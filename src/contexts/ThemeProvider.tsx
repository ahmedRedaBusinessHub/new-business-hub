"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "sonner";

import ThemeSelector from "@/components/features/ThemeSelector";
// import CustomCursor from "@/components/features/CustomCursor";

import { useI18n } from "@/hooks/useI18n";
const queryClient = new QueryClient();
export type ThemeColor = "default" | "ocean" | "sunset" | "forest" | "purple";
export type ThemeMode = "light" | "dark";
export type Language = "ar" | "en";

interface ThemeContextType {
  theme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, ...props }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeColor>("default");
  const [mode, setMode] = useState<ThemeMode>("light");
  const { language } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const savedMode = localStorage.getItem("theme-mode") as ThemeMode;
    if (savedMode) {
      setMode(savedMode);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    // Apply theme class to document
    document.documentElement.className = `theme-${theme} ${mode} ${
      language === "ar" ? "rtl" : "ltr"
    }`;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = `${language}`;
    localStorage.setItem("theme-mode", mode);
  }, [theme, mode, language]);
  if (!mounted) {
    return null;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider {...props} defaultTheme={mode}>
        <ThemeContext.Provider value={{ theme, setTheme, mode, setMode }}>
          {children}
          {/* <CustomCursor /> */}
          <ThemeSelector />
          <Toaster />
        </ThemeContext.Provider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
