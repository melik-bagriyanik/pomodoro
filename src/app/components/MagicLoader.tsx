"use client";

import { motion } from "framer-motion";

interface MagicLoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function MagicLoader({ size = "md", text = "Yükleniyor..." }: MagicLoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24"
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Magical Spinning Rings */}
      <div className="relative">
        {/* Outer Ring */}
        <motion.div
          className={`${sizeClasses[size]} border-4 border-purple-400/30 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Middle Ring */}
        <motion.div
          className={`absolute inset-2 border-4 border-pink-400/50 rounded-full`}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner Ring */}
        <motion.div
          className={`absolute inset-4 border-4 border-cyan-400/70 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />

        {/* Magical Center Orb */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
        </motion.div>

        {/* Floating Particles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: "50%",
              top: "50%",
              transformOrigin: "0 0",
            }}
            animate={{
              rotate: [0, 360],
              x: [0, 30 * Math.cos((i * 60) * Math.PI / 180)],
              y: [0, 30 * Math.sin((i * 60) * Math.PI / 180)],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Magical Text */}
      <motion.div
        className="text-center"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <p className={`text-white/80 font-medium ${textSizes[size]}`}>
          {text}
        </p>
        
        {/* Animated Dots */}
        <div className="flex justify-center space-x-1 mt-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-1 bg-white rounded-full"
              animate={{
                scale: [0.5, 1, 0.5],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

