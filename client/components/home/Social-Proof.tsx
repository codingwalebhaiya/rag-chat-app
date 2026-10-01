"use client"

import { motion, useInView } from "framer-motion";
import { CheckCircle2, Shield, Star } from "lucide-react";
import { useRef } from "react";

const LOGOS = [
  { name: "Acme Corp", symbol: "▰" },
  { name: "Nova AI", symbol: "✦" },
  { name: "Vertex", symbol: "▲" },
  { name: "CloudBase", symbol: "☁" },
  { name: "NextScale", symbol: "❖" },
  { name: "DataFlow", symbol: "≈" },
];

const STATS = [
  { value: "10M+", label: "Queries answered" },
  { value: "99.9%", label: "System uptime" },
  { value: "< 2s", label: "Latency window" },
  { value: "100%", label: "Privacy verified" },
];

export default function SocialSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Duplicate items to ensure a perfectly seamless infinite scrolling loop
  const marqueeItems = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <section
      ref={containerRef}
      className="w-full py-16 bg-background border-t border-border/50 overflow-hidden flex flex-col items-center"
      aria-label="Social validation matrix"
    >
      <div className="w-full max-w-5xl mx-auto px-4 text-center">
        {/* Minimalist Subtext Label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-8"
        >
          Trusted by high-velocity product teams worldwide
        </motion.p>

        {/* Seamless Infinite Marquee Loop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full relative overflow-hidden py-2 mb-16 [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]"
        >
          <motion.div
            className="flex gap-16 items-center whitespace-nowrap min-w-full w-max cursor-default"
            animate={{ x: [0, -800] }}
            transition={{ ease: "linear", duration: 25, repeat: Infinity }}
          >
            {marqueeItems.map((logo, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-muted-foreground/50 hover:text-foreground/80 transition-colors duration-200 select-none"
              >
                <span className="font-mono text-lg font-bold">
                  {logo.symbol}
                </span>
                <span className="text-sm font-medium tracking-tight">
                  {logo.name}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Clean, Non-Boxed Performance Metrics Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-14">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.05 }}
              className="flex flex-col items-center text-center group"
            >
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground transition-transform duration-300 group-hover:scale-105">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground mt-1 font-medium tracking-tight">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Single Line Micro-Testimonial Footer Accent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.8 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground pt-6 border-t border-border/40 w-full max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-1 text-amber-500 shrink-0">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="font-semibold text-foreground text-[11px]">
              4.9/5
            </span>
          </div>
          <span className="hidden sm:inline text-border/60">|</span>
          <p className="italic text-center">
            &ldquo;Changed how our entire analytics team navigates dense
            compliance APIs.&rdquo;
          </p>
        </motion.div>
      </div>
    </section>
  );
}
