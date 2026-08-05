import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { retrieveContext } from "../services/retrieval.service.js";
import { generateAnswer } from "../services/generation.service.js";
import ApiResponse from "../utils/apiResponse.js";


const userQuery = asyncHandler(async (req, res) => {

    const { userQuery } = req.body;
    const userId = req.user?.id;
    const { conversationId } = req.params;

    if (!userQuery) {
        throw new ApiError(400, "user message is required")
    }


    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        throw new ApiError(404, "conversation not found")
    }

    const userMessage = await Message.create({
        conversationId,
        sender: userId,
        content: userQuery
    })

    // retrieve top k chunks context from vector db pinecone 
    const contextOfTopKChunks = await retrieveContext({ userQuery, fileId: conversation.fileId, namespace: conversation.namespace })

    // generate answer via llm using context of top k chunks 
    const aiResponse = await generateAnswer({ userQuery, contextOfTopKChunks })

    // save ai response 
    const aiMessage = await Message.create({
        conversationId,
        sender: "assistant",
        content: aiResponse.answer,
        citations: aiResponse.citations,
    })

    return res.status(200).json(
        new ApiResponse(200, "Message sent successfully", {
            userMessage, // user message is important to send frontend because user have already userQuery in frontend then why send ??
            aiMessage,
        })
    )

})

const getConversationMessages = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        throw new ApiError(404, "conversation not found")
    }
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 })
    return res.status(200).json(
        new ApiResponse(200, "Messages fetched successfully", messages)
    )
})

const getAllConversations = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const conversations = await Conversation.find({ userId })
    return res.status(200).json(
        new ApiResponse(200, "Conversations fetched successfully", conversations)
    )
})

const deleteConversation = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        throw new ApiError(404, "conversation not found")
    }

    await Conversation.findByIdAndDelete(conversationId);
    await Message.deleteMany({ conversationId });
    return res.status(200).json(
        new ApiResponse(200, "Conversation deleted successfully", {})
    )
})

export const conversationController = { userQuery, getConversationMessages, getAllConversations, deleteConversation }