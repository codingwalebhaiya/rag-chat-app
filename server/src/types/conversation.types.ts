
import { Document, Types } from "mongoose";


export interface IConversation {
    userId: Types.ObjectId;
    fileId: Types.ObjectId;
    title: string;

}

export interface IConversationDocument extends IConversation, Document {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date
}