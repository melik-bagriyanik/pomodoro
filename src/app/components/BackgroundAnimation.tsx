"use client";

import { motion } from "framer-motion";

export function BackgroundAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Magical Floating Orbs with Enhanced Effects */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full blur-3xl ${
            i % 4 === 0 ? 'bg-gradient-to-br from-purple-400/40 to-pink-400/40' :
            i % 4 === 1 ? 'bg-gradient-to-br from-blue-400/40 to-cyan-400/40' :
            i % 4 === 2 ? 'bg-gradient-to-br from-green-400/40 to-emerald-400/40' :
            'bg-gradient-to-br from-orange-400/40 to-red-400/40'
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, 200, -200, 0],
            y: [0, -200, 200, 0],
            scale: [0.8, 1.5, 0.6, 0.8],
            rotate: [0, 360, 720],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 30 + i * 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Magical Sparkles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Magical Animated Grid */}
      <motion.div 
        className="absolute inset-0 opacity-15"
        animate={{
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
            <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(147, 51, 234, 0.3)" />
              <stop offset="50%" stopColor="rgba(236, 72, 153, 0.3)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.3)" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </motion.div>

      {/* Magical Wave Animation */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-48 sm:h-40 bg-gradient-to-t from-purple-500/20 to-transparent"
        animate={{
          background: [
            "linear-gradient(to top, rgba(147, 51, 234, 0.3), transparent)",
            "linear-gradient(to top, rgba(236, 72, 153, 0.3), transparent)",
            "linear-gradient(to top, rgba(59, 130, 246, 0.3), transparent)",
            "linear-gradient(to top, rgba(16, 185, 129, 0.3), transparent)",
            "linear-gradient(to top, rgba(245, 158, 11, 0.3), transparent)",
            "linear-gradient(to top, rgba(147, 51, 234, 0.3), transparent)",
          ],
          height: ["12rem", "10rem", "12rem"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Magical Aurora Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10"
        animate={{
          background: [
            "linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1))",
            "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(245, 158, 11, 0.1), rgba(239, 68, 68, 0.1))",
            "linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1))",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Enhanced Magical Particle System */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className={`absolute w-1 h-1 sm:w-2 sm:h-2 rounded-full ${
            i % 5 === 0 ? 'bg-purple-400/80' :
            i % 5 === 1 ? 'bg-pink-400/80' :
            i % 5 === 2 ? 'bg-blue-400/80' :
            i % 5 === 3 ? 'bg-cyan-400/80' :
            'bg-emerald-400/80'
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -300, 0],
            x: [0, Math.random() * 200 - 100, 0],
            opacity: [0, 1, 0.5, 0],
            scale: [0, 1.5, 0.8, 0],
            rotate: [0, 360, 720],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Magical Energy Rings */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute inset-0 border border-purple-400/20 rounded-full"
          style={{
            width: `${200 + i * 100}px`,
            height: `${200 + i * 100}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.8, 0.3],
            rotate: [0, 360],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}

      {/* Enhanced Magical Radial Gradient Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-purple-900/40 via-pink-900/20 to-transparent"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
          background: [
            "radial-gradient(circle, rgba(147, 51, 234, 0.4), rgba(236, 72, 153, 0.2), transparent)",
            "radial-gradient(circle, rgba(59, 130, 246, 0.4), rgba(16, 185, 129, 0.2), transparent)",
            "radial-gradient(circle, rgba(147, 51, 234, 0.4), rgba(236, 72, 153, 0.2), transparent)",
          ],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Magical Animated Lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{
            top: `${15 + i * 12}%`,
          }}
          animate={{
            x: ['-100%', '100%'],
            opacity: [0, 1, 0],
            scaleY: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 10 + i * 1.5,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Magical Floating Geometric Shapes */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`shape-${i}`}
          className={`absolute ${
            i % 3 === 0 ? 'w-8 h-8' :
            i % 3 === 1 ? 'w-6 h-6' :
            'w-4 h-4'
          } ${
            i % 2 === 0 ? 'rounded-full' : 'rounded-lg'
          } ${
            i % 4 === 0 ? 'bg-purple-400/30' :
            i % 4 === 1 ? 'bg-pink-400/30' :
            i % 4 === 2 ? 'bg-blue-400/30' :
            'bg-cyan-400/30'
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 100, 0],
            x: [0, 50, -50, 0],
            rotate: [0, 180, 360],
            scale: [0.5, 1.2, 0.8, 0.5],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}
    </div>
  );
}
