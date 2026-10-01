"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Loader2,
  LogOut,
  User,
  FileText,
  MessageSquare,
  Columns2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/queries/auth.query";
import { useViewMode, ViewMode } from "@/context/ViewModeContext";
import { useUploadFile } from "@/queries/file.query";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { mode, setMode } = useViewMode();
  const { mutate: uploadFileToS3, isPending: isUploading } = useUploadFile();
  const isConversationRoute = pathname.startsWith("/c/");

  // Monitor scroll height
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    uploadFileToS3(file);
    event.target.value = "";
  };

  const handleNewChat = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* Hidden File Input for Upload */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,application/pdf"
        onChange={handleFileSelect}
      />

      {/* Header */}
      <header
        className={cn(
          "w-full border-b bg-card/80 backdrop-blur-sm transition-all duration-200 ",
          isScrolled ? "py-2" : "py-4",
        )}
      >
        <nav
          className="w-full px-3 sm:px-4 md:px-6 flex items-center justify-between gap-3 "
          aria-label="Main navigation"
        >
          {/* Center: Tabs for Conversation Routes */}
          {isConversationRoute && (
            <div className="flex-1 flex justify-center">
              <Tabs
                value={mode}
                onValueChange={(value) => setMode(value as ViewMode)}
                className="w-full max-w-md"
              >
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
                  <TabsTrigger
                    value="pdf"
                    className="gap-1.5 sm:gap-2 px-2 sm:px-3"
                  >
                    <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">Document</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="chat"
                    className="gap-1.5 sm:gap-2 px-2 sm:px-3"
                  >
                    <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">Chat</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="both"
                    className="gap-1.5 sm:gap-2 px-2 sm:px-3 hidden md:inline-flex"
                  >
                    <Columns2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">Split View</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          {/* left side  on desktop */}
          <div> </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Desktop: User Actions */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary text-primary-foreground flex items-center justify-center w-8 h-8">
                    <User className="h-4 w-4" />
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={isLoggingOut}
                    onClick={() => logout()}
                    className="text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    {isLoggingOut ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <LogOut className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              ) : (
                <Button size="sm" asChild>
                  <Link href="/login" className="flex items-center gap-1">
                    <span>Login</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              )}
            </div>

            {/* Mobile & Desktop: New Chat Button (always visible on conversation routes) */}
            {isConversationRoute && (
              <Button
                onClick={handleNewChat}
                disabled={isUploading}
                size="sm"
                className=" md:hidden lg:hidden gap-1.5 sm:gap-2 px-3 sm:px-4 h-9 text-xs sm:text-sm"
              >
                {isUploading ? (
                  <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                ) : (
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}
                <span className="hidden xs:inline">New Chat</span>
                <span className="xs:hidden">New</span>
              </Button>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
