import { Document, Types } from "mongoose";


export type FileStatus =
  | "pending_upload"    // presigned URL issued, waiting for S3 upload
  | "uploaded"          // client confirmed S3 upload
  | "processing"        // BullMQ job picked up
  | "embedding"         // chunks being embedded
  | "ready"             // all chunks embedded, chat enabled
  | "failed";           // ingestion error

  // file metadata stored in MongoDB
export interface IFile {
    userId: Types.ObjectId;
    fileName: string;
    filePath: string;
    mimeType: string;
    status: FileStatus;
    pineconeNamespace: string;// userId-based namespace isolation
}

export interface IFileDocument extends IFile, Document {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date
}


