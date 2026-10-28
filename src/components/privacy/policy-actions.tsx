"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PolicyActions({ slug }: { title?: string; slug: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      const url =
        typeof window !== "undefined"
          ? window.location.href
          : `https://prahladinala.in/privacy-policy/${slug}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-8 border-b border-border/60 print:hidden">
      <Link
        href="/privacy-policy"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        All Privacy Policies
      </Link>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="h-8 gap-1.5 text-xs font-medium"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span>Copied Link</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="h-8 gap-1.5 text-xs font-medium"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / PDF</span>
        </Button>
      </div>
    </div>
  );
}
