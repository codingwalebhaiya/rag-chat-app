import { Document, Types } from "mongoose";


// file metadata stored in MongoDB
export interface IFile {
  userId: Types.ObjectId;
  fileName: string;
  mimeType: string;
  fileSize: number;
  totalChunks: number;
  s3Key: string;
  s3Url: string;
  status: string;
  namespace: string;// userId-based namespace isolation
}

export interface IFileDocument extends IFile, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date
}


