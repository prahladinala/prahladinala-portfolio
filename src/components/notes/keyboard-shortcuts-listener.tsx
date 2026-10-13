"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { KeyboardShortcutsModal } from "./keyboard-shortcuts-modal";
import { STORAGE_KEYS } from "@/config/constants";

export function NotesKeyboardShortcuts() {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const { theme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in form inputs, textareas, or contentEditable
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      // Modifier keys check: don't trigger if Ctrl/Cmd/Alt is pressed (except for standard browser shortcuts)
      if (e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }

      const key = e.key;

      if (key === "?") {
        e.preventDefault();
        setModalOpen((prev) => !prev);
        return;
      }

      if (key === "z" || key === "Z") {
        e.preventDefault();
        // Toggle focus theme
        if (theme === "focus" || resolvedTheme === "focus") {
          const prev = localStorage.getItem("prahlad-last-theme") || "system";
          setTheme(prev === "focus" ? "system" : prev);
        } else {
          localStorage.setItem("prahlad-last-theme", theme || "system");
          setTheme("focus");
        }
        return;
      }

      if (key === "j" || key === "J") {
        // Next note in series
        const nextLink = document.getElementById("next-note-link") as HTMLAnchorElement | null;
        if (nextLink && nextLink.href) {
          e.preventDefault();
          nextLink.click();
        }
        return;
      }

      if (key === "k" || key === "K") {
        // Previous note in series
        const prevLink = document.getElementById("prev-note-link") as HTMLAnchorElement | null;
        if (prevLink && prevLink.href) {
          e.preventDefault();
          prevLink.click();
        }
        return;
      }

      if (key === "[" || key === "]") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("prahlad-toggle-sidebar"));
        return;
      }

      if (key === "t" || key === "T") {
        e.preventDefault();
        // Scroll to table of contents or first heading
        const tocElement = document.querySelector("#table-of-contents, #note-content h2");
        if (tocElement) {
          tocElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        return;
      }

      if (key === "b" || key === "B") {
        e.preventDefault();
        // Trigger bookmark button if on note page
        const bookmarkBtn = document.querySelector(
          'button[aria-label="Save Bookmark"], button[aria-label="Remove Bookmark"]'
        ) as HTMLButtonElement | null;
        if (bookmarkBtn) {
          bookmarkBtn.click();
        }
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [theme, resolvedTheme, setTheme, router]);

  return <KeyboardShortcutsModal open={modalOpen} onOpenChange={setModalOpen} />;
}
