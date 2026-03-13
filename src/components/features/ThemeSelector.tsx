import { useTheme } from "@/contexts/ThemeProvider";
import { Button } from "../ui/Button";
import { Palette, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

export default function ThemeSelector() {
  const { theme, setTheme, mode, setMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    {
      id: "default" as const,
      name: "Default",
      colors: ["#0D5BDC", "#340F87", "#4587F4"],
    },
    {
      id: "ocean" as const,
      name: "Ocean",
      colors: ["#0891B2", "#155E75", "#22D3EE"],
    },
    {
      id: "sunset" as const,
      name: "Sunset",
      colors: ["#F59E0B", "#DC2626", "#FBBF24"],
    },
    {
      id: "forest" as const,
      name: "Forest",
      colors: ["#059669", "#065F46", "#10B981"],
    },
    {
      id: "purple" as const,
      name: "Purple",
      colors: ["#9333EA", "#6B21A8", "#A855F7"],
    },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="flex flex-col gap-3">
        {/* Theme Mode Toggle */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            size="icon"
            className="w-12 h-12 rounded-full glassmorphism transition-all duration-300 border-0"
            style={{
              background:
                mode === "dark"
                  ? "linear-gradient(135deg, #1E293B 0%, #334155 100%)"
                  : "linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)",
            }}
          >
            {mode === "light" ? (
              <Sun
                className="w-5 h-5"
                style={{ color: "var(--theme-primary)" }}
              />
            ) : (
              <Moon className="w-5 h-5 text-yellow-300" />
            )}
          </Button>
        </motion.div>

        {/* Theme Selector Toggle */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            size="icon"
            className="w-12 h-12 rounded-full glassmorphism transition-all duration-300 border-0"
            style={{
              background: `linear-gradient(135deg, var(--theme-gradient-start) 0%, var(--theme-gradient-end) 100%)`,
            }}
          >
            <Palette className="w-5 h-5 text-white" />
          </Button>
        </motion.div>

        {/* Theme Options */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="glassmorphism rounded-2xl p-4 space-y-2 min-w-[180px]"
            >
              <p
                className="text-sm mb-3 px-2"
                style={{ color: "var(--theme-text-primary)" }}
              >
                Choose Theme
              </p>
              {themes.map((t) => (
                <motion.button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  whileHover={{ scale: 1.05, x: 4 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                    theme === t.id ? "ring-2 ring-offset-2" : ""
                  }`}
                  style={{
                    background:
                      theme === t.id
                        ? `linear-gradient(135deg, ${t.colors[0]} 0%, ${t.colors[1]} 100%)`
                        : mode === "dark"
                        ? "rgba(30, 41, 59, 0.5)"
                        : "rgba(255, 255, 255, 0.5)",
                    // ringColor: t.colors[0],
                  }}
                >
                  <div className="flex gap-1">
                    {t.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span
                    className="text-sm"
                    style={{
                      color:
                        theme === t.id ? "white" : "var(--theme-text-primary)",
                    }}
                  >
                    {t.name}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
