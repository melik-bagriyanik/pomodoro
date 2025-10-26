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

type AppMode = "pomodoro" | "breathing" | "focus";
type Theme = "uzay" | "sıcak" | "soğuk" | "orman" | "yağmur";

interface ThemeConfig {
  name: Theme;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    particles: string[];
  };
  particles: {
    count: number;
    speed: number;
    size: { min: number; max: number };
    links: {
      distance: number;
      opacity: number;
    };
  };
}

const themes: ThemeConfig[] = [
  {
    name: "uzay",
    colors: {
      primary: "from-purple-500 to-indigo-500",
      secondary: "from-violet-400 to-purple-400",
      accent: "from-pink-400 to-rose-400",
      background: "from-slate-900 via-purple-900 to-indigo-900",
      particles: ["#8b5cf6", "#6366f1", "#ec4899", "#f59e0b", "#06b6d4"]
    },
    particles: {
      count: 80,
      speed: 0.3,
      size: { min: 1, max: 4 },
      links: { distance: 250, opacity: 0.15 }
    }
  },
  {
    name: "sıcak",
    colors: {
      primary: "from-orange-500 to-red-500",
      secondary: "from-yellow-400 to-orange-400",
      accent: "from-red-400 to-pink-400",
      background: "from-orange-900 via-red-900 to-yellow-900",
      particles: ["#f97316", "#ef4444", "#f59e0b", "#fbbf24", "#f87171"]
    },
    particles: {
      count: 60,
      speed: 0.8,
      size: { min: 2, max: 6 },
      links: { distance: 180, opacity: 0.3 }
    }
  },
  {
    name: "soğuk",
    colors: {
      primary: "from-blue-500 to-cyan-500",
      secondary: "from-indigo-400 to-blue-400",
      accent: "from-cyan-400 to-teal-400",
      background: "from-blue-900 via-indigo-900 to-cyan-900",
      particles: ["#3b82f6", "#06b6d4", "#6366f1", "#0891b2", "#67e8f9"]
    },
    particles: {
      count: 45,
      speed: 0.4,
      size: { min: 1, max: 4 },
      links: { distance: 200, opacity: 0.2 }
    }
  },
  {
    name: "orman",
    colors: {
      primary: "from-green-500 to-emerald-500",
      secondary: "from-lime-400 to-green-400",
      accent: "from-emerald-400 to-teal-400",
      background: "from-green-900 via-emerald-900 to-lime-900",
      particles: ["#10b981", "#059669", "#84cc16", "#22c55e", "#6ee7b7"]
    },
    particles: {
      count: 55,
      speed: 0.6,
      size: { min: 2, max: 5 },
      links: { distance: 160, opacity: 0.25 }
    }
  },
  {
    name: "yağmur",
    colors: {
      primary: "from-gray-500 to-slate-500",
      secondary: "from-slate-400 to-gray-400",
      accent: "from-blue-400 to-indigo-400",
      background: "from-gray-900 via-slate-900 to-blue-900",
      particles: ["#64748b", "#475569", "#3b82f6", "#6366f1", "#94a3b8"]
    },
    particles: {
      count: 70,
      speed: 1.2,
      size: { min: 1, max: 3 },
      links: { distance: 120, opacity: 0.4 }
    }
  }
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

  const getCurrentThemeConfig = () => {
    return themes.find(theme => theme.name === currentTheme) || themes[0];
  };

  const modes = [
    { id: "pomodoro", label: "Pomodoro", icon: Timer, color: "from-red-500 to-orange-500" },
    { id: "breathing", label: "Nefes Egzersizi", icon: Wind, color: "from-blue-500 to-cyan-500" },
    { id: "focus", label: "Odak Modu", icon: Brain, color: "from-purple-500 to-pink-500" }
  ];


  return (
    <div className={`min-h-screen bg-gradient-to-br ${getCurrentThemeConfig().colors.background} relative overflow-hidden flex flex-col`}>
      <BackgroundAnimation theme={getCurrentThemeConfig()} />
      
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
              <div className="text-xl sm:text-2xl font-bold text-green-400">
                {sessionCount}
              </div>
              <div className="text-xs font-medium text-white/70">Oturum</div>
            </div>
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl px-3 py-2 sm:px-4 sm:py-3 border border-white/10">
              <div className="text-xl sm:text-2xl font-bold text-orange-400">
                {Math.floor(totalFocusTime / 60)}
              </div>
              <div className="text-xs font-medium text-white/70">Dakika</div>
            </div>
            
          </div>
        </div>
        
        {/* Theme Selection */}
        <div className="mt-4 flex justify-center">
          <div className="flex space-x-2 bg-white/5 backdrop-blur-sm rounded-xl p-1 border border-white/10 relative">
            {themes.map((theme) => (
              <motion.button
                key={theme.name}
                onClick={() => setCurrentTheme(theme.name)}
                className={`relative px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                  currentTheme === theme.name
                    ? "text-white shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: themes.indexOf(theme) * 0.1 }}
              >
                {currentTheme === theme.name && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${theme.colors.primary} rounded-lg`}
                    layoutId="activeTheme"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                )}
                <span className="relative z-10">
                  {theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </header>

      {/* Mode Selection */}
      <div className="relative z-10 px-4 sm:px-6 mb-2 sm:mb-3 flex-shrink-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center space-y-1 sm:space-y-0 sm:space-x-2 backdrop-blur-xl rounded-2xl p-1 sm:p-2 border shadow-2xl bg-white/5 border-white/10">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setCurrentMode(mode.id as AppMode)}
                className={`flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-500 relative overflow-hidden min-h-[36px] ${
                  currentMode === mode.id
                    ? "bg-white text-gray-900 shadow-xl scale-105"
                    : "text-white hover:bg-white/10 hover:scale-105"
                }`}
              >
                {currentMode === mode.id && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${mode.color} opacity-20`} />
                )}
                <mode.icon className={`w-3 h-3 sm:w-4 sm:h-4 relative z-10 ${
                  currentMode === mode.id 
                    ? "text-gray-900"
                    : "text-white"
                }`} />
                {currentMode === mode.id ? (
                  <span className="font-semibold text-xs sm:text-sm relative z-10 text-gray-900">
                    {mode.label}
                  </span>
                ) : (
                  <span className="font-semibold text-xs sm:text-sm relative z-10 text-white">
                    {mode.label}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 flex-1 flex items-start justify-center overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full py-2">
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
      </main>


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