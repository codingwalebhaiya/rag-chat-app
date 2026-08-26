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
        s3FileKey: {
            type: String,
            required: true,
            unique: true
        },
        //Socket.io: Transmit all transient stages (downloading, loading, splitting, indexing, completed, failed)
        fileStatus: {
           type:Boolean,
           required:true,
           default:false
        },
        pineconeNamespace: {
            type: String,
            required: true
        },
       
        jobId: {
            type: String,
            default: null,
            index: true
        }
    },

    {
        timestamps: true
    }
)


const File = mongoose.models.File || mongoose.model<IFileDocument>("File", fileSchema)

export default File
