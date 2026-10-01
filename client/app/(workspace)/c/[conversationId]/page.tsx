"use client"

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useViewMode } from "@/context/ViewModeContext";
import { Loader2, AlertCircle, FileWarning, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/api";

interface ISource {
  fileName: string;
  pageNumber: string;
  pageIndex: number;
  title?: string;
}

interface IMessage {
  sender: "user" | "assistant";
  content: string;
  sources?: ISource[];
  createdAt: string;
  updatedAt: string;

}
interface IConversation {
  id: string;
  messages: IMessage[];
}

interface IConversationResponse {
  cloudfrontSignedUrl: string;
  file: {
    id: string;
    status: boolean | string;
  };
  conversation: IConversation;
}

// Dynamic imports (SSR disabled)
const PdfViewer = dynamic(() => import("@/components/conversation/PdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading PDF viewer...</p>
      </div>
    </div>
  ),
});

const ConversationInterface = dynamic(
  () => import("@/components/conversation/ConversationInterface"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading chat interface...
          </p>
        </div>
      </div>
    ),
  },
);

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  //const progress = FileIngestionProgress({ conversationId });

  const { mode } = useViewMode();

  const getConversation = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      const response = await api.get(`/conversations/${conversationId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to get conversation");
      }
      console.log(response)
      return response.data.data as IConversationResponse;
    }
  });

  const { data, isLoading, isError, refetch } = getConversation;

  const cloudfrontSignedUrl = data?.cloudfrontSignedUrl;
  const fileStatus = data?.file?.status;
  const messages = data?.conversation?.messages;

  // Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading conversation...</p>
      </div>
    );
  }

  // Error State
  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h3 className="text-lg font-semibold">Failed to load conversation</h3>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          The conversation could not be loaded. The file might still be
          processing or there was an error.
        </p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }


  return (
    <div className="flex h-full">
      {/* PDF Panel */}
      {(mode === "pdf" || mode === "both") && (
        <div
          className={`${mode === "both" ? "w-1/2 border-r hidden md:block" : "w-full"
            } h-full overflow-hidden`}
        >
          <PdfViewer cloudfrontSignedUrl={cloudfrontSignedUrl} className="h-full" />
        </div>
      )}

      {/* Chat Panel */}
      {(mode === "chat" || mode === "both") && (
        <div
          className={`${mode === "both" ? "w-1/2" : "w-full"
            } h-full overflow-hidden`}
        >
          <ConversationInterface
            conversationId={conversationId}
            conversationHistory={messages || []}
            initialFileStatus={fileStatus === true || fileStatus === "completed"}
            className="h-full"
          />
        </div>
      )}
    </div>
  );
}
