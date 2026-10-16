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
        sans: ["var(--font-manrope)", "var(--font-manrope-family)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        manrope: ["var(--font-manrope)", "var(--font-manrope-family)", "sans-serif"],
        heading: ["var(--font-manrope)", "var(--font-manrope-family)", "sans-serif"],
        body: ["var(--font-manrope)", "var(--font-manrope-family)", "sans-serif"],
        button: ["var(--font-manrope)", "var(--font-manrope-family)", "sans-serif"],
        navigation: ["var(--font-manrope)", "var(--font-manrope-family)", "sans-serif"],
        form: ["var(--font-manrope)", "var(--font-manrope-family)", "sans-serif"],
        logo: ["var(--font-manrope)", "var(--font-manrope-family)", "sans-serif"],
        label: ["var(--font-manrope)", "var(--font-manrope-family)", "sans-serif"],
        outfit: ["var(--font-manrope)", "var(--font-manrope-family)", "sans-serif"],
        cormorant: ["var(--font-manrope)", "var(--font-manrope-family)", "sans-serif"],
        "cormorant-garamond": ["var(--font-manrope)", "var(--font-manrope-family)", "sans-serif"],
        seasons: ["var(--font-manrope)", "var(--font-manrope-family)", "sans-serif"],
        "the-seasons": ["var(--font-manrope)", "var(--font-manrope-family)", "sans-serif"],
        serif: ["var(--font-manrope)", "var(--font-manrope-family)", "sans-serif"],
      },
      fontSize: {
        xs: ["0.875rem", { lineHeight: "1.45", letterSpacing: "-0.006em" }],      /* 14px */
        sm: ["0.95rem", { lineHeight: "1.55", letterSpacing: "-0.008em" }],       /* ~15px */
        base: ["1rem", { lineHeight: "1.65", letterSpacing: "-0.011em" }],        /* 16px */
        lg: ["1.125rem", { lineHeight: "1.55", letterSpacing: "-0.013em" }],     /* ~18px */
        xl: ["1.25rem", { lineHeight: "1.45", letterSpacing: "-0.017em" }],       /* ~20px */
        "2xl": ["1.5rem", { lineHeight: "1.35", letterSpacing: "-0.02em" }],      /* ~24px */
        "3xl": ["1.875rem", { lineHeight: "1.25", letterSpacing: "-0.022em" }],   /* ~30px */
        "4xl": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.025em" }],     /* ~36px */
        "5xl": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.028em" }],       /* ~48px */
        "6xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.03em" }],      /* ~60px */
        hero: ["3rem", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        "hero-md": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.025em" }],
      },
      borderRadius: {
        card: "1.5rem",
        pill: "999px",
      },
      boxShadow: {
        none: "none",
        xs: "0 1px 2px 0 rgba(17, 34, 80, 0.04)",
        sm: "0 2px 4px 0 rgba(17, 34, 80, 0.05)",
        DEFAULT: "0 4px 12px -2px rgba(17, 34, 80, 0.08)",
        md: "0 8px 20px -4px rgba(17, 34, 80, 0.09)",
        lg: "0 14px 28px -6px rgba(17, 34, 80, 0.10)",
        xl: "0 20px 35px -8px rgba(17, 34, 80, 0.12)",
        "2xl": "0 28px 56px -12px rgba(17, 34, 80, 0.16)",
        inner: "inset 0 2px 4px 0 rgba(17, 34, 80, 0.06)",
        soft: "0 12px 32px -8px rgba(17, 34, 80, 0.08)",
        card: "0 16px 40px -12px rgba(17, 34, 80, 0.09)",
      },
      backgroundImage: {
        "constellation": "radial-gradient(circle at 1px 1px, rgba(17,34,80,0.14) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};

export default config;
