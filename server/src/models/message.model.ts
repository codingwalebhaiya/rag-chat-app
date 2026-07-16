import mongoose, { Schema } from "mongoose"
import { IMessageDocument } from "../types/message.types.js"

const messageSchema = new Schema<IMessageDocument>({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
        index: true,
    },
    sender: {
        type: String,
        enum: ["USER", "AI"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
},

    {
        timestamps: true
    }


)

// Optimized index for fast timeline loading
messageSchema.index({ conversation: 1, createdAt: 1 });

const Message = mongoose.models.Message || mongoose.model<IMessageDocument>("Message", messageSchema)

export default Message
