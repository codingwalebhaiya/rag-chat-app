
import Conversation from "../models/conversation.model.js";
import ApiResponse from "../utils/apiResponse.js";
import { docsQueue } from "../queue/docsQueue.js";
import File from "../models/file.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadPresignedUrl from "../utils/generateUploadPresignedUrl.js";

// ===== STEP 1: Generate Upload URL =====
const getUploadUrl = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { fileName, fileSize, mimeType } = req.body;

    if (!fileName || !fileSize || !mimeType) {
        throw new ApiError(400, "All fields are required")
    }

    if (fileSize > 5 * 1024 * 1024) { // 5MB
        throw new ApiError(400, "File size should be less than 5MB")
    }

    if (!mimeType.startsWith("application/pdf")) {
        throw new ApiError(400, "Only PDF files are allowed")
    }

    // Clean filename
    const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");

    // create pinecone namespace
   const namespace = `tenant_user_${userId.toString()}`;


    const s3FileKey = `docs/${userId.toString()}/${Date.now()}-${safeFileName}`;

    // Generate PUT presigned URL for direct browser upload
    const presignedUrl = await uploadPresignedUrl(s3FileKey, mimeType);
    if (!presignedUrl) {
        throw new ApiError(500, "Failed to generate presigned URL")
    }

    // Create File document in MongoDB 
    const file = await File.create({
        userId,
        fileName: safeFileName,
        fileSize,
        mimeType,
        s3FileKey,
        pineconeNamespace:namespace

    })

    // create conversation document in MongoDB
    const conversation = await Conversation.create({
        userId,
        fileId: file._id,
        title: safeFileName
    })

    // send response with presigned url and upload pdf file from frontend to aws s3
    return res.status(200).json(
        new ApiResponse(201, "Upload URL generated successfully ", {
            presignedUrl,
            s3Key: s3FileKey,
            conversationId: conversation._id.toString(),
            fileId: file._id.toString()
        })
    )


})


// ===== STEP 2: Confirm Upload & Start Processing =====
const confirmUploadAndProcess = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { s3Key, conversationId } = req.body;

    if (!s3Key || !conversationId) {
        throw new ApiError(400, "All fields are required")
    }

    // Find conversation and populate file
    const conversation = await Conversation.findById(conversationId).populate('fileId')
    if (!conversation) {
        throw new ApiError(404, "Conversation not found");
    }

    // Access the populated file
    const file = conversation.fileId;

    if (!file) {
        throw new ApiError(404, "File not found in conversation");
    }

    // Verify that the s3Key matches the file's s3FileKey
    if (file.s3FileKey !== s3Key) {
        throw new ApiError(400, "S3 key does not match the file");
    }

    // Get the pinecone namespace from the file
    const pineconeNamespace = file.pineconeNamespace;


    // Verify ownership
    if (file.userId.toString() !== userId.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    // Check if file is already being processed
    if (file.jobId) {
        throw new ApiError(400, "File is already being processed");
    }

    // Check if conversation is already active
    if (conversation.conversationStatus) {
        throw new ApiError(400, "Conversation is already active");
    }


    // Add BullMQ job for background processing
    const job = await docsQueue.add("document-ingestion-queue", {
        fileName: file.fileName,
        fileId: file._id.toString(),
        conversationId: conversation._id.toString(),
        s3Key,
        pineconeNamespace,
    }, {
        jobId: `docs-${file._id}`,
        priority: 1,
        removeOnComplete: true,
        removeOnFail: true
        // attempts: 3,
        // backoff: { type: "exponential", delay: 5000 },
    })


    // Update jobId in file document and mark conversation as active
    await Promise.all([
        File.updateOne(
            { _id: file._id },
            { jobId: job.id }
        ),
        Conversation.updateOne(
            { _id: conversation._id },
            { conversationStatus: true }
        )
    ]);

    // Send response to frontend 
    return res.status(200).json(
        new ApiResponse(200, "File processing started", {
            jobId: job.id,
            status: "processing"
        })
    );


})

export const fileController = {
    getUploadUrl,
    confirmUploadAndProcess
}