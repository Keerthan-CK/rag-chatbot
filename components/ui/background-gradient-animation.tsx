"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type Props = {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
};

export function BackgroundGradientAnimation({
  gradientBackgroundStart = "rgb(108, 0, 162)",
  gradientBackgroundEnd = "rgb(0, 17, 82)",
  firstColor = "18, 113, 255",
  secondColor = "221, 74, 255",
  thirdColor = "100, 220, 255",
  fourthColor = "200, 50, 50",
  fifthColor = "180, 180, 50",
  pointerColor = "140, 100, 255",
  size = "60%",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
}: Props) {
  const pointerBlobRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const target = useRef({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
  });
  const current = useRef({ x: target.current.x, y: target.current.y });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // set CSS vars
  useEffect(() => {
    if (typeof document === "undefined") return;
    const body = document.body;
    body.style.setProperty(
      "--gradient-background-start",
      gradientBackgroundStart
    );
    body.style.setProperty("--gradient-background-end", gradientBackgroundEnd);
    body.style.setProperty("--first-color", firstColor);
    body.style.setProperty("--second-color", secondColor);
    body.style.setProperty("--third-color", thirdColor);
    body.style.setProperty("--fourth-color", fourthColor);
    body.style.setProperty("--fifth-color", fifthColor);
    body.style.setProperty("--pointer-color", pointerColor);
    body.style.setProperty("--size", size);
    body.style.setProperty("--blending-value", blendingValue);
  }, [
    gradientBackgroundStart,
    gradientBackgroundEnd,
    firstColor,
    secondColor,
    thirdColor,
    fourthColor,
    fifthColor,
    pointerColor,
    size,
    blendingValue,
  ]);

  // pointer tracking
  useEffect(() => {
    if (!mounted) return;

    const onPointerMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    if (interactive) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    const step = () => {
      current.current.x += (target.current.x - current.current.x) * 0.12;
      current.current.y += (target.current.y - current.current.y) * 0.12;

      const dx = current.current.x - window.innerWidth / 2;
      const dy = current.current.y - window.innerHeight / 2;

      if (pointerBlobRef.current) {
        pointerBlobRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (interactive) window.removeEventListener("pointermove", onPointerMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [interactive, mounted]);

  // scattered positions for 5 blobs
  // scattered positions for 5 blobs
  const blobs = [
    {
      color: "--first-color",
      top: "10%",
      left: "15%",
      animate: "animate-first",
      opacity: "opacity-100",
    },
    {
      color: "--second-color",
      top: "20%",
      left: "70%",
      animate: "animate-second",
      opacity: "opacity-100",
    },
    {
      color: "--third-color",
      top: "65%",
      left: "20%",
      animate: "animate-third",
      opacity: "opacity-95",
    },
    {
      color: "--fourth-color",
      top: "75%",
      left: "75%",
      animate: "animate-fourth",
      opacity: "opacity-95",
    },
    {
      color: "--fifth-color",
      top: "40%",
      left: "50%",
      animate: "animate-fifth",
      opacity: "opacity-100",
    },
  ];

  const portalContent = (
    <div
      className={cn(
        "fixed inset-0 pointer-events-none -z-10",
        containerClassName
      )}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]" />

      {/* scattered blobs */}
      {blobs.map((blob, i) => (
        <div
          key={i}
          className={cn(
            `absolute w-[var(--size)] h-[var(--size)] [mix-blend-mode:var(--blending-value)] ${blob.animate} ${blob.opacity} pointer-events-none`,
            `[background:radial-gradient(circle_at_center,_rgba(var(${blob.color}),_1)_0,_rgba(var(${blob.color}),_0)_50%)_no-repeat]`
          )}
          style={{ top: blob.top, left: blob.left }}
        />
      ))}

      {/* pointer-following blob */}
      <div
        ref={pointerBlobRef}
        className={cn(
          `absolute inset-0 [background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.8)_0,_rgba(var(--pointer-color),_0)_50%)_no-repeat]`,
          `[mix-blend-mode:var(--blending-value)] w-full h-full opacity-70 pointer-events-none`
        )}
        style={{ transform: "translate(0px, 0px)" }}
      />
    </div>
  );

  return (
    <>
      <div className={cn("relative z-10 pointer-events-auto", className)}>
        {children}
      </div>
      {mounted && createPortal(portalContent, document.body)}
    </>
  );
}
