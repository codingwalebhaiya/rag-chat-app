// types/ingestionProgress.ts

export type IngestionProgressStatus =
    | "downloading"
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
    error: string | null;
}