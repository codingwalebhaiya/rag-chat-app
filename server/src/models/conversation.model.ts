
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
    },
    conversationStatus: {
       type:Boolean,
       required:true,
       default:false
    }

}, {
    timestamps: true
}

)


const Conversation = mongoose.models.Conversation || mongoose.model<IConversationDocument>("Conversation", conversationSchema)

export default Conversation