import type { Config } from "tailwindcss";

const config = {
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
      },
    },
  },
  plugins: [],
} as Config;

export default config;
