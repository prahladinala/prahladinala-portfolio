"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FolderOpen, Folder, CheckCircle, PanelLeftClose, PanelLeftOpen, ChevronDown, ChevronUp, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SidebarProps = {
  topics: {
    name: string;
    notes: { title: string; slug: string }[];
  }[];
};

export function NotesSidebar({ topics }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [completedNotes, setCompletedNotes] = useState<string[]>([]);
  const [bookmarkedNotes, setBookmarkedNotes] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadState = () => {
      try {
        setCompletedNotes(JSON.parse(localStorage.getItem("prahlad-completed-notes") || "[]"));
        const newKeys = JSON.parse(localStorage.getItem("prahlad-bookmarked-notes") || "[]");
        const oldKeys = JSON.parse(localStorage.getItem("prahlad-bookmarks") || "[]");
        setBookmarkedNotes(Array.from(new Set([...newKeys, ...oldKeys])));
      } catch (e) {}
    };
    
    loadState();
    window.addEventListener('prahlad-notes-updated', loadState);
    return () => window.removeEventListener('prahlad-notes-updated', loadState);
  }, []);

  return (
    <aside 
      className={cn(
        "shrink-0 transition-all duration-300 md:border-r border-border mb-6 md:mb-0 print:hidden relative",
        isCollapsed ? "w-full md:w-12 pr-0 md:pr-2" : "w-full md:w-64 lg:w-72 pr-0 md:pr-6"
      )}
      suppressHydrationWarning
    >
      {/* Toggle Button for Desktop */}
      <Button 
        variant="ghost" 
        size="icon"
        className="absolute -right-4 top-24 z-10 hidden md:flex rounded-full border border-border bg-background shadow-sm h-8 w-8 text-muted-foreground hover:text-primary"
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
         {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
      </Button>

      {/* Toggle Button for Mobile */}
      <Button 
        variant="outline" 
        className="w-full flex md:hidden items-center justify-between mb-2"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="flex items-center gap-2 font-semibold">
          <BookOpen className="w-4 h-4 text-primary" /> 
          {isCollapsed ? "View Topics" : "Hide Topics"}
        </span>
        {isCollapsed ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronUp className="w-4 h-4 text-muted-foreground" />}
      </Button>

      <div className={cn(
        "sticky top-24 overflow-hidden transition-all duration-300", 
        isCollapsed ? "max-h-0 md:max-h-none opacity-0 md:opacity-0 md:pointer-events-none" : "max-h-[2000px] opacity-100"
      )}>
        {/* Fixed width inner wrapper to prevent text squishing during animation */}
        <div className="w-[calc(100vw-2rem)] md:w-[232px] lg:w-[264px] pt-4 md:pt-0">
          <Link href="/notes" className="hidden md:flex items-center gap-3 mb-8 group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Digital Notes</h2>
          </Link>
          
          <div className="space-y-2">
            <Link 
              href="/notes/bookmarks"
              className={cn(
                "font-semibold text-sm flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all mb-4",
                pathname === "/notes/bookmarks" 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Bookmark className={cn("w-4 h-4", pathname === "/notes/bookmarks" ? "fill-current" : "")} />
              Bookmarks
            </Link>

            {topics.length === 0 ? (
              <p className="text-sm text-muted-foreground px-3">No topics found.</p>
            ) : (
              topics.map((topic) => {
                const isTopicActive = pathname?.startsWith(`/notes/${topic.name}`) ?? false;
                
                return (
                  <div key={topic.name} className="flex flex-col gap-1">
                    <Link 
                      href={`/notes/${topic.name}`}
                      className={cn(
                        "font-semibold text-sm capitalize flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                        isTopicActive 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {isTopicActive ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
                      {topic.name}
                    </Link>
                    
                    {isTopicActive && (
                      <ul className="space-y-1 mt-1 mb-3 ml-5 pl-4 border-l border-border/50">
                        {topic.notes.map((note) => {
                          const notePath = `/notes/${topic.name}/${note.slug}`;
                          const isNoteActive = pathname === notePath;
                          const isNoteCompleted = completedNotes.includes(notePath);
                          const isNoteBookmarked = bookmarkedNotes.includes(notePath);
                          
                          return (
                            <li key={note.slug}>
                              <Link 
                                href={notePath}
                                className={cn(
                                  "text-sm flex items-center justify-between px-3 py-1.5 rounded-md transition-all group",
                                  isNoteActive 
                                    ? "bg-primary text-primary-foreground font-medium shadow-sm" 
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                              >
                                <span className="line-clamp-1">{note.title}</span>
                                {mounted && (isNoteCompleted || isNoteBookmarked) && (
                                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                    {isNoteBookmarked && (
                                      <Bookmark className={cn(
                                        "w-3.5 h-3.5 fill-current",
                                        isNoteActive ? "text-primary-foreground/90" : "text-primary"
                                      )} />
                                    )}
                                    {isNoteCompleted && (
                                      <CheckCircle className={cn(
                                        "w-3.5 h-3.5", 
                                        isNoteActive ? "text-primary-foreground/90" : "text-green-500/80"
                                      )} />
                                    )}
                                  </div>
                                )}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
