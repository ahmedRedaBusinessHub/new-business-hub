export type ThemeName = "default" | "corporate" | "vibrant";
export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  background: string;
  foreground: string;
}

export const themes: Record<ThemeName, Record<ThemeMode, ThemeColors>> = {
  default: {
    light: {
      primary: "oklch(0.205 0 0)",
      "primary-foreground": "oklch(0.985 0 0)",

      secondary: "oklch(0.97 0 0)",
      "secondary-foreground": "oklch(0.205 0 0)",

      background: "oklch(1 0 0)",
      foreground: "oklch(0.145 0 0)",
    },
    dark: {
      primary: "rgb(96, 165, 250)",
      "primary-foreground": "rgb(249, 250, 251)",
      secondary: "rgb(167, 139, 250)",
      "secondary-foreground": "rgb(249, 250, 251)",
      background: "rgb(17, 24, 39)",
      foreground: "rgb(249, 250, 251)",
    },
  },
  // corporate: {
  //   light: {
  //     primary: "rgb(14, 165, 233)",
  //     secondary: "rgb(6, 182, 212)",
  //     background: "rgb(248, 250, 252)",
  //     foreground: "rgb(15, 23, 42)",
  //     primary_foreground: "rgb(248, 250, 252)",
  //     secondary_foreground: "rgb(248, 250, 252)",
  //   },
  //   dark: {
  //     primary: "rgb(56, 189, 248)",
  //     secondary: "rgb(34, 211, 238)",
  //     background: "rgb(2, 6, 23)",
  //     foreground: "rgb(241, 245, 249)",
  //     primary_foreground: "rgb(241, 245, 249)",
  //     secondary_foreground: "rgb(241, 245, 249)",
  //   },
  // },
  // vibrant: {
  //   light: {
  //     primary: "rgb(236, 72, 153)",
  //     secondary: "rgb(245, 158, 11)",
  //     background: "rgb(254, 242, 242)",
  //     foreground: "rgb(127, 29, 29)",
  //     primary_foreground: "rgb(127, 29, 29)",
  //     secondary_foreground: "rgb(127, 29, 29)",
  //   },
  //   dark: {
  //     primary: "rgb(244, 114, 182)",
  //     secondary: "rgb(251, 191, 36)",
  //     background: "rgb(69, 10, 10)",
  //     foreground: "rgb(254, 242, 242)",
  //     primary_foreground: "rgb(254, 242, 242)",
  //     secondary_foreground: "rgb(254, 242, 242)",
  //   },
  // },
};
