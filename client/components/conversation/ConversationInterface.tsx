"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Copy, Check, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FileIngestionProgress, IFileProgress } from "./FileIngestionProgress";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

interface IChatInterfaceProps {
  conversationId: string;
  conversationHistory: IMessage[];
  initialFileStatus?: boolean;
  className?: string;
}

export default function ChatInterface({
  conversationId,
  conversationHistory,
  initialFileStatus = false,
  className,
}: IChatInterfaceProps) {
  const [messages, setMessages] = useState<IMessage[]>(
    conversationHistory || [],
  );
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isIngesting, setIsIngesting] = useState(!initialFileStatus);
  const [ingestionProgress, setIngestionProgress] = useState(initialFileStatus ? 100 : 0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const queryClient = useQueryClient();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clean up streaming on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsGenerating(false);
    }
  };

  const handleSendMessage = async () => {
    const userQuery = input.trim();

    if (!userQuery || isGenerating || isIngesting) return;

    const userMsg: IMessage = {
      sender: "user",
      content: userQuery,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const initialAssistantMsg: IMessage = {
      sender: "assistant",
      content: "",
      sources: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Immediately show user's message and placeholder for assistant
    setMessages((prev) => [...prev, userMsg, initialAssistantMsg]);
    setInput("");
    setIsGenerating(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`
        : "http://localhost:8000/api/v1";

      const response = await fetch(`${baseUrl}/conversations/${conversationId}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userQuery }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Request failed with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body received from server");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const eventStr of events) {
          if (!eventStr.trim()) continue;

          let eventType = "message";
          let dataStr = "";

          const lines = eventStr.split("\n");
          for (const line of lines) {
            if (line.startsWith("event:")) {
              eventType = line.replace("event:", "").trim();
            } else if (line.startsWith("data:")) {
              dataStr += line.replace("data:", "").trim();
            }
          }

          if (!dataStr) continue;

          try {
            const parsed = JSON.parse(dataStr);

            if (eventType === "sources") {
              const sources = parsed.sources || [];
              setMessages((prev) => {
                const next = [...prev];
                const lastIdx = next.length - 1;
                if (lastIdx >= 0 && next[lastIdx].sender === "assistant") {
                  next[lastIdx] = { ...next[lastIdx], sources };
                }
                return next;
              });
            } else if (eventType === "chunk") {
              const text = parsed.text || "";
              setMessages((prev) => {
                const next = [...prev];
                const lastIdx = next.length - 1;
                if (lastIdx >= 0 && next[lastIdx].sender === "assistant") {
                  next[lastIdx] = {
                    ...next[lastIdx],
                    content: next[lastIdx].content + text,
                  };
                }
                return next;
              });
            } else if (eventType === "done") {
              const finalMsg = parsed.assistantMessage;
              if (finalMsg) {
                setMessages((prev) => {
                  const next = [...prev];
                  const lastIdx = next.length - 1;
                  if (lastIdx >= 0 && next[lastIdx].sender === "assistant") {
                    next[lastIdx] = {
                      ...next[lastIdx],
                      content: finalMsg.content || next[lastIdx].content,
                      sources: finalMsg.sources || next[lastIdx].sources,
                      createdAt: finalMsg.createdAt || next[lastIdx].createdAt,
                      updatedAt: finalMsg.updatedAt || next[lastIdx].updatedAt,
                    };
                  }
                  return next;
                });
              }
            } else if (eventType === "error") {
              throw new Error(parsed.message || "Failed to generate answer");
            }
          } catch (parseError: any) {
            if (eventType === "error") {
              throw parseError;
            }
            console.error("Error parsing SSE event:", parseError, eventStr);
          }
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Stream aborted by user");
        return;
      }
      console.error("Failed to stream AI response:", err);
      toast.error(err.message || "Failed to get AI response. Please try again.");

      // Clean up empty assistant placeholder if failed completely
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.sender === "assistant" && !last.content) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
      queryClient.invalidateQueries({ queryKey: ["conversation", conversationId] });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter") return;

    if (e.shiftKey) {
      // Shift + Enter = newline
      return;
    }

    e.preventDefault();
    handleSendMessage();
  };

  const handleIngestionComplete = () => {
    setIsIngesting(false);
    queryClient.invalidateQueries({ queryKey: ["conversation", conversationId] });
    toast.success("Document ingestion completed! You can now ask questions.");
  };

  const handleProgressUpdate = (progressData: IFileProgress) => {
    setIngestionProgress(progressData.progress);
    if (progressData.status === "completed") {
      setIsIngesting(false);
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Processing Status - shows only in conversation when needed */}
      <FileIngestionProgress
        conversationId={conversationId}
        initialCompleted={initialFileStatus}
        onProgressUpdate={handleProgressUpdate}
        onComplete={handleIngestionComplete}
      />
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const isLast = index === messages.length - 1;
          const isStreamingThis = isGenerating && isLast && msg.sender === "assistant";

          return (
            <div
              key={`${msg.sender}-${msg.createdAt}-${index}`}
              className={cn(
                "flex gap-3 max-w-[90%]",
                msg.sender === "user" ? "ml-auto flex-row-reverse" : "",
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                  msg.sender === "assistant"
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary text-secondary-foreground",
                )}
              >
                {msg.sender === "assistant" ? (
                  <Bot className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>

              {/* Message Content */}
              <div
                className={cn(
                  "p-3.5 rounded-xl text-sm leading-relaxed",
                  msg.sender === "assistant"
                    ? "bg-card border shadow-sm rounded-tl-none"
                    : "bg-primary text-primary-foreground rounded-tr-none",
                )}
              >
                {isStreamingThis && !msg.content ? (
                  <div className="flex items-center gap-2 py-1 text-muted-foreground">
                    <div className="flex gap-1.5">
                      <span className="h-2 w-2 bg-primary/40 rounded-full animate-bounce" />
                      <span className="h-2 w-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.1s]" />
                      <span className="h-2 w-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Searching document and generating answer...
                    </p>
                  </div>
                ) : (
                  <>
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          const [copied, setCopied] = useState(false);

                          const handleCopy = () => {
                            navigator.clipboard.writeText(String(children));
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          };

                          return !inline && match ? (
                            <div className="relative mt-2 rounded-lg overflow-hidden">
                              <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50 text-xs text-muted-foreground border-b">
                                <span>{match[1]}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={handleCopy}
                                  className="h-6 w-6"
                                >
                                  {copied ? (
                                    <Check className="h-3 w-3" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                              <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            </div>
                          ) : (
                            <code
                              className="bg-muted px-1.5 py-0.5 rounded text-xs"
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>

                    {/* Streaming Cursor Indicator */}
                    {isStreamingThis && (
                      <span className="inline-block w-1.5 h-4 ml-0.5 bg-primary animate-pulse align-middle" />
                    )}
                  </>
                )}

                {/* Citations */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t space-y-1">
                    {msg.sources.map((source, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-muted-foreground flex items-start gap-1.5"
                      >
                        <span className="font-mono font-medium text-primary mt-0.5">
                          📄 p.{source.pageNumber}
                        </span>
                        <span>{source.title || source.fileName}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4 bg-card/50 backdrop-blur-sm">
        {isIngesting && (
          <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping shrink-0" />
            <span className="font-medium text-foreground/80">
              Document indexing in progress ({ingestionProgress}%)... Querying will be enabled once indexing completes.
            </span>
          </div>
        )}
        <div className="flex gap-2">
          <textarea
            disabled={isIngesting || isGenerating}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isIngesting
                ? `Indexing document (${ingestionProgress}%)... Please wait`
                : "Ask a question about this document... (Shift+Enter for newline)"
            }
            className="flex-1 resize-none rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[40px] max-h-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
            rows={1}
          />
          {isGenerating ? (
            <Button
              onClick={handleStopGeneration}
              variant="destructive"
              size="icon"
              className="shrink-0 cursor-pointer"
              title="Stop generating"
            >
              <Square className="h-3.5 w-3.5 fill-current" />
            </Button>
          ) : (
            <Button
              onClick={handleSendMessage}
              disabled={isIngesting || !input.trim()}
              size="icon"
              className={cn(
                "shrink-0",
                isIngesting || !input.trim()
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              )}
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
