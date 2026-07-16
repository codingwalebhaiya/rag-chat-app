
import mongoose, { Schema } from "mongoose"
import { IConversationDocument } from "../types/conversation.types.js"


const conversationSchema = new Schema<IConversationDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    fileId: {
        type: Schema.Types.ObjectId,
        ref: "File",
        required: true,
        index: true,
    },
    title: {
        type: String,  // e.g., "Chat with Q4_Report.pdf"
        required: true,
        trim: true
    }

}, {
    timestamps: true
}

)

conversationSchema.index({ userId: 1, updatedAt: -1 })

const Conversation = mongoose.models.Conversation || mongoose.model<IConversationDocument>("Conversation", conversationSchema)

export default Conversation