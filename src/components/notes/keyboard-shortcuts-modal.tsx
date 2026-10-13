"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Keyboard, Sparkles } from "lucide-react";

type Shortcut = {
  key: string;
  description: string;
  category: "Navigation" | "Reading & Focus" | "Actions";
};

const SHORTCUTS: Shortcut[] = [
  { key: "Z", description: "Toggle Zen / Focus reading mode", category: "Reading & Focus" },
  { key: "J", description: "Jump to next note in series", category: "Navigation" },
  { key: "K", description: "Jump to previous note in series", category: "Navigation" },
  { key: "[ or ]", description: "Toggle left topic sidebar", category: "Navigation" },
  { key: "T", description: "Scroll to Table of Contents", category: "Navigation" },
  { key: "B", description: "Bookmark / Unbookmark current note", category: "Actions" },
  { key: "?", description: "Open this keyboard shortcuts cheat sheet", category: "Actions" },
  { key: "Esc", description: "Close modal / dismiss popovers", category: "Actions" },
];

export function KeyboardShortcutsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-6 bg-background/95 backdrop-blur-xl border-border shadow-2xl rounded-2xl">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                Keyboard Shortcuts
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Pro
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Navigate notes at the speed of thought without touching your mouse
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {(["Navigation", "Reading & Focus", "Actions"] as const).map((category) => {
            const items = SHORTCUTS.filter((s) => s.category === category);
            if (items.length === 0) return null;
            return (
              <div key={category} className="space-y-1.5">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                  {category}
                </h4>
                <div className="rounded-xl border border-border/60 bg-muted/20 divide-y divide-border/40 overflow-hidden">
                  {items.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between px-3.5 py-2.5 hover:bg-muted/40 transition-colors"
                    >
                      <span className="text-sm text-foreground/90 font-medium">
                        {item.description}
                      </span>
                      <kbd className="px-2 py-1 text-xs font-mono font-semibold text-foreground bg-background border border-border rounded-md shadow-xs shrink-0">
                        {item.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-border/50 text-center text-xs text-muted-foreground">
          Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono font-bold">?</kbd> anywhere in Notes to open this cheat sheet.
        </div>
      </DialogContent>
    </Dialog>
  );
}
