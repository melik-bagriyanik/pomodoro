import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, X } from "lucide-react";
import confetti from "canvas-confetti";

export type GameType = "waves" | "sand" | "bubbles";


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

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

interface Game {
  id: GameType;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
}

const games: Game[] = [
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
  },
  {
    id: "bubbles",
    name: "Balonlar",
    description: "Balonlara tıkla ve patlat",
    icon: Play
  }
];

export function RelaxationGames() {
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);
  const [waves, setWaves] = useState<Wave[]>([]);
  const [sandPoints, setSandPoints] = useState<SandPoint[]>([]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
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



  const createWave = (x: number, y: number) => {
    console.log('Creating wave at:', x, y);
    
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
      maxRadius: 120, // Biraz daha küçük maksimum radius
      speed: 1.2 // Daha yavaş büyüme hızı
    };
    
    console.log('New wave created:', newWave);
    setWaves(prev => {
      const updated = [...prev, newWave];
      console.log('Total waves:', updated.length);
      return updated;
    });
  };

  const createBubble = () => {
    const newBubble: Bubble = {
      id: Date.now() + Math.random(),
      x: Math.random() * 350 + 30,
      y: 400,
      size: Math.random() * 40 + 30,
      speed: Math.random() * 1 + 0.5
    };
    setBubbles(prev => [...prev, newBubble]);
  };

  const popBubble = (id: number, x: number, y: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    
    // Play pop sound
    const audio = new Audio('/voice/bubble-pop-293342.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
    
    // Trigger confetti at the exact clicked position
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      // Use the exact mouse coordinates relative to viewport
      const confettiX = x / window.innerWidth;
      const confettiY = y / window.innerHeight;
      
      // Create colorful confetti burst at exact position
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { x: confettiX, y: confettiY },
        colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8', '#60a5fa', '#a25afd', '#ff5e7e'],
        shapes: ['circle', 'square'],
        scalar: 1.0,
        gravity: 0.6,
        ticks: 80,
        startVelocity: 20
      });
    }
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
      }, 20); // Daha yavaş animasyon (10ms yerine 20ms)

      return () => clearInterval(interval);
    } else {
      setWaves([]); // Clear waves when switching games
    }
  }, [currentGame]);

  // Bubble animation
  useEffect(() => {
    if (currentGame === "bubbles") {
      const interval = setInterval(() => {
        setBubbles(prev =>
          prev
            .map(bubble => ({
              ...bubble,
              y: bubble.y - bubble.speed
            }))
            .filter(bubble => bubble.y + bubble.size > 0) // Üstten çıkınca sil
        );
      }, 16);

      const bubbleSpawner = setInterval(() => createBubble(), 800);

      return () => {
        clearInterval(interval);
        clearInterval(bubbleSpawner);
        setBubbles([]);
      };
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
    setWaves([]);
    setSandPoints([]);
    setBubbles([]);
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
          <div className="flex gap-2">
            {currentGame === "sand" && (
              <button
                onClick={clearSand}
                className="px-6 py-3 bg-blue-500/30 backdrop-blur-sm rounded-lg text-white font-semibold hover:bg-blue-500/40 transition-colors border-2 border-blue-400/50 shadow-lg"
              >
                🧹 Temizle
              </button>
            )}
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              Geri Dön
            </button>
          </div>
        </div>

        <div
          ref={canvasRef}
          className="relative w-full h-96 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10"
          onClick={handleCanvasClick}
          onMouseMove={currentGame === "sand" ? handleSandMouseMove : undefined}
          style={{ 
            cursor: currentGame === "sand" ? "crosshair" : "pointer",
            position: "relative",
            height: "400px", // Fixed height for debugging
            borderRadius: "13px"
          }}
        >

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
                  radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.1) 50%),
                  radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.4) 0%, rgba(6, 182, 212, 0.1) 50%),
                  radial-gradient(circle at 50% 50%, rgba(29, 78, 216, 0.3) 0%, rgba(29, 78, 216, 0.05) 70%),
                  linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(6, 182, 212, 0.3) 50%, rgba(29, 78, 216, 0.2) 100%)
                `,
              }}
            >
              {/* Instruction text */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none">
                <p className="text-white/80 text-lg font-medium">
                  Dalga oluşturmak için tıklayın
                </p>
              </div>
              
              {waves.map((wave) => (
                <div
                  key={wave.id}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    left: wave.x - wave.radius,
                    top: wave.y - wave.radius,
                    width: wave.radius * 2,
                    height: wave.radius * 2,
                    border: `3px solid rgba(59, 130, 246, ${Math.max(0.2, 1 - wave.radius / wave.maxRadius)})`,
                    opacity: Math.max(0.1, 1 - wave.radius / wave.maxRadius),
                    boxShadow: `0 0 ${wave.radius * 0.5}px rgba(59, 130, 246, 0.6)`,
                    zIndex: 5,
                    transition: 'none',
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

          {/* Bubbles */}
          {currentGame === "bubbles" && (
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #93c5fd, #bfdbfe)"
              }}
            >
              {/* Instruction text */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none z-10">
                <p className="text-white/80 text-lg font-medium">
                  Balonları patlatın
                </p>
              </div>
              
              {bubbles.map(bubble => (
                <div
                  key={bubble.id}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX;
                    const y = e.clientY;
                    popBubble(bubble.id, x, y);
                  }}
                  className="absolute rounded-full cursor-pointer hover:opacity-80 transition"
                  style={{
                    width: bubble.size,
                    height: bubble.size,
                    left: bubble.x,
                    top: bubble.y,
                    background:
                      "radial-gradient(circle at 30% 30%, white, #60a5fa)",
                    border: "2px solid rgba(255,255,255,0.7)",
                    boxShadow: "0 0 10px rgba(255,255,255,0.6)",
                    zIndex: 5
                  }}
                ></div>
              ))}
            </div>
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