import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AIAssistantModal } from "@/components/ai-assistant-modal";

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
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <AIAssistantModal />
        <Footer />
      </body>
    </html>
  );
}
