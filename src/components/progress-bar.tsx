"use client";

import { useEffect, useState } from "react";

export function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const computeProgress = () => {
      // The scrollable height is total height minus viewport height
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight <= 0) {
        setProgress(0);
        return;
      }
      
      const currentScroll = window.scrollY;
      const scrolled = (currentScroll / scrollHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrolled)));
    };

    window.addEventListener("scroll", computeProgress, { passive: true });
    // Compute initially
    computeProgress();

    return () => window.removeEventListener("scroll", computeProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[60] print:hidden bg-transparent pointer-events-none">
      <div 
        className="h-full bg-primary transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
