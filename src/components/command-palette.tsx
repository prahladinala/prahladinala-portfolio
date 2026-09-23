"use client";

import { useEffect, useState, useMemo } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { FileText, Mail, Briefcase, PenTool, Search, BookOpen, Hash } from "lucide-react";
import { Linkedin, Github, Twitter, Medium } from "@/components/icons";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Fuse from "fuse.js";
import type { Socials } from "@/lib/keystatic-data";

type NoteIndex = {
  title: string;
  description: string;
  slug: string;
  topic: string;
  tags?: string[];
};

export function CommandPalette({ socials }: { socials: Socials | null }) {
  if (!socials) socials = { email: '', github: '', linkedin: '', twitter: '', medium: '' };
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState<NoteIndex[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch search index when palette is opened for the first time
    if (open && notes.length === 0) {
      fetch("/api/search")
        .then((res) => res.json())
        .then((data) => setNotes(data))
        .catch((err) => console.error("Failed to fetch search index", err));
    }
  }, [open, notes.length]);

  const fuse = useMemo(() => new Fuse(notes, {
    keys: [
      { name: 'title', weight: 3 },
      { name: 'topic', weight: 2 },
      { name: 'tags', weight: 2 },
      { name: 'description', weight: 1 }
    ],
    threshold: 0.4,
  }), [notes]);

  const searchResults = useMemo(() => {
    if (!query) return notes;
    return fuse.search(query).map(result => result.item);
  }, [query, fuse, notes]);

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  const handleNavigate = (href: string) => {
    if (href.startsWith("http")) {
      window.open(href, "_blank");
    } else if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(href);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 overflow-hidden shadow-2xl rounded-xl max-w-2xl border-border bg-background">
        <VisuallyHidden>
          <DialogTitle>Command Palette</DialogTitle>
        </VisuallyHidden>
        <Command 
          className="w-full flex flex-col overflow-hidden bg-background"
          shouldFilter={false} // Disable cmdk default filter to use Fuse.js
        >
          <div className="flex items-center border-b border-border px-3" cmdk-input-wrapper="">
            <Search className="mr-2 h-5 w-5 shrink-0 opacity-50" />
            <Command.Input 
              value={query}
              onValueChange={setQuery}
              placeholder="Type a command or search notes..." 
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-none ring-0 focus:ring-0"
            />
          </div>
          <Command.List className="max-h-[400px] overflow-y-auto p-2 scroll-py-2 hide-scrollbar">
            {query.length > 0 && searchResults.length === 0 && (
              <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </Command.Empty>
            )}
            
            {/* Notes Search Results */}
            {searchResults.length > 0 && (
              <Command.Group heading={query ? "Search Results" : "All Notes"} className="text-xs font-medium text-muted-foreground px-2 py-1.5 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
                {searchResults.map((note) => (
                  <Command.Item 
                    key={note.slug}
                    onSelect={() => runCommand(() => handleNavigate(`/notes/${note.topic}/${note.slug}`))}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col flex-1 truncate">
                      <span className="truncate">{note.title}</span>
                      <span className="text-xs text-muted-foreground truncate flex items-center gap-2">
                        <span className="capitalize">{note.topic}</span>
                      </span>
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {query.length === 0 && (
              <>
                <Command.Separator className="h-px bg-border my-1" />
                <Command.Group heading="Navigation" className="text-xs font-medium text-muted-foreground px-2 py-1.5 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
                  <Command.Item 
                    onSelect={() => runCommand(() => handleNavigate("#projects"))}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    <span>Projects</span>
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => handleNavigate("#blog"))}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <PenTool className="mr-2 h-4 w-4" />
                    <span>Blogs</span>
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => handleNavigate("#contact"))}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Contact</span>
                  </Command.Item>
                </Command.Group>
                
                <Command.Separator className="h-px bg-border my-1" />
                
                <Command.Group heading="Links" className="text-xs font-medium text-muted-foreground px-2 py-1.5 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
                  <Command.Item 
                    onSelect={() => runCommand(() => handleNavigate("/resume"))}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Download Resume</span>
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => handleNavigate(socials.github))}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    <span>GitHub Profile</span>
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => handleNavigate(socials.linkedin))}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <Linkedin className="mr-2 h-4 w-4" />
                    <span>LinkedIn Profile</span>
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => handleNavigate(socials.twitter))}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <Twitter className="mr-2 h-4 w-4" />
                    <span>Twitter Profile</span>
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => handleNavigate(socials.medium))}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <Medium className="mr-2 h-4 w-4" />
                    <span>Medium Profile</span>
                  </Command.Item>
                </Command.Group>
              </>
            )}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

