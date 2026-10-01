"use client"

import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {useRef, useState} from "react"

const TIERS = [
  {
    name: "Starter",
    priceMonthly: 0,
    priceYearly: 0,
    desc: "Essential search capabilities for individual students and researchers.",
    features: [
      "Up to 3 active documents",
      "Maximum 20MB per file upload",
      "150 AI queries per month",
      "Standard PDF syntax support",
    ],
    cta: "Start free",
    popular: false,
  },
  {
    name: "Pro",
    priceMonthly: 19,
    priceYearly: 15,
    desc: "Advanced RAG workspace pipelines for high-velocity professionals.",
    features: [
      "Unlimited active documents",
      "Maximum 120MB per file upload",
      "Unlimited AI queries & citations",
      "Priority RAG vector indexing",
      "Dedicated multi-format parser (.xlsx, .docx)",
      "Premium support window",
    ],
    cta: "Upgrade to Pro",
    popular: true,
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

export default function PricingSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section 
      ref={sectionRef}
      className="w-full py-24 bg-background overflow-hidden flex flex-col items-center border-t border-border/40"
      aria-label="Product pricing structural layout"
    >
      <div className="w-full max-w-5xl mx-auto px-4 flex flex-col items-center">
        
        {/* Crisp Header Layout */}
        <div className="text-center max-w-2xl mb-12">
          <motion.span 
            initial={{ opacity: 0, y: 5 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-xs font-semibold tracking-wider text-primary uppercase block mb-3"
          >
            Transparent Pricing
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.05 }}
            className="text-3xl font-bold tracking-tight text-foreground mb-4"
          >
            Predictable plans, tailored to scale.
          </motion.h2>
        </div>

        {/* Minimalist Billing Cycle Switch Button Group */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 p-1 border rounded-xl bg-secondary/20 mb-16 backdrop-blur-xs"
        >
          <button
            onClick={() => setIsYearly(false)}
            className={cn(
              "px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all outline-none",
              !isYearly ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={cn(
              "px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all outline-none flex items-center gap-1.5",
              isYearly ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Annually
            <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded-md">Save 20%</span>
          </button>
        </motion.div>

        {/* Crisp Responsive Card Row Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl items-start">
          {TIERS.map((tier, i) => {
            const price = isYearly ? tier.priceYearly : tier.priceMonthly;
            return (
              <motion.div
                key={tier.name}
                custom={i}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={FADE_UP}
                whileHover={{ y: -2 }}
                className={cn(
                  "p-8 rounded-2xl border text-left flex flex-col justify-between transition-all duration-300 min-h-[460px] relative bg-background",
                  tier.popular 
                    ? "border-primary/40 shadow-[0_20px_40px_rgba(0,0,0,0.03)] ring-1 ring-primary/20" 
                    : "border-border/60 shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
                )}
              >
                {/* Popular Badge Overlay */}
                {tier.popular && (
                  <span className="absolute -top-3 right-6 px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-primary text-primary-foreground rounded-full shadow-xs">
                    Most Popular
                  </span>
                )}

                <div>
                  {/* Tier Meta info */}
                  <h3 className="text-sm font-semibold text-foreground tracking-tight mb-2">{tier.name}</h3>
                  <p className="text-xs text-muted-foreground leading-normal mb-6 min-h-[32px]">{tier.desc}</p>
                  
                  {/* Dynamic Pricing Metrics */}
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-extrabold tracking-tight text-foreground transition-all duration-300">
                      ${price}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      / month {isYearly && <span className="text-[10px] text-muted-foreground/60">(billed yearly)</span>}
                    </span>
                  </div>

                  {/* Divider line */}
                  <div className="h-px bg-border/40 w-full mb-6" />

                  {/* Feature Checklist Mapping */}
                  <ul className="space-y-3.5 mb-8" aria-label={`${tier.name} included capabilities matrix`}>
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-xs text-muted-foreground font-normal leading-normal">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5 stroke-[2.5]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call-to-action Button Trigger */}
                <Button 
                  variant={tier.popular ? "default" : "outline"} 
                  className={cn(
                    "w-full rounded-xl py-5 text-xs font-semibold shadow-2xs transition-all outline-none",
                    tier.popular ? "bg-primary text-primary-foreground hover:opacity-95" : "border-border bg-background/50 hover:bg-secondary/40"
                  )}
                >
                  {tier.cta}
                </Button>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
