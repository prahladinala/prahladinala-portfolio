"use client";

import { useState } from "react";
import Link from "next/link";
import { Network, Trophy, Sparkles } from "lucide-react";
import { KnowledgeGraphModal } from "./knowledge-graph-modal";

export function NotesActionButtons() {
  const [graphOpen, setGraphOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2.5 mb-8">
        <button
          onClick={() => setGraphOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground text-xs font-semibold transition-all hover:border-primary/40 shadow-xs group"
        >
          <Network className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
          <span>Knowledge Graph</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 font-bold">
            Interactive
          </span>
        </button>

        <Link
          href="/notes/stats"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground text-xs font-semibold transition-all hover:border-primary/40 shadow-xs group"
        >
          <Trophy className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          <span>Learning Stats & Streaks</span>
        </Link>
      </div>

      <KnowledgeGraphModal open={graphOpen} onOpenChange={setGraphOpen} />
    </>
  );
}
