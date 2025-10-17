"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
  gradient?: "purple" | "blue" | "green" | "orange" | "pink" | "rainbow";
  speed?: "slow" | "medium" | "fast";
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

export function AnimatedGradientText({
  children,
  className = "",
  gradient = "purple",
  speed = "medium",
  size = "md",
  animated = true,
}: AnimatedGradientTextProps) {
  const getGradientClasses = () => {
    switch (gradient) {
      case "blue":
        return "from-blue-400 via-cyan-400 to-blue-600";
      case "green":
        return "from-green-400 via-emerald-400 to-green-600";
      case "orange":
        return "from-orange-400 via-yellow-400 to-orange-600";
      case "pink":
        return "from-pink-400 via-rose-400 to-pink-600";
      case "rainbow":
        return "from-purple-400 via-pink-400 via-blue-400 via-green-400 to-yellow-400";
      default:
        return "from-purple-400 via-pink-400 to-purple-600";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-sm";
      case "lg":
        return "text-lg";
      case "xl":
        return "text-xl";
      default:
        return "text-base";
    }
  };

  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 4;
      case "fast":
        return 1.5;
      default:
        return 2.5;
    }
  };

  return (
    <motion.span
      className={`
        bg-gradient-to-r ${getGradientClasses()} bg-clip-text text-transparent
        font-bold ${getSizeClasses()} ${className}
        ${animated ? "animate-gradient" : ""}
      `}
      animate={animated ? {
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      } : {}}
      transition={{
        duration: getSpeed(),
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        backgroundSize: gradient === "rainbow" ? "400% 100%" : "200% 100%",
      }}
    >
      {children}
    </motion.span>
  );
}

