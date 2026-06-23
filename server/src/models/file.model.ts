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
        },

        fileSize: {
            type: Number,
            required: true
        },
        totalChunks: {
            type: Number,
            default: 0
        },
        pageNumber: {
            type: Number,
            default: 0
        },
        s3Key: {
            type: String,
            required: true
        },
        s3Url: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["processing", "ready", "failed"],
            default: "processing"
        },
        namespace: {
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
