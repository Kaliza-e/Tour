import type { Metadata } from "next";
import { Comic_Neue, Nunito, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AIAssistantModal } from "@/components/ai-assistant-modal";
import { Providers } from "@/components/providers";

const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-comic-neue",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TOUR — Explore Knowledge Wisely | Student Research Platform",
  description:
    "TOUR is a world-class student-led research ecosystem that empowers young minds to explore, write, publish, collaborate, and contribute to scientific knowledge.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${comicNeue.variable} ${nunito.variable} ${inter.variable} ${plusJakartaSans.variable}`}
    >
      <body
        suppressHydrationWarning
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        <Providers>
          <Navbar />
          <main>{children}</main>
          <AIAssistantModal />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
