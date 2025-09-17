"use client";

import { useEffect, useState } from "react";
import { Bot, Zap, Brain, FileText } from "lucide-react";

interface Star {
  left: string;
  top: string;
  duration: string;
}

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(0);
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generatedStars: Star[] = [...Array(20)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: `${2 + Math.random() * 3}s`,
    }));
    setStars(generatedStars);
  }, []);

  // Progress bar logic
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 10;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const isLoading = progress < 100;
  const fadeOut = progress >= 100;

  if (isLoading) {
    return (
      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ${
          fadeOut ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
          <div className="absolute inset-0 bg-black/40" />

          {/* Stars */}
          <div className="absolute inset-0 overflow-hidden">
            {stars.map((star, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/10 rounded-full animate-pulse"
                style={{
                  left: star.left,
                  top: star.top,
                  animationDuration: star.duration,
                }}
              />
            ))}
          </div>

          {/* Radial dot pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
          {/* Loader circle */}
          <div className="relative mb-8">
            <div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-t-indigo-400 border-r-cyan-400 rounded-full animate-spin" />
            <div className="relative w-32 h-32 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-900/50 animate-pulse">
              <div className="w-24 h-24 bg-white/5 backdrop-blur rounded-full flex items-center justify-center border border-white/10">
                <Bot size={36} className="text-white animate-bounce" />
              </div>
            </div>

            {/* Floating icons */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center animate-bounce shadow-md">
              <Brain size={16} className="text-white" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center animate-bounce shadow-md">
              <FileText size={16} className="text-white" />
            </div>
            <div className="absolute top-2 -left-6 w-6 h-6 bg-gradient-to-br from-cyan-500 to-indigo-500 rounded-full flex items-center justify-center animate-bounce shadow-md">
              <Zap size={12} className="text-white" />
            </div>
          </div>

          {/* Title & subtitle */}
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-indigo-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent animate-pulse">
                R.A.G
              </span>
              <span className="text-white ml-2">Bot</span>
            </h1>
            <p className="text-xl text-gray-400 font-light tracking-wide">
              Chat with your Docx
            </p>

            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-500 font-mono">
                INITIALIZING
              </span>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-80 max-w-sm mb-8">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Loading</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden backdrop-blur">
              <div
                className="h-full bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 transition-all duration-300 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/10 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Status messages */}
          <div className="text-center space-y-2 h-12">
            {progress < 30 && (
              <p className="text-gray-500 text-sm animate-fade-in">
                Initializing...
              </p>
            )}
            {progress >= 30 && progress < 60 && (
              <p className="text-gray-500 text-sm animate-fade-in">
                Loading language models...
              </p>
            )}
            {progress >= 60 && progress < 90 && (
              <p className="text-gray-500 text-sm animate-fade-in">
                Preparing document analysis...
              </p>
            )}
            {progress >= 90 && (
              <p className="text-emerald-400 text-sm animate-fade-in font-medium">
                Ready to assist you!
              </p>
            )}
          </div>

          {/* Features */}
          <div className="flex gap-8 mt-12 opacity-70">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center backdrop-blur border border-white/10">
                <Brain size={20} className="text-indigo-400" />
              </div>
              <span className="text-xs text-gray-500">Smart Docx AI</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center backdrop-blur border border-white/10">
                <FileText size={20} className="text-cyan-400" />
              </div>
              <span className="text-xs text-gray-500">Documents</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center backdrop-blur border border-white/10">
                <Zap size={20} className="text-amber-400" />
              </div>
              <span className="text-xs text-gray-500">Lightning Fast</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400" />
      </div>
    );
  }

  return <>{children}</>;
}
