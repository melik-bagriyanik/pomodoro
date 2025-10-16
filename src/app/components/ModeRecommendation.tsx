"use client";

import { motion } from "framer-motion";
import { Brain, Clock, Target, TrendingUp, Coffee, Moon, Sun } from "lucide-react";

interface ModeRecommendationProps {
  sessionCount: number;
  totalFocusTime: number;
}

export function ModeRecommendation({ sessionCount, totalFocusTime }: ModeRecommendationProps) {
  const currentHour = new Date().getHours();
  const isMorning = currentHour >= 6 && currentHour < 12;
  const isAfternoon = currentHour >= 12 && currentHour < 18;
  const isEvening = currentHour >= 18 && currentHour < 22;
  const isNight = currentHour >= 22 || currentHour < 6;

  const getRecommendation = () => {
    if (sessionCount === 0) {
      return {
        title: "Hoş Geldiniz! 👋",
        description: "FocusFlow'a hoş geldiniz! İlk pomodoro oturumunuzu başlatmak için harika bir zaman.",
        mode: "pomodoro",
        icon: Coffee,
        color: "from-orange-500 to-red-500"
      };
    }

    if (sessionCount < 2) {
      return {
        title: "Başlangıç Aşaması 🚀",
        description: "İlk oturumunuzu tamamladınız! Devam etmek için ikinci pomodoro oturumunu başlatın.",
        mode: "pomodoro",
        icon: Target,
        color: "from-green-500 to-emerald-500"
      };
    }

    if (sessionCount >= 4) {
      return {
        title: "Mükemmel Performans! 🎯",
        description: "4 pomodoro oturumunu tamamladınız! Şimdi uzun bir mola zamanı. Nefes egzersizi yapmayı deneyin.",
        mode: "breathing",
        icon: Brain,
        color: "from-blue-500 to-cyan-500"
      };
    }

    if (isMorning) {
      return {
        title: "Günaydın! ☀️",
        description: "Sabah enerjisiyle odaklanma zamanı. Pomodoro tekniği ile güne başlayın.",
        mode: "pomodoro",
        icon: Sun,
        color: "from-yellow-500 to-orange-500"
      };
    }

    if (isAfternoon) {
      return {
        title: "Öğleden Sonra Odaklanma 🎯",
        description: "Öğleden sonra enerjinizi korumak için kısa nefes egzersizleri yapın.",
        mode: "breathing",
        icon: Brain,
        color: "from-purple-500 to-pink-500"
      };
    }

    if (isEvening) {
      return {
        title: "Akşam Sakinliği 🌙",
        description: "Günün yorgunluğunu atmak için nefes egzersizleri yapın ve zihninizi sakinleştirin.",
        mode: "breathing",
        icon: Moon,
        color: "from-indigo-500 to-purple-500"
      };
    }

    return {
      title: "Gece Modu 🌃",
      description: "Gece saatleri için sakinleştirici nefes egzersizleri öneriyoruz.",
      mode: "breathing",
      icon: Moon,
      color: "from-slate-500 to-gray-500"
    };
  };

  const recommendation = getRecommendation();
  const IconComponent = recommendation.icon;

  const stats = [
    {
      label: "Toplam Oturum",
      value: sessionCount,
      icon: Target,
      color: "text-green-400"
    },
    {
      label: "Odaklanma Süresi",
      value: `${Math.floor(totalFocusTime / 60)} dk`,
      icon: Clock,
      color: "text-blue-400"
    },
    {
      label: "Günlük Hedef",
      value: `${Math.min(sessionCount, 8)}/8`,
      icon: TrendingUp,
      color: "text-purple-400"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Main Recommendation */}
      <motion.div
        className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 text-center border border-white/10 shadow-2xl relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background Gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${recommendation.color} opacity-5`}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className={`w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br ${recommendation.color} flex items-center justify-center shadow-2xl relative z-10`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <IconComponent className="w-12 h-12 text-white" />
        </motion.div>

        <motion.h2 
          className="text-3xl font-bold text-white mb-6 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            textShadow: "0 0 20px rgba(255,255,255,0.3)"
          }}
        >
          {recommendation.title}
        </motion.h2>

        <motion.p 
          className="text-white/90 text-xl mb-8 leading-relaxed relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {recommendation.description}
        </motion.p>

        <motion.button
          className={`px-10 py-5 rounded-2xl bg-gradient-to-r ${recommendation.color} text-white font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/20 relative z-10`}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {recommendation.mode === "pomodoro" ? "🍅 Pomodoro Başlat" : "🌬️ Nefes Egzersizi Başlat"}
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/10 shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(255,255,255,0.08)"
            }}
          >
            {/* Background Glow */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${stat.color.replace('text-', 'from-').replace('-400', '-500/20')} opacity-0`}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            
            <motion.div
              className={`w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color.replace('text-', 'from-').replace('-400', '-500')} flex items-center justify-center shadow-lg`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <stat.icon className="w-6 h-6 text-white" />
            </motion.div>
            
            <div className="text-3xl font-bold text-white mb-2 relative z-10">{stat.value}</div>
            <div className="text-white/70 font-medium relative z-10">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tips Section */}
      <motion.div
        className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Günlük İpuçları</h3>
        </div>
        
        <div className="space-y-4">
          <motion.div 
            className="flex items-start space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white font-bold text-sm">1</span>
            </div>
            <p className="text-white/90 font-medium leading-relaxed">Her 25 dakikalık çalışmadan sonra 5 dakika mola verin</p>
          </motion.div>
          
          <motion.div 
            className="flex items-start space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white font-bold text-sm">2</span>
            </div>
            <p className="text-white/90 font-medium leading-relaxed">4 pomodoro oturumundan sonra 15-30 dakika uzun mola yapın</p>
          </motion.div>
          
          <motion.div 
            className="flex items-start space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white font-bold text-sm">3</span>
            </div>
            <p className="text-white/90 font-medium leading-relaxed">Nefes egzersizleri stres seviyenizi düşürür ve odaklanmanızı artırır</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
