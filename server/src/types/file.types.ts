import { Document, Types } from "mongoose";


export type FileStatus =
    | "UPLOADED"
    | "PROCESSING"
    | "READY"
    | "FAILED"
    | "DELETED";

export interface IFile {
    user: Types.ObjectId;
    fileName: string;
    originalName: string;
    mimeType: string;
    size: number;
    pages?: number;
    s3Key: string;
    url?: string;
    status?: FileStatus;
    chunksCount: number;
    namespace?: string;
    errorMessage?: string;

}

export interface IFileDocument extends IFile, Document {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date
}