"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Timer, Wind, Heart } from "lucide-react";
import { BreathingExercise } from "./components/BreathingExercise";
import { PomodoroTimer } from "./components/PomodoroTimer";
import { BackgroundAnimation } from "./components/BackgroundAnimation";
import { RelaxationGames } from "./components/RelaxationGames";
import { MagicToast, ToastType } from "./components/MagicToast";
import { Theme, ThemeConfig, themes, getCurrentThemeConfig } from "./types/theme";

type AppMode = "pomodoro" | "breathing" | "relax";

const modes = [
  { id: "pomodoro", label: "Pomodoro", icon: Timer, color: "from-red-500 to-orange-500" },
  { id: "breathing", label: "Nefes Egzersizi", icon: Wind, color: "from-blue-500 to-cyan-500" },
  { id: "relax", label: "Rahatla", icon: Heart, color: "from-pink-500 to-rose-500" }
];

export default function Home() {
  const [currentMode, setCurrentMode] = useState<AppMode>("pomodoro");
  const [currentTheme, setCurrentTheme] = useState<Theme>("uzay");
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  // Load data from localStorage
  useEffect(() => {
    const savedSessionCount = localStorage.getItem("focusflow-session-count");
    const savedTotalTime = localStorage.getItem("focusflow-total-time");
    const savedTheme = localStorage.getItem("focusflow-theme") as Theme;
    
    if (savedSessionCount) setSessionCount(parseInt(savedSessionCount));
    if (savedTotalTime) setTotalFocusTime(parseInt(savedTotalTime));
    if (savedTheme && themes.find(t => t.name === savedTheme)) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("focusflow-session-count", sessionCount.toString());
    localStorage.setItem("focusflow-total-time", totalFocusTime.toString());
    localStorage.setItem("focusflow-theme", currentTheme);
  }, [sessionCount, totalFocusTime, currentTheme]);

  const handleSessionComplete = () => {
    setSessionCount(prev => prev + 1);
    setTotalFocusTime(prev => prev + (currentMode === "pomodoro" ? 25 : 5));
    
    setToast({
      message: "🎉 Harika! Pomodoro oturumunu tamamladınız!",
      type: "success",
      isVisible: true,
    });
  };

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true });
  };

  const currentThemeConfig = getCurrentThemeConfig(currentTheme);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentThemeConfig.colors.background} relative overflow-hidden flex flex-col`}>
      <BackgroundAnimation theme={currentThemeConfig} />
      
      {/* Header */}
      <header className="relative z-10 p-2 sm:p-3 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Brain className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                FocusFlow
              </h1>
              <p className="text-xs sm:text-sm font-medium text-white/80">Üretkenlik ve Zihin Aracı</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-6">
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl px-3 py-2 sm:px-4 sm:py-3 border border-white/10">
              <div className="text-xl sm:text-2xl font-bold text-green-400">{sessionCount}</div>
              <div className="text-xs sm:text-sm text-white/70">Oturum</div>
            </div>
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl px-3 py-2 sm:px-4 sm:py-3 border border-white/10">
              <div className="text-xl sm:text-2xl font-bold text-blue-400">{totalFocusTime}</div>
              <div className="text-xs sm:text-sm text-white/70">Dakika</div>
            </div>
          </div>
        </div>
      </header>

      {/* Theme Selection */}
      <div className="relative z-10 px-4 sm:px-6 mb-2 sm:mb-3 flex-shrink-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {themes.map((theme) => (
              <motion.button
                key={theme.name}
                onClick={() => setCurrentTheme(theme.name)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  currentTheme === theme.name
                    ? "bg-white/20 text-white shadow-lg"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="relative z-10 px-4 sm:px-6 mb-2 sm:mb-3 flex-shrink-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center space-y-1 sm:space-y-0 sm:space-x-2 backdrop-blur-xl rounded-2xl p-1 sm:p-2 border shadow-2xl bg-white/5 border-white/10">
            {modes.map((mode) => {
              const Icon = mode.icon;
              return (
                <motion.button
                  key={mode.id}
                  onClick={() => setCurrentMode(mode.id as AppMode)}
                  className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    currentMode === mode.id
                      ? "bg-white/20 text-white shadow-lg"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">{mode.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 flex-1 flex items-start justify-center overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full py-2">
          {/* Pomodoro Timer - Always rendered but conditionally visible */}
          <div className={currentMode === "pomodoro" ? "block" : "hidden"}>
            <motion.div
              key="pomodoro"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PomodoroTimer 
                onSessionComplete={handleSessionComplete}
                isActive={isActive}
                setIsActive={setIsActive}
              />
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {currentMode === "breathing" && (
              <motion.div
                key="breathing"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <BreathingExercise />
              </motion.div>
            )}

            {currentMode === "relax" && (
              <motion.div
                key="relax"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <RelaxationGames />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Toast */}
      <MagicToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}