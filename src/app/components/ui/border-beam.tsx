"use client";

import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
  reverse?: boolean;
  initialOffset?: number;
}

export const BorderBeam = ({
  className,
  size = 200,
  duration = 15,
  borderWidth = 1.5,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  delay = 0,
  reverse = false,
  initialOffset = 0,
}: BorderBeamProps) => {
  return (
    <motion.div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        className
      )}
      style={{
        "--size": size,
        "--duration": duration,
        "--border-width": borderWidth,
        "--color-from": colorFrom,
        "--color-to": colorTo,
        "--delay": delay,
        "--reverse": reverse ? 1 : 0,
        "--initial-offset": initialOffset,
      } as React.CSSProperties}
    >
      <motion.div
        className="absolute inset-0 rounded-[inherit] opacity-0"
        style={{
          background: `conic-gradient(from 0deg, transparent, var(--color-from), var(--color-to), transparent)`,
          padding: "var(--border-width)",
          mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          maskComposite: "xor",
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: "xor",
        }}
        animate={{
          opacity: [0, 1, 0],
          rotate: reverse ? [360, 0] : [0, 360],
        }}
        transition={{
          duration: duration,
          delay: delay,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </motion.div>
  );
};
