"use client";

import { motion } from "framer-motion";

export function BackgroundAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Floating Orbs */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-40 h-40 rounded-full blur-2xl ${
            i % 3 === 0 ? 'bg-gradient-to-br from-purple-400/30 to-pink-400/30' :
            i % 3 === 1 ? 'bg-gradient-to-br from-blue-400/30 to-cyan-400/30' :
            'bg-gradient-to-br from-green-400/30 to-emerald-400/30'
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, 150, -150, 0],
            y: [0, -150, 150, 0],
            scale: [1, 1.3, 0.7, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 25 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Wave Animation */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-purple-500/20 to-transparent"
        animate={{
          background: [
            "linear-gradient(to top, rgba(147, 51, 234, 0.2), transparent)",
            "linear-gradient(to top, rgba(236, 72, 153, 0.2), transparent)",
            "linear-gradient(to top, rgba(59, 130, 246, 0.2), transparent)",
            "linear-gradient(to top, rgba(16, 185, 129, 0.2), transparent)",
            "linear-gradient(to top, rgba(147, 51, 234, 0.2), transparent)",
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Particle System */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className={`absolute w-1 h-1 rounded-full ${
            i % 4 === 0 ? 'bg-purple-400/60' :
            i % 4 === 1 ? 'bg-pink-400/60' :
            i % 4 === 2 ? 'bg-blue-400/60' :
            'bg-cyan-400/60'
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -200],
            x: [0, Math.random() * 100 - 50],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Radial Gradient Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-purple-900/30 via-transparent to-transparent"
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Animated Lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{
            top: `${20 + i * 20}%`,
          }}
          animate={{
            x: ['-100%', '100%'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
