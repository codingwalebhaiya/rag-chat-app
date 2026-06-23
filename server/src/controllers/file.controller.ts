import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { awsS3 } from "../config/s3Client.js";
import { uploadPdfToS3 } from "../config/s3Upload.js";
import File from "../models/file.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { splitDocuments } from "../utils/chunk.js";
import { loadPdfDocuments } from "../utils/pdf.js";
import { pineconeIndex } from "../config/pinecone.js";
import { ingestDocuments } from "../services/ingestion.service.js";


const uploadPdf = asyncHandler(async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const cleanTenantNamespace = `tenant_user_${req.user.id.toString()}`;

    const s3Key = await uploadPdfToS3(file);
    const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    const dbFile = await File.create(
        {
            userId: req.user.id,
            fileName: file.originalname,
            fileSize: file.size,
            mimeType: file.mimetype,
            s3Key,
            s3Url,
            namespace: cleanTenantNamespace,
            status: "processing"
        }
    )

    try {
        const { documents, totalPages } = await loadPdfDocuments(file.buffer);
        dbFile.pageNumber = totalPages;
        await dbFile.save();

        const chunks = await splitDocuments({
            documents,
            fileId: dbFile._id.toString(),
            fileName: file.originalname,
            userId: req.user.id.toString(),
            namespace: cleanTenantNamespace
        });

        // update the document with totalChunks
        dbFile.totalChunks = chunks.length;
        await dbFile.save();

        await ingestDocuments(chunks, cleanTenantNamespace)

        dbFile.status = 'ready'
        await dbFile.save()
        return res.status(201).json({ success: true, document: dbFile })
    }

    catch (error: any) {
        console.error(error);
        // Update status to failed in case of error
        if (dbFile) {
            dbFile.status = 'failed';
            await dbFile.save();
        }
        throw new ApiError(
            500,
            error.message
        );
    }
}
)

const getFile = asyncHandler(async (req, res) => {

    const file = await File.findById(req.params.fileId);


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
    const file = await File.findById(req.params.fileId);

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

    //  delete vectors from pinecone vector database 
    // await index.namespace(file.namespace)
    //     .deleteMany({
    //         filter: {
    //             fileId:
    //                 file._id.toString()
    //         }
    //     })

    //  FIX: Delete vectors from Pinecone using predictable IDs
    const vectorIdsToDelete: string[] = [];
    for (let i = 0; i < file.totalChunks; i++) {
        vectorIdsToDelete.push(`${file._id.toString()}_chunk_${i}`);
    }

    if (vectorIdsToDelete.length > 0) {
        await pineconeIndex.namespace(file.namespace).deleteMany(vectorIdsToDelete);
    }

    // delete metadata from mongodb
    await file.deleteOne();

    return res.status(200).json({
        success: true,
        message: "File, vectors and metadata deleted successfully",
    })
})


export {
    uploadPdf,
    getFile,
    deleteFile
}