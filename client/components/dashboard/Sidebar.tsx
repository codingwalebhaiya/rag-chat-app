"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  MessageSquare,
  Files,
  Settings,
  User,
} from "lucide-react";

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const DASHBOARD_NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Chats", href: "/chats", icon: MessageSquare },
  { label: "Documents", href: "/documents", icon: Files },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Profile", href: "/settings/profile", icon: User },
];

export default function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  // Close the menu when a route switches in mobile displays
  React.useEffect(() => {
    onMobileClose();
  }, [pathname]);

  // Shared inner navigation content layout loop block
  const SidebarContent = ({
    isMobileView = false,
  }: {
    isMobileView?: boolean;
  }) => (
    <div className="flex flex-col h-full justify-between p-5">
      <div className="flex flex-col gap-8">
        {/* Upper Micro Brand Frame Logo element */}
        <div className="flex items-center justify-between px-2">
          <Link href="/" className="flex items-center gap-2 group outline-none">
            <Sparkles className="h-4 w-4 text-primary fill-primary/5 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-bold text-sm tracking-tight">Home</span>
          </Link>
          {isMobileView && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Stop click propagation to layout layers
                onMobileClose();
              }}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground md:hidden"
              aria-label="Dismiss sidebar context"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sidebar Nav Links Array Generation Map */}
        <nav
          className="flex flex-col gap-1"
          aria-label="Console inner sidebar tree navigation matrix"
        >
          {DASHBOARD_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all duration-200 outline-none relative group",
                  isActive
                    ? "text-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 stroke-[1.75]",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
                <span>{item.label}</span>

                {/* Premium spring-physics sliding active indicator background item block (Desktop Only) */}
                {isActive && !isMobileView && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute inset-0 bg-secondary border border-border/40 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Session Exiting Options Section */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start rounded-xl text-xs font-semibold px-3 py-5 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 group gap-3"
      >
        <LogOut className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        Sign out session
      </Button>
    </div>
  );

  return (
    <>
      {/* --- A. DESKTOP PERMANENT STICKY STATIC VIEW PANEL --- */}
      <aside className="hidden md:block w-64 border-r border-border/50 bg-secondary/15 h-screen sticky top-0 shrink-0">
        <SidebarContent />
      </aside>

      {/* --- B. MOBILE SLIDING DRAWER SHEET OVERLAY POPUP PANELS --- */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Blurred Dark Backdrop shade overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-background/60 backdrop-blur-xs z-40 md:hidden"
            />

            {/* Main Absolute Sliding Navigation Sheet Container */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-y-0 left-0 w-72 bg-background border-r border-border shadow-2xl z-50 md:hidden"
            >
              <SidebarContent isMobileView />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
