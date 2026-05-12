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


// ─── Chunk ─────────────────────────────────────────────────────────────────
export interface TextChunk {
  text: string;
  pageNumber: number;
  chunkIndex: number;
  fileId: string;
  fileName: string;
  userId: string;
}

 
// ─── Pinecone vector metadata ──────────────────────────────────────────────
export interface ChunkMetadata {
  fileId: string;
  userId: string;
  fileName: string;
  pageNumber: number;
  chunkIndex: number;
  text: string;        // stored so we can return it without re-fetching
}