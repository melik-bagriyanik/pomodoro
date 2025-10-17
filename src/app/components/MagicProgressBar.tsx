"use client";

import { motion } from "framer-motion";

interface MagicProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  animated?: boolean;
  color?: "purple" | "blue" | "green" | "orange" | "pink";
}

export function MagicProgressBar({ 
  progress, 
  label, 
  showPercentage = true, 
  animated = true,
  color = "purple" 
}: MagicProgressBarProps) {
  const getColorClasses = () => {
    switch (color) {
      case "blue":
        return "from-blue-500 to-cyan-500";
      case "green":
        return "from-green-500 to-emerald-500";
      case "orange":
        return "from-orange-500 to-yellow-500";
      case "pink":
        return "from-pink-500 to-rose-500";
      default:
        return "from-purple-500 to-pink-500";
    }
  };

  const getGlowColor = () => {
    switch (color) {
      case "blue":
        return "shadow-blue-500/50";
      case "green":
        return "shadow-green-500/50";
      case "orange":
        return "shadow-orange-500/50";
      case "pink":
        return "shadow-pink-500/50";
      default:
        return "shadow-purple-500/50";
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Label and Percentage */}
      {(label || showPercentage) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className="text-white/80 font-medium text-sm">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-white/60 text-sm font-mono">
              {Math.round(progress)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar Container */}
      <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
        {/* Background Glow Effect */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${getColorClasses()} opacity-20 blur-sm`}
          animate={animated ? {
            opacity: [0.1, 0.3, 0.1],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Progress Fill */}
        <motion.div
          className={`relative h-full bg-gradient-to-r ${getColorClasses()} rounded-full shadow-lg ${getGlowColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Shimmer Effect */}
          {animated && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Floating Particles */}
          {animated && Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: "50%",
                transform: "translateY(-50%)",
              }}
              animate={{
                y: [0, -8, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        {/* Magical Border */}
        <motion.div
          className="absolute inset-0 rounded-full border border-white/20"
          animate={animated ? {
            boxShadow: [
              "0 0 0 0px rgba(255,255,255,0.1)",
              "0 0 0 2px rgba(255,255,255,0.2)",
              "0 0 0 0px rgba(255,255,255,0.1)",
            ],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}

