"use client";
import { STORAGE_KEYS } from "@/config/constants";

import { useState, useEffect } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { Bookmark, Clock, ArrowLeft, BookX } from "lucide-react";
import { NoteMeta } from "@/lib/mdx";

export function BookmarksClient({ allNotes }: { allNotes: NoteMeta[] }) {
  const [bookmarkedPaths, setBookmarkedPaths] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadBookmarks = () => {
      try {
        const newKeys = JSON.parse(localStorage.getItem(STORAGE_KEYS.bookmarkedNotes) || "[]");
        const oldKeys = JSON.parse(localStorage.getItem(STORAGE_KEYS.oldBookmarks) || "[]");
        // Merge and deduplicate
        const merged = Array.from(new Set([...newKeys, ...oldKeys]));
        setBookmarkedPaths(merged);
      } catch (e) {}
    };
    loadBookmarks();
    window.addEventListener('prahlad-notes-updated', loadBookmarks);
    return () => window.removeEventListener('prahlad-notes-updated', loadBookmarks);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-4xl pb-24 flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Filter notes that match the paths in localStorage safely
  const bookmarkedNotes = allNotes.filter(note => {
    return bookmarkedPaths.some(p => p.toLowerCase().includes(`/${note.slug.toLowerCase()}`));
  });

  // If there are paths in localStorage but they don't match any known notes (stale/broken links)
  const hasGhostBookmarks = bookmarkedPaths.length > 0 && bookmarkedNotes.length === 0;

  return (
    <div className="max-w-4xl pb-24">
      <Link href="/notes" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Notes
      </Link>
      
      <header className="mb-12">
        <h1 className="text-4xl font-black mb-4 tracking-tight flex items-center gap-3">
          <Bookmark className="w-8 h-8 text-primary fill-current" />
          Bookmarked Notes
        </h1>
        <p className="text-xl text-muted-foreground">
          {bookmarkedNotes.length} saved note{bookmarkedNotes.length !== 1 ? 's' : ''} for quick reference
        </p>
      </header>

      {bookmarkedNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-2xl bg-muted/10">
          <BookX className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            {hasGhostBookmarks 
              ? "We found some bookmarks, but they don't seem to match any existing notes! You may have renamed or deleted them."
              : "You haven't bookmarked any notes. Right-click any note link or use the reading toolbar to save notes here!"}
          </p>
          <Link href="/notes" className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors">
            Explore Notes
          </Link>
          
          {/* Debug Data */}
          {hasGhostBookmarks && (
            <div className="mt-8 text-xs text-muted-foreground/70 text-left bg-background p-4 rounded-md overflow-auto max-w-full">
              <p className="font-mono mb-2">Debug Info:</p>
              <p>Saved Paths: {JSON.stringify(bookmarkedPaths)}</p>
              <p>Available Notes: {allNotes.length}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {bookmarkedNotes.map((note) => (
            <Link 
              key={`${note.topic}-${note.slug}`} 
              href={`/notes/${note.topic}/${note.slug}`}
              className="group block p-6 rounded-2xl border border-border hover:border-primary/50 bg-card hover:bg-muted/20 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-6 w-8 h-10 bg-primary/10 flex items-center justify-center rounded-b-lg group-hover:bg-primary transition-colors">
                <Bookmark className="w-4 h-4 text-primary group-hover:text-primary-foreground fill-current" />
              </div>
              
              <div className="flex items-start justify-between gap-4 mb-4 pr-12">
                <h2 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                  {note.title}
                </h2>
                <span className="shrink-0 capitalize px-2.5 py-1 bg-primary/10 text-primary rounded-md text-xs font-semibold">
                  {note.topic}
                </span>
              </div>
              
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {note.description}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {note.date && <time>{dayjs(note.date).format("MMM D, YYYY")}</time>}
                {note.readingTime && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                    <Clock className="w-3.5 h-3.5" /> {note.readingTime} min read
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
