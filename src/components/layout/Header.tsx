"use client";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/contexts/ThemeProvider";
import { ThemeName } from "@/config/themes";
import { signOut } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { locales } from "@/types/locales";

export function Header() {
  const { themeName, setThemeName, mode, setMode } = useTheme();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getTargetPath = (lang: string) => {
    // preserve current path without the locale segment (if present)
    const currentPath = pathname || "/";
    const segments = currentPath.split("/");
    // segments[0] is empty string because path starts with '/'
    const segment = segments[1] as (typeof locales)[number] | undefined;
    if (segment && locales.includes(segment)) {
      segments.splice(1, 1);
    }
    const base = segments.join("/") || "/";
    const query = searchParams ? `?${searchParams.toString()}` : "";
    return `/${lang}${base}${query}`;
  };

  const themes: ThemeName[] = ["default", "corporate", "vibrant"];

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-700 bg-(--color-background)">
      <div className="h-full px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-(--color-foreground)">
          Enterprise App
        </h1>

        <div className="flex items-center gap-4">
          <select
            value={
              /* derive current locale from pathname or default to first locale */
              ((pathname || "").split("/")[1] as (typeof locales)[number]) ||
              locales[0]
            }
            onChange={(e) => {
              const lang = e.target.value;
              router.push(getTargetPath(lang));
            }}
            className="px-3 py-2 rounded-md bg-(--color-background) text-(--color-foreground) border border-gray-300 dark:border-gray-600"
          >
            {locales.map((loc) => (
              <option key={loc} value={loc}>
                {loc === "en"
                  ? "English"
                  : loc === "ar"
                  ? "العربية"
                  : loc === "es"
                  ? "Español"
                  : loc}
              </option>
            ))}
          </select>

          <select
            value={themeName}
            onChange={(e) => setThemeName(e.target.value as ThemeName)}
            className="px-3 py-2 rounded-md bg-(--color-background) text-(--color-foreground) border border-gray-300 dark:border-gray-600"
          >
            {themes.map((theme) => (
              <option key={theme} value={theme}>
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
          >
            {mode === "light" ? "🌙 Dark" : "☀️ Light"}
          </Button>

          <Button variant="ghost" size="sm" onClick={() => signOut()}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
