"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check, Quote, Sparkles, Image as ImageIcon } from "lucide-react";
import { SITE_CONFIG } from "@/config/constants";
import { toast } from "@/components/ui/toast";

export function QuoteCardModal({
  open,
  onOpenChange,
  quote,
  noteTitle,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: string;
  noteTitle?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<"dark" | "gradient" | "minimal">("dark");

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 3,
      });
      const link = document.createElement("a");
      link.download = `quote-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Quote card downloaded", { icon: "📥" });
    } catch (e) {
      console.error("Failed to generate quote card image:", e);
      toast.error("Failed to generate quote card image");
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyImage = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      const { toBlob } = await import("html-to-image");
      const blob = await toBlob(cardRef.current, {
        quality: 1,
        pixelRatio: 3,
      });
      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setCopied(true);
        toast.success("Quote card copied to clipboard", { icon: "🎨" });
        setTimeout(() => setCopied(false), 2000);
      } else {
        await handleDownload();
      }
    } catch (e) {
      console.error("Failed to copy quote card to clipboard:", e);
      toast.error("Failed to copy quote card to clipboard");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-6 bg-background/95 backdrop-blur-xl border-border shadow-2xl rounded-2xl">
        <DialogHeader className="mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">Social Quote Card</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Ready to share on Twitter / LinkedIn
                </DialogDescription>
              </div>
            </div>

            {/* Theme switcher */}
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg text-xs">
              {(["dark", "gradient", "minimal"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTheme(t)}
                  className={`px-2 py-0.5 rounded capitalize font-medium transition-all ${
                    selectedTheme === t
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </DialogHeader>

        {/* The Card Component to Render & Export */}
        <div className="p-2 bg-muted/40 rounded-xl border border-border/50 flex justify-center overflow-hidden">
          <div
            ref={cardRef}
            className={`w-[480px] p-8 rounded-2xl relative flex flex-col justify-between transition-all select-none ${
              selectedTheme === "gradient"
                ? "bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white border border-indigo-500/30"
                : selectedTheme === "minimal"
                ? "bg-stone-50 text-stone-900 border border-stone-200"
                : "bg-zinc-950 text-zinc-100 border border-zinc-800"
            }`}
            style={{ minHeight: "260px" }}
          >
            {/* Top Quote Icon & Note Title */}
            <div className="flex items-center justify-between mb-4">
              <Quote
                className={`w-7 h-7 ${
                  selectedTheme === "gradient"
                    ? "text-indigo-400"
                    : selectedTheme === "minimal"
                    ? "text-stone-400"
                    : "text-primary"
                }`}
              />
              {noteTitle && (
                <span
                  className={`text-[11px] font-semibold tracking-wider uppercase truncate max-w-[260px] ${
                    selectedTheme === "minimal" ? "text-stone-500" : "text-zinc-400"
                  }`}
                >
                  {noteTitle}
                </span>
              )}
            </div>

            {/* Quoted Text */}
            <blockquote className="my-auto py-2">
              <p
                className={`text-base sm:text-lg font-medium leading-relaxed italic ${
                  selectedTheme === "minimal" ? "text-stone-800" : "text-zinc-100"
                }`}
              >
                &ldquo;{quote}&rdquo;
              </p>
            </blockquote>

            {/* Author Footer */}
            <div className="mt-6 pt-4 border-t border-current/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm tracking-tighter ${
                    selectedTheme === "gradient"
                      ? "bg-indigo-500 text-white"
                      : selectedTheme === "minimal"
                      ? "bg-stone-900 text-white"
                      : "bg-white text-zinc-950"
                  }`}
                >
                  PI
                </div>
                <div>
                  <h5 className="text-xs font-bold leading-tight">
                    {SITE_CONFIG.name}
                  </h5>
                  <p
                    className={`text-[10px] ${
                      selectedTheme === "minimal" ? "text-stone-500" : "text-zinc-400"
                    }`}
                  >
                    Software Engineer • Notes
                  </p>
                </div>
              </div>

              <span
                className={`text-[11px] font-mono ${
                  selectedTheme === "minimal" ? "text-stone-500" : "text-zinc-400"
                }`}
              >
                prahladinala.in
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-end">
          <Button
            variant="outline"
            onClick={handleCopyImage}
            disabled={isExporting}
            className="w-full sm:w-auto"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-500" /> Copied Image!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" /> Copy Image
              </>
            )}
          </Button>

          <Button
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full sm:w-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PNG
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
