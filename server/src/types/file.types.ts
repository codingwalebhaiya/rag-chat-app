import { Document, Types } from "mongoose";

export interface IFile {
  userId: Types.ObjectId;
  fileName: string;
  mimeType: string;
  fileSize: number;
  totalChunks: number;
  pageNumber: number;
  s3FileKey: string;
  fileStatus:boolean;
  pineconeNamespace: string;
  jobId: string | null;
}

export interface IFileDocument extends IFile, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date
}
