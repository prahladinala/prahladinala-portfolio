"use client";

import { useEffect, useState } from "react";
import { Copy, Share2, Check } from "lucide-react";

export function TextSelectionMenu() {
  const [selection, setSelection] = useState("");
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleSelection = () => {
      // Small delay to allow the DOM selection to settle
      setTimeout(() => {
        const activeSelection = window.getSelection();
        if (!activeSelection || activeSelection.isCollapsed) {
          setShow(false);
          return;
        }

        const text = activeSelection.toString().trim();
        if (!text || text.length < 2) {
          setShow(false);
          return;
        }

        const range = activeSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Don't show if the selection box is essentially empty or invisible
        if (rect.width === 0 && rect.height === 0) return;

        setSelection(text);
        setPosition({
          top: Math.max(10, rect.top - 50), // 50px above, with a 10px screen edge buffer
          left: rect.left + rect.width / 2, // Centered over selection
        });
        setShow(true);
        setCopied(false);
      }, 50);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if ((e.target as Element).closest('#custom-selection-menu')) return;
      setShow(false);
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("keyup", handleSelection);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("keyup", handleSelection);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

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
        // Fallback for desktop browsers without Web Share API
        const text = encodeURIComponent(`"${selection}"\n\n${window.location.href}`);
        window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
        setShow(false);
      }
    } catch (e) {
      console.error("Failed to share", e);
    }
  };

  if (!show) return null;

  return (
    <div
      id="custom-selection-menu"
      className="fixed z-[9999] flex items-center gap-0.5 px-1 py-1 bg-zinc-900 dark:bg-white text-zinc-100 dark:text-zinc-900 rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 pointer-events-auto border border-zinc-800 dark:border-zinc-200 print:hidden"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: "translate(-50%, 0)",
      }}
    >
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors text-xs font-semibold tracking-wide"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-400 dark:text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? "Copied" : "Copy"}
      </button>
      
      <div className="w-px h-4 bg-zinc-700 dark:bg-zinc-300 mx-1" />
      
      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors text-xs font-semibold tracking-wide"
      >
        <Share2 className="w-3.5 h-3.5" />
        Share
      </button>
      
      {/* Decorative pointer arrow at the bottom center */}
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-zinc-900 dark:bg-white rotate-45 border-r border-b border-zinc-800 dark:border-zinc-200 pointer-events-none" />
    </div>
  );
}
