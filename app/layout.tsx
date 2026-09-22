import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";
import { BackgroundParticles } from "@/components/background-particles";
import { PageTransition } from "@/components/page-transition";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
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
    <html lang="en" className={cormorant.variable} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="relative bg-[#EBF1F5] text-navy antialiased min-h-screen selection:bg-sapphire/20"
        style={{ fontFamily: "var(--font-cormorant-family)" }}
      >
        <Providers>
          <BackgroundParticles />
          <div className="relative z-10 flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

