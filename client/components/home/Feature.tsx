"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { Zap, Search, Brain, Shield, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Ingestion",
    desc: "Upload multi-page documents and build your context vector space in under two seconds flat.",
  },
  {
    icon: Search,
    title: "Semantic Analysis",
    desc: "Look past simple keyword matches. Our AI understands full contextual syntax, phrases, and intent.",
  },
  {
    icon: Brain,
    title: "Deep Synthesis",
    desc: "Generate cross-document summaries, structural charts, and bulleted takeaways instantly.",
  },
  {
    icon: Shield,
    title: "Isolated Security",
    desc: "Your data is entirely yours. All stored assets are heavily encrypted and completely omitted from AI models.",
  },
];

const FADE_UP = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }
  })
};

export default function FeatureSection() {
  const sectionRef = React.useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section 
      ref={sectionRef}
      className="w-full py-24 bg-background overflow-hidden flex flex-col items-center border-t border-border/40"
      aria-label="Product capabilities matrix"
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        
        {/* Crisp Header Layout */}
        <div className="max-w-2xl text-left mb-16">
          <motion.span 
            initial={{ opacity: 0, x: -5 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="text-xs font-semibold tracking-wider text-primary uppercase block mb-3"
          >
            Engineered for Precision
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight mb-4"
          >
            Everything you need to interface <br className="hidden sm:inline" />
            with raw corporate intelligence.
          </motion.h2>
        </div>

        {/* Minimalist Grid Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 max-w-5xl">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                custom={i}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={FADE_UP}
                className="flex flex-col items-start text-left group"
              >
                {/* Clean, Non-Boxed Elegant Icon Frame */}
                <div className="mb-4 text-muted-foreground group-hover:text-primary transition-colors duration-300">
                  <Icon className="h-5 w-5 stroke-[1.75]" />
                </div>
                
                {/* Interactive Title */}
                <h3 className="text-sm font-semibold text-foreground tracking-tight mb-2 flex items-center gap-1">
                  {feat.title}
                  <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-primary" />
                </h3>
                
                {/* Body copy */}
                <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed font-normal max-w-sm">
                  {feat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
