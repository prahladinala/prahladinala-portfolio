"use client";

import * as React from "react";
import { Moon, Sun, Eye } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[104px] h-9" />; // Placeholder to avoid layout shift
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  return (
    <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-full border border-border shadow-sm">
      <button 
        onClick={() => setTheme('light')} 
        className={`p-1.5 rounded-full transition-colors ${currentTheme === 'light' ? 'bg-primary/10 text-primary' : 'hover:bg-background hover:text-primary text-muted-foreground'}`}
        title="Light Mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button 
        onClick={() => setTheme('dark')} 
        className={`p-1.5 rounded-full transition-colors ${currentTheme === 'dark' ? 'bg-primary/10 text-primary' : 'hover:bg-background hover:text-primary text-muted-foreground'}`}
        title="Dark Mode"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button 
        onClick={() => setTheme('focus')} 
        className={`p-1.5 rounded-full transition-colors ${currentTheme === 'focus' ? 'bg-primary/10 text-primary' : 'hover:bg-background hover:text-primary text-muted-foreground'}`}
        title="Focus Mode (Eye Protection)"
      >
        <Eye className="w-4 h-4" />
      </button>
    </div>
  );
}
