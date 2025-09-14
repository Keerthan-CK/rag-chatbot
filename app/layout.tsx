import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "The R.A.G Bot",
  description: "Chat with your documents using RAG + Gemini AI",
  icons: {
    icon: "/logo.png", // favicon
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen text-white">
        {/* 🌌 Global animated gradient background */}
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
          {/* Page content */}
          <main className="relative z-10">{children}</main>
        </BackgroundGradientAnimation>
      </body>
    </html>
  );
}
