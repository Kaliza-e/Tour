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
        cormorant: ["var(--font-cormorant-family)"],
        "cormorant-garamond": ["var(--font-cormorant-family)"],
        seasons: ["var(--font-cormorant-family)"],
        "the-seasons": ["var(--font-cormorant-family)"],
        heading: ["var(--font-cormorant-family)"],
        body: ["var(--font-cormorant-family)"],
        button: ["var(--font-cormorant-family)"],
        navigation: ["var(--font-cormorant-family)"],
        form: ["var(--font-cormorant-family)"],
        logo: ["var(--font-cormorant-family)"],
        label: ["var(--font-cormorant-family)"],
        outfit: ["var(--font-cormorant-family)"],
        sans: ["var(--font-cormorant-family)"],
        serif: ["var(--font-cormorant-family)"],
      },
      fontSize: {
        xs: ["0.875rem", { lineHeight: "1.4" }],      /* 14px */
        sm: ["1.025rem", { lineHeight: "1.5" }],     /* ~16.5px */
        base: ["1.15rem", { lineHeight: "1.6" }],      /* ~18.5px */
        lg: ["1.3rem", { lineHeight: "1.5" }],        /* ~21px */
        xl: ["1.55rem", { lineHeight: "1.4" }],       /* ~25px */
        "2xl": ["1.85rem", { lineHeight: "1.3" }],    /* ~30px */
        "3xl": ["2.25rem", { lineHeight: "1.25" }],   /* ~36px */
        "4xl": ["2.75rem", { lineHeight: "1.2" }],    /* ~44px */
        "5xl": ["3.5rem", { lineHeight: "1.15" }],    /* ~56px */
        "6xl": ["4.25rem", { lineHeight: "1.1" }],    /* ~68px */
        hero: ["3.5rem", { lineHeight: "1.1", letterSpacing: "0" }],
        "hero-md": ["2.5rem", { lineHeight: "1.15", letterSpacing: "0" }],
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
