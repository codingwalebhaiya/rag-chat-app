
import { Document, Types } from "mongoose";


export interface IConversation {
    conversationId: string;
    userId: Types.ObjectId;
    fileId: Types.ObjectId;
    title: string;
    conversationStatus: boolean

}

export interface IConversationDocument extends IConversation, Document {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date
}