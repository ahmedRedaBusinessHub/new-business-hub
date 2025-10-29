"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeName, ThemeMode, themes } from "@/config/themes";

interface ThemeContextType {
  themeName: ThemeName;
  setThemeName: (theme: ThemeName) => void;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeNameState] = useState<ThemeName>("default");
  const [mode, setModeState] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load from localStorage
    const savedTheme = localStorage.getItem("theme-name") as ThemeName;
    const savedMode = localStorage.getItem("theme-mode") as ThemeMode;
    if (savedTheme) setThemeNameState(savedTheme);
    if (savedMode) setModeState(savedMode);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Apply theme colors as CSS variables
    const colors = themes[themeName][mode];
    const root = document.documentElement;

    root.style.setProperty("--color-primary", colors.primary);
    root.style.setProperty("--color-secondary", colors.secondary);
    root.style.setProperty("--color-background", colors.background);
    root.style.setProperty("--color-foreground", colors.foreground);

    // Apply dark class for Tailwind
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Save to localStorage
    localStorage.setItem("theme-name", themeName);
    localStorage.setItem("theme-mode", mode);
  }, [themeName, mode, mounted]);

  const setThemeName = (theme: ThemeName) => {
    setThemeNameState(theme);
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName, mode, setMode }}>
      <NextThemesProvider attribute="class" defaultTheme="light">
        {children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
