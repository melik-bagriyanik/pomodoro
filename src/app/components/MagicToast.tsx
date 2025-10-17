"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, AlertTriangle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

interface MagicToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function MagicToast({ message, type, isVisible, onClose, duration = 4000 }: MagicToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            onClose();
            return 0;
          }
          return prev - (100 / (duration / 50));
        });
      }, 50);

      return () => clearInterval(interval);
    } else {
      setProgress(100);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case "error":
        return <XCircle className="w-6 h-6 text-red-400" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
      case "info":
        return <Info className="w-6 h-6 text-blue-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-purple-400" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return "from-green-500/20 to-emerald-500/20 border-green-400/30";
      case "error":
        return "from-red-500/20 to-rose-500/20 border-red-400/30";
      case "warning":
        return "from-yellow-500/20 to-orange-500/20 border-yellow-400/30";
      case "info":
        return "from-blue-500/20 to-cyan-500/20 border-blue-400/30";
      default:
        return "from-purple-500/20 to-pink-500/20 border-purple-400/30";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <motion.div
            className={`relative bg-gradient-to-r ${getColors()} backdrop-blur-xl rounded-2xl p-4 border shadow-2xl overflow-hidden`}
            whileHover={{ scale: 1.02 }}
          >
            {/* Magical Background Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Sparkle Effects */}
            {Array.from({ length: 8 }).map((_, i) => (
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
                }}
                transition={{
                  duration: 1 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}

            <div className="relative z-10 flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                {getIcon()}
              </motion.div>
              
              <div className="flex-1">
                <p className="text-white font-medium text-sm">{message}</p>
              </div>

              <motion.button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <XCircle className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Progress Bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full"
              style={{ width: `${progress}%` }}
              initial={{ width: "100%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

