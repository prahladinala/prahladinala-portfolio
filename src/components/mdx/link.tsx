import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

type MdxLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export function MdxLink({ href = "", className, children, ...props }: MdxLinkProps) {
  const isInternal =
    href.startsWith("/") ||
    href.startsWith("#") ||
    href.startsWith("?");

  if (isInternal) {
    return (
      <Link
        href={href}
        className={cn(
          "font-medium text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors",
          className
        )}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-0.5 font-medium text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors group/link",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <ExternalLink className="inline-block w-3.5 h-3.5 shrink-0 opacity-70 group-hover/link:opacity-100 transition-opacity ml-0.5 align-text-top" />
    </a>
  );
}
