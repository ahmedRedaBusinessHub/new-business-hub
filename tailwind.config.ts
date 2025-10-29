import type { Config } from "tailwindcss";

const config: Config = {
  //   darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Default Theme
        default: {
          light: {
            primary: "#3b82f6",
            secondary: "#8b5cf6",
            background: "#ffffff",
            foreground: "#1f2937",
          },
          dark: {
            primary: "#60a5fa",
            secondary: "#a78bfa",
            background: "#111827",
            foreground: "#f9fafb",
          },
        },
        // Corporate Theme
        corporate: {
          light: {
            primary: "#0ea5e9",
            secondary: "#06b6d4",
            background: "#f8fafc",
            foreground: "#0f172a",
          },
          dark: {
            primary: "#38bdf8",
            secondary: "#22d3ee",
            background: "#020617",
            foreground: "#f1f5f9",
          },
        },
        // Vibrant Theme
        vibrant: {
          light: {
            primary: "#ec4899",
            secondary: "#f59e0b",
            background: "#fef2f2",
            foreground: "#7f1d1d",
          },
          dark: {
            primary: "#f472b6",
            secondary: "#fbbf24",
            background: "#450a0a",
            foreground: "#fef2f2",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
