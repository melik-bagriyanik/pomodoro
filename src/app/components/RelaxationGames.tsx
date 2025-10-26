import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, X } from "lucide-react";

export type GameType = "bubbles" | "waves" | "sand";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

interface Wave {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
}

interface SandPoint {
  x: number;
  y: number;
  color: string;
  size: number;
}

interface Game {
  id: GameType;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
}

const games: Game[] = [
  {
    id: "bubbles",
    name: "Balonlar",
    description: "Balonları patlatın ve rahatlayın",
    icon: Play
  },
  {
    id: "waves",
    name: "Dalgalar",
    description: "Suya dokunun ve dalgalar oluşturun",
    icon: Play
  },
  {
    id: "sand",
    name: "Kum",
    description: "Kum üzerinde çizim yapın",
    icon: Play
  }
];

export function RelaxationGames() {
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [waves, setWaves] = useState<Wave[]>([]);
  const [sandPoints, setSandPoints] = useState<SandPoint[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ripples, setRipples] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [sandAudio, setSandAudio] = useState<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const sandCanvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize sand audio
  useEffect(() => {
    const audio = new Audio('/voice/sand-in-bag-6989.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = 'auto';
    setSandAudio(audio);
  }, []);

  // Bubble game
  useEffect(() => {
    if (currentGame === "bubbles") {
      const interval = setInterval(() => {
        setBubbles(prev => {
          const newBubble: Bubble = {
            id: Date.now() + Math.random(),
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 30 + 20,
            speed: Math.random() * 0.5 + 0.2
          };
          return [...prev, newBubble];
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [currentGame]);

  const popBubble = (id: number, x: number, y: number) => {
    setBubbles(prev => prev.filter(bubble => bubble.id !== id));
    
    // Play bubble pop sound
    const playBubbleSound = () => {
      const audio = new Audio('/voice/bubble-pop-293342.mp3');
      audio.volume = 0.3;
      audio.play().catch((error) => {
        console.log('Bubble sound error:', error);
      });
    };
    
    playBubbleSound();
    
    // Cool ripple effect
    const rippleId = Date.now() + Math.random();
    setRipples(prev => [...prev, { id: rippleId, x, y }]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 600);
  };

  const createWave = (x: number, y: number) => {
    // Play water sound from file
    const playWaterSound = () => {
      const audio = new Audio('/voice/water-drip-45622.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore autoplay errors
      });
    };
    
    playWaterSound();
    
    const newWave: Wave = {
      id: Date.now() + Math.random(),
      x,
      y,
      radius: 0,
      maxRadius: 100,
      speed: 2
    };
    
    setWaves(prev => [...prev, newWave]);
  };

  // Wave animation
  useEffect(() => {
    if (currentGame === "waves") {
      const interval = setInterval(() => {
        setWaves(prev => 
          prev.map(wave => ({
            ...wave,
            radius: wave.radius + wave.speed
          })).filter(wave => wave.radius < wave.maxRadius)
        );
      }, 16);

      return () => clearInterval(interval);
    }
  }, [currentGame]);

  // Sand drawing
  useEffect(() => {
    if (currentGame === "sand" && sandCanvasRef.current) {
      const canvas = sandCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const resizeCanvas = () => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          canvas.width = rect.width;
          canvas.height = rect.height;
        }
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      return () => window.removeEventListener('resize', resizeCanvas);
    }
  }, [currentGame]);

  const handleSandMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    drawSand(e);
  };

  const handleSandMouseMove = (e: React.MouseEvent) => {
    drawSand(e);
  };

  const handleSandMouseUp = () => {
    setIsDrawing(false);
  };

  const handleSandMouseLeave = () => {
    // Stop sand sound when mouse leaves
    if (sandAudio && !sandAudio.paused) {
      sandAudio.pause();
      sandAudio.currentTime = 0;
    }
  };

  const drawSand = (e: React.MouseEvent) => {
    // Start sand sound only if not playing
    if (sandAudio && sandAudio.paused) {
      sandAudio.currentTime = 0;
      sandAudio.play().catch((error) => {
        console.log('Sand sound error:', error);
        // Try alternative approach if main fails
        const altAudio = new Audio('/voice/sand-in-bag-6989.mp3');
        altAudio.volume = 0.3;
        altAudio.play().catch((altError) => {
          console.log('Alternative sand sound error:', altError);
        });
      });
    }
    
    const canvas = sandCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get correct mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Realistic sand colors with more variety
    const sandColors = [
      '#f4e4bc', '#e6d3a3', '#d4c4a8', '#c9b896', '#b8a082', 
      '#a68b5b', '#8b7355', '#6b5b47', '#5a4a3a', '#4a3a2a',
      '#f7e7ce', '#e6d3a3', '#d4c4a8', '#c9b896', '#b8a082'
    ];

    // Create multiple sand particles for realistic effect
    for (let i = 0; i < 8; i++) {
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;
      const particleX = x + offsetX;
      const particleY = y + offsetY;
      
      const color = sandColors[Math.floor(Math.random() * sandColors.length)];
      const size = Math.random() * 3 + 1;
      
      // Add shadow and highlight for 3D effect
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      ctx.beginPath();
      ctx.arc(particleX, particleY, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      
      // Add highlight
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      ctx.beginPath();
      ctx.arc(particleX - size/3, particleY - size/3, size/2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fill();
      
      ctx.shadowBlur = 0;
    }
  };

  const clearSand = () => {
    const canvas = sandCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const resetGame = () => {
    setCurrentGame(null);
    setBubbles([]);
    setWaves([]);
    setSandPoints([]);
    setRipples([]);
    clearSand();
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (currentGame) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {games.find(g => g.id === currentGame)?.name}
          </h2>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            Geri Dön
          </button>
        </div>

        <div
          ref={canvasRef}
          className="relative w-full h-96 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 overflow-hidden"
          onClick={handleCanvasClick}
          onMouseMove={currentGame === "sand" ? handleSandMouseMove : undefined}
          style={{ 
            cursor: currentGame === "sand" ? "crosshair" : "pointer",
            overflow: "hidden",
            position: "relative"
          }}
        >
          {/* Bubbles */}
          {currentGame === "bubbles" && (
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ 
                overflow: "hidden",
                position: "relative"
              }}
            >
              {bubbles.map((bubble) => (
                <div
                  key={bubble.id}
                  className="absolute rounded-full bg-gradient-to-br from-blue-400/80 to-purple-400/80 backdrop-blur-sm border border-white/20 shadow-lg cursor-pointer transition-all duration-300 hover:scale-110"
                  style={{
                    left: `${bubble.x}%`,
                    top: `${bubble.y}%`,
                    width: `${bubble.size}px`,
                    height: `${bubble.size}px`,
                    animation: `float ${2 + Math.random() * 2}s ease-in-out infinite`,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = rect.left + rect.width / 2;
                    const y = rect.top + rect.height / 2;
                    popBubble(bubble.id, x, y);
                  }}
                />
              ))}
            </div>
          )}

          {/* Cool ripple effects */}
          {ripples.map((ripple) => (
            <div
              key={ripple.id}
              className="absolute pointer-events-none"
              style={{
                left: ripple.x - 25,
                top: ripple.y - 25,
                width: 50,
                height: 50,
              }}
            >
              <div className="ripple-animation w-full h-full border-2 border-blue-400 rounded-full opacity-60"></div>
            </div>
          ))}

          {/* Waves */}
          {currentGame === "waves" && (
            <div 
              className="absolute inset-0 cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                createWave(x, y);
              }}
              style={{
                background: `
                  radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
                  linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)
                `,
              }}
            >
              {waves.map((wave) => (
                <div
                  key={wave.id}
                  className="absolute border-2 border-blue-400/60 rounded-full pointer-events-none"
                  style={{
                    left: wave.x - wave.radius,
                    top: wave.y - wave.radius,
                    width: wave.radius * 2,
                    height: wave.radius * 2,
                    opacity: 1 - (wave.radius / wave.maxRadius),
                  }}
                />
              ))}
            </div>
          )}

          {/* Sand canvas */}
          {currentGame === "sand" && (
            <>
              <canvas
                ref={sandCanvasRef}
                className="absolute inset-0 w-full h-full"
                onMouseDown={handleSandMouseDown}
                onMouseMove={handleSandMouseMove}
                onMouseUp={handleSandMouseUp}
                onMouseLeave={handleSandMouseLeave}
                style={{ 
                  background: `
                    radial-gradient(circle at 20% 80%, #f4e4bc 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, #e6d3a3 0%, transparent 50%),
                    radial-gradient(circle at 40% 40%, #d4c4a8 0%, transparent 50%),
                    linear-gradient(135deg, #f4e4bc 0%, #e6d3a3 25%, #d4c4a8 50%, #c9b896 75%, #b8a082 100%)
                  `,
                  filter: 'contrast(1.1) brightness(1.05)',
                  imageRendering: 'pixelated'
                }}
              />
              
              {/* Sand texture overlay */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                    repeating-linear-gradient(
                      0deg,
                      transparent,
                      transparent 2px,
                      rgba(255, 255, 255, 0.03) 2px,
                      rgba(255, 255, 255, 0.03) 4px
                    ),
                    repeating-linear-gradient(
                      90deg,
                      transparent,
                      transparent 2px,
                      rgba(255, 255, 255, 0.02) 2px,
                      rgba(255, 255, 255, 0.02) 4px
                    )
                  `,
                  mixBlendMode: 'overlay'
                }}
              />
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Rahatlatıcı Oyunlar</h2>
        <p className="text-white/70 text-lg">Stresinizi azaltmak için interaktif aktiviteler</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <motion.div
              key={game.id}
              onClick={() => setCurrentGame(game.id)}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-300"
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{game.name}</h3>
                <p className="text-white/70 text-sm">{game.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}