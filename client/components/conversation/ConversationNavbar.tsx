"use client";

import { useViewMode, ViewMode } from "@/context/ViewModeContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, MessageSquare, Columns2 } from "lucide-react";

export default function ConversationNavbar() {
  const { mode, setMode } = useViewMode();

  return (
    <header className="border-b bg-card/80 backdrop-blur-sm">
      <div className="flex items-center justify-center px-4 py-2">
        <Tabs
          value={mode}
          onValueChange={(value) => setMode(value as ViewMode)}
          className="w-full max-w-md"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pdf" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Document</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="both" className="gap-2 hidden md:inline-flex">
              <Columns2 className="h-4 w-4" />
              <span className="hidden sm:inline">Split View</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </header>
  );
}
