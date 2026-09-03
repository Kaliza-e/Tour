import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AIAssistantModal } from "@/components/ai-assistant-modal";
import { Providers } from "@/components/providers";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TOUR — Explore Knowledge Wisely | Student Research Platform",
  description:
    "TOUR is a world-class student-led research ecosystem that empowers young minds to explore, write, publish, collaborate, and contribute to scientific knowledge.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.png",
  },
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
      className={`${outfit.variable}`}
    >
      <body
        suppressHydrationWarning
        style={{ fontFamily: "'Outfit', sans-serif" }}
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
