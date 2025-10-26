"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Waves, Sparkles } from "lucide-react";

type GameType = "bubbles" | "waves" | "sand";

interface Game {
  id: GameType;
  name: string;
  icon: any;
  color: string;
  description: string;
}

const games: Game[] = [
  {
    id: "bubbles",
    name: "Balonlar",
    icon: Wind,
    color: "from-blue-400 to-cyan-400",
    description: "Mouse ile balonları patlatın"
  },
  {
    id: "waves",
    name: "Dalgalar",
    icon: Waves,
    color: "from-teal-400 to-blue-400",
    description: "Su dalgaları oluşturun"
  },
  {
    id: "sand",
    name: "Kum",
    icon: Sparkles,
    color: "from-yellow-400 to-orange-400",
    description: "Kum üzerinde çizim yapın"
  }
];

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  velocity: { x: number; y: number };
}

interface Wave {
  id: number;
  x: number;
  y: number;
  radius: number;
  opacity: number;
  intensity: number;
}

interface SandPoint {
  x: number;
  y: number;
  color: string;
  size: number;
}


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
            x: Math.random() * (canvasRef.current?.clientWidth || 800),
            y: (canvasRef.current?.clientHeight || 600) + 50,
            size: Math.random() * 30 + 20,
            color: `hsl(${Math.random() * 60 + 180}, 70%, 60%)`,
            velocity: { x: (Math.random() - 0.5) * 2, y: -Math.random() * 3 - 1 }
          };
          return [...prev.slice(-20), newBubble];
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentGame]);

  // Bubble animation
  useEffect(() => {
    if (currentGame === "bubbles") {
      const interval = setInterval(() => {
        setBubbles(prev => 
          prev.map(bubble => ({
            ...bubble,
            x: bubble.x + bubble.velocity.x,
            y: bubble.y + bubble.velocity.y
          })).filter(bubble => bubble.y > -50)
        );
      }, 50);

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
      opacity: 0.8,
      intensity: Math.random() * 0.5 + 0.5
    };
    setWaves(prev => [...prev.slice(-10), newWave]);
  };

  // Wave animation
  useEffect(() => {
    if (currentGame === "waves") {
      const interval = setInterval(() => {
        setWaves(prev => 
          prev.map(wave => ({
            ...wave,
            radius: wave.radius + 2,
            opacity: wave.opacity - 0.02
          })).filter(wave => wave.opacity > 0)
        );
      }, 50);

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
          
          // Set canvas style to match container
          canvas.style.width = rect.width + 'px';
          canvas.style.height = rect.height + 'px';
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
      '#f7e7c7', '#e8d4a6', '#d7c5ab', '#cbb999', '#baa285'
    ];
    
    // Create more prominent and relaxing sand particles
    const particleCount = Math.floor(Math.random() * 4) + 2; // 2-5 particles (more particles)
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const distance = Math.random() * 5 + 2; // Larger spread
      const offsetX = Math.cos(angle) * distance;
      const offsetY = Math.sin(angle) * distance;
      
      const color = sandColors[Math.floor(Math.random() * sandColors.length)];
      const size = Math.random() * 1.2 + 0.4; // Larger particles (0.4-1.6px)
      
      // Draw main particle with glow effect
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 3;
      ctx.beginPath();
      ctx.arc(x + offsetX, y + offsetY, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Reset shadow
      ctx.shadowBlur = 0;
      
      // Add subtle shadow for depth
      ctx.fillStyle = `rgba(0, 0, 0, 0.2)`;
      ctx.beginPath();
      ctx.arc(x + offsetX + 0.5, y + offsetY + 0.5, size * 0.8, 0, Math.PI * 2);
      ctx.fill();
      
      // Add highlight for realism
      if (Math.random() < 0.5) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.2})`;
        ctx.beginPath();
        ctx.arc(x + offsetX - size * 0.3, y + offsetY - size * 0.3, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Add more scattered particles around the main area
    for (let i = 0; i < 3; i++) { // Increased from 1 to 3
      const scatterX = x + (Math.random() - 0.5) * 10; // Increased from 6 to 10
      const scatterY = y + (Math.random() - 0.5) * 10; // Increased from 6 to 10
      const color = sandColors[Math.floor(Math.random() * sandColors.length)];
      const size = Math.random() * 0.8 + 0.2; // Larger scattered particles (0.2-1.0px)
      
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 2;
      ctx.beginPath();
      ctx.arc(scatterX, scatterY, size, 0, Math.PI * 2);
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

  const handleCanvasClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentGame === "waves") {
      createWave(x, y);
    }
  };

  const resetGame = () => {
    setCurrentGame(null);
    setBubbles([]);
    setWaves([]);
    setSandPoints([]);
    setRipples([]);
    setIsDrawing(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {!currentGame ? (
          <motion.div
            key="game-selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-8">
              Rahatlatıcı Oyunlar
            </h2>
            <p className="text-white/70 mb-8 text-lg">
              Hangi oyunla rahatlamak istiyorsunuz?
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {games.map((game) => (
                <motion.button
                  key={game.id}
                  onClick={() => setCurrentGame(game.id)}
                  className="group p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <game.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {game.name}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {game.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="game-canvas"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {games.find(g => g.id === currentGame)?.name}
              </h2>
              <div className="flex gap-2">
                {currentGame === "sand" && (
                  <button
                    onClick={clearSand}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors"
                  >
                    Temizle
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
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                  }}
                >
                  {bubbles.map((bubble) => (
                    <div
                      key={bubble.id}
                      className="absolute rounded-full cursor-pointer"
                      style={{
                        left: bubble.x,
                        top: bubble.y,
                        width: bubble.size,
                        height: bubble.size,
                        backgroundColor: bubble.color,
                        boxShadow: `0 0 20px ${bubble.color}40`,
                        overflow: "hidden"
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const rect = canvasRef.current?.getBoundingClientRect();
                        if (rect) {
                          const x = e.clientX - rect.left;
                          const y = e.clientY - rect.top;
                          popBubble(bubble.id, x, y);
                        }
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

              {/* Waves with simple water effect */}
              {currentGame === "waves" && (
                <>
                  {/* Simple water background */}
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-600/50 via-cyan-500/40 to-blue-700/60">
                  </div>
                  
                  {/* Wave ripples only */}
                  {waves.map((wave) => (
                    <motion.div
                      key={wave.id}
                      className="absolute border-2 border-blue-300 rounded-full"
                      style={{
                        left: wave.x - wave.radius,
                        top: wave.y - wave.radius,
                        width: wave.radius * 2,
                        height: wave.radius * 2,
                        opacity: wave.opacity,
                        boxShadow: `
                          0 0 ${wave.radius * 4}px rgba(59, 130, 246, ${wave.intensity}),
                          inset 0 0 ${wave.radius * 3}px rgba(255, 255, 255, 0.4),
                          0 0 ${wave.radius * 2}px rgba(147, 197, 253, 0.6)
                        `
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </>
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
                      backgroundImage: `
                        radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                        radial-gradient(circle at 75% 75%, rgba(0,0,0,0.1) 1px, transparent 1px),
                        radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0.5px, transparent 0.5px)
                      `,
                      backgroundSize: '20px 20px, 15px 15px, 10px 10px'
                    }}
                  />
                  
                  {/* Subtle sand particles floating */}
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          width: Math.random() * 2 + 1,
                          height: Math.random() * 2 + 1,
                          backgroundColor: `rgba(139, 115, 85, ${Math.random() * 0.3 + 0.1})`
                        }}
                        animate={{
                          y: [0, -15, 0],
                          opacity: [0.1, 0.4, 0.1],
                          scale: [0.8, 1.2, 0.8]
                        }}
                        transition={{
                          duration: 4 + Math.random() * 3,
                          repeat: Infinity,
                          delay: Math.random() * 3
                        }}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Instructions */}
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-white/60 text-sm">
                  {currentGame === "bubbles" && "Balonlara tıklayın"}
                  {currentGame === "waves" && "Su dalgaları oluşturmak için tıklayın"}
                  {currentGame === "sand" && "Mouse ile kum üzerinde çizim yapın"}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
