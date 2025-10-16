"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
  color?: string;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export function ProgressBar({ 
  progress, 
  color = "from-purple-500 to-pink-500", 
  size = "md",
  animated = true 
}: ProgressBarProps) {
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };

  return (
    <div className={`w-full bg-white/10 rounded-full overflow-hidden ${sizeClasses[size]}`}>
      <motion.div
        className={`h-full bg-gradient-to-r ${color} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(progress * 100, 100)}%` }}
        transition={animated ? { duration: 0.5, ease: "easeOut" } : { duration: 0 }}
      />
    </div>
  );
}
