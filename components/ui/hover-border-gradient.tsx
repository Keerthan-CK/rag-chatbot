"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1.2,
  clockwise = true,
  highlightColor = "#3275F8", 
  pulseOnHover = true,        
  ...props
}: React.PropsWithChildren<{
  as?: React.ElementType;
  containerClassName?: string;
  className?: string;
  duration?: number;
  clockwise?: boolean;
  highlightColor?: string;
  pulseOnHover?: boolean;
} & React.HTMLAttributes<HTMLElement>>) {
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(20% 60% at 50% 0%, white 0%, transparent 100%)",
    LEFT: "radial-gradient(20% 60% at 0% 50%, white 0%, transparent 100%)",
    BOTTOM: "radial-gradient(20% 60% at 50% 100%, white 0%, transparent 100%)",
    RIGHT: "radial-gradient(20% 60% at 100% 50%, white 0%, transparent 100%)",
  };

  const highlight = `radial-gradient(80% 120% at 50% 50%, ${highlightColor} 0%, transparent 100%)`;

  useEffect(() => {
    const rotateDirection = (current: Direction): Direction => {
      const dirs: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
      const idx = dirs.indexOf(current);
      const next = clockwise
        ? (idx - 1 + dirs.length) % dirs.length
        : (idx + 1) % dirs.length;
      return dirs[next];
    };

    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prev) => rotateDirection(prev));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, duration, clockwise]);

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex w-fit items-center justify-center rounded-full p-[2px] overflow-hidden",
        "transition-colors duration-500",
        pulseOnHover && hovered && "scale-105",
        containerClassName
      )}
      {...props}
    >
      {/* Inner content */}
      <div
        className={cn(
          "relative z-10 rounded-[inherit] bg-black px-6 py-3 text-white text-lg font-medium",
          className
        )}
      >
        {children}
      </div>

      {/* Animated glowing border */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] z-0"
        style={{ filter: "blur(3px)" }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered ? [movingMap[direction], highlight] : movingMap[direction],
        }}
        transition={{ ease: "linear", duration }}
      />
    </Tag>
  );
}
