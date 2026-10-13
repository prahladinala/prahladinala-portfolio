"use client";

import { useEffect, useState, useRef } from "react";
import { STORAGE_KEYS } from "@/config/constants";
import { Trash2, StickyNote, X, Check } from "lucide-react";

export type HighlightItem = {
  id: string;
  text: string;
  color: "yellow" | "emerald" | "cyan" | "violet";
  note?: string;
  createdAt: string;
};

const COLOR_CLASSES: Record<HighlightItem["color"], string> = {
  yellow: "bg-yellow-300/40 text-yellow-950 dark:bg-yellow-500/30 dark:text-yellow-200 border-b-2 border-yellow-500/60",
  emerald: "bg-emerald-300/40 text-emerald-950 dark:bg-emerald-500/30 dark:text-emerald-200 border-b-2 border-emerald-500/60",
  cyan: "bg-cyan-300/40 text-cyan-950 dark:bg-cyan-500/30 dark:text-cyan-200 border-b-2 border-cyan-500/60",
  violet: "bg-purple-300/40 text-purple-950 dark:bg-purple-500/30 dark:text-purple-200 border-b-2 border-purple-500/60",
};

export function NoteHighlighter() {
  const [activeHighlight, setActiveHighlight] = useState<{
    item: HighlightItem;
    x: number;
    y: number;
  } | null>(null);
  const [editingNote, setEditingNote] = useState("");

  const applyHighlights = () => {
    const contentEl = document.getElementById("note-content");
    if (!contentEl) return;

    try {
      const path = window.location.pathname;
      const allHighlights: Record<string, HighlightItem[]> = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.noteHighlights) || "{}"
      );
      const items = allHighlights[path] || [];

      // First remove existing mark elements that we injected
      const existingMarks = contentEl.querySelectorAll("mark[data-prahlad-highlight]");
      existingMarks.forEach((mark) => {
        const parent = mark.parentNode;
        if (parent) {
          while (mark.firstChild) {
            parent.insertBefore(mark.firstChild, mark);
          }
          parent.removeChild(mark);
        }
      });
      contentEl.normalize();

      if (items.length === 0) return;

      // Apply marks to text nodes
      items.forEach((item) => {
        if (!item.text || item.text.trim().length < 2) return;

        const searchText = item.text.trim();
        const walker = document.createTreeWalker(contentEl, NodeFilter.SHOW_TEXT);
        let node: Text | null = walker.nextNode() as Text | null;

        while (node) {
          const text = node.nodeValue || "";
          const idx = text.indexOf(searchText);

          if (idx !== -1 && node.parentElement && !node.parentElement.closest("pre, code, mark")) {
            const range = document.createRange();
            range.setStart(node, idx);
            range.setEnd(node, idx + searchText.length);

            const mark = document.createElement("mark");
            mark.setAttribute("data-prahlad-highlight", item.id);
            mark.className = `cursor-pointer transition-colors px-0.5 rounded-xs ${
              COLOR_CLASSES[item.color] || COLOR_CLASSES.yellow
            }`;
            mark.title = item.note ? `Note: ${item.note}` : "Click to view note or remove highlight";

            try {
              range.surroundContents(mark);
              break; // Found and highlighted
            } catch (err) {
              // If cross-boundary, skip gracefully
            }
          }
          node = walker.nextNode() as Text | null;
        }
      });
    } catch (e) {
      console.error("Failed to render highlights", e);
    }
  };

  useEffect(() => {
    // Initial apply after brief delay for MDX DOM rendering
    const timer = setTimeout(applyHighlights, 300);

    const handleUpdate = () => {
      applyHighlights();
    };

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("mark[data-prahlad-highlight]") as HTMLElement | null;
      if (target) {
        const id = target.getAttribute("data-prahlad-highlight");
        const path = window.location.pathname;
        const allHighlights: Record<string, HighlightItem[]> = JSON.parse(
          localStorage.getItem(STORAGE_KEYS.noteHighlights) || "{}"
        );
        const item = (allHighlights[path] || []).find((h) => h.id === id);
        if (item) {
          const rect = target.getBoundingClientRect();
          setActiveHighlight({
            item,
            x: rect.left + rect.width / 2,
            y: rect.bottom + window.scrollY + 8,
          });
          setEditingNote(item.note || "");
        }
      } else if (!(e.target as HTMLElement)?.closest("#highlight-tooltip")) {
        setActiveHighlight(null);
      }
    };

    window.addEventListener("prahlad-highlights-updated", handleUpdate);
    document.addEventListener("click", handleClick);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("prahlad-highlights-updated", handleUpdate);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleDeleteHighlight = () => {
    if (!activeHighlight) return;
    try {
      const path = window.location.pathname;
      const allHighlights: Record<string, HighlightItem[]> = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.noteHighlights) || "{}"
      );
      allHighlights[path] = (allHighlights[path] || []).filter(
        (h) => h.id !== activeHighlight.item.id
      );
      localStorage.setItem(STORAGE_KEYS.noteHighlights, JSON.stringify(allHighlights));
      setActiveHighlight(null);
      applyHighlights();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveNote = () => {
    if (!activeHighlight) return;
    try {
      const path = window.location.pathname;
      const allHighlights: Record<string, HighlightItem[]> = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.noteHighlights) || "{}"
      );
      allHighlights[path] = (allHighlights[path] || []).map((h) =>
        h.id === activeHighlight.item.id ? { ...h, note: editingNote } : h
      );
      localStorage.setItem(STORAGE_KEYS.noteHighlights, JSON.stringify(allHighlights));
      setActiveHighlight(null);
      applyHighlights();
    } catch (e) {
      console.error(e);
    }
  };

  if (!activeHighlight) return null;

  return (
    <div
      id="highlight-tooltip"
      className="absolute z-[9999] p-3 w-72 bg-popover text-popover-foreground border border-border shadow-2xl rounded-xl animate-in fade-in zoom-in-95 duration-150"
      style={{
        left: `${activeHighlight.x}px`,
        top: `${activeHighlight.y}px`,
        transform: "translateX(-50%)",
      }}
    >
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/50">
        <span className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground">
          <StickyNote className="w-3.5 h-3.5 text-primary" /> Sticky Note
        </span>
        <button
          onClick={handleDeleteHighlight}
          className="text-xs text-destructive hover:bg-destructive/10 p-1 rounded-md transition-colors flex items-center gap-1"
          title="Delete highlight"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Remove</span>
        </button>
      </div>

      <textarea
        value={editingNote}
        onChange={(e) => setEditingNote(e.target.value)}
        placeholder="Add your personal notes or insights..."
        className="w-full text-xs bg-muted/40 border border-border rounded-lg p-2 resize-none focus:outline-hidden focus:ring-1 focus:ring-primary h-20 text-foreground"
      />

      <div className="flex justify-end gap-1.5 mt-2">
        <button
          onClick={() => setActiveHighlight(null)}
          className="px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveNote}
          className="px-2.5 py-1 text-xs bg-primary text-primary-foreground font-semibold rounded-md shadow-xs hover:bg-primary/90 transition-colors flex items-center gap-1"
        >
          <Check className="w-3 h-3" /> Save Note
        </button>
      </div>
    </div>
  );
}
