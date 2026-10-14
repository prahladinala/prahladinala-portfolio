"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { ArrowRight, Search, Clock } from "lucide-react";
import Fuse from "fuse.js";
import { NoteMeta } from "@/lib/mdx";
import { cn } from "@/lib/utils";

export function NotesList({ notes }: { notes: NoteMeta[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(notes, {
        keys: ["title", "description", "topic", "tags"],
        threshold: 0.4, // Fuzzy matching threshold
        distance: 100,
      }),
    [notes],
  );

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    return fuse.search(searchQuery).map((result) => result.item);
  }, [searchQuery, fuse, notes]);

  return (
    <div className="space-y-8">
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow shadow-sm"
        />
      </div>

      {filteredNotes.length === 0 ? (
        <div className="p-8 text-center bg-muted/50 rounded-2xl border border-border">
          <p className="text-muted-foreground">
            No notes found matching "{searchQuery}".
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredNotes.map((note) => (
            <Link
              key={`${note.topic}/${note.slug}`}
              href={`/notes/${note.topic}/${note.slug}`}
            >
              <div className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all hover:-translate-y-1 group shadow-sm">
                <div className="flex flex-wrap items-center gap-2.5 text-sm text-muted-foreground mb-3">
                  <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-md text-xs font-semibold">
                    {note.topicName || note.topic}
                  </span>

                  {note.readingTime && (
                    <span className="text-xs font-medium text-muted-foreground">
                      ⚡ {note.readingTime} min read
                    </span>
                  )}

                  {note.difficulty && (
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                        note.difficulty === "Beginner" &&
                          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                        note.difficulty === "Intermediate" &&
                          "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                        note.difficulty === "Advanced" &&
                          "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                      )}
                    >
                      🎯 {note.difficulty}
                    </span>
                  )}

                  {note.date && (
                    <span className="text-xs text-muted-foreground/70 hidden sm:inline ml-auto">
                      {dayjs(note.date).format("MMM D, YYYY")}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {note.title}
                </h2>
                <p className="text-muted-foreground line-clamp-2">
                  {note.description}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Read Note <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
