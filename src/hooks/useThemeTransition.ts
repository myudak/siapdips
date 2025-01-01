import { useTheme } from "@/components/theme-provider";
import { useCallback } from "react";
import { flushSync } from "react-dom";

export function useThemeTransition() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    const md = window.matchMedia("(max-width: 768px)").matches;

    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(theme === "light" ? "dark" : "light");
      return;
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(theme === "light" ? "dark" : "light");
      });
    });

    transition.ready.then(() => {
      const blur = md ? 2 : 10;
      const duration = md ? 500 : 700;

      document.documentElement.animate(
        {
          clipPath: [`circle(50% at -100% 50%)`, `circle(100% at 50% 50%)`],
          filter: [`blur(${blur}px)`, `blur(0)`],
        },
        {
          duration,
          easing: "ease-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  }, [theme, setTheme]);

  return {
    theme,
    toggleTheme,
  };
}
