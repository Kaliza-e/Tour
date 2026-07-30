import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#112250",
        ivory: "#F5F4F0",
        sapphire: "#3B507D",
        champagne: "#E7E2CE",
        taupe: "#BEB7A7",
        // semantic aliases used across components
        background: "#F5F4F0",
        foreground: "#112250",
        accent: "#3B507D",
        highlight: "#E7E2CE",
        muted: "#BEB7A7",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Playfair Display", "Georgia", "serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
      },
      fontSize: {
        hero: ["72px", { lineHeight: "1.05", letterSpacing: "0" }],
        "hero-md": ["48px", { lineHeight: "1.08", letterSpacing: "0" }],
      },
      borderRadius: {
        card: "24px",
        pill: "999px",
      },
      boxShadow: {
        soft: "0 20px 60px -20px rgba(17, 34, 80, 0.18)",
        card: "0 10px 30px -12px rgba(17, 34, 80, 0.12)",
      },
      backgroundImage: {
        "constellation": "radial-gradient(circle at 1px 1px, rgba(17,34,80,0.14) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};

export default config;
