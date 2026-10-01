"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Sidebar from "@/components/common/Sidebar";
import Navbar from "@/components/common/Navbar";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";
import { ViewModeProvider } from "@/context/ViewModeContext";
import { usePathname } from "next/navigation";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const isConversationRoute = pathname.startsWith("/c/");

  // 🌟 Check if the current page is the root/home page
  const isHomePage = pathname === "/";

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ViewModeProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          {/* 🌟 Only show Navbar if it is NOT the home page */}
          {!isHomePage && <Navbar />}

          {/* Main Content */}
          <main
            // className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-950/50">

            className={`flex-1 overflow-hidden ${isConversationRoute
                ? "" // No padding for conversation pages (full height split view)
                : "overflow-y-auto bg-gray-50/50 dark:bg-gray-950/50" // Regular pages with scroll
              }`}
          >
            {isConversationRoute ? (
              // Conversation pages: no wrapper
              children
            ) : (
              // Regular workspace pages: padded container

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="container mx-auto p-6 lg:p-8"
              >
                {children}
              </motion.div>
            )}
          </main>
        </div>
      </div>

    </ViewModeProvider>
  );
}
