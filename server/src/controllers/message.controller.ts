import asyncHandler from "../utils/asyncHandler.js";
import Message from "../models/message.model.js";
import ApiResponse from "../utils/apiResponse.js";

const getMessages = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    return res.status(200).json(
        new ApiResponse(200, "Messages fetched successfully", messages)
    )
});

export { getMessages }