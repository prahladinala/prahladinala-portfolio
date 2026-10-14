"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabItem = {
  label: string;
  content: string;
};

export type TabsProps = {
  items?: TabItem[];
  defaultValue?: string;
};

export function Tabs({ items = [], defaultValue }: TabsProps) {
  const initialIndex = defaultValue
    ? Math.max(0, items.findIndex((it) => it.label.toLowerCase() === defaultValue.toLowerCase()))
    : 0;
  const [activeTab, setActiveTab] = useState(initialIndex);
  const [copied, setCopied] = useState(false);

  if (items.length === 0) return null;

  const currentItem = items[activeTab] || items[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentItem.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy tab content", e);
    }
  };

  return (
    <div className="my-6 rounded-2xl border border-border/80 bg-[#0d1117] text-white shadow-md overflow-hidden">
      {/* Tab Header */}
      <div className="flex items-center justify-between border-b border-border/40 bg-[#161b22] px-3">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1.5">
          {items.map((tab, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all select-none whitespace-nowrap",
                  isActive
                    ? "bg-[#21262d] text-white shadow-xs border border-border/60"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/10 transition-colors shrink-0"
          title="Copy to clipboard"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 overflow-x-auto text-sm font-mono leading-relaxed bg-[#0d1117] text-gray-200">
        <pre className="m-0 p-0 bg-transparent border-0 font-inherit whitespace-pre-wrap">
          <code>{currentItem.content}</code>
        </pre>
      </div>
    </div>
  );
}
