"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { Flame, CheckCircle, Bookmark, BookOpen, Trophy, Sparkles, ArrowLeft, Calendar, Keyboard, Moon, Brain, Code2 } from "lucide-react";
import { STORAGE_KEYS } from "@/config/constants";
import { NoteMeta } from "@/lib/mdx";

type StatsData = {
  currentStreak: number;
  longestStreak: number;
  datesRead: string[];
  lastReadDate?: string;
};

type ProgressItem = {
  slug: string;
  topic: string;
  title: string;
  percent: number;
  updatedAt: number;
};

export function NotesStatsClient({ totalNotes }: { totalNotes: number }) {
  const [stats, setStats] = useState<StatsData>({
    currentStreak: 0,
    longestStreak: 0,
    datesRead: [],
  });
  const [completedCount, setCompletedCount] = useState(0);
  const [bookmarkedCount, setBookmarkedCount] = useState(0);
  const [readNotesCount, setReadNotesCount] = useState(0);
  const [isNightOwl, setIsNightOwl] = useState(false);
  const [activeRecallCount, setActiveRecallCount] = useState(0);
  const [reactCompleted, setReactCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      // 1. Reading streaks
      const streakData = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.readingStreaks) || "{}"
      );
      setStats({
        currentStreak: streakData.currentStreak || 0,
        longestStreak: streakData.longestStreak || 0,
        datesRead: streakData.datesRead || [],
        lastReadDate: streakData.lastReadDate,
      });

      // 2. Completed notes
      const completed: string[] = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.completedNotes) || "[]"
      );
      setCompletedCount(completed.length);
      const hasFinishedReact = completed.some((n) => n.includes("react-hooks") || n.includes("react"));
      setReactCompleted(hasFinishedReact);

      // 3. Bookmarked notes
      const bookmarked: string[] = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.bookmarkedNotes) || "[]"
      );
      setBookmarkedCount(bookmarked.length);

      // 4. In progress / read notes
      const progress: Record<string, ProgressItem> = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.readingProgress) || "{}"
      );
      setReadNotesCount(Object.keys(progress).length);

      // 5. Night Owl badge
      const nightOwlSaved = localStorage.getItem("prahlad-night-owl") === "true";
      const curHour = new Date().getHours();
      setIsNightOwl(nightOwlSaved || curHour >= 23 || curHour < 5);

      // 6. Active Recall badge (flashcards + quizzes)
      const recallCount = parseInt(localStorage.getItem("prahlad-active-recall") || "0", 10);
      setActiveRecallCount(recallCount);
    } catch (e) {}
  }, []);

  // Generate 26 weeks (approx. 6 months) for the heatmap
  const weeks = 26;
  const daysPerWeek = 7;
  const today = dayjs();
  const startDate = today.subtract(weeks * 7 - 1, "day");

  const calendarDays = Array.from({ length: weeks * daysPerWeek }, (_, i) => {
    const d = startDate.add(i, "day");
    const dateStr = d.format("YYYY-MM-DD");
    const hasRead = stats.datesRead.includes(dateStr);
    return {
      date: dateStr,
      hasRead,
      isFuture: d.isAfter(today, "day"),
    };
  });

  // Achievements
  const achievements = [
    {
      id: "night_owl",
      title: "Night Owl 🦉",
      description: "Read or study late after 11:00 PM",
      unlocked: isNightOwl,
      icon: Moon,
      color: "text-purple-400",
      progress: isNightOwl ? 100 : 0,
    },
    {
      id: "streak_runner",
      title: "Streak Runner 🔥",
      description: "Maintain a 3-day active learning streak",
      unlocked: stats.longestStreak >= 3 || stats.currentStreak >= 3,
      icon: Flame,
      color: "text-amber-500",
      progress: Math.min(100, (Math.max(stats.longestStreak, stats.currentStreak) / 3) * 100),
    },
    {
      id: "active_recaller",
      title: "Active Recaller 🧠",
      description: "Review 5+ flashcards or complete an interactive quiz",
      unlocked: activeRecallCount >= 5,
      icon: Brain,
      color: "text-emerald-500",
      progress: Math.min(100, (activeRecallCount / 5) * 100),
    },
    {
      id: "hook_connoisseur",
      title: "Hook Connoisseur 📚",
      description: "Complete and master all React deep dive notes",
      unlocked: reactCompleted,
      icon: Code2,
      color: "text-cyan-500",
      progress: reactCompleted ? 100 : 0,
    },
    {
      id: "first_read",
      title: "First Steps",
      description: "Read your first digital note",
      unlocked: readNotesCount >= 1 || completedCount >= 1,
      icon: BookOpen,
      color: "text-blue-500",
      progress: Math.min(100, ((readNotesCount || (completedCount > 0 ? 1 : 0)) / 1) * 100),
    },
    {
      id: "curator",
      title: "Knowledge Curator",
      description: "Bookmark 3 notes to reference later",
      unlocked: bookmarkedCount >= 3,
      icon: Bookmark,
      color: "text-indigo-500",
      progress: Math.min(100, (bookmarkedCount / 3) * 100),
    },
  ];

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <Link
          href="/notes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Notes
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Learning Stats & Streaks</h1>
            <p className="text-sm text-muted-foreground">
              Track your reading activity, active streaks, and mastery milestones.
            </p>
          </div>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-border bg-muted/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Streak</span>
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black">{mounted ? stats.currentStreak : 0}</span>
            <span className="text-xs text-muted-foreground ml-1.5">days</span>
          </div>
          <span className="text-[11px] text-muted-foreground/80 mt-1">
            Best: {mounted ? stats.longestStreak : 0} days
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-muted/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-primary mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">In Progress</span>
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black">{mounted ? readNotesCount : 0}</span>
            <span className="text-xs text-muted-foreground ml-1.5">notes</span>
          </div>
          <span className="text-[11px] text-muted-foreground/80 mt-1">
            Active reading sessions
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-muted/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-green-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Completed</span>
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black">{mounted ? completedCount : 0}</span>
            <span className="text-xs text-muted-foreground ml-1.5">of {totalNotes}</span>
          </div>
          <span className="text-[11px] text-muted-foreground/80 mt-1">
            {totalNotes > 0 ? Math.round((completedCount / totalNotes) * 100) : 0}% library finished
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-muted/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-indigo-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Saved</span>
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black">{mounted ? bookmarkedCount : 0}</span>
            <span className="text-xs text-muted-foreground ml-1.5">bookmarks</span>
          </div>
          <span className="text-[11px] text-muted-foreground/80 mt-1">
            Pinned for review
          </span>
        </div>
      </div>

      {/* GitHub-Style Reading Activity Heatmap */}
      <div className="p-6 rounded-2xl border border-border bg-muted/20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="text-base font-bold text-foreground">Reading Activity Heatmap</h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Less</span>
            <span className="w-3 h-3 rounded-xs bg-muted border border-border/40 inline-block" />
            <span className="w-3 h-3 rounded-xs bg-primary inline-block" />
            <span>More</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div
            className="grid grid-rows-7 grid-flow-col gap-1 w-max"
            style={{ minWidth: "550px" }}
          >
            {calendarDays.map((d) => (
              <div
                key={d.date}
                className={`w-3.5 h-3.5 rounded-xs transition-colors ${
                  d.isFuture
                    ? "bg-transparent border border-dashed border-border/20"
                    : d.hasRead
                    ? "bg-primary shadow-xs ring-1 ring-primary/40"
                    : "bg-muted/70 border border-border/40 hover:border-border"
                }`}
                title={`${d.date}: ${d.hasRead ? "Active reading session" : "No activity recorded"}`}
              />
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Calculated locally in your browser based on daily notes read and completed.
        </p>
      </div>

      {/* Achievements & Badges */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Learning Milestones & Badges
          </h3>
          <span className="text-xs text-muted-foreground">
            {achievements.filter((a) => a.unlocked).length} of {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((ach) => {
            const Icon = ach.icon;
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all ${
                  ach.unlocked
                    ? "border-primary/30 bg-primary/5 shadow-xs"
                    : "border-border/60 bg-muted/10 opacity-70"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      ach.unlocked
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-foreground truncate">
                        {ach.title}
                      </h4>
                      {ach.unlocked && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          Unlocked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      {ach.description}
                    </p>

                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${ach.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Keyboard Shortcuts Hub */}
      <div className="p-6 rounded-2xl border border-border bg-muted/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Keyboard Shortcuts Cheat Sheet</h3>
              <p className="text-xs text-muted-foreground">Power-user keybindings active throughout all technical notes</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("prahlad-open-shortcuts"))}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>Open Interactive Modal</span>
            <kbd className="px-1 py-0.5 text-[10px] font-mono bg-background border border-border rounded">?</kbd>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
              Navigation
            </span>
            <div className="rounded-xl border border-border/60 bg-background/50 divide-y divide-border/40 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 text-xs">
                <span className="text-muted-foreground">Next note</span>
                <kbd className="px-2 py-0.5 font-mono font-bold bg-muted border border-border rounded">J</kbd>
              </div>
              <div className="flex items-center justify-between px-3 py-2 text-xs">
                <span className="text-muted-foreground">Previous note</span>
                <kbd className="px-2 py-0.5 font-mono font-bold bg-muted border border-border rounded">K</kbd>
              </div>
              <div className="flex items-center justify-between px-3 py-2 text-xs">
                <span className="text-muted-foreground">Toggle sidebar</span>
                <kbd className="px-2 py-0.5 font-mono font-bold bg-muted border border-border rounded">[ or ]</kbd>
              </div>
              <div className="flex items-center justify-between px-3 py-2 text-xs">
                <span className="text-muted-foreground">Table of contents</span>
                <kbd className="px-2 py-0.5 font-mono font-bold bg-muted border border-border rounded">T</kbd>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
              Reading & Focus
            </span>
            <div className="rounded-xl border border-border/60 bg-background/50 divide-y divide-border/40 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 text-xs">
                <span className="text-muted-foreground">Zen / Focus Mode</span>
                <kbd className="px-2 py-0.5 font-mono font-bold bg-muted border border-border rounded">Z</kbd>
              </div>
              <div className="flex items-center justify-between px-3 py-2 text-xs">
                <span className="text-muted-foreground">Bookmark note</span>
                <kbd className="px-2 py-0.5 font-mono font-bold bg-muted border border-border rounded">B</kbd>
              </div>
              <div className="flex items-center justify-between px-3 py-2 text-xs">
                <span className="text-muted-foreground">Audio narration</span>
                <span className="text-[11px] text-muted-foreground">Toolbar</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 text-xs">
                <span className="text-muted-foreground">Font resize</span>
                <span className="text-[11px] text-muted-foreground">Toolbar</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
              Actions & Modal
            </span>
            <div className="rounded-xl border border-border/60 bg-background/50 divide-y divide-border/40 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 text-xs">
                <span className="text-muted-foreground">Shortcuts modal</span>
                <kbd className="px-2 py-0.5 font-mono font-bold bg-muted border border-border rounded">?</kbd>
              </div>
              <div className="flex items-center justify-between px-3 py-2 text-xs">
                <span className="text-muted-foreground">Close modal</span>
                <kbd className="px-2 py-0.5 font-mono font-bold bg-muted border border-border rounded">Esc</kbd>
              </div>
              <div className="flex items-center justify-between px-3 py-2 text-xs">
                <span className="text-muted-foreground">Command palette</span>
                <kbd className="px-2 py-0.5 font-mono font-bold bg-muted border border-border rounded">⌘K</kbd>
              </div>
              <div className="flex items-center justify-between px-3 py-2 text-xs">
                <span className="text-muted-foreground">Code range link</span>
                <span className="text-[10px] text-muted-foreground font-mono">Shift+Click</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
