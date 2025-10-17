"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MagicButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function MagicButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
}: MagicButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "secondary":
        return "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800";
      case "success":
        return "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600";
      case "warning":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600";
      case "danger":
        return "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600";
      default:
        return "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-4 py-2 text-sm";
      case "lg":
        return "px-8 py-4 text-lg";
      default:
        return "px-6 py-3 text-base";
    }
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden rounded-2xl font-semibold text-white
        shadow-2xl border border-white/20 backdrop-blur-sm
        transition-all duration-300
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      whileHover={!disabled ? { 
        scale: 1.05,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)"
      } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={loading ? {
        boxShadow: [
          "0 0 20px rgba(147, 51, 234, 0.4)",
          "0 0 40px rgba(236, 72, 153, 0.6)",
          "0 0 20px rgba(147, 51, 234, 0.4)",
        ],
      } : {}}
      transition={{
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      {/* Magical Background Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Ripple Effect */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-2xl"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ 
          scale: 1, 
          opacity: [0, 0.5, 0],
          transition: { duration: 0.3 }
        }}
      />

      {/* Floating Particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center space-x-2">
        {loading && (
          <motion.div
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        <span>{children}</span>
      </div>

      {/* Magical Border Glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl border border-white/30"
        animate={{
          boxShadow: [
            "0 0 0 0px rgba(255,255,255,0.1)",
            "0 0 0 2px rgba(255,255,255,0.3)",
            "0 0 0 0px rgba(255,255,255,0.1)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.button>
  );
}

