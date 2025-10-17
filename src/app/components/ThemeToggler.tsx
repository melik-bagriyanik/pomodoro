"use client";

import { motion } from "framer-motion";
import { Sun, Moon, Sparkles, Palette } from "lucide-react";
import { useState } from "react";

export type Theme = "dark" | "light" | "cool" | "warm";

interface ThemeTogglerProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  className?: string;
}

export function ThemeToggler({ currentTheme, onThemeChange, className = "" }: ThemeTogglerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: "dark", label: "Karanlık", icon: Moon, color: "from-slate-600 to-slate-800" },
    { id: "light", label: "Aydınlık", icon: Sun, color: "from-yellow-400 to-orange-500" },
    { id: "cool", label: "Serin", icon: Sparkles, color: "from-blue-400 to-cyan-500" },
    { id: "warm", label: "Sıcak", icon: Palette, color: "from-orange-400 to-red-500" },
  ] as const;

  const currentThemeData = themes.find(theme => theme.id === currentTheme);

  return (
    <div className={`relative z-[9999] ${className}`}>
      {/* Theme Toggle Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Theme toggler clicked!', isOpen);
          setIsOpen(!isOpen);
        }}
        className={`
          relative w-12 h-12 rounded-2xl bg-gradient-to-br ${currentThemeData?.color || "from-purple-500 to-pink-500"}
          flex items-center justify-center text-white shadow-2xl border border-white/20 backdrop-blur-sm
          overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200
        `}
        style={{ zIndex: 9999 }}
      >
        {/* Magical Background Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating Particles */}
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              zIndex: 1,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}

        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          {currentThemeData?.icon && <currentThemeData.icon className="w-5 h-5 relative z-10" />}
        </div>
      </button>

      {/* Theme Options Dropdown */}
      {isOpen && (
        <div
          className="absolute top-14 bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20 shadow-2xl z-[10000] min-w-[200px]"
          style={{ 
            pointerEvents: "auto",
            zIndex: 10000,
            right: 0,
            left: "auto",
            transform: "translateX(0)"
          }}
        >
        {themes.map((theme, index) => (
          <button
            key={theme.id}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log(`Theme selected: ${theme.id} (${theme.label})`);
              console.log('Button clicked, theme:', theme.id);
              onThemeChange(theme.id);
              setIsOpen(false);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Mouse down on theme:', theme.id);
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Touch start on theme:', theme.id);
            }}
            className={`
              w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300
              hover:scale-105 cursor-pointer relative z-[10001] touch-manipulation
              active:scale-95 select-none
              ${currentTheme === theme.id 
                ? "bg-white/20 text-white" 
                : "text-white/70 hover:bg-white/10 hover:text-white"
              }
            `}
            style={{ 
              zIndex: 10001,
              pointerEvents: "auto",
              touchAction: "manipulation",
              userSelect: "none",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none"
            }}
          >
            <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${theme.color} flex items-center justify-center`}>
              <theme.icon className="w-3 h-3 text-white" />
            </div>
            <span className="font-medium text-sm">{theme.label}</span>
            
            {currentTheme === theme.id && (
              <div className="ml-auto w-2 h-2 bg-white rounded-full" />
            )}
          </button>
        ))}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Backdrop clicked, closing dropdown');
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
}

