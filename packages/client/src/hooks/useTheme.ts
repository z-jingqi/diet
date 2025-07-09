import { useEffect, useState, useCallback } from "react";

export type ThemeOption = "light" | "dark" | "system";

const STORAGE_KEY = "theme-preference";

function getSystemTheme(): ThemeOption {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: ThemeOption) {
  const resolved = theme === "system" ? getSystemTheme() : theme;
  if (resolved === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export const useTheme = () => {
  const [theme, setThemeState] = useState<ThemeOption>(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeOption | null;
    return stored || "system";
  });

  const setTheme = useCallback((newTheme: ThemeOption) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  }, []);

  // Apply on mount & when theme changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Listen to system preference changes when in system mode
  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => applyTheme("system");
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);

  return { theme, setTheme };
};
