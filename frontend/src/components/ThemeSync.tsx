import { useEffect } from "react";

import { useDesignSystemStore } from "@/stores/useDesignSystemStore";
import { useFontsStore } from "@/stores/useFontsStore";
import { useUIStore } from "@/stores/useUIStore";

export function ThemeSync() {
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    void useFontsStore.getState().loadFonts();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && media.matches);
      document.documentElement.classList.toggle("dark", dark);
      useDesignSystemStore.getState().setColorMode(dark ? "dark" : "light");
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);

  return null;
}
