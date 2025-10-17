"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Coffee, CheckCircle } from "lucide-react";
import { ProgressBar } from "./ProgressBar";

interface PomodoroTimerProps {
  onSessionComplete: () => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
}

export function PomodoroTimer({ onSessionComplete, isActive, setIsActive }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isBreak, setIsBreak] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const workTime = 25 * 60; // 25 minutes
  const breakTime = 5 * 60; // 5 minutes
  const longBreakTime = 15 * 60; // 15 minutes

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    
    if (!isBreak) {
      // Work session completed
      setCompletedPomodoros(prev => prev + 1);
      onSessionComplete();
      
      // Start break
      setIsBreak(true);
      setTimeLeft(completedPomodoros >= 3 ? longBreakTime : breakTime);
    } else {
      // Break completed, start work
      setIsBreak(false);
      setTimeLeft(workTime);
      setCompletedPomodoros(0);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(workTime);
    setCompletedPomodoros(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? (completedPomodoros >= 3 ? (longBreakTime - timeLeft) / longBreakTime : (breakTime - timeLeft) / breakTime)
    : (workTime - timeLeft) / workTime;

  return (
    <div className="text-center">
      {/* Timer Display */}
      <motion.div 
        className="relative mb-8 sm:mb-12"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative w-72 h-72 sm:w-96 sm:h-96 mx-auto">
          {/* Outer Glow Ring */}
          <motion.div
            className={`absolute inset-0 rounded-full ${
              isBreak ? "bg-green-500/20" : "bg-orange-500/20"
            } blur-xl`}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Progress Ring */}
          <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 100 100">
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="3"
              fill="none"
            />
            {/* Progress Ring */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke={isBreak ? "#10b981" : "#f59e0b"}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress)}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - progress) }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{
                filter: "drop-shadow(0 0 10px currentColor)"
              }}
            />
          </svg>

          {/* Timer Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <motion.div 
              className="text-5xl sm:text-7xl font-bold text-white mb-3 sm:mb-4 tracking-tight"
              key={timeLeft}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                textShadow: "0 0 30px rgba(255,255,255,0.3)"
              }}
            >
              {formatTime(timeLeft)}
            </motion.div>
            
            <motion.div 
              className={`text-lg sm:text-xl font-semibold px-4 sm:px-6 py-2 rounded-full backdrop-blur-sm border ${
                isBreak 
                  ? "text-green-100 bg-green-500/20 border-green-400/30" 
                  : "text-orange-100 bg-orange-500/20 border-orange-400/30"
              }`}
              key={isBreak ? "break" : "work"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {isBreak ? "🌿 Mola Zamanı" : "🎯 Odaklanma Zamanı"}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div 
        className="flex justify-center space-x-4 sm:space-x-6 mb-8 sm:mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          onClick={() => setIsActive(!isActive)}
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-white shadow-2xl backdrop-blur-sm border transition-all duration-300 ${
            isActive 
              ? "bg-gradient-to-br from-red-500 to-red-600 border-red-400/30 hover:from-red-600 hover:to-red-700" 
              : "bg-gradient-to-br from-green-500 to-green-600 border-green-400/30 hover:from-green-600 hover:to-green-700"
          }`}
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: isActive 
              ? "0 0 20px rgba(239, 68, 68, 0.4)"
              : "0 0 20px rgba(34, 197, 94, 0.4)"
          }}
        >
          <motion.div
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isActive ? <Pause className="w-6 h-6 sm:w-8 sm:h-8" /> : <Play className="w-6 h-6 sm:w-8 sm:h-8" />}
          </motion.div>
        </motion.button>

        <motion.button
          onClick={resetTimer}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 flex items-center justify-center text-white shadow-2xl backdrop-blur-sm border border-gray-500/30"
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          }}
          whileTap={{ scale: 0.9 }}
        >
          <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8" />
        </motion.button>
      </motion.div>

      {/* Session Progress */}
      <motion.div 
        className="bg-white/5 backdrop-blur-xl rounded-3xl p-4 sm:p-8 max-w-lg mx-auto border border-white/10 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <span className="text-white font-semibold text-base sm:text-lg">Pomodoro Oturumları</span>
              <p className="text-white/60 text-xs sm:text-sm">Günlük hedefinize ulaşın</p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <span className="text-xl sm:text-2xl font-bold text-white">{completedPomodoros}/4</span>
            <p className="text-white/60 text-xs">tamamlandı</p>
          </div>
        </div>
        
        <div className="flex justify-center space-x-2 sm:space-x-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={index}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center relative overflow-hidden ${
                index < completedPomodoros 
                  ? "bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg" 
                  : "bg-white/10 border border-white/20"
              }`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.1 * index,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              whileHover={{ scale: 1.1 }}
            >
              {index < completedPomodoros && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + 0.1 * index }}
                >
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </motion.div>
              )}
              {index >= completedPomodoros && (
                <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/30 rounded-full" />
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Progress Bar */}
        <motion.div className="mt-6">
          <div className="flex justify-between text-sm text-white/60 mb-2">
            <span>İlerleme</span>
            <span>{Math.round((completedPomodoros / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedPomodoros / 4) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
