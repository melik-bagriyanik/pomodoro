"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Brain, Timer, Wind, Settings } from "lucide-react";
import { BreathingExercise } from "./components/BreathingExercise";
import { PomodoroTimer } from "./components/PomodoroTimer";
import { BackgroundAnimation } from "./components/BackgroundAnimation";
import { ProgressBar } from "./components/ProgressBar";
import { ModeRecommendation } from "./components/ModeRecommendation";
import { MagicToast, ToastType } from "./components/MagicToast";
import { AnimatedGradientText } from "./components/AnimatedGradientText";
import { ThemeToggler, Theme } from "./components/ThemeToggler";

type AppMode = "pomodoro" | "breathing" | "focus";

export default function Home() {
  const [currentMode, setCurrentMode] = useState<AppMode>("pomodoro");
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: "",
    type: "success",
    isVisible: false,
  });
  const [currentTheme, setCurrentTheme] = useState<Theme>("dark");

  // Load data from localStorage
  useEffect(() => {
    const savedSessionCount = localStorage.getItem("focusflow-session-count");
    const savedTotalTime = localStorage.getItem("focusflow-total-time");
    const savedTheme = localStorage.getItem("focusflow-theme");
    
    if (savedSessionCount) setSessionCount(parseInt(savedSessionCount));
    if (savedTotalTime) setTotalFocusTime(parseInt(savedTotalTime));
    if (savedTheme) setCurrentTheme(savedTheme as Theme);
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
    
    // Show magical success toast
    setToast({
      message: "🎉 Harika! Pomodoro oturumunu tamamladınız!",
      type: "success",
      isVisible: true,
    });
  };

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true });
  };

  const modes = [
    { id: "pomodoro", label: "Pomodoro", icon: Timer, color: "from-red-500 to-orange-500" },
    { id: "breathing", label: "Nefes Egzersizi", icon: Wind, color: "from-blue-500 to-cyan-500" },
    { id: "focus", label: "Odak Modu", icon: Brain, color: "from-purple-500 to-pink-500" }
  ];

  const getThemeClasses = () => {
    switch (currentTheme) {
      case "light":
        return "min-h-screen bg-gradient-to-br from-yellow-50 via-orange-100 to-yellow-200";
      case "cool":
        return "min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-cyan-900";
      case "warm":
        return "min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900";
      default: // dark
        return "min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900";
    }
  };

  return (
    <div className={`${getThemeClasses()} relative overflow-hidden`}>
      <BackgroundAnimation />
      
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-4 sm:p-6"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <motion.div 
            className="flex items-center space-x-3 sm:space-x-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-2xl"
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Brain className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </motion.div>
            <div>
              <AnimatedGradientText
                gradient="purple"
                size="lg"
                className="text-2xl sm:text-3xl font-bold"
              >
                FocusFlow
              </AnimatedGradientText>
              <p className={`text-xs sm:text-sm font-medium ${
                currentTheme === "light" ? "text-orange-600/80" : "text-purple-200/80"
              }`}>Üretkenlik ve Zihin Aracı</p>
            </div>
          </motion.div>

          <div className="flex items-center space-x-3 sm:space-x-6">
            <motion.div 
              className="text-center bg-white/5 backdrop-blur-sm rounded-2xl px-3 py-2 sm:px-4 sm:py-3 border border-white/10"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <AnimatedGradientText
                gradient="green"
                size="lg"
                className="text-xl sm:text-2xl font-bold"
              >
                {sessionCount}
              </AnimatedGradientText>
              <div className={`text-xs font-medium ${
                currentTheme === "light" ? "text-orange-600/70" : "text-purple-200/70"
              }`}>Oturum</div>
            </motion.div>
            <motion.div 
              className="text-center bg-white/5 backdrop-blur-sm rounded-2xl px-3 py-2 sm:px-4 sm:py-3 border border-white/10"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <AnimatedGradientText
                gradient="orange"
                size="lg"
                className="text-xl sm:text-2xl font-bold"
              >
                {Math.floor(totalFocusTime / 60)}
              </AnimatedGradientText>
              <div className={`text-xs font-medium ${
                currentTheme === "light" ? "text-orange-600/70" : "text-purple-200/70"
              }`}>Dakika</div>
            </motion.div>
            
            {/* Theme Toggler */}
            <div className="relative z-[9999]">
              <ThemeToggler
                currentTheme={currentTheme}
                onThemeChange={setCurrentTheme}
                className="hidden sm:block"
              />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mode Selection */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 px-4 sm:px-6 mb-6 sm:mb-8"
      >
        <div className="max-w-5xl mx-auto">
          <div className={`flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3 backdrop-blur-xl rounded-3xl p-2 sm:p-3 border shadow-2xl ${
            currentTheme === "light" 
              ? "bg-orange-100/50 border-orange-200/30" 
              : "bg-white/5 border-white/10"
          }`}>
            {modes.map((mode, index) => (
              <motion.button
                key={mode.id}
                onClick={() => setCurrentMode(mode.id as AppMode)}
                className={`flex items-center justify-center space-x-2 sm:space-x-3 px-4 sm:px-8 py-3 sm:py-4 rounded-2xl transition-all duration-500 relative overflow-hidden min-h-[48px] ${
                  currentMode === mode.id
                    ? currentTheme === "light" 
                      ? "bg-orange-200 text-orange-900 shadow-xl scale-105" 
                      : "bg-white text-gray-900 shadow-xl scale-105"
                    : currentTheme === "light"
                      ? "text-orange-800 hover:bg-orange-100/50 hover:scale-105"
                      : "text-white hover:bg-white/10 hover:scale-105"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {currentMode === mode.id && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${mode.color} opacity-20`}
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <mode.icon className={`w-4 h-4 sm:w-5 sm:h-5 relative z-10 ${
                  currentMode === mode.id 
                    ? currentTheme === "light" ? "text-orange-900" : "text-gray-900"
                    : currentTheme === "light" ? "text-orange-800" : "text-white"
                }`} />
                {currentMode === mode.id ? (
                  <span className={`font-semibold text-sm sm:text-base relative z-10 ${
                    currentTheme === "light" ? "text-orange-900" : "text-gray-900"
                  }`}>
                    {mode.label}
                  </span>
                ) : (
                  <AnimatedGradientText
                    gradient="purple"
                    size="sm"
                    className="font-semibold text-sm sm:text-base relative z-10"
                  >
                    {mode.label}
                  </AnimatedGradientText>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>


      {/* Main Content */}
      <motion.main 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 px-4 sm:px-6"
      >
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {currentMode === "pomodoro" && (
              <motion.div
                key="pomodoro"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <PomodoroTimer 
                  onSessionComplete={handleSessionComplete}
                  isActive={isActive}
                  setIsActive={setIsActive}
                />
              </motion.div>
            )}

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

            {currentMode === "focus" && (
              <motion.div
                key="focus"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ModeRecommendation 
                  sessionCount={sessionCount}
                  totalFocusTime={totalFocusTime}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.main>

      {/* Floating Action Button */}
      <motion.div 
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-20"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shadow-2xl flex items-center justify-center text-white border backdrop-blur-sm ${
            currentTheme === "light" 
              ? "bg-gradient-to-br from-orange-500 via-yellow-500 to-orange-600 border-orange-200/30"
              : currentTheme === "cool"
              ? "bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 border-blue-200/30"
              : currentTheme === "warm"
              ? "bg-gradient-to-br from-red-500 via-orange-500 to-pink-500 border-red-200/30"
              : "bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 border-white/20"
          }`}
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)"
          }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsActive(!isActive)}
          animate={{
            boxShadow: isActive 
              ? "0 0 20px rgba(236, 72, 153, 0.5), 0 0 40px rgba(147, 51, 234, 0.3)"
              : "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          }}
        >
          <motion.div
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isActive ? <Pause className="w-6 h-6 sm:w-7 sm:h-7" /> : <Play className="w-6 h-6 sm:w-7 sm:h-7" />}
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Magical Toast Notifications */}
      <MagicToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
        duration={4000}
      />
    </div>
  );
}