"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MagicCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  animated?: boolean;
  glowColor?: "purple" | "blue" | "green" | "orange" | "pink";
}

export function MagicCard({
  children,
  className = "",
  hoverable = true,
  animated = true,
  glowColor = "purple",
}: MagicCardProps) {
  const getGlowColor = () => {
    switch (glowColor) {
      case "blue":
        return "shadow-blue-500/20";
      case "green":
        return "shadow-green-500/20";
      case "orange":
        return "shadow-orange-500/20";
      case "pink":
        return "shadow-pink-500/20";
      default:
        return "shadow-purple-500/20";
    }
  };

  return (
    <motion.div
      className={`
        relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10
        shadow-2xl overflow-hidden
        ${hoverable ? "cursor-pointer" : ""}
        ${className}
      `}
      whileHover={hoverable ? {
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
      } : {}}
      animate={animated ? {
        boxShadow: [
          `0 0 20px ${glowColor === "purple" ? "rgba(147, 51, 234, 0.1)" : 
            glowColor === "blue" ? "rgba(59, 130, 246, 0.1)" :
            glowColor === "green" ? "rgba(16, 185, 129, 0.1)" :
            glowColor === "orange" ? "rgba(245, 158, 11, 0.1)" :
            "rgba(236, 72, 153, 0.1)"}`,
          `0 0 40px ${glowColor === "purple" ? "rgba(147, 51, 234, 0.2)" : 
            glowColor === "blue" ? "rgba(59, 130, 246, 0.2)" :
            glowColor === "green" ? "rgba(16, 185, 129, 0.2)" :
            glowColor === "orange" ? "rgba(245, 158, 11, 0.2)" :
            "rgba(236, 72, 153, 0.2)"}`,
          `0 0 20px ${glowColor === "purple" ? "rgba(147, 51, 234, 0.1)" : 
            glowColor === "blue" ? "rgba(59, 130, 246, 0.1)" :
            glowColor === "green" ? "rgba(16, 185, 129, 0.1)" :
            glowColor === "orange" ? "rgba(245, 158, 11, 0.1)" :
            "rgba(236, 72, 153, 0.1)"}`,
        ],
      } : {}}
      transition={{
        boxShadow: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      {/* Magical Background Gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${
          glowColor === "purple" ? "from-purple-500/5 to-pink-500/5" :
          glowColor === "blue" ? "from-blue-500/5 to-cyan-500/5" :
          glowColor === "green" ? "from-green-500/5 to-emerald-500/5" :
          glowColor === "orange" ? "from-orange-500/5 to-yellow-500/5" :
          "from-pink-500/5 to-rose-500/5"
        }`}
        animate={animated ? {
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.05, 1],
        } : {}}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Sparkles */}
      {animated && Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Shimmer Effect */}
      {animated && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Magical Border */}
      <motion.div
        className="absolute inset-0 rounded-3xl border border-white/20"
        animate={animated ? {
          borderColor: [
            "rgba(255, 255, 255, 0.1)",
            "rgba(255, 255, 255, 0.3)",
            "rgba(255, 255, 255, 0.1)",
          ],
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}

