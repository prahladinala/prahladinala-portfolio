"use client";

import { useEffect, useState } from "react";
import { Copy, Share2, Check, Sparkles, StickyNote, Image as ImageIcon } from "lucide-react";
import { STORAGE_KEYS } from "@/config/constants";
import { QuoteCardModal } from "@/components/notes/quote-card-modal";
import { HighlightItem } from "@/components/notes/note-highlighter";

export function TextSelectionMenu() {
  const [selection, setSelection] = useState("");
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [stickyNoteText, setStickyNoteText] = useState("");
  const [selectedColor, setSelectedColor] = useState<HighlightItem["color"]>("yellow");

  useEffect(() => {
    const handleSelection = () => {
      // Small delay to allow the DOM selection to settle
      setTimeout(() => {
        const activeSelection = window.getSelection();
        if (!activeSelection || activeSelection.isCollapsed) {
          if (!showNoteInput) setShow(false);
          return;
        }

        const text = activeSelection.toString().trim();
        if (!text || text.length < 2) {
          if (!showNoteInput) setShow(false);
          return;
        }

        const range = activeSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        if (rect.width === 0 && rect.height === 0) return;

        setSelection(text);
        setPosition({
          top: Math.max(10, rect.top - 54),
          left: rect.left + rect.width / 2,
        });
        setShow(true);
        setCopied(false);
      }, 50);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if ((e.target as Element).closest("#custom-selection-menu")) return;
      if (!showNoteInput) setShow(false);
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("keyup", handleSelection);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("keyup", handleSelection);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [showNoteInput]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selection);
      setCopied(true);
      setTimeout(() => setShow(false), 1500);
    } catch (e) {
      console.error("Failed to copy text", e);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          text: `"${selection}"\n\n— Read more at ${window.location.href}`,
        });
        setShow(false);
      } else {
        const text = encodeURIComponent(`"${selection}"\n\n${window.location.href}`);
        window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
        setShow(false);
      }
    } catch (e) {
      console.error("Failed to share", e);
    }
  };

  const handleHighlight = (color: HighlightItem["color"]) => {
    try {
      const path = window.location.pathname;
      const allHighlights: Record<string, HighlightItem[]> = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.noteHighlights) || "{}"
      );
      const items = allHighlights[path] || [];

      const newItem: HighlightItem = {
        id: `hl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        text: selection,
        color,
        note: stickyNoteText.trim() || undefined,
        createdAt: new Date().toISOString(),
      };

      allHighlights[path] = [...items, newItem];
      localStorage.setItem(STORAGE_KEYS.noteHighlights, JSON.stringify(allHighlights));
      window.dispatchEvent(new CustomEvent("prahlad-highlights-updated"));

      setShow(false);
      setShowNoteInput(false);
      setStickyNoteText("");
      window.getSelection()?.removeAllRanges();
    } catch (e) {
      console.error(e);
    }
  };

  if (!show && !quoteModalOpen) return null;

  return (
    <>
      {show && (
        <div
          id="custom-selection-menu"
          className="fixed z-[9999] flex flex-col items-center bg-zinc-950 dark:bg-white text-zinc-100 dark:text-zinc-900 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-150 pointer-events-auto border border-zinc-800 dark:border-zinc-200 print:hidden p-1"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          {showNoteInput ? (
            <div className="flex flex-col gap-2 p-2 w-64">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1">
                  <StickyNote className="w-3.5 h-3.5" /> Attach Sticky Note
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
                      } ${selectedColor === c ? "scale-125 ring-2 ring-white dark:ring-zinc-900" : "opacity-60"}`}
                    />
                  ))}
                </div>
              </div>
              <textarea
                value={stickyNoteText}
                onChange={(e) => setStickyNoteText(e.target.value)}
                placeholder="Write your note..."
                autoFocus
                className="w-full text-xs p-2 rounded-md bg-zinc-900 dark:bg-zinc-100 border border-zinc-700 dark:border-zinc-300 resize-none h-16 focus:outline-hidden text-zinc-100 dark:text-zinc-900"
              />
              <div className="flex justify-end gap-1.5">
                <button
                  onClick={() => setShowNoteInput(false)}
                  className="px-2 py-1 text-xs text-zinc-400 hover:text-white dark:text-zinc-600 dark:hover:text-zinc-900"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleHighlight(selectedColor)}
                  className="px-2.5 py-1 text-xs bg-primary text-primary-foreground font-semibold rounded-md shadow-xs"
                >
                  Save & Highlight
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-0.5">
              {/* Highlight color quick buttons */}
              <div className="flex items-center gap-1 px-1.5 border-r border-zinc-800 dark:border-zinc-200">
                <button
                  onClick={() => handleHighlight("yellow")}
                  className="w-4 h-4 rounded-full bg-yellow-400 hover:scale-125 transition-transform"
                  title="Highlight Yellow"
                />
                <button
                  onClick={() => handleHighlight("emerald")}
                  className="w-4 h-4 rounded-full bg-emerald-400 hover:scale-125 transition-transform"
                  title="Highlight Emerald"
                />
                <button
                  onClick={() => handleHighlight("cyan")}
                  className="w-4 h-4 rounded-full bg-cyan-400 hover:scale-125 transition-transform"
                  title="Highlight Cyan"
                />
                <button
                  onClick={() => handleHighlight("violet")}
                  className="w-4 h-4 rounded-full bg-purple-400 hover:scale-125 transition-transform"
                  title="Highlight Violet"
                />
              </div>

              {/* Sticky Note */}
              <button
                onClick={() => setShowNoteInput(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors text-xs font-semibold tracking-wide"
                title="Add Sticky Note"
              >
                <StickyNote className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Note</span>
              </button>

              <div className="w-px h-3.5 bg-zinc-800 dark:border-zinc-200" />

              {/* Quote Card Generator */}
              <button
                onClick={() => {
                  setQuoteModalOpen(true);
                  setShow(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors text-xs font-semibold tracking-wide"
                title="Generate Social Quote Card"
              >
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Quote Card</span>
              </button>

              <div className="w-px h-3.5 bg-zinc-800 dark:border-zinc-200" />

              {/* Copy */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors text-xs font-semibold tracking-wide"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>

              <div className="w-px h-3.5 bg-zinc-800 dark:border-zinc-200" />

              {/* Share */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors text-xs font-semibold tracking-wide"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          )}

          {/* Decorative pointer arrow */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-zinc-950 dark:bg-white rotate-45 border-r border-b border-zinc-800 dark:border-zinc-200 pointer-events-none" />
        </div>
      )}

      {/* Quote Card Modal */}
      <QuoteCardModal
        open={quoteModalOpen}
        onOpenChange={setQuoteModalOpen}
        quote={selection}
        noteTitle={typeof document !== "undefined" ? document.title.split("|")[0].trim() : undefined}
      />
    </>
  );
}
