import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "selector",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // i add safelist for grid col spans used in DynamicForm component
  safelist: [
    // Grid column spans for all screen sizes
    "col-span-1",
    "col-span-2",
    "col-span-3",
    "col-span-4",
    "col-span-5",
    "col-span-6",
    "col-span-7",
    "col-span-8",
    "col-span-9",
    "col-span-10",
    "col-span-11",
    "col-span-12",

    // For tablet (md) and desktop (lg) responsive classes
    "md:col-span-1",
    "md:col-span-2",
    "md:col-span-3",
    "md:col-span-4",
    "md:col-span-5",
    "md:col-span-6",
    "md:col-span-7",
    "md:col-span-8",
    "md:col-span-9",
    "md:col-span-10",
    "md:col-span-11",
    "md:col-span-12",
    "lg:col-span-1",
    "lg:col-span-2",
    "lg:col-span-3",
    "lg:col-span-4",
    "lg:col-span-5",
    "lg:col-span-6",
    "lg:col-span-7",
    "lg:col-span-8",
    "lg:col-span-9",
    "lg:col-span-10",
    "lg:col-span-11",
    "lg:col-span-12",
  ],
  theme: {
    extend: {
      fontFamily: {
        somar: ["var(--font-somar)"],
        // You can also add a fallback font
        // somar: ['var(--font-somar)', 'sans-serif'],
      },
      //   colors: {
      //     // Default Theme
      //     default: {
      //       light: {
      //         primary: "#3b82f6",
      //         secondary: "#8b5cf6",
      //         background: "#ffffff",
      //         foreground: "#1f2937",
      //       },
      //       dark: {
      //         primary: "#60a5fa",
      //         secondary: "#a78bfa",
      //         background: "#111827",
      //         foreground: "#f9fafb",
      //       },
      //     },
      //     // Corporate Theme
      //     corporate: {
      //       light: {
      //         primary: "#0ea5e9",
      //         secondary: "#06b6d4",
      //         background: "#f8fafc",
      //         foreground: "#0f172a",
      //       },
      //       dark: {
      //         primary: "#38bdf8",
      //         secondary: "#22d3ee",
      //         background: "#020617",
      //         foreground: "#f1f5f9",
      //       },
      //     },
      //     // Vibrant Theme
      //     vibrant: {
      //       light: {
      //         primary: "#ec4899",
      //         secondary: "#f59e0b",
      //         background: "#fef2f2",
      //         foreground: "#7f1d1d",
      //       },
      //       dark: {
      //         primary: "#f472b6",
      //         secondary: "#fbbf24",
      //         background: "#450a0a",
      //         foreground: "#fef2f2",
      //       },
      //     },
      //   },
    },
  },
  plugins: [],
};

export default config;
