import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";
import { BackgroundParticles } from "@/components/background-particles";
import { PageTransition } from "@/components/page-transition";
import { TourAiWidget } from "@/components/tour-ai-widget";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TOUR | Young Student Research & Publishing",
  description:
    "TOUR is a student-led, non-profit research and educational platform that helps young students explore curiosity, conduct research, write, and publish meaningful work.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} font-sans`} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="relative bg-[#EBF1F5] text-navy antialiased min-h-screen selection:bg-sapphire/20 font-sans"
      >
        <Providers>
          <BackgroundParticles />
          <div className="relative z-10 flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <TourAiWidget />
          </div>
        </Providers>
      </body>
    </html>
  );
}

