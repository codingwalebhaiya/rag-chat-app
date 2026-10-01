import { Document, Types } from "mongoose";


export interface ISource {
    fileName: string;
    pageNumber: number;
    chunkIndex: number;
}

export interface IMessage {
    conversationId: Types.ObjectId;
    sender: "user" | "assistant";
    content: string;
    sources?: ISource[];
}

export interface IMessageDocument extends IMessage, Document {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date
}
