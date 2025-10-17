"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Wind, Sparkles } from "lucide-react";

export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [cycle, setCycle] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const breathingPattern = {
    inhale: 4, // 4 seconds
    hold: 4,   // 4 seconds
    exhale: 6, // 6 seconds
    pause: 2   // 2 seconds
  };

  const totalCycles = 4;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let currentPhase: keyof typeof breathingPattern = 'inhale';
    let phaseTime = 0;

    if (isActive && !isComplete) {
      interval = setInterval(() => {
        phaseTime++;
        
        if (phaseTime >= breathingPattern[currentPhase]) {
          // Move to next phase
          switch (currentPhase) {
            case 'inhale':
              currentPhase = 'hold';
              setPhase('hold');
              break;
            case 'hold':
              currentPhase = 'exhale';
              setPhase('exhale');
              break;
            case 'exhale':
              currentPhase = 'pause';
              setPhase('pause');
              break;
            case 'pause':
              currentPhase = 'inhale';
              setPhase('inhale');
              setCycle(prev => {
                const newCycle = prev + 1;
                if (newCycle >= totalCycles) {
                  setIsComplete(true);
                  setIsActive(false);
                  return prev;
                }
                return newCycle;
              });
              break;
          }
          phaseTime = 0;
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isComplete]);

  const resetExercise = () => {
    setIsActive(false);
    setPhase('inhale');
    setCycle(0);
    setIsComplete(false);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Nefes Al';
      case 'hold': return 'Tut';
      case 'exhale': return 'Nefes Ver';
      case 'pause': return 'Bekle';
      default: return '';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'from-blue-400 to-cyan-400';
      case 'hold': return 'from-green-400 to-emerald-400';
      case 'exhale': return 'from-orange-400 to-red-400';
      case 'pause': return 'from-purple-400 to-indigo-400';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="text-center">
      {/* Breathing Circle */}
      <motion.div 
        className="relative mb-8 sm:mb-12"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative w-72 h-72 sm:w-96 sm:h-96 mx-auto">
          {/* Outer Glow */}
          <motion.div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${getPhaseColor()} blur-2xl opacity-30`}
            animate={{
              scale: phase === 'inhale' ? [1, 1.3, 1] : 
                     phase === 'hold' ? 1.3 : 
                     phase === 'exhale' ? [1.3, 1, 0.8] : 
                     [0.8, 1],
            }}
            transition={{
              duration: phase === 'inhale' ? 4 : 
                       phase === 'hold' ? 4 : 
                       phase === 'exhale' ? 6 : 2,
              ease: phase === 'inhale' ? "easeOut" : 
                    phase === 'exhale' ? "easeIn" : "linear"
            }}
          />

          {/* Background Circle */}
          <motion.div
            className={`w-full h-full rounded-full bg-gradient-to-br ${getPhaseColor()} opacity-20 border-2 border-white/10`}
            animate={{
              scale: phase === 'inhale' ? [1, 1.2, 1] : 
                     phase === 'hold' ? 1.2 : 
                     phase === 'exhale' ? [1.2, 1, 0.8] : 
                     [0.8, 1],
            }}
            transition={{
              duration: phase === 'inhale' ? 4 : 
                       phase === 'hold' ? 4 : 
                       phase === 'exhale' ? 6 : 2,
              ease: phase === 'inhale' ? "easeOut" : 
                    phase === 'exhale' ? "easeIn" : "linear"
            }}
          />

          {/* Magical Breathing Circle */}
          <motion.div
            className={`absolute inset-12 rounded-full bg-gradient-to-br ${getPhaseColor()} shadow-2xl border-2 border-white/20`}
            animate={{
              scale: phase === 'inhale' ? [1, 1.3, 1] : 
                     phase === 'hold' ? 1.3 : 
                     phase === 'exhale' ? [1.3, 1, 0.7] : 
                     [0.7, 1],
            }}
            transition={{
              duration: phase === 'inhale' ? 4 : 
                       phase === 'hold' ? 4 : 
                       phase === 'exhale' ? 6 : 2,
              ease: phase === 'inhale' ? "easeOut" : 
                    phase === 'exhale' ? "easeIn" : "linear"
            }}
            style={{
              filter: "drop-shadow(0 0 30px currentColor)"
            }}
          >
            {/* Magical Inner Glow */}
            <motion.div
              className="absolute inset-4 rounded-full bg-white/20"
              animate={{
                opacity: [0.2, 0.6, 0.2],
                scale: [0.8, 1.1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Floating Energy Particles */}
            {Array.from({ length: 8 }).map((_, i) => (
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
                  x: [0, 40 * Math.cos((i * 45) * Math.PI / 180)],
                  y: [0, 40 * Math.sin((i * 45) * Math.PI / 180)],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <motion.div 
              className="text-3xl sm:text-5xl font-bold text-white mb-3 sm:mb-4"
              key={phase}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                textShadow: "0 0 30px rgba(255,255,255,0.5)"
              }}
            >
              {getPhaseText()}
            </motion.div>
            
            <motion.div 
              className="text-lg sm:text-xl text-white/90 font-medium px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm bg-white/10 border border-white/20"
              key={`cycle-${cycle}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Döngü {cycle + 1}/{totalCycles}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div 
        className="flex justify-center space-x-3 sm:space-x-4 mb-6 sm:mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {!isComplete ? (
          <motion.button
            onClick={() => setIsActive(!isActive)}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white shadow-lg ${
              isActive 
                ? "bg-red-500 hover:bg-red-600" 
                : "bg-green-500 hover:bg-green-600"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isActive ? <Pause className="w-5 h-5 sm:w-6 sm:h-6" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6" />}
          </motion.button>
        ) : (
          <motion.button
            onClick={resetExercise}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-purple-500 hover:bg-purple-600 flex items-center justify-center text-white shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>
        )}

        <motion.button
          onClick={resetExercise}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-600 hover:bg-gray-700 flex items-center justify-center text-white shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>
      </motion.div>

      {/* Instructions */}
      <motion.div 
        className="bg-white/5 backdrop-blur-xl rounded-3xl p-4 sm:p-8 max-w-lg mx-auto border border-white/10 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-center space-x-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
            <Wind className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="text-white font-semibold text-base sm:text-lg">Nefes Egzersizi</span>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          <motion.div 
            className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-blue-400 font-bold text-sm sm:text-base">1</span>
            </div>
            <span className="text-white/90 font-medium text-sm sm:text-base">4 saniye nefes al</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-green-400 font-bold text-sm sm:text-base">2</span>
            </div>
            <span className="text-white/90 font-medium text-sm sm:text-base">4 saniye tut</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
              <span className="text-orange-400 font-bold text-sm sm:text-base">3</span>
            </div>
            <span className="text-white/90 font-medium text-sm sm:text-base">6 saniye nefes ver</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
              <span className="text-purple-400 font-bold text-sm sm:text-base">4</span>
            </div>
            <span className="text-white/90 font-medium text-sm sm:text-base">2 saniye bekle</span>
          </motion.div>
          
          <motion.div 
            className="text-center mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <p className="text-cyan-300 font-semibold text-sm sm:text-base">
              Bu döngüyü {totalCycles} kez tekrarla
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Magical Completion Message */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          >
            {/* Magical Background Effects */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  y: [0, -50, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeOut",
                }}
              />
            ))}

            <motion.div 
              className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 text-center max-w-sm mx-4 shadow-2xl border border-white/20 relative overflow-hidden"
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Magical Background Shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 relative"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              >
                {/* Magical Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-green-400 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <Wind className="w-10 h-10 text-white relative z-10" />
              </motion.div>
              
              <motion.h3 
                className="text-2xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                🎉 Tebrikler! 🎉
              </motion.h3>
              
              <motion.p 
                className="text-gray-600 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Nefes egzersizini başarıyla tamamladınız! 
                Kendinizi daha sakin ve odaklanmış hissediyor musunuz?
              </motion.p>

              {/* Magical Sparkles */}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${20 + (i % 2) * 60}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
