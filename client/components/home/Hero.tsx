"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, Upload, ArrowRight, FileText, CheckCircle2, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const FADE_UP = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }
  })
};

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] w-full pt-20 pb-20 overflow-hidden flex flex-col items-center justify-center bg-background px-4">
      {/* Subtle, classy grid background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,#000_70%,transparent_100%)]" />
      
      {/* Soft central ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full filter blur-[120px] pointer-events-none z-0" />

      <div className="w-full max-w-5xl mx-auto text-center flex flex-col items-center relative z-10">
        
        {/* Minimalist Pill Badge */}
        <motion.div custom={0} variants={FADE_UP} initial="hidden" animate="visible" className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background/60 backdrop-blur-md shadow-sm mb-6">
          <Sparkles className="h-3.5 w-3.5 text-primary fill-primary/5" />
          <span className="text-xs font-medium tracking-tight text-foreground/80">Introducing Smart RAG 2.0</span>
        </motion.div>

        {/* Crisp, Focused Typography */}
        <motion.h1 custom={1} variants={FADE_UP} initial="hidden" animate="visible" className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground max-w-3xl leading-[1.1] mb-6">
          Chat with your documents, <br className="hidden sm:inline" />
          <span className="text-muted-foreground font-normal">backed by verified sources.</span>
        </motion.h1>

        {/* Clean, digestible description */}
        <motion.p custom={2} variants={FADE_UP} initial="hidden" animate="visible" className="text-base sm:text-lg text-muted-foreground max-w-xl mb-10 font-normal leading-relaxed">
          Upload PDFs, legal contracts, or technical manuals. Instantly synthesize knowledge, extract answers, and get direct citations in seconds.
        </motion.p>

        {/* Single Primary Action Group to reduce friction */}
        <motion.div custom={3} variants={FADE_UP} initial="hidden" animate="visible" className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md px-4 mb-16">
          <Button size="lg" className="rounded-xl px-6 py-6 text-sm font-medium w-full sm:w-auto shadow-md bg-primary text-primary-foreground hover:opacity-95 gap-2 group">
            <Upload className="h-4 w-4 text-primary-foreground/80" />
            Upload Document
          </Button>
          <Button size="lg" variant="outline" className="rounded-xl px-6 py-6 text-sm font-medium w-full sm:w-auto border-border bg-background/40 backdrop-blur-sm hover:bg-secondary/50 gap-1.5 group">
            Explore live demo
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </motion.div>

        {/* Classy, minimalist Web App Interface Mockup */}
        <motion.div custom={4} variants={FADE_UP} initial="hidden" animate="visible" className="w-full max-w-4xl p-2 rounded-2xl border bg-secondary/20 shadow-[0_20px_50px_rgba(0,0,0,0.04)] backdrop-blur-sm border-border/60">
          <div className="rounded-xl border bg-background shadow-sm overflow-hidden flex flex-col md:flex-row h-[360px] text-left">
            
            {/* Sidebar: File Meta */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border/60 p-4 bg-secondary/10 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase block">Active Context</span>
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-background border border-border/80 shadow-xs">
                  <div className="p-1.5 rounded bg-red-500/10 text-red-500"><FileText className="h-4 w-4" /></div>
                  <div className="flex flex-col truncate"><span className="text-xs font-medium text-foreground truncate">Q4_Report_2026.pdf</span><span className="text-[10px] text-muted-foreground">18.4 MB</span></div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-500 font-medium bg-emerald-500/5 px-2 py-1 rounded-md border border-emerald-500/10 self-start">
                <CheckCircle2 className="h-3 w-3" /> Vectors Synced
              </div>
            </div>

            {/* Chat Stream View */}
            <div className="flex-1 p-5 flex flex-col justify-between gap-4 text-xs bg-background/50">
              <div className="space-y-4 overflow-y-auto pr-1">
                {/* User Input bubble */}
                <div className="flex gap-3 max-w-[85%] ml-auto flex-row-reverse text-right">
                  <div className="h-6 w-6 rounded-full border bg-secondary flex items-center justify-center shrink-0"><User className="h-3 w-3 text-muted-foreground" /></div>
                  <div className="bg-primary text-primary-foreground p-3 rounded-xl rounded-tr-none text-left shadow-xs leading-relaxed">
                    What were the main drivers for revenue growth in Q4?
                  </div>
                </div>

                {/* Streamed AI Output bubble */}
                <div className="flex gap-3 max-w-[90%]">
                  <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0"><Bot className="h-3 w-3" /></div>
                  <div className="space-y-2 flex-1">
                    <div className="bg-secondary/40 border p-3.5 rounded-xl rounded-tl-none space-y-2 text-foreground/90 leading-relaxed shadow-2xs">
                      <p>Revenue growth was driven by three primary channels detailed in the filing:</p>
                      <ul className="space-y-1.5 list-none pl-0">
                        <li className="flex flex-col">
                          <span className="flex items-start gap-1">⏱️ <span className="font-medium text-foreground">SaaS Expansion:</span> Up 24% via new enterprise integrations.</span>
                          <span className="text-[10px] text-muted-foreground font-mono mt-0.5 ml-5 flex items-center gap-1">📄 Page 14 • Sec. 2.1</span>
                        </li>
                        <li className="flex flex-col">
                          <span className="flex items-start gap-1">📉 <span className="font-medium text-foreground">Churn Reduction:</span> Lowered by 4.2% following support changes.</span>
                          <span className="text-[10px] text-muted-foreground font-mono mt-0.5 ml-5 flex items-center gap-1">📄 Page 28 • Table 1.2</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fake message input element for premium look */}
              <div className="pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Ask anything about this document...</span>
                <span className="text-[10px] font-mono bg-secondary px-1.5 py-0.5 rounded border border-border">⌘ K</span>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
