import { Document, Types } from "mongoose";


export interface IMessage {
    conversationId: Types.ObjectId;
    sender: "user" | "ai";
    content: string;
}

export interface IMessageDocument extends IMessage, Document {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date
}