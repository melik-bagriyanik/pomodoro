export type Theme = "uzay" | "sıcak" | "soğuk" | "orman" | "yağmur";

export interface ThemeConfig {
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

export const themes: ThemeConfig[] = [
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
      background: "from-orange-900 via-red-900 to-pink-900",
      particles: ["#f97316", "#ef4444", "#f59e0b", "#ec4899", "#fbbf24"]
    },
    particles: {
      count: 60,
      speed: 0.5,
      size: { min: 2, max: 5 },
      links: { distance: 200, opacity: 0.2 }
    }
  },
  {
    name: "soğuk",
    colors: {
      primary: "from-blue-500 to-cyan-500",
      secondary: "from-indigo-400 to-blue-400",
      accent: "from-teal-400 to-cyan-400",
      background: "from-blue-900 via-cyan-900 to-teal-900",
      particles: ["#3b82f6", "#06b6d4", "#6366f1", "#10b981", "#8b5cf6"]
    },
    particles: {
      count: 70,
      speed: 0.4,
      size: { min: 1, max: 3 },
      links: { distance: 220, opacity: 0.18 }
    }
  },
  {
    name: "orman",
    colors: {
      primary: "from-green-500 to-emerald-500",
      secondary: "from-lime-400 to-green-400",
      accent: "from-emerald-400 to-teal-400",
      background: "from-green-900 via-emerald-900 to-teal-900",
      particles: ["#10b981", "#059669", "#84cc16", "#22c55e", "#06b6d4"]
    },
    particles: {
      count: 90,
      speed: 0.2,
      size: { min: 1, max: 4 },
      links: { distance: 280, opacity: 0.12 }
    }
  },
  {
    name: "yağmur",
    colors: {
      primary: "from-gray-500 to-slate-500",
      secondary: "from-blue-400 to-gray-400",
      accent: "from-slate-400 to-blue-400",
      background: "from-gray-900 via-slate-900 to-blue-900",
      particles: ["#6b7280", "#475569", "#3b82f6", "#64748b", "#94a3b8"]
    },
    particles: {
      count: 100,
      speed: 0.6,
      size: { min: 1, max: 2 },
      links: { distance: 180, opacity: 0.25 }
    }
  }
];

export const getCurrentThemeConfig = (theme: Theme): ThemeConfig => {
  return themes.find(t => t.name === theme) || themes[0];
};
