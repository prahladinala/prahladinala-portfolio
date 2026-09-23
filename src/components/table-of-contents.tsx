"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type TOCItem = {
  id: string;
  text: string;
  level: number;
};

export function TableOfContents() {
  const [items, setItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Find all h2 and h3 elements inside the note content
    const elements = Array.from(document.querySelectorAll("#note-content h2, #note-content h3"));
    const tocItems = elements.map((el) => ({
      id: el.id,
      text: el.textContent || "",
      level: Number(el.tagName.charAt(1)),
    }));
    
    setItems(tocItems);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="hidden xl:block w-64 shrink-0 print:hidden">
      <div className="sticky top-24 pl-4 border-l border-border/40">
        <h4 className="font-semibold text-sm tracking-tight mb-4 uppercase text-muted-foreground">
          On this page
        </h4>
        <ul className="space-y-2.5 text-sm">
          {items.map((item) => (
            <li
              key={item.id}
              className={cn(
                "transition-colors line-clamp-2",
                item.level === 3 ? "ml-4" : "",
                activeId === item.id 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <a href={`#${item.id}`} className="block">
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
