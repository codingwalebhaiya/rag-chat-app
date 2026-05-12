import mongoose, { Schema } from "mongoose"
import { IFileDocument } from "../types/file.types.js"

const fileSchema = new Schema<IFileDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        fileName: {
            type: String,
            required: true,
            trim: true,
        },

        mimeType: {
            type: String,
            required: true,
            default: "application/pdf",
        },

        filePath: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: 'processing'
        },
        pineconeNamespace: {
            type: String,
            required: true
        }
    },

    {
        timestamps: true
    }
)


const File = mongoose.models.File || mongoose.model<IFileDocument>("File", fileSchema)

export default File
