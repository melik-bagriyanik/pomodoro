"use client";

import { useCallback, useState, useEffect } from "react";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";
import { ThemeConfig } from "../types/theme";
import { Meteors } from "./ui/meteors";

interface BackgroundAnimationProps {
  theme: ThemeConfig;
}

export function BackgroundAnimation({ theme }: BackgroundAnimationProps) {
  const [starPositions, setStarPositions] = useState<Array<{
    left: number;
    top: number;
    duration: number;
    delay: number;
  }>>([]);
  
  const [shootingStarPositions, setShootingStarPositions] = useState<Array<{
    left: number;
    top: number;
    delay: number;
  }>>([]);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  // Generate random positions on client side only
  useEffect(() => {
    if (theme.name === "uzay") {
      setStarPositions(
        Array.from({ length: 20 }).map(() => ({
          left: Math.random() * 100,
          top: Math.random() * 100,
          duration: 2 + Math.random() * 3,
          delay: Math.random() * 2,
        }))
      );
      
      setShootingStarPositions(
        Array.from({ length: 3 }).map(() => ({
          left: Math.random() * 100,
          top: Math.random() * 100,
          delay: Math.random() * 5,
        }))
      );
    }
  }, [theme.name]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 2,
              },
              repulse: {
                distance: 150,
                duration: 0.8,
              },
            },
          },
          particles: {
            color: {
              value: theme.colors.particles,
            },
            links: {
              color: "#ffffff",
              distance: theme.particles.links.distance,
              enable: true,
              opacity: theme.particles.links.opacity,
              width: 0.5,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "out",
              },
              random: false,
              speed: theme.particles.speed,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 1000,
              },
              value: theme.particles.count,
            },
            opacity: {
              value: 0.4,
              animation: {
                enable: true,
                speed: 0.5,
                sync: false,
              },
            },
            shape: {
              type: "circle",
            },
            size: {
              value: theme.particles.size,
              animation: {
                enable: true,
                speed: 1,
                sync: false,
              },
            },
          },
          detectRetina: true,
        }}
        className="w-full h-full"
      />
      
      {/* Gentle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/15 via-pink-900/8 to-blue-900/15" />
      
      {/* Theme-based floating orbs */}
      <div className={`absolute w-96 h-96 bg-gradient-to-br ${theme.colors.primary}/10 rounded-full blur-3xl top-1/4 left-1/4 animate-pulse`} style={{ animationDuration: '4s' }} />
      <div className={`absolute w-80 h-80 bg-gradient-to-br ${theme.colors.secondary}/8 rounded-full blur-3xl top-3/4 right-1/4 animate-pulse`} style={{ animationDuration: '6s', animationDelay: '2s' }} />
      <div className={`absolute w-64 h-64 bg-gradient-to-br ${theme.colors.accent}/6 rounded-full blur-3xl bottom-1/4 left-1/2 animate-pulse`} style={{ animationDuration: '5s', animationDelay: '1s' }} />
      
      {/* Special effects for space theme */}
      {theme.name === "uzay" && (
        <>
          {/* Stars */}
          {starPositions.map((star, i) => (
            <div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
          style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                animationDuration: `${star.duration}s`,
                animationDelay: `${star.delay}s`,
          }}
        />
      ))}

          {/* Shooting stars */}
          {shootingStarPositions.map((shootingStar, i) => (
            <div
              key={`shooting-star-${i}`}
              className="absolute w-20 h-px bg-gradient-to-r from-white to-transparent animate-shooting-star"
          style={{
                left: `${shootingStar.left}%`,
                top: `${shootingStar.top}%`,
                animationDelay: `${shootingStar.delay}s`,
          }}
        />
      ))}
        </>
      )}

      {/* Special effects for rain theme */}
      {theme.name === "yağmur" && (
        <Meteors number={20} />
      )}
    </div>
  );
}
