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
        enum: ['user', 'assistant'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    sources: [
        {
            _id: false, // Prevents Mongoose from generating unnecessary IDs for each citation
            fileName: {
                type: String,
                required: true
            },
            pageNumber: {
                type: Number,
                required: true,
            },
            chunkIndex: {
                type: Number,
                required: true,
            }
        }
    ]

},

    {
        timestamps: true
    }


)


const Message = mongoose.models.Message || mongoose.model<IMessageDocument>("Message", messageSchema)

export default Message;