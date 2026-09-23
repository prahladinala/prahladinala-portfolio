"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { ArrowRight, Search, Clock } from "lucide-react";
import Fuse from "fuse.js";
import { NoteMeta } from "@/lib/mdx";

export function NotesList({ notes }: { notes: NoteMeta[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const fuse = useMemo(() => new Fuse(notes, {
    keys: ["title", "description", "topic", "tags"],
    threshold: 0.4, // Fuzzy matching threshold
    distance: 100,
  }), [notes]);

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    return fuse.search(searchQuery).map(result => result.item);
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
          <p className="text-muted-foreground">No notes found matching "{searchQuery}".</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredNotes.map((note) => (
            <Link key={`${note.topic}/${note.slug}`} href={`/notes/${note.topic}/${note.slug}`}>
              <div className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all hover:-translate-y-1 group shadow-sm">
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                  <span className="capitalize px-2.5 py-1 bg-primary/10 text-primary rounded-md text-xs font-semibold">
                    {note.topic}
                  </span>
                  {note.date && <time>{dayjs(note.date).format("MMM D, YYYY")}</time>}
                  {note.readingTime && (
                    <span className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/50 mx-1"></span>
                      <Clock className="w-3.5 h-3.5" /> {note.readingTime} min read
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
