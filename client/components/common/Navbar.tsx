
"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Monitor scroll height to condense navbar height and opacity dynamically
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50",
          "w-[calc(100%-32px)] max-w-5xl rounded-xl border transition-all duration-300 ease-in-out",
          isScrolled
            ? "py-2.5 bg-background/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.03)] border-border/80"
            : "py-4 bg-background/30 backdrop-blur-xs border-border/40"
        )}
      >
        <nav className="w-full px-6 flex items-center justify-between" aria-label="Main navigation grid">
          
          {/* Left Block: Modern Micro Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-md group"
          >
            <Sparkles className="h-4 w-4 text-primary fill-primary/5 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-bold text-sm tracking-tight text-foreground">PDF AI</span>
          </Link>

          {/* Center Block: Sleek Link Arrays */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg outline-none focus-visible:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Block: Clean Conversion CTA Trigger */}
          <div className="hidden md:flex items-center">
            <Button  size="sm" className="rounded-xl px-4 text-xs font-semibold shadow-2xs bg-primary text-primary-foreground hover:opacity-95 flex items-center gap-1 group">
             <Link href={"/login"} >Login</Link>
              
              <ArrowRight className="h-3 w-3 text-primary-foreground/80 group-hover:translate-x-0.5 transition-transform" />
           
            </Button>
          </div>

          {/* Mobile Controller Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors outline-none focus-visible:ring-1 focus-visible:ring-primary md:hidden"
            aria-expanded={isOpen}
            aria-label="Toggle navigation viewport"
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

        </nav>
      </header>

      {/* Responsive Mobile Drawer Mask overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Soft Ambient Backdrop Blur click target */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/40 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Menu Panel Stream */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-20 left-4 right-4 z-40 p-5 rounded-xl border bg-background shadow-xl flex flex-col gap-4 md:hidden border-border/80"
            >
              <div className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-all"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="h-px bg-border/40 w-full my-0.5" />
              <Button onClick={() => setIsOpen(false)} className="w-full rounded-xl py-5 text-xs font-semibold bg-primary text-primary-foreground flex items-center justify-center gap-1">
                <Link href={"/login"}>Login</Link>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
