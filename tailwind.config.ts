import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // "dark" scale is now a neutral LIGHT surface scale (kept for backward compat).
        dark: {
          DEFAULT: "#f8fafc",
          100: "#ffffff",
          200: "#f8fafc",
          300: "#f1f5f9",
          400: "#e2e8f0",
          500: "#cbd5e1",
        },
        // Trust blue (fintech primary)
        primary: {
          DEFAULT: "#2563eb",
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        // Semantic surfaces and ink
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f1f5f9",
          subtle: "#f8fafc",
        },
        ink: {
          DEFAULT: "#0f172a",
          muted: "#475569",
          soft: "#64748b",
          faint: "#94a3b8",
        },
        line: {
          DEFAULT: "#e2e8f0",
          soft: "#f1f5f9",
          strong: "#cbd5e1",
        },
        accent: {
          DEFAULT: "#f97316",
          blue: "#2563eb",
          cyan: "#0ea5e9",
          pink: "#db2777",
          gold: "#f59e0b",
          orange: "#f97316",
          purple: "#7c3aed",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
        "gradient-accent": "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)",
        "gradient-gold": "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
        "gradient-dark": "linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)",
        "grid-pattern":
          "linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px)",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 23, 42, 0.04), 0 2px 8px rgba(15, 23, 42, 0.04)",
        card: "0 1px 3px rgba(15, 23, 42, 0.06), 0 4px 16px rgba(15, 23, 42, 0.04)",
        pop: "0 8px 24px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.04)",
        brand: "0 10px 30px rgba(37, 99, 235, 0.20)",
        "brand-sm": "0 4px 14px rgba(37, 99, 235, 0.18)",
        accent: "0 10px 30px rgba(249, 115, 22, 0.22)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2.5s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 0 rgba(37,99,235,0.25)" },
          "100%": { boxShadow: "0 0 24px rgba(37,99,235,0.35)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
