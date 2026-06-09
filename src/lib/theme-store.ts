import { useSyncExternalStore } from "react";

const KEY = "strathmart_theme";
let theme: "light" | "dark" = "light";
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  try {
    const saved = localStorage.getItem(KEY) as "light" | "dark" | null;
    if (saved) theme = saved;
    apply();
  } catch {}
}

function apply() {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export const themeStore = {
  toggle() {
    theme = theme === "dark" ? "light" : "dark";
    if (typeof window !== "undefined") localStorage.setItem(KEY, theme);
    apply();
    listeners.forEach((l) => l());
  },
  get() {
    return theme;
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useTheme() {
  return useSyncExternalStore(
    themeStore.subscribe,
    () => theme,
    () => "light" as const,
  );
}
