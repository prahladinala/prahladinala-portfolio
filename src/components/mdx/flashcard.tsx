"use client";

import { useState } from "react";
import { HelpCircle, RotateCw, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type FlashcardProps = {
  question: string;
  answer: string;
  hint?: string;
};

export function Flashcard({ question, answer, hint }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [mastered, setMastered] = useState<boolean | null>(null);

  return (
    <div className="my-8 max-w-xl mx-auto select-none [perspective:1000px]">
      <div
        onClick={() => setIsFlipped((prev) => !prev)}
        className={cn(
          "relative w-full min-h-[220px] rounded-2xl border transition-all duration-500 cursor-pointer [transform-style:preserve-3d] shadow-md hover:shadow-xl",
          isFlipped ? "[transform:rotateY(180deg)]" : "",
          mastered === true
            ? "border-green-500/40 bg-green-500/5"
            : mastered === false
            ? "border-amber-500/40 bg-amber-500/5"
            : "border-border bg-card"
        )}
      >
        {/* Front Side: Question */}
        <div className="absolute inset-0 w-full h-full p-6 flex flex-col justify-between [backface-visibility:hidden] rounded-2xl">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-primary">
              <HelpCircle className="w-4 h-4" /> Quick Check
            </span>
            <span className="flex items-center gap-1 text-[11px] bg-muted/60 px-2 py-0.5 rounded-full">
              <RotateCw className="w-3 h-3" /> Click to flip
            </span>
          </div>

          <div className="my-auto py-3">
            <h4 className="text-base sm:text-lg font-bold text-foreground leading-snug">
              {question}
            </h4>
            {hint && (
              <p className="text-xs text-muted-foreground/80 mt-2 italic">
                Hint: {hint}
              </p>
            )}
          </div>

          <div className="text-[11px] text-muted-foreground text-center">
            Tap anywhere to test your knowledge
          </div>
        </div>

        {/* Back Side: Answer */}
        <div className="absolute inset-0 w-full h-full p-6 flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-2xl bg-muted/20">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
              <Sparkles className="w-4 h-4" /> Answer
            </span>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
              <RotateCw className="w-3 h-3" /> Flip back
            </span>
          </div>

          <div className="my-auto py-3">
            <p className="text-sm sm:text-base font-medium leading-relaxed text-foreground">
              {answer}
            </p>
          </div>

          <div
            className="flex items-center justify-center gap-3 pt-2 border-t border-border/40"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMastered(false)}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-semibold transition-colors",
                mastered === false
                  ? "bg-amber-500 text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              Review Later
            </button>
            <button
              onClick={() => setMastered(true)}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1",
                mastered === true
                  ? "bg-green-600 text-white"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <Check className="w-3.5 h-3.5" /> Got It!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
