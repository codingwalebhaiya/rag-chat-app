import { queryEmbeddings } from "../utils/embed.js";
import { PineconeStore } from "@langchain/pinecone";
import { Document } from "@langchain/core/documents";
import { pineconeIndex } from "../config/pinecone.js";

export interface RetrievedChunk {
    content: string;
    fileName: string;
    pageNumber: number
}

interface RetrieveContextOptions {
    query: string;
    namespace: string;
    fileId: string;
}


export const retrieveContext = async ({
    query,
    namespace,
    fileId,
}: RetrieveContextOptions): Promise<RetrievedChunk[]> => {
    const vectorStore =
        await PineconeStore.fromExistingIndex(
            queryEmbeddings,
            {
                pineconeIndex,
                namespace,
            }
        );

    const retriever =
        vectorStore.asRetriever({
            k: 5,
            filter: {
                fileId,
            },
        });

    const docs: Document[] =
        await retriever.invoke(query);

    return docs.map((doc) => ({
        content: doc.pageContent,
        fileName:
            doc.metadata.fileName,
        pageNumber:
            doc.metadata.pageNumber,
    }));
}


