import { Moon, Sun } from "lucide-react";
import { themeStore, useTheme } from "@/lib/theme-store";

export function ThemeToggle() {
  const theme = useTheme();
  const dark = theme === "dark";
  return (
    <button
      onClick={() => themeStore.toggle()}
      aria-label="Toggle theme"
      className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
    >
      <Sun className={`absolute h-5 w-5 transition-all duration-300 ${dark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"}`} />
      <Moon className={`absolute h-5 w-5 transition-all duration-300 ${dark ? "scale-100 rotate-0 opacity-100 text-accent" : "scale-0 rotate-90 opacity-0"}`} />
    </button>
  );
}
