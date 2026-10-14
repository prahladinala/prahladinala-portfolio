"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, X } from "lucide-react";
import { STORAGE_KEYS } from "@/config/constants";

type InProgressNote = {
  slug: string;
  topic: string;
  topicName: string;
  title: string;
  percent: number;
  scrollY: number;
  updatedAt: number;
};

export function ResumeReadingBanner() {
  const [recentNote, setRecentNote] = useState<InProgressNote | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const progressMap: Record<string, InProgressNote> = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.readingProgress) || "{}"
      );

      const items = Object.values(progressMap)
        .filter((n) => n.percent >= 5 && n.percent <= 95)
        .sort((a, b) => b.updatedAt - a.updatedAt);

      if (items.length > 0) {
        setRecentNote(items[0]);
      }
    } catch (e) {}
  }, []);

  if (!recentNote || dismissed) return null;

  return (
    <div className="relative mb-8 p-4 sm:p-5 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent overflow-hidden shadow-sm animate-in fade-in slide-in-from-top-3 duration-300">
      {/* Dismiss button anchored in the top corner to prevent squishing text on smaller screens */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors z-10"
        title="Dismiss"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pr-7 sm:pr-8">
        {/* Left: Icon + Title & Topic */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/20 whitespace-nowrap">
                Continue Reading
              </span>
              <span className="text-xs text-muted-foreground font-medium truncate">
                {recentNote.topicName || recentNote.topic}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold truncate text-foreground">
              {recentNote.title}
            </h4>
          </div>
        </div>

        {/* Right: Progress bar + Resume Button */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 justify-between lg:justify-end border-t border-border/40 lg:border-0 pt-3 lg:pt-0">
          <div className="flex items-center gap-2.5">
            <div className="w-24 sm:w-28 h-2 bg-muted rounded-full overflow-hidden border border-border/50">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${recentNote.percent}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-muted-foreground tabular-nums whitespace-nowrap">
              {recentNote.percent}%
            </span>
          </div>

          <Link
            href={`/notes/${recentNote.topic}/${recentNote.slug}?resume=true`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-xs hover:bg-primary/90 transition-all hover:gap-2 whitespace-nowrap shrink-0"
          >
            Resume <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
