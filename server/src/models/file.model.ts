import mongoose, { Schema } from "mongoose";
import { IFileDocument } from "../types/file.types.js";

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
      required: true,
    },
    s3FileKey: {
      type: String,
      required: true,
      unique: true,
    },
    fileStatus: {
      type: String,
      enum: ["pending", "processing", "ready", "failed"],
      default: "pending",
      index: true,
    },
    ingestionProgressStatus: {
      type: String,
      enum: [
        "null",
        "downloading",
        "parsing",
        "splitting",
        "indexing",
        "completed",
        "failed",
      ],
      default: "null",
    },
    ingestionProgressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    ingestionProgressMessage: {
      type: String,
      default: "",
      trim: true,
    },
    ingestionProgressError: {
      type: String,
      default: null,
    },
    pineconeNamespace: {
      type: String,
      required: true,
    },

    jobId: {
      type: String,
      default: null,
      index: true,
    },
  },

  {
    timestamps: true,
  },
);

const File =
  mongoose.models.File || mongoose.model<IFileDocument>("File", fileSchema);

export default File;
