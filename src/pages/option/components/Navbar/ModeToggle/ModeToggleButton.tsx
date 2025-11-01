import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useThemeTransition } from "@/hooks/useThemeTransition";
import { Monitor, Moon, Sun } from "lucide-react";

const ModeToggleButton = () => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={cycleTheme}>
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all ${
          theme === "light" ? "rotate-0 scale-100" : "rotate-90 scale-0"
        }`}
      />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
          theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
        }`}
      />
      <Monitor
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
          theme === "system" ? "rotate-0 scale-100" : "rotate-90 scale-0"
        }`}
      />
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
};

export default ModeToggleButton;
