import mongoose, { Schema } from "mongoose"
import { IFileDocument } from "../types/file.types.js"

const fileSchema = new Schema<IFileDocument>(
    {
        user: {
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

        originalName: {
            type: String,
            required: true,
            trim: true,
        },

        mimeType: {
            type: String,
            default: "application/pdf",
        },

        size: {
            type: Number,
            required: true,
        },

        s3Key: {
            type: String,
            required: true,
            unique: true,
        },

        url: {
            type: String,
        },

        pages: {
            type: Number,
            default: 0,
        },

        chunksCount: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: [
                "UPLOADED",
                "PROCESSING",
                "READY",
                "FAILED",
                "DELETED",
            ],
            default: "UPLOADED",
            index: true,
        },

        namespace: {
            type: String,
        },

        errorMessage: {
            type: String,
        }
    },

    {
        timestamps: true
    }
)


const File = mongoose.models.File || mongoose.model<IFileDocument>("File", fileSchema)

export default File
