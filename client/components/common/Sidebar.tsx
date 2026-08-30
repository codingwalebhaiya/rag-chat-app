"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Plus,
  X,
  MoreVertical,
  Trash2,
  Loader2,
  LogOut,
  UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/queries/auth.query";
import { useUploadFile } from "@/queries/file.query";
import {
  useGetConversations,
  useDeleteConversation,
} from "@/queries/conversation.query";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Conversation {
  _id: string;
  title: string;
  updatedAt: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [conversationToDelete, setConversationToDelete] =
    useState<Conversation | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const user = useAuthStore((state) => state.user);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { mutate: uploadFileToS3, isPending: isUploading } = useUploadFile();
  const { mutate: deleteConversation, isPending: isDeleting } =
    useDeleteConversation();

  const { data: recentConversations = [] } = useGetConversations();

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

  const handleDeleteClick = (conversation: Conversation) => {
    setConversationToDelete(conversation);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (!conversationToDelete) return;

    deleteConversation(conversationToDelete._id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setConversationToDelete(null);

        // If deleting current conversation, navigate home
        if (pathname === `/c/${conversationToDelete._id}`) {
          router.push("/");
        }
      },
      onError: () => {
        // Handle error if needed
        setShowDeleteDialog(false);
        setConversationToDelete(null);
      },
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,application/pdf"
        onChange={handleFileSelect}
      />

      {/* Toggle/Open Button */}
      {!isOpen && (
        <div className="fixed top-4 left-4 z-50 shadow-md bg-white dark:bg-gray-950 hover:bg-gray-100 dark:hover:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(true)}
            className="fixed top-4 left-4 z-50 shadow-md bg-white dark:bg-gray-950 hover:bg-gray-100 dark:hover:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all flex"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -288,
          width: isOpen ? 288 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed lg:relative z-40 h-screen bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800",
          "flex flex-col shadow-sm overflow-hidden",
          !isOpen && "border-r-0",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <Link href="/" className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold text-base tracking-tight">
              PDF AI
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5 lg:hidden" />
            <PanelLeftClose className="h-4 w-4 hidden lg:block" />
          </Button>
        </div>

        {/* Conversations Section */}
        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-5">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2.5 justify-center w-full font-medium text-sm py-2.5 px-4 border border-dashed border-primary/30 rounded-lg bg-primary/5 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {isUploading ? "Uploading..." : "New Chat"}
          </button>

          {user && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 text-primary" />
                Recent Chats
              </h3>
              <div className="space-y-0.5">
                <AnimatePresence>
                  {recentConversations?.map((conversation: Conversation) => {
                    const isActive = pathname === `/c/${conversation._id}`;
                    const isHovered = hoveredId === conversation._id;

                    return (
                      <motion.div
                        key={conversation._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="relative"
                        onMouseEnter={() => setHoveredId(conversation._id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        <Link
                          href={`/c/${conversation._id}`}
                          onClick={() => {
                            if (window.innerWidth < 1024) setIsOpen(false);
                          }}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                            isActive
                              ? "bg-primary/10 text-primary font-medium shadow-sm"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50",
                          )}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium leading-snug">
                              {conversation.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {formatDate(conversation.updatedAt)}
                            </p>
                          </div>
                        </Link>

                        {/* Three dots dropdown - visible on hover */}
                        {isHovered && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(conversation);
                                  }}
                                  className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 cursor-pointer"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {recentConversations?.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">
                      No conversations yet
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Upload a PDF to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full">
                <div className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 cursor-pointer transition-colors text-gray-700 dark:text-gray-300">
                  <UserIcon className="rounded-full bg-primary text-primary-foreground flex items-center justify-center w-8 h-8" />
                  <div className="flex-1 text-left truncate">
                    <p className="text-sm font-medium leading-snug">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Free Plan</p>
                  </div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 p-1.5"
              align="start"
              side="top"
              sideOffset={8}
            >
              <DropdownMenuItem
                onClick={() => router.push("/settings")}
                className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer"
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logout()}
                disabled={isLoggingOut}
                className="flex items-center gap-2.5 px-3 py-2.5 text-red-600 dark:text-red-400 cursor-pointer"
              >
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.aside>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{conversationToDelete?.title}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>No</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Yes"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
