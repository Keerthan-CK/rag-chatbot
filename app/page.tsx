"use client";

import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { cn } from "@/lib/utils";
import { GridPattern } from "@/components/ui/grid-pattern";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import SplashScreen from "@/components/ui/SplashScreen";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleChatNavigation = () => {
    router.push("/chat");
  };

  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(12, 12, 30)"
      gradientBackgroundEnd="rgb(0, 0, 0)"
      firstColor="18, 113, 255"
      secondColor="221, 74, 255"
      thirdColor="100, 220, 255"
      fourthColor="200, 50, 50"
      fifthColor="180, 180, 50"
      pointerColor="140, 100, 255"
      size="70%"
      blendingValue="soft-light"
      containerClassName="fixed inset-0 -z-10"
     
    >
      <main className="relative z-10">
        <SplashScreen>
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
                Upload PDFs or text files and ask questions with real-time
                answers, powered by RAG + Gemini AI.
              </p>

              <div className="mt-8 flex justify-center">
                <HoverBorderGradient
                  as="button"
                  containerClassName="rounded-full from-cyan-500 via-pink-500 to-purple-500"
                  className="bg-black text-white px-6 py-3 rounded-full text-lg font-medium transition-transform hover:scale-105 active:scale-95"
                  onClick={handleChatNavigation}
                >
                  Chat with the RAG Bot
                </HoverBorderGradient>
              </div>
            </section>
          </div>
        </SplashScreen>
      </main>
    </BackgroundGradientAnimation>
  );
}