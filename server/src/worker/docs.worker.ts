import { Worker, Job } from "bullmq";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import File from "../models/file.model.js";
import bullmqConnection from "../config/bullmq.js";
import ApiError from "../utils/apiError.js";
import ingestDocuments from "../services/ingestion.service.js";
import Conversation from "../models/conversation.model.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import s3Client from "../config/s3Client.js";
import { streamToBlob } from "../utils/s3StreamToBlob.js";
import { Document } from "@langchain/core/documents";
import { publishProgress } from "../services/ingestionProgress.service.js";


// types/ingestionProgress.ts

export type IngestionProgressStatus =
    | "downloading"
    | "parsing"
    | "splitting"
    | "indexing"
    | "completed"
    | "failed";


export interface IngestionProgressEvent {
    fileId: string;
    conversationId: string;
    status: IngestionProgressStatus;
    progress: number;
    message: string;
}
const docsWorker = new Worker(
    "document-ingestion-queue",
    async (job: Job) => {
        const { fileId, fileName, conversationId, s3Key, pineconeNamespace } = job.data;
        console.log(`[Worker] Started processing file: ${fileId}`);

        try {

            await publishProgress({
                fileId,
                conversationId,
                status: "downloading",
                progress: 10,
                message: "Downloading PDF from storage..."
            })

            // Pull down stream from aws s3 
            const s3Response = await s3Client.send(new GetObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: s3Key,
            }))

            if (!s3Response.Body) {
                throw new ApiError(400, "Empty S3 file body received")
            }

            await publishProgress({
                fileId,
                conversationId,
                status: "parsing",
                progress: 30,
                message: "parsing PDF..."
            })

            const fileBlob = await streamToBlob(s3Response.Body, "application/pdf");
            const loader = new WebPDFLoader(fileBlob, { splitPages: true, parsedItemSeparator: "", }
            );

            // Load the raw pages(Outputs 1 document per PDF page)
            const pages: Document[] = await loader.load();

            //Split pages into chunks with metadata preservation
            const textSplitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 200,
                separators: [
                    "\n\n",
                    "\n",
                    ". ",
                    " ",
                    "",
                ],
            });

            await publishProgress(
                {
                    fileId,
                    conversationId,
                    status: "splitting",
                    progress: 50,
                    message: `Splitting ${pages.length} pages into chunks...`
                }
            )

            await job.updateProgress(50);

            const chunks: Document[] = await textSplitter.splitDocuments(pages);

            const chunksWithMetadata: Document[] =
                chunks.map((chunk, index) => {
                    return new Document({
                        pageContent: chunk.pageContent,
                        metadata: {
                            ...chunk.metadata,
                            fileId,
                            fileName,
                            chunkIndex: index,
                        },
                    });
                });


            await publishProgress({
                conversationId,
                fileId,
                status: "indexing",
                progress: 70,
                message: `Indexing ${chunks.length} chunks into vector database...`
            });



            await ingestDocuments({
                chunksWithMetadata,
                pineconeNamespace
            })

            // update file status
            await File.findByIdAndUpdate(fileId, {
                fileStatus: true
            });

            // update conversation status
            await Conversation.findByIdAndUpdate(conversationId, {
                $addToSet: { files: fileId },
                conversationStatus: true
            });

            await publishProgress({
                conversationId,
                fileId,
                status: "completed",
                progress: 100,
                message: "Document ready! You can now ask questions."
            });

            await job.updateProgress(100);


        } catch (error) {

            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            await File.findByIdAndUpdate(fileId, {
                fileStatus: false
            })

            await Conversation.findByIdAndUpdate(conversationId, {
                conversationStatus: false

            })
            await publishProgress({
                fileId,
                conversationId,
                status: "failed",
                progress: 0,
                message: `Processing failed: ${errorMessage}`
            });
            throw error;
        }
    },
    {
        connection: bullmqConnection,
        concurrency: 1,
        lockDuration: 300000, // 5 minutes (default is 30 seconds)
        lockRenewTime: 15000, // Renew every 15 seconds (default is 15 seconds)
        stalledInterval: 300000, // Check for stalled jobs every 5 minutes
        maxStalledCount: 2, // Allow 2 stalled attempts


    }
);

// add event handlers
docsWorker.on("active", (job) => {
    console.log(`🔨 Job ${job.id} started processing`);
});

docsWorker.on("progress", (job, progress) => {
    console.log(`📊 Job ${job.id} progress: ${progress}%`);
});

docsWorker.on("completed", (job) => {
    console.log(`✅ Job ${job.id} completed successfully`);
});

docsWorker.on("failed", (job, error) => {
    console.error(`❌ Job ${job?.id} failed:`, error.message);
});


docsWorker.on("error", (error) => {
    console.error("❌ Worker error:", error);

});


export default docsWorker;