"use client";

import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type AccordionProps = {
  title: string;
  content?: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
};

export function Accordion({
  title,
  content,
  children,
  defaultOpen = false,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="my-6 rounded-2xl border border-border/80 bg-muted/20 overflow-hidden shadow-xs transition-all">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-foreground hover:bg-muted/40 transition-colors select-none group"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <span className="group-hover:text-primary transition-colors">{title}</span>
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-300 shrink-0 ml-2",
            isOpen ? "rotate-180 text-primary" : ""
          )}
        />
      </button>

      {isOpen && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/40 animate-in fade-in slide-in-from-top-1 duration-200">
          {content ? (
            <p className="m-0 whitespace-pre-wrap font-medium">{content}</p>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  );
}
