"use client"


import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import {useRef} from "react"

const TESTIMONIALS = [
  {
    quote: "This has completely changed how our analytics team reads through dense corporate compliance PDFs. Complex answers are instant and always include source page citations.",
    name: "Alex Rivera",
    role: "Lead Data Scientist",
    company: "Synapse Labs",
    avatar: "AR"
  },
  {
    quote: "The semantic search capabilities are remarkable. It picks up deep contextual relationships across separate documents that traditional search completely misses.",
    name: "Marcus Chen",
    role: "Principal Researcher",
    company: "Vertex AI",
    avatar: "MC"
  },
  {
    quote: "We cross-examine legal contracts daily. Being able to extract precise clauses and verify them via page pins saves our legal desk hours every single afternoon.",
    name: "Elena Rostova",
    role: "General Counsel",
    company: "Aether Law",
    avatar: "ER"
  },
  {
    quote: "Extremely simple, secure, and lightning-fast. The fact that our document vector spaces are completely omitted from public LLM training datasets is a total game-changer for us.",
    name: "David K.",
    role: "Director of Infrastructure",
    company: "Basecamp Tech",
    avatar: "DK"
  }
];

const FADE_UP = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }
  })
};

export default function TestimonialSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section 
      ref={sectionRef}
      className="w-full py-24 bg-background overflow-hidden flex flex-col items-center border-t border-border/40"
      aria-label="User endorsements validation matrix"
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="max-w-2xl text-left mb-16">
          <motion.span 
            initial={{ opacity: 0, x: -5 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="text-xs font-semibold tracking-wider text-primary uppercase block mb-3"
          >
            User Validation
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-3xl font-bold tracking-tight text-foreground leading-tight"
          >
            Loved by data-driven professionals.
          </motion.h2>
        </div>

        {/* Clean Responsive Layout Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          {TESTIMONIALS.map((item, i) => (
            <motion.div
              key={item.name}
              custom={i}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={FADE_UP}
              whileHover={{ y: -2, borderColor: "rgba(var(--primary), 0.15)" }}
              className="p-6 rounded-xl border bg-secondary/10 backdrop-blur-xs flex flex-col justify-between text-left transition-all duration-300 group"
            >
              <div>
                {/* Minimal 5-Star Row indicator */}
                <div className="flex gap-0.5 text-amber-500 mb-4" aria-hidden="true">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="h-3.5 w-3.5 fill-current stroke-none" />
                  ))}
                </div>
                
                {/* Testimonial Quote */}
                <blockquote className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed font-normal mb-6">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>

              {/* User Bio Footer layout */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/40 w-full mt-auto">
                <div className="h-8 w-8 rounded-full bg-background border border-border text-muted-foreground flex items-center justify-center font-bold text-[10px] tracking-wider select-none shrink-0 group-hover:border-primary/30 transition-colors duration-300">
                  {item.avatar}
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-xs font-semibold text-foreground tracking-tight truncate">
                    {item.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground truncate">
                    {item.role} • <span className="font-medium text-foreground/80">{item.company}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
