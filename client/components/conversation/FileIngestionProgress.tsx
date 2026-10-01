"use client";

import {
    CheckCircle2,
    XCircle,
    Download,
    Scissors,
    Database,
    FileText,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export interface IFileProgress {
    fileId?: string;
    conversationId: string;
    status: string;
    progress: number;
    message: string;
}

interface FileIngestionProgressProps {
    conversationId: string;
    initialCompleted?: boolean;
    onProgressUpdate?: (progress: IFileProgress) => void;
    onComplete?: () => void;
}

export function FileIngestionProgress({
    conversationId,
    initialCompleted = false,
    onProgressUpdate,
    onComplete,
}: FileIngestionProgressProps) {
    const [progress, setProgress] = useState<IFileProgress | null>(() => {
        if (initialCompleted) return null;
        return {
            conversationId,
            status: "downloading",
            progress: 5,
            message: "Initializing document ingestion...",
        };
    });
    const [isConnected, setIsConnected] = useState(false);
    const [isVisible, setIsVisible] = useState(!initialCompleted);

    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        if (!conversationId || initialCompleted) {
            return;
        }

        const url = `${API_URL}/api/v1/files/file-ingestion-progress/${conversationId}`;
        const eventSource = new EventSource(url, {
            withCredentials: true,
        });

        // SSE connected
        eventSource.onopen = () => {
            setIsConnected(true);
        };

        eventSource.addEventListener("progress", (event) => {
            try {
                const data: IFileProgress = JSON.parse(event.data);
                console.log("📊 Progress:", data);

                setProgress(data);
                onProgressUpdate?.(data);

                if (data.status === "completed") {
                    onComplete?.();
                    eventSource.close();
                    setIsConnected(false);
                    // Keep visible briefly for user confirmation, then gracefully hide
                    setTimeout(() => {
                        setIsVisible(false);
                    }, 4000);
                } else if (data.status === "failed") {
                    eventSource.close();
                    setIsConnected(false);
                }
            } catch (error) {
                console.error("Failed to parse SSE event data", error);
            }
        });

        eventSource.onerror = () => {
            setIsConnected(false);
        };

        return () => {
            eventSource.close();
        };
    }, [conversationId, initialCompleted, onComplete, onProgressUpdate]);

    if (!isVisible || !progress) {
        return null;
    }

    const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
        downloading: { icon: Download, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/40" },
        loading: { icon: Download, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/40" },
        parsing: { icon: FileText, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/40" },
        splitting: { icon: Scissors, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-950/40" },
        indexing: { icon: Database, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/40" },
        completed: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/40" },
        failed: { icon: XCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/40" },
    };

    const config = statusConfig[progress.status] || statusConfig.downloading;
    const Icon = config.icon;

    return (
        <div className="w-full p-4 bg-background border-b shadow-sm transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
                <div className={cn("p-2 rounded-lg", config.bg)}>
                    <Icon
                        className={cn(
                            "h-5 w-5",
                            config.color,
                            progress.status !== "completed" &&
                            progress.status !== "failed" &&
                            "animate-spin"
                        )}
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                        {progress.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {progress.status === "completed"
                            ? "Complete"
                            : isConnected
                                ? "Live updates"
                                : "Connecting..."}
                    </p>
                </div>

                <span className="text-sm font-semibold font-mono">
                    {progress.progress}%
                </span>
            </div>

            <Progress
                value={progress.progress}
                className={cn(
                    "h-2",
                    progress.status === "failed" && "bg-red-100 dark:bg-red-950/50",
                    progress.status === "completed" && "bg-green-100 dark:bg-green-950/50"
                )}
            />
        </div>
    );
}