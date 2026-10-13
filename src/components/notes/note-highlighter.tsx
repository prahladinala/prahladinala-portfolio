"use client";

import { useEffect, useState, useCallback } from "react";
import { STORAGE_KEYS } from "@/config/constants";
import { Trash2, StickyNote, X, Check, Copy, ExternalLink, BookmarkCheck } from "lucide-react";

export type HighlightItem = {
  id: string;
  text: string;
  color: "yellow" | "emerald" | "cyan" | "violet";
  note?: string;
  createdAt: string;
};

const COLOR_CLASSES: Record<HighlightItem["color"], string> = {
  yellow: "bg-yellow-300/40 text-yellow-950 dark:bg-yellow-500/30 dark:text-yellow-200 border-b-2 border-yellow-500/70",
  emerald: "bg-emerald-300/40 text-emerald-950 dark:bg-emerald-500/30 dark:text-emerald-200 border-b-2 border-emerald-500/70",
  cyan: "bg-cyan-300/40 text-cyan-950 dark:bg-cyan-500/30 dark:text-cyan-200 border-b-2 border-cyan-500/70",
  violet: "bg-purple-300/40 text-purple-950 dark:bg-purple-500/30 dark:text-purple-200 border-b-2 border-purple-500/70",
};

export function NoteHighlighter() {
  const [activeHighlight, setActiveHighlight] = useState<{
    item: HighlightItem;
    x: number;
    y: number;
    placement: "top" | "bottom";
  } | null>(null);
  const [editingNote, setEditingNote] = useState("");
  const [selectedColor, setSelectedColor] = useState<HighlightItem["color"]>("yellow");
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const getNormalizedPath = useCallback(() => {
    if (typeof window === "undefined") return "";
    return window.location.pathname.replace(/\/$/, "") || "/";
  }, []);

  const loadHighlights = useCallback(() => {
    try {
      const path = getNormalizedPath();
      const all: Record<string, HighlightItem[]> = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.noteHighlights) || "{}"
      );
      return all[path] || [];
    } catch {
      return [];
    }
  }, [getNormalizedPath]);

  const applyHighlightsToDom = useCallback(() => {
    const contentEl = document.getElementById("note-content");
    if (!contentEl) return;

    try {
      const items = loadHighlights();
      setHighlights(items);

      // 1. Remove existing marks
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

      // 2. Multi-segment highlight applicator
      items.forEach((item) => {
        if (!item.text || item.text.trim().length < 2) return;
        const targetText = item.text.trim();

        // Collect text nodes
        const walker = document.createTreeWalker(
          contentEl,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode(node) {
              const parent = node.parentElement;
              if (!parent) return NodeFilter.FILTER_REJECT;
              if (parent.closest("pre, code.hljs, script, style, mark[data-prahlad-highlight]")) {
                return NodeFilter.FILTER_REJECT;
              }
              return NodeFilter.FILTER_ACCEPT;
            },
          }
        );

        const textNodes: Text[] = [];
        let curr: Text | null = walker.nextNode() as Text | null;
        while (curr) {
          textNodes.push(curr);
          curr = walker.nextNode() as Text | null;
        }

        // Build continuous string with character segment mapping
        let fullText = "";
        const segments: { node: Text; start: number; end: number; text: string }[] = [];

        for (const node of textNodes) {
          const str = node.nodeValue || "";
          const start = fullText.length;
          fullText += str;
          const end = fullText.length;
          segments.push({ node, start, end, text: str });
        }

        let matchIndex = fullText.indexOf(targetText);
        if (matchIndex === -1) {
          matchIndex = fullText.toLowerCase().indexOf(targetText.toLowerCase());
        }

        if (matchIndex === -1) return;

        const matchStart = matchIndex;
        const matchEnd = matchIndex + targetText.length;

        // Process overlapping segments in reverse order so splitting later segments does not invalidate earlier offsets
        const overlapping = segments.filter(
          (seg) => seg.start < matchEnd && seg.end > matchStart
        );

        for (let i = overlapping.length - 1; i >= 0; i--) {
          const seg = overlapping[i];
          const segLocalStart = Math.max(0, matchStart - seg.start);
          const segLocalEnd = Math.min(seg.text.length, matchEnd - seg.start);

          if (segLocalStart >= segLocalEnd) continue;

          try {
            const range = document.createRange();
            range.setStart(seg.node, segLocalStart);
            range.setEnd(seg.node, segLocalEnd);

            const mark = document.createElement("mark");
            mark.setAttribute("data-prahlad-highlight", item.id);
            mark.className = `cursor-pointer transition-all px-0.5 rounded-xs ${
              COLOR_CLASSES[item.color] || COLOR_CLASSES.yellow
            } hover:brightness-105`;
            mark.title = item.note ? `Note: ${item.note}` : "Click to view note or remove highlight";

            range.surroundContents(mark);
          } catch (e) {
            console.warn("Could not wrap segment", e);
          }
        }
      });
    } catch (e) {
      console.error("Failed to render highlights", e);
    }
  }, [loadHighlights]);

  useEffect(() => {
    // Initial apply after brief delay for MDX DOM rendering
    const timer = setTimeout(applyHighlightsToDom, 350);

    const handleUpdate = () => {
      applyHighlightsToDom();
    };

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("mark[data-prahlad-highlight]") as HTMLElement | null;
      if (target) {
        const id = target.getAttribute("data-prahlad-highlight");
        const items = loadHighlights();
        const item = items.find((h) => h.id === id);
        if (item) {
          const rect = target.getBoundingClientRect();
          const isNearBottom = rect.bottom > window.innerHeight - 240;
          setActiveHighlight({
            item,
            x: Math.max(160, Math.min(window.innerWidth - 160, rect.left + rect.width / 2)),
            y: isNearBottom ? Math.max(20, rect.top - 12) : Math.min(window.innerHeight - 20, rect.bottom + 12),
            placement: isNearBottom ? "top" : "bottom",
          });
          setEditingNote(item.note || "");
          setSelectedColor(item.color);
        }
      } else if (
        !(e.target as HTMLElement)?.closest("#highlight-tooltip") &&
        !(e.target as HTMLElement)?.closest("#highlights-drawer")
      ) {
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
  }, [applyHighlightsToDom, loadHighlights]);

  const handleDeleteHighlight = (idToDelete?: string) => {
    const id = idToDelete || activeHighlight?.item.id;
    if (!id) return;
    try {
      const path = getNormalizedPath();
      const all: Record<string, HighlightItem[]> = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.noteHighlights) || "{}"
      );
      all[path] = (all[path] || []).filter((h) => h.id !== id);
      localStorage.setItem(STORAGE_KEYS.noteHighlights, JSON.stringify(all));
      if (activeHighlight?.item.id === id) {
        setActiveHighlight(null);
      }
      applyHighlightsToDom();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveNote = () => {
    if (!activeHighlight) return;
    try {
      const path = getNormalizedPath();
      const all: Record<string, HighlightItem[]> = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.noteHighlights) || "{}"
      );
      all[path] = (all[path] || []).map((h) =>
        h.id === activeHighlight.item.id
          ? { ...h, note: editingNote.trim() || undefined, color: selectedColor }
          : h
      );
      localStorage.setItem(STORAGE_KEYS.noteHighlights, JSON.stringify(all));
      setActiveHighlight(null);
      applyHighlightsToDom();
    } catch (e) {
      console.error(e);
    }
  };

  const scrollToHighlight = (id: string) => {
    const mark = document.querySelector(`mark[data-prahlad-highlight="${id}"]`);
    if (mark) {
      mark.scrollIntoView({ behavior: "smooth", block: "center" });
      mark.classList.add("ring-4", "ring-primary", "ring-offset-2");
      setTimeout(() => {
        mark.classList.remove("ring-4", "ring-primary", "ring-offset-2");
      }, 2000);
    }
  };

  const handleCopyAllNotes = async () => {
    try {
      const markdown = highlights
        .map(
          (h, i) =>
            `### Highlight ${i + 1}\n> "${h.text}"\n\n${
              h.note ? `**Note:** ${h.note}\n` : ""
            }`
        )
        .join("\n---\n\n");
      await navigator.clipboard.writeText(markdown);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {/* Floating Sticky Note Popover on Mark Click */}
      {activeHighlight && (
        <div
          id="highlight-tooltip"
          className="fixed z-[9999] p-3.5 w-80 bg-popover text-popover-foreground border border-border shadow-2xl rounded-2xl animate-in fade-in zoom-in-95 duration-150"
          style={{
            left: `${activeHighlight.x}px`,
            top: `${activeHighlight.y}px`,
            transform:
              activeHighlight.placement === "top"
                ? "translate(-50%, -100%)"
                : "translate(-50%, 0)",
          }}
        >
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border/60">
            <span className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
              <StickyNote className="w-3.5 h-3.5 text-amber-500" /> Sticky Note
            </span>
            <div className="flex items-center gap-1">
              {(["yellow", "emerald", "cyan", "violet"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`w-3.5 h-3.5 rounded-full transition-transform ${
                    c === "yellow"
                      ? "bg-amber-400"
                      : c === "emerald"
                      ? "bg-emerald-400"
                      : c === "cyan"
                      ? "bg-cyan-400"
                      : "bg-purple-400"
                  } ${
                    selectedColor === c
                      ? "scale-125 ring-2 ring-primary"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  title={`Color: ${c}`}
                />
              ))}
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground line-clamp-2 italic mb-2 px-1 border-l-2 border-primary/40">
            "{activeHighlight.item.text}"
          </p>

          <textarea
            value={editingNote}
            onChange={(e) => setEditingNote(e.target.value)}
            placeholder="Add your personal insights or notes..."
            className="w-full text-xs bg-muted/40 border border-border rounded-xl p-2.5 resize-none focus:outline-hidden focus:ring-1 focus:ring-primary h-24 text-foreground placeholder:text-muted-foreground/60"
          />

          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/40">
            <button
              onClick={() => handleDeleteHighlight()}
              className="text-xs text-destructive hover:bg-destructive/10 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
              title="Delete highlight"
            >
              <Trash2 className="w-3 h-3" />
              <span>Remove</span>
            </button>

            <div className="flex gap-1.5">
              <button
                onClick={() => setActiveHighlight(null)}
                className="px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-3 py-1 text-xs bg-primary text-primary-foreground font-semibold rounded-lg shadow-xs hover:bg-primary/90 transition-colors flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Pill: Quick Access to Highlights & Notes */}
      {highlights.length > 0 && (
        <div className="fixed bottom-6 right-6 z-[990] print:hidden">
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-background/95 dark:bg-card/95 backdrop-blur-xl border border-border shadow-xl hover:border-primary/50 text-xs font-semibold text-foreground transition-all duration-300 hover:scale-105 group"
            title="View all sticky notes & highlights on this page"
          >
            <StickyNote className="w-4 h-4 text-amber-500 group-hover:rotate-12 transition-transform" />
            <span>Highlights & Notes</span>
            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
              {highlights.length}
            </span>
          </button>
        </div>
      )}

      {/* Side Slide-Over Drawer for All Page Notes */}
      {drawerOpen && (
        <div
          id="highlights-drawer"
          className="fixed inset-y-0 right-0 z-[9999] w-full max-w-md bg-background/95 backdrop-blur-2xl border-l border-border shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300 print:hidden"
        >
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <StickyNote className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-base">My Highlights & Notes</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                {highlights.length}
              </span>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {highlights.map((h, i) => (
              <div
                key={h.id}
                className="p-3.5 rounded-xl border border-border/80 bg-card hover:border-primary/40 transition-colors flex flex-col gap-2 group"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                      h.color === "yellow"
                        ? "bg-amber-500/10 text-amber-500"
                        : h.color === "emerald"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : h.color === "cyan"
                        ? "bg-cyan-500/10 text-cyan-500"
                        : "bg-purple-500/10 text-purple-500"
                    }`}
                  >
                    Highlight #{i + 1}
                  </span>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => scrollToHighlight(h.id)}
                      className="p-1 text-muted-foreground hover:text-primary transition-colors text-xs flex items-center gap-1"
                      title="Jump to highlighted text"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteHighlight(h.id)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors text-xs"
                      title="Delete highlight"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-foreground font-medium italic border-l-2 border-primary/50 pl-2">
                  "{h.text}"
                </p>

                {h.note && (
                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50 text-xs text-foreground">
                    <span className="font-semibold text-muted-foreground text-[10px] uppercase block mb-1">
                      Sticky Note:
                    </span>
                    {h.note}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between gap-2">
            <button
              onClick={handleCopyAllNotes}
              className="flex-1 py-2 px-3 rounded-xl bg-muted/60 hover:bg-muted text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiedAll ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Copied as Markdown!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy All Notes</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
