import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-jetbrains-mono)", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        background: {
          primary: "#0A0E17",
          secondary: "#141A26",
          tertiary: "#1C2436",
          accent: "#1A3A1A",
        },
        primary: {
          DEFAULT: "#00E676",
          dark: "#00C853",
          dim: "#1B5E2040",
        },
        accent: {
          amber: "#FFB300",
          red: "#FF5252",
          blue: "#448AFF",
        },
        surface: {
          DEFAULT: "rgba(28, 36, 54, 0.6)",
          hover: "rgba(28, 36, 54, 0.8)",
          border: "rgba(148, 163, 184, 0.1)",
        },
        text: {
          primary: "#F1F5F9",
          secondary: "#94A3B8",
          muted: "#7483A0",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-up": "fadeUp 0.6s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(0, 230, 118, 0.2)" },
          "50%": { boxShadow: "0 0 20px rgba(0, 230, 118, 0.5)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
