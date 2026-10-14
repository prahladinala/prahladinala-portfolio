"use client";

import { Hash } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function createHeading(Tag: "h1" | "h2" | "h3" | "h4") {
  return function HeadingComponent({
    id,
    children,
    className,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) {
    const handleCopyAnchor = (e: React.MouseEvent) => {
      e.preventDefault();
      if (!id) return;
      const url = `${window.location.origin}${window.location.pathname}#${id}`;
      navigator.clipboard.writeText(url).then(() => {
        window.history.pushState(null, "", `#${id}`);
        toast.success("Heading link copied to clipboard", { icon: "🔗" });
      }).catch(() => {
        window.history.pushState(null, "", `#${id}`);
      });
    };

    return (
      <Tag
        id={id}
        className={cn(
          "group relative scroll-mt-24 flex items-center",
          className
        )}
        {...props}
      >
        {id && (
          <a
            href={`#${id}`}
            onClick={handleCopyAnchor}
            className="absolute -left-6 sm:-left-7 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/30 hover:text-primary transition-all opacity-0 group-hover:opacity-100 no-underline shrink-0"
            title="Copy link to this section"
            aria-label="Copy link to this section"
          >
            <Hash className="w-4 h-4" />
          </a>
        )}
        <span>{children}</span>
      </Tag>
    );
  };
}

export const H1 = createHeading("h1");
export const H2 = createHeading("h2");
export const H3 = createHeading("h3");
export const H4 = createHeading("h4");
