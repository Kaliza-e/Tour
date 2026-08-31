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
        heading: ["var(--font-comic-neue)", "Comic Neue", "cursive", "sans-serif"],
        body: ["var(--font-nunito)", "Nunito", "sans-serif"],
        button: ["var(--font-nunito)", "Nunito", "sans-serif"],
        navigation: ["var(--font-nunito)", "Nunito", "sans-serif"],
        form: ["var(--font-nunito)", "Nunito", "sans-serif"],
        logo: ["var(--font-plus-jakarta-sans)", "Plus Jakarta Sans", "sans-serif"],
        label: ["var(--font-inter)", "Inter", "sans-serif"],
        comic: ["var(--font-comic-neue)", "Comic Neue", "cursive", "sans-serif"],
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        nunito: ["var(--font-nunito)", "Nunito", "sans-serif"],
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
