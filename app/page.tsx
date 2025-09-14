"use client";

import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { cn } from "@/lib/utils";
import { GridPattern } from "@/components/ui/grid-pattern";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white relative">
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]",
          "absolute inset-0 -z-10 opacity-30"
        )}
      />

      <section className="text-center space-y-6 px-6">
        <h1 className="text-4xl md:text-6xl font-bold">
          Chat with your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient">
            Documents
          </span>
        </h1>

        <p className="max-w-xl mx-auto text-gray-300">
          Upload PDFs or text files and ask questions with real-time answers,
          powered by RAG + Gemini AI.
        </p>

        <div className="mt-8 flex justify-center">
          <HoverBorderGradient
            as="button"
            containerClassName="rounded-full from-cyan-500 via-pink-500 to-purple-500"
            className="bg-black text-white px-6 py-3 rounded-full text-lg font-medium"
            onClick={() => (window.location.href = "/chat")}
          >
            Chat with the RAG Bot
          </HoverBorderGradient>
        </div>
      </section>
    </div>
  );
}
