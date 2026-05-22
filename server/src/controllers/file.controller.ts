import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { awsS3 } from "../config/s3Client.js";
import { uploadPdfToS3 } from "../config/s3Upload.js";
import File from "../models/file.model.js";
import { ingestChunks } from "../services/ingest.service.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { chunkText } from "../utils/chunk.js";
import { extactPdfText } from "../utils/pdf.js";

import { Pinecone }
    from "@pinecone-database/pinecone";

const pc = new Pinecone({
    apiKey:
        process.env.PINECONE_API_KEY!
});

const index =
    pc.Index(
        process.env.PINECONE_INDEX!
    );

const uploadPdf = asyncHandler(async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    try {
        const s3Key = await uploadPdfToS3(file);
        const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

        const parsedText = await extactPdfText(file.buffer);
        const chunks = await chunkText(parsedText.pages);

        const doc = await File.create(
            {
                userId: req.user.id,
                fileName: file.originalname,
                fileSize: file.size,
                mimeType: file.mimetype,
                s3Key,
                s3Url,
                totalChunks: chunks.length,
                namespace: req.user.id.toString(),
                status: "processing"

            }
        )

        await ingestChunks(chunks, doc._id.toString(), doc.namespace)

        doc.status = 'ready'
        await doc.save()
        res.status(201).json({ success: true, doc })

    }
    catch (error: any) {
        console.error(error);
        throw new ApiError(
            500,
            error.message
        );
    }
}
)

const getFile = asyncHandler(async (req, res) => {

    const file = await File.findById(req.params.id);


    if (!file) {
        return res.status(404).json({
            success: false,
            message: "File not found"
        })
    }

    const isOwner =
        file.userId.toString() === req.user.id.toString();

    const isAdmin =
        req.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
        throw new ApiError(403, "Forbidden");
    }

    return res.status(200).json({
        success: true,
        message: "File fetched successfully",
        data: file
    })
})

const deleteFile = asyncHandler(async (req, res) => {
    const file = await File.findById(req.params.id);


    if (!file) {
        return res.status(404).json({
            success: false,
            message: "File not found"
        })
    }

    const isOwner =
        file.userId.toString() === req.user.id.toString();

    const isAdmin =
        req.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
        throw new ApiError(403, "Forbidden");
    }

    // delete pdf file from s3
    await awsS3.send(
        new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: file.s3Key
        })
    )

    // delete vectors from pinecone vector database 
    await index.namespace(file.namespace)
        .deleteMany({
            filter: {
                docId:
                    file._id.toString()
            }
        })

    // delete metadata from mongodb
    await file.deleteOne();

    return res.status(200).json({
        success: true,
        message: "File deleted successfully",
    })
})


export {
    uploadPdf,
    getFile,
    deleteFile
}