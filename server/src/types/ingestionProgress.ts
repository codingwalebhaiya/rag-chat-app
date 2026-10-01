// types/ingestionProgress.ts

export type IngestionProgressStatus =
    | "downloading"
    | "loading"
    | "parsing"
    | "splitting"
    | "indexing"
    | "completed"
    | "failed";


export interface IngestionProgressEvent {
    fileId: string;
    conversationId: string;
    status: IngestionProgressStatus;
    progress: number;
    message: string;
}