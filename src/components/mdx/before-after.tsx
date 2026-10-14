"use client";

import { useState } from "react";
import { XCircle, CheckCircle2, Copy, Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type BeforeAfterProps = {
  beforeTitle?: string;
  beforeCode: string;
  afterTitle?: string;
  afterCode: string;
  explanation?: string;
};

export function BeforeAfter({
  beforeTitle = "Don't (Anti-Pattern)",
  beforeCode = "",
  afterTitle = "Do (Recommended)",
  afterCode = "",
  explanation,
}: BeforeAfterProps) {
  const [copiedBefore, setCopiedBefore] = useState(false);
  const [copiedAfter, setCopiedAfter] = useState(false);

  const copyCode = async (code: string, isBefore: boolean) => {
    try {
      await navigator.clipboard.writeText(code);
      if (isBefore) {
        setCopiedBefore(true);
        setTimeout(() => setCopiedBefore(false), 2000);
      } else {
        setCopiedAfter(true);
        setTimeout(() => setCopiedAfter(false), 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="my-8 rounded-2xl border border-border/80 bg-muted/20 p-4 sm:p-5 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Anti-Pattern (Before / Don't) */}
        <div className="rounded-xl border border-rose-500/30 bg-[#0d1117] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-3.5 py-2 bg-rose-500/10 border-b border-rose-500/20">
            <span className="flex items-center gap-1.5 text-xs font-bold text-rose-500 dark:text-rose-400">
              <XCircle className="w-4 h-4" /> {beforeTitle}
            </span>
            <button
              onClick={() => copyCode(beforeCode, true)}
              className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Copy code"
            >
              {copiedBefore ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <div className="p-3.5 font-mono text-xs sm:text-sm text-gray-300 leading-relaxed overflow-x-auto flex-1">
            <pre className="m-0 p-0 bg-transparent border-0 font-inherit whitespace-pre-wrap">
              <code>{beforeCode}</code>
            </pre>
          </div>
        </div>

        {/* Best Practice (After / Do) */}
        <div className="rounded-xl border border-emerald-500/30 bg-[#0d1117] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-3.5 py-2 bg-emerald-500/10 border-b border-emerald-500/20">
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> {afterTitle}
            </span>
            <button
              onClick={() => copyCode(afterCode, false)}
              className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Copy code"
            >
              {copiedAfter ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <div className="p-3.5 font-mono text-xs sm:text-sm text-gray-300 leading-relaxed overflow-x-auto flex-1">
            <pre className="m-0 p-0 bg-transparent border-0 font-inherit whitespace-pre-wrap">
              <code>{afterCode}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Explanation */}
      {explanation && (
        <div className="mt-3.5 flex items-start gap-2 text-xs sm:text-sm text-muted-foreground pt-3 border-t border-border/40">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="m-0 leading-relaxed font-medium">{explanation}</p>
        </div>
      )}
    </div>
  );
}
