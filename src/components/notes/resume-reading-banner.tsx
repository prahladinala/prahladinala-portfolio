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
    <div className="mb-8 p-4 sm:p-5 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent relative overflow-hidden shadow-sm animate-in fade-in slide-in-from-top-3 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Resume Where You Left Off
              </span>
              <span className="text-muted-foreground/60">•</span>
              <span className="text-xs text-muted-foreground">
                {recentNote.topicName || recentNote.topic}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold truncate text-foreground">
              {recentNote.title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-semibold text-muted-foreground">
              {recentNote.percent}% completed
            </span>
            <div className="w-24 sm:w-28 h-1.5 bg-muted rounded-full overflow-hidden border border-border/50">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${recentNote.percent}%` }}
              />
            </div>
          </div>

          <Link
            href={`/notes/${recentNote.topic}/${recentNote.slug}?resume=true`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-xs hover:bg-primary/90 transition-all hover:gap-2"
          >
            Resume <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
