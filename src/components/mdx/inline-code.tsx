import { cn } from "@/lib/utils";
import React from "react";

type CodeProps = React.HTMLAttributes<HTMLElement>;

/**
 * MDX `code` component.
 *
 * When inside a fenced code block, remark attaches a `language-*` className to
 * the <code> element. We use that to tell inline code apart from block code:
 *   - No className  → inline `code` → styled pill
 *   - Has className → inside <pre> (handled by Pre) → render plain so Pre can style it
 */
export function InlineCode({ className, children, ...props }: CodeProps) {
  // Block-level code (inside <pre>) — has a language class; let Pre handle it
  if (className) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  // Inline code — style as a subtle pill
  return (
    <code
      className={cn(
        "relative inline-flex items-center rounded-md px-[0.4em] py-[0.15em]",
        "font-mono text-[0.875em] font-medium",
        "bg-muted/70 text-foreground",
        "border border-border/60",
        "break-words",
      )}
      {...props}
    >
      {children}
    </code>
  );
}
