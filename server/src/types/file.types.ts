import { Document, Types } from "mongoose";

export type FileStatus = "pending" | "processing" | "ready" | "failed";

export type IngestionProgressStatus =
  | "null"
  | "downloading"
  | "parsing"
  | "splitting"
  | "indexing"
  | "completed"
  | "failed";

export interface IFile {
  userId: Types.ObjectId;
  fileName: string;
  mimeType: string;
  fileSize: number;
  totalChunks?: number;
  pageNumber?: number;
  s3FileKey: string;
  fileStatus: FileStatus;
  ingestionProgressStatus: IngestionProgressStatus;
  ingestionProgressPercentage: number;
  ingestionProgressMessage: string;
  ingestionProgressError: string | null;
  pineconeNamespace: string;
  jobId: string | null;
}

export interface IFileDocument extends IFile, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
