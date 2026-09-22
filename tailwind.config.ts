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
        ivory: "#EBF1F5",
        sapphire: "#3B507D",
        champagne: "#E7E2CE",
        taupe: "#BEB7A7",
        // semantic aliases used across components
        background: "#EBF1F5",
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
        sm: ["0.95rem", { lineHeight: "1.5" }],       /* ~15px */
        base: ["1rem", { lineHeight: "1.6" }],        /* 16px */
        lg: ["1.125rem", { lineHeight: "1.5" }],     /* ~18px */
        xl: ["1.25rem", { lineHeight: "1.4" }],       /* ~20px */
        "2xl": ["1.5rem", { lineHeight: "1.3" }],      /* ~24px */
        "3xl": ["1.875rem", { lineHeight: "1.25" }],   /* ~30px */
        "4xl": ["2.25rem", { lineHeight: "1.2" }],    /* ~36px */
        "5xl": ["3rem", { lineHeight: "1.15" }],      /* ~48px */
        "6xl": ["3.75rem", { lineHeight: "1.1" }],    /* ~60px */
        hero: ["3rem", { lineHeight: "1.1", letterSpacing: "0" }],
        "hero-md": ["2.25rem", { lineHeight: "1.15", letterSpacing: "0" }],
      },
      borderRadius: {
        card: "1.5rem",
        pill: "999px",
      },
      boxShadow: {
        none: "none",
        "2xs": "none",
        sm: "none",
        DEFAULT: "none",
        md: "none",
        lg: "none",
        xl: "none",
        "2xl": "none",
        inner: "none",
        soft: "none",
        card: "none",
      },
      backgroundImage: {
        "constellation": "radial-gradient(circle at 1px 1px, rgba(17,34,80,0.14) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};

export default config;
