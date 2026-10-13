import Link from "next/link";
import { Trophy } from "lucide-react";

export function NotesActionButtons() {
  return (
    <div className="flex flex-wrap items-center gap-2.5 mb-8">
      <Link
        href="/notes/stats"
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground text-xs font-semibold transition-all hover:border-primary/40 shadow-xs group"
      >
        <Trophy className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
        <span>Learning Stats & Streaks</span>
      </Link>
    </div>
  );
}
