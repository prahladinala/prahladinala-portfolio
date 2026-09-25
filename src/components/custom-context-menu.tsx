"use client";
import { STORAGE_KEYS } from "@/config/constants";

import { useEffect, useState, useRef } from "react";
import { Copy, Share2, ExternalLink, Check, CheckCircle, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

export function CustomContextMenu() {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [targetUrl, setTargetUrl] = useState<string | null>(null);
  const [targetText, setTargetText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Note-specific states
  const [isNote, setIsNote] = useState(false);
  const [notePath, setNotePath] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest("a");
      
      if (anchor && anchor.href) {
        e.preventDefault();
        
        const url = new URL(anchor.href);
        const path = url.pathname;
        const isNoteLink = /^\/notes\/[^\/]+\/[^\/]+$/.test(path);
        
        setTargetUrl(anchor.href);
        setTargetText(anchor.textContent?.trim() || "Link");
        setIsNote(isNoteLink);
        setNotePath(isNoteLink ? path : null);

        if (isNoteLink) {
          try {
            const completed = JSON.parse(localStorage.getItem(STORAGE_KEYS.completedNotes) || "[]");
            const bookmarked = JSON.parse(localStorage.getItem(STORAGE_KEYS.bookmarkedNotes) || "[]");
            setIsCompleted(completed.includes(path));
            setIsBookmarked(bookmarked.includes(path));
          } catch (err) {
            console.error(err);
          }
        }
        
        let x = e.clientX;
        let y = e.clientY;
        const menuWidth = 200;
        const menuHeight = isNoteLink ? 200 : 120; // taller if note options are present
        
        if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 10;
        if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 10;
        
        setPos({ x, y });
        setShow(true);
        setCopied(false);
      } else {
        setShow(false);
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) return;
      setShow(false);
    };

    const handleScroll = () => setShow(false);

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleCopyLink = async () => {
    if (!targetUrl) return;
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setShow(false), 1000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    if (!targetUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: targetText || "Check out this link",
          url: targetUrl,
        });
      } else {
        await navigator.clipboard.writeText(targetUrl);
        setCopied(true);
      }
      setTimeout(() => setShow(false), 1000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenNewTab = () => {
    if (targetUrl) {
      window.open(targetUrl, "_blank");
      setShow(false);
    }
  };

  const toggleComplete = () => {
    if (!notePath) return;
    try {
      const completed = JSON.parse(localStorage.getItem(STORAGE_KEYS.completedNotes) || "[]");
      const newCompleted = isCompleted 
        ? completed.filter((p: string) => p !== notePath)
        : [...completed, notePath];
      
      localStorage.setItem(STORAGE_KEYS.completedNotes, JSON.stringify(newCompleted));
      window.dispatchEvent(new Event("prahlad-notes-updated"));
      setShow(false);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleBookmark = () => {
    if (!notePath) return;
    try {
      const bookmarked = JSON.parse(localStorage.getItem(STORAGE_KEYS.bookmarkedNotes) || "[]");
      const newBookmarked = isBookmarked 
        ? bookmarked.filter((p: string) => p !== notePath)
        : [...bookmarked, notePath];
      
      localStorage.setItem(STORAGE_KEYS.bookmarkedNotes, JSON.stringify(newBookmarked));
      window.dispatchEvent(new Event("prahlad-notes-updated"));
      setShow(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!show) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-[9999] w-52 bg-zinc-900/95 dark:bg-zinc-100/95 backdrop-blur-md text-zinc-100 dark:text-zinc-900 rounded-xl shadow-2xl border border-zinc-800 dark:border-zinc-300 py-1.5 px-1.5 animate-in fade-in zoom-in-95 duration-150"
      style={{ top: `${pos.y}px`, left: `${pos.x}px` }}
    >
      <div className="px-2 py-1.5 mb-1 border-b border-zinc-800 dark:border-zinc-300">
        <p className="text-[10px] font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500 truncate">
          {isNote ? "Note Actions" : (targetText || "Link Actions")}
        </p>
      </div>

      {isNote && (
        <>
          <button
            onClick={toggleComplete}
            className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-xs font-medium text-left"
          >
            {isCompleted ? "Mark Unread" : "Mark Complete"}
            <CheckCircle className={cn("w-3.5 h-3.5", isCompleted ? "text-green-500" : "opacity-70")} />
          </button>
          <button
            onClick={toggleBookmark}
            className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-xs font-medium text-left"
          >
            {isBookmarked ? "Remove Bookmark" : "Bookmark Note"}
            <Bookmark className={cn("w-3.5 h-3.5", isBookmarked ? "fill-current text-primary" : "opacity-70")} />
          </button>
          
          <div className="h-px bg-zinc-800 dark:bg-zinc-300 my-1 mx-1" />
        </>
      )}

      <button
        onClick={handleOpenNewTab}
        className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-xs font-medium text-left"
      >
        Open in New Tab
        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
      </button>

      <button
        onClick={handleCopyLink}
        className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-xs font-medium text-left"
      >
        {copied ? "Copied!" : "Copy Link"}
        {copied ? <Check className="w-3.5 h-3.5 text-green-400 dark:text-green-600" /> : <Copy className="w-3.5 h-3.5 opacity-70" />}
      </button>

      <button
        onClick={handleShare}
        className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-xs font-medium text-left"
      >
        Share Link
        <Share2 className="w-3.5 h-3.5 opacity-70" />
      </button>
    </div>
  );
}
