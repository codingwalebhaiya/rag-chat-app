import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { retrieveContext } from "../services/retrieval.service.js";
import generateAnswer from "../services/generation.service.js";
import ApiResponse from "../utils/apiResponse.js";
import File from "../models/file.model.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../config/s3Client.js"
import { pineconeIndex } from "../config/pinecone.js";
import generateCloudFrontSignedUrl from "../utils/generateCloudFrontSignedUrl.js";


const userQuery = asyncHandler(async (req, res) => {

    const { userQuery } = req.body;// User's question
    const userId = req.user?.id;
    const { conversationId } = req.params;

    if (!userQuery || !userQuery.trim()) {
        throw new ApiError(400, "Query is required")
    }

    // Step 1: Find conversation and verify ownership + file is ready
    const conversation = await Conversation.findOne({
        _id: conversationId,
        userId
    }).populate("fileId");

    if (!conversation) {
        throw new ApiError(404, "conversation not found")
    }

    const file = conversation.fileId;

    if (!file) {
        throw new ApiError(404, "file not found")
    }

    // add same namespace like ingestion pipeline - which is store in pinecone db 
    const namespace = `tenant_user_${userId.toString()}`;
    //const namespace = file.pineconeNamespace;

    // Step 2: Save user message
    await Message.create({
        conversationId,
        sender: "user",
        content: userQuery.trim()
    })

    // Step 3: Query Pinecone for relevant chunks (RAG retrieval)
    // retrieve top k chunks context from vector db pinecone 
    const contextOfTopKChunks = await retrieveContext({
        userQuery,
        fileId: file._id.toString(),
        namespace
    })


    // generate answer via llm using context of top k chunks 
    const aiResponse = await generateAnswer({ userQuery, contextOfTopKChunks });
    console.log("llm ai response", aiResponse)


    const aiMessage = await Message.create({
        conversationId,
        sender: "assistant",
        content: aiResponse.answer,
        sources: aiResponse.sources || []
    })
    console.log("ai response created in mongodb ", aiMessage);

    return res.status(200).json(
        new ApiResponse(200, "Message sent successfully", {
            assistantMessage: {
                sender: aiMessage.sender,
                content: aiMessage.content,
                sources: aiMessage.sources,
                createdAt: aiMessage.createdAt,
                updatedAt: aiMessage.updatedAt,
            }

        })
    )

})

// get single conversation with all messages by conversation id
const conversation = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.user.id;
    const conversation = await Conversation.findOne({
        _id: conversationId,
        userId: userId,
    }).populate('fileId');

    if (!conversation) {
        throw new ApiError(404, "conversation not found")
    }

    // Generate CloudFront signed URL if file is true
    let cloudfrontSignedUrl = null;
    if (
        conversation.fileId &&
        conversation.fileId.fileStatus === true &&
        conversation.fileId.s3FileKey) {

        try {

            const fileKey = conversation.fileId.s3FileKey;
            cloudfrontSignedUrl = generateCloudFrontSignedUrl(
                fileKey,
                3600 // 1 hour expiry
            );


        } catch (error) {
            console.error("Failed to generate signed URL:", error);
            throw new ApiError(500, "Failed to generate CloudFront signed URL");
            // Don't fail the whole request if URL generation fails
            // The frontend can handle missing URL
        }
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 }).lean();

    return res.status(200).json(
        new ApiResponse(200, "Conversation loaded successfully", {
            cloudfrontSignedUrl,
            file: {
                id: conversation.fileId._id.toString(),
                status: conversation.fileId.fileStatus,
            },
            conversation: {
                id: conversation._id.toString(),
                messages: messages.map((msg) => ({
                    sender: msg.sender,
                    content: msg.content,
                    sources: msg.sources || [],
                    createdAt: msg.createdAt,
                    updatedAt: msg.updatedAt,
                })),
            }

        })
    );

})


// show in frontend sidebar as conversation list with file name as title
const getAllConversations = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const conversations = await Conversation.find({ userId });
    return res.status(200).json(
        new ApiResponse(200, "Conversations fetched successfully", conversations)
    )
})


const deleteConversation = asyncHandler(async (req, res) => {

    try {
        const { conversationId } = req.params;
        const userId = req.user?.id;
        console.log("conversation id ", conversationId)

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            throw new ApiError(404, "conversation not found")
        }


        const isOwner =
            conversation.userId.toString() === req.user.id.toString();

        const isAdmin =
            req.user.role === "ADMIN";

        if (!isOwner && !isAdmin) {
            throw new ApiError(403, "Forbidden");
        }

        const file = await File.findById(conversation.fileId);
        if (!file) {
            throw new ApiError(404, "file not found")
        }



        // delete pdf file from aws  s3
        const awsFile = await s3Client.send(
            new DeleteObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: file.s3FileKey
            })
        )
        if (!awsFile) {
            throw new ApiError(500, "Failed to delete file from AWS S3");
        }


        const fileId = file._id.toString();
        const pineconeNamespace = `tenant_user_${userId.toString()}`;

        // Delete with filter via fileId
   await pineconeIndex.namespace(pineconeNamespace).deleteMany({
            fileId: { $eq: fileId }
        });


        // delete file metadata from mongodb
        const deletedFile = await file.deleteOne();
        if (!deletedFile) {
            throw new ApiError(500, "Failed to delete file metadata from mongodb");
        }

        const deletedConversation = await Conversation.findByIdAndDelete(conversationId);
        if (!deletedConversation) {
            throw new ApiError(500, "Failed to delete conversation from mongodb");
        }

        const deletedMessages = await Message.deleteMany({ conversationId });
        if (!deletedMessages) {
            throw new ApiError(500, "Failed to delete messages from mongodb");
        }

        return res.status(200).json(
            new ApiResponse(200, "File, vectors and metadata including conversation and messages  deleted successfully", {})
        )

    } catch (error) {
        throw new ApiError(500, "Failed to delete conversation");
    }
})


export const conversationController = { userQuery, conversation, getAllConversations, deleteConversation }