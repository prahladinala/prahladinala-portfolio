"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";
import { STORAGE_KEYS } from "@/config/constants";
import { cn } from "@/lib/utils";

type ChecklistProps = {
  title?: string;
  items?: string[];
  id?: string;
};

export function Checklist({ title = "Interactive Tutorial Checklist", items = [], id }: ChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);
  const checklistId = id || title.toLowerCase().replace(/[^a-z0-9]/g, "-");

  useEffect(() => {
    setMounted(true);
    try {
      const path = window.location.pathname;
      const allChecklists = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.tutorialChecklists) || "{}"
      );
      const saved = allChecklists[`${path}::${checklistId}`] || [];
      setCheckedItems(saved);
    } catch (e) {
      console.error(e);
    }
  }, [checklistId]);

  const toggleItem = (index: number) => {
    const updated = checkedItems.includes(index)
      ? checkedItems.filter((i) => i !== index)
      : [...checkedItems, index];

    setCheckedItems(updated);

    try {
      const path = window.location.pathname;
      const allChecklists = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.tutorialChecklists) || "{}"
      );
      allChecklists[`${path}::${checklistId}`] = updated;
      localStorage.setItem(STORAGE_KEYS.tutorialChecklists, JSON.stringify(allChecklists));
    } catch (e) {
      console.error(e);
    }
  };

  const progress = items.length > 0 ? Math.round((checkedItems.length / items.length) * 100) : 0;

  return (
    <div className="my-8 rounded-2xl border border-border/80 bg-muted/20 p-5 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            ✓
          </div>
          <h4 className="font-bold text-base text-foreground tracking-tight m-0">
            {title}
          </h4>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-28 h-2 bg-muted rounded-full overflow-hidden border border-border/40">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
            {checkedItems.length} of {items.length} ({progress}%)
          </span>
          {progress === 100 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Done
            </span>
          )}
        </div>
      </div>

      <ul className="space-y-2.5 m-0 p-0 list-none">
        {items.map((item, idx) => {
          const isChecked = mounted && checkedItems.includes(idx);
          return (
            <li
              key={idx}
              onClick={() => toggleItem(idx)}
              className={cn(
                "flex items-start gap-3 p-2.5 rounded-xl border border-transparent transition-all cursor-pointer select-none group",
                isChecked
                  ? "bg-primary/5 border-primary/20 text-muted-foreground"
                  : "hover:bg-muted/50 hover:border-border/60 text-foreground"
              )}
            >
              <button
                type="button"
                className="mt-0.5 shrink-0 focus:outline-hidden"
                aria-label={`Toggle ${item}`}
              >
                {isChecked ? (
                  <CheckCircle2 className="w-5 h-5 text-primary transition-transform scale-110" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </button>
              <span
                className={cn(
                  "text-sm font-medium leading-relaxed transition-all",
                  isChecked ? "line-through opacity-70" : ""
                )}
              >
                {item}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function InteractiveListItem({ children, ...props }: React.LiHTMLAttributes<HTMLLIElement>) {
  return (
    <li className="my-1.5 leading-relaxed" {...props}>
      {children}
    </li>
  );
}
