"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle, RotateCcw, Lightbulb, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type QuizOption = {
  text: string;
  isCorrect?: boolean;
  explanation?: string;
};

export type QuizProps = {
  question: string;
  options?: QuizOption[];
  explanation?: string;
};

export function Quiz({
  question,
  options = [],
  explanation,
}: QuizProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (index: number) => {
    if (submitted) return;
    setSelectedIndex(index);
    setSubmitted(true);
    try {
      const cur = parseInt(localStorage.getItem("prahlad-active-recall") || "0", 10);
      localStorage.setItem("prahlad-active-recall", (cur + 1).toString());
    } catch (e) {}
  };

  const handleReset = () => {
    setSelectedIndex(null);
    setSubmitted(false);
  };

  const selectedOption = selectedIndex !== null ? options[selectedIndex] : null;
  const isCorrect = selectedOption?.isCorrect === true;
  const activeExplanation = selectedOption?.explanation || (isCorrect ? explanation : options.find(o => o.isCorrect)?.explanation || explanation);

  return (
    <div className="my-8 rounded-2xl border border-border/80 bg-muted/20 p-5 sm:p-6 shadow-xs transition-all">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-border/50">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
          <HelpCircle className="w-3.5 h-3.5" /> Quick Quiz
        </span>

        {submitted && (
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Try Again
          </button>
        )}
      </div>

      {/* Question */}
      <h4 className="text-base sm:text-lg font-bold text-foreground mb-4 leading-snug">
        {question}
      </h4>

      {/* Options */}
      <div className="space-y-2.5">
        {options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx); // A, B, C, D
          const isSelected = selectedIndex === idx;
          const showAsCorrect = submitted && opt.isCorrect;
          const showAsWrong = submitted && isSelected && !opt.isCorrect;

          return (
            <button
              key={idx}
              type="button"
              disabled={submitted}
              onClick={() => handleSelect(idx)}
              className={cn(
                "w-full flex items-center justify-between p-3.5 rounded-xl border text-left text-sm font-medium transition-all select-none group",
                !submitted && "bg-card/70 border-border hover:border-primary/50 hover:bg-muted/40 cursor-pointer text-foreground",
                showAsCorrect && "bg-emerald-500/10 border-emerald-500/50 text-emerald-700 dark:text-emerald-300 font-semibold",
                showAsWrong && "bg-rose-500/10 border-rose-500/50 text-rose-700 dark:text-rose-300 font-semibold",
                submitted && !showAsCorrect && !showAsWrong && "opacity-50 border-border bg-card/40 cursor-default"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                    !submitted && "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary",
                    showAsCorrect && "bg-emerald-500 text-white",
                    showAsWrong && "bg-rose-500 text-white",
                    submitted && !showAsCorrect && !showAsWrong && "bg-muted text-muted-foreground"
                  )}
                >
                  {letter}
                </span>
                <span className="truncate">{opt.text}</span>
              </div>

              {submitted && (
                <div className="shrink-0 ml-2">
                  {showAsCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  {showAsWrong && <XCircle className="w-5 h-5 text-rose-500" />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback & Explanation */}
      {submitted && (
        <div
          className={cn(
            "mt-4 p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300",
            isCorrect
              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-900 dark:text-emerald-200"
              : "bg-amber-500/5 border-amber-500/20 text-amber-900 dark:text-amber-200"
          )}
        >
          <div className="flex items-center gap-2 mb-1.5 font-bold text-xs uppercase tracking-wide">
            {isCorrect ? (
              <>
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Correct! Well done.</span>
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span className="text-amber-600 dark:text-amber-400">Not quite right</span>
              </>
            )}
          </div>
          {activeExplanation && (
            <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-90 m-0">
              {activeExplanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
