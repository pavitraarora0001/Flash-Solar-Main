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
        midnight: {
          950: "#040D17",
          900: "#061321", // Suggested background
          850: "#0A1828",
          800: "#101F32", // Suggested secondary background
          750: "#182C44",
          700: "#29445E", // Suggested border color
        },
        gold: {
          600: "#D49522",
          500: "#F2B33F", // Suggested gold
          400: "#FFD17A", // Suggested light gold
          300: "#FFE0A3",
          100: "#FEF4DE",
          50: "#FFFDF7",
        },
        ivory: {
          50: "#FCFCFA",
          100: "#F7F7F5", // Suggested primary text on dark
          200: "#EBECE8",
          300: "#DCE0DC",
          400: "#B6C1D0", // Suggested secondary text
        },
        navy: {
          950: "#061321",
          900: "#0B192C",
          850: "#101F32",
          800: "#1E3E62",
          700: "#29445E",
        },
        slate: {
          900: "#0F172A",
          800: "#1E293B",
          700: "#334155",
          600: "#475569",
          500: "#64748B",
          400: "#94A3B8",
          200: "#E2E8F0",
          100: "#F1F5F9",
          50: "#F8FAFC",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "'Times New Roman'", "Times", "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        heading: ["Georgia", "Cambria", "'Times New Roman'", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      borderRadius: {
        xl: "0.75rem",
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        card: "0 1px 3px 0 rgba(6, 19, 33, 0.08), 0 1px 2px 0 rgba(6, 19, 33, 0.04)",
        elevated: "0 20px 40px -15px rgba(6, 19, 33, 0.25)",
        goldGlow: "0 0 25px -5px rgba(242, 179, 63, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
