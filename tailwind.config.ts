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
        navy: {
          950: "#060D1A",
          900: "#0B192C",
          850: "#112239",
          800: "#1E3E62",
          700: "#2B527E",
        },
        gold: {
          600: "#C88A22",
          500: "#E5A93C",
          400: "#F3BE58",
          100: "#FEF3C7",
          50: "#FFFBEB",
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
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        heading: ["var(--font-heading)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(11, 25, 44, 0.06), 0 1px 2px 0 rgba(11, 25, 44, 0.03)",
        elevated: "0 10px 25px -5px rgba(11, 25, 44, 0.1), 0 8px 10px -6px rgba(11, 25, 44, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;

