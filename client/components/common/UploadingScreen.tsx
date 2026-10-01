"use client";

import { motion } from "framer-motion";
import { Loader2, Upload } from "lucide-react";

export default function UploadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center gap-4 p-8 bg-card border rounded-2xl shadow-lg"
      >
        <div className="relative">
          <div className="p-4 rounded-full bg-primary/10">
            <Upload className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -right-1">
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-lg font-semibold text-foreground">
            Uploading Document
          </h3>
          <p className="text-sm text-muted-foreground">
            Please wait while we process your PDF...
          </p>
        </div>
        <div className="w-48 h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{
              width: ["0%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
