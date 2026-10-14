"use client";

import { CheckCircle2 } from "lucide-react";

export type StepItem = {
  title: string;
  description: string;
};

export type StepsProps = {
  title?: string;
  items?: StepItem[];
};

export function Steps({ title, items = [] }: StepsProps) {
  if (items.length === 0) return null;

  return (
    <div className="my-8 rounded-2xl border border-border/80 bg-muted/20 p-5 sm:p-6 shadow-xs">
      {title && (
        <h4 className="font-bold text-base sm:text-lg text-foreground mb-6 flex items-center gap-2 m-0">
          <CheckCircle2 className="w-5 h-5 text-primary" /> {title}
        </h4>
      )}

      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-[2px] before:bg-border/80">
        {items.map((step, idx) => (
          <div key={idx} className="relative group">
            {/* Step Number Dot */}
            <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-card border-2 border-primary text-primary flex items-center justify-center text-xs font-bold shadow-xs group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              {idx + 1}
            </div>

            {/* Step Content */}
            <div className="pt-0.5">
              <h5 className="font-bold text-sm sm:text-base text-foreground mb-1 leading-snug m-0">
                {step.title}
              </h5>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed m-0 font-medium">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
