// const Footer = () => {
//   return (
//     <footer className="bg-neutral-primary-soft rounded-base shadow-xs border border-default">
//       <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
//         <div className="sm:flex sm:items-center sm:justify-between">
//           <a
//             href="https://flowbite.com/"
//             className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
//           >
//             <img
//               src="https://flowbite.com/docs/images/logo.svg"
//               className="h-7"
//               alt="Flowbite Logo"
//             />
//             <span className="text-heading self-center text-2xl font-semibold whitespace-nowrap">
//               Flowbite
//             </span>
//           </a>
//           <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-body sm:mb-0">
//             <li>
//               <a href="#" className="hover:underline me-4 md:me-6">
//                 About
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:underline me-4 md:me-6">
//                 Privacy Policy
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:underline me-4 md:me-6">
//                 Licensing
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:underline">
//                 Contact
//               </a>
//             </li>
//           </ul>
//         </div>
//         <hr className="my-6 border-default sm:mx-auto lg:my-8" />
//         <span className="block text-sm text-body sm:text-center">
//           © 2023{" "}
//           <a href="https://flowbite.com/" className="hover:underline">
//             Flowbite™
//           </a>
//           . All Rights Reserved.
//         </span>
//       </div>
//     </footer>
//   );
// };

// export default Footer;



"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const FOOTER_LINKS = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Security", href: "#" },
    { label: "Privacy", href: "#" },
  ],
  resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Status", href: "#" },
  ],
};

export default function Footer() {
  const footerRef = React.useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: "-50px" });

  const currentYear = new Date().getFullYear();

  return (
    <footer 
      ref={footerRef}
      className="w-full bg-background border-t border-border/40 pt-20 pb-10 overflow-hidden flex flex-col items-center"
      aria-label="Global page footer context"
    >
      <div className="w-full max-w-5xl mx-auto px-4 flex flex-col gap-16">
        
        {/* Top Segment: Asymmetric Layout Matrix */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 w-full">
          
          {/* Left Column: Brand Logo + Micro Conversion CTA Block */}
          <div className="flex flex-col items-start text-left max-w-xs shrink-0">
            <Link 
              href="/" 
              className="flex items-center gap-2 outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-md mb-4 group"
              aria-label="PDF AI Home Anchor"
            >
              <Sparkles className="h-4 w-4 text-primary fill-primary/5 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-bold text-sm tracking-tight text-foreground">PDF AI</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed mb-6 font-normal">
              Unlock the deep structural knowledge isolated inside your high-density corporate documentation pipelines instantly.
            </p>
            
            {/* Embedded Micro CTA Action Link */}
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Button size="sm" variant="secondary" className="rounded-xl border shadow-2xs font-medium text-xs py-4 px-4 hover:bg-secondary/80 gap-1.5 group">
                Start chatting free
                <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </motion.div>
          </div>

          {/* Right Column: Balanced Semantic Stream Columns */}
          <div className="grid grid-cols-3 gap-x-12 sm:gap-x-16 gap-y-8 text-left">
            {Object.entries(FOOTER_LINKS).map(([category, links], catIdx) => (
              <div key={category} className="flex flex-col gap-3 min-w-[80px]">
                <span className="text-[10px] font-bold tracking-widest text-foreground uppercase block mb-1">
                  {category}
                </span>
                <ul className="space-y-2 list-none pl-0">
                  {links.map((link, linkIdx) => (
                    <motion.li 
                      key={link.label}
                      initial={{ opacity: 0, y: 5 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.3, delay: 0.15 + (catIdx * 0.05) + (linkIdx * 0.03) }}
                    >
                      <Link 
                        href={link.href}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 outline-none focus-visible:text-foreground font-normal"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Segment: Minimal Copyright & Regulatory Meta Line */}
        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 w-full text-[11px] text-muted-foreground">
          <div className="flex flex-wrap items-center gap-1.5 font-normal">
            <span>&copy; {currentYear} PDF AI Inc.</span>
            <span className="text-border/60 hidden sm:inline">•</span>
            <span>All engineering rights reserved globally.</span>
          </div>
          
          {/* Secondary system tracking indicators */}
          <div className="flex items-center gap-2 font-medium text-emerald-500 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-md">
            <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
            <span>All Vectors Operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

