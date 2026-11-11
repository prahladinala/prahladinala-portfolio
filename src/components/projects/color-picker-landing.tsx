"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Pipette,
  Palette,
  Check,
  Copy,
  Sliders,
  Share2,
  ShieldCheck,
  Lock,
  ExternalLink,
  X,
  Maximize2,
  ChevronRight,
  Eye,
  CheckCircle2,
  ArrowRight,
  Layers,
  Code2,
  RefreshCw,
  Send,
  FileText,
  MessageCircle,
} from "lucide-react";
import { Linkedin, Twitter } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle-v2";
import { ChromeLogo } from "@/components/projects/universal-pdf-exporter-landing";
import { cn } from "@/lib/utils";

// Extension Config
const EXTENSION_NAME = "Color Picker - Eyedropper & Palette Tool";
const EXTENSION_VERSION = "v1.2";
// Placeholder / store URL - updated automatically when store listing ID is shared
const CHROME_STORE_URL =
  process.env.NEXT_PUBLIC_COLOR_PICKER_STORE_URL ||
  "https://chromewebstore.google.com/category/extensions";

// Screenshot Showcase Tabs
const SCREENSHOT_TABS = [
  {
    id: "palette",
    title: "Palette History",
    subtitle:
      "Instant 1-click swatch copying across HEX, RGB, HSL, OKLCH, and Tailwind classes",
    image: "/images/projects/color-picker/palette-framed.png",
    rawImage: "/images/projects/color-picker/palette.png",
    alt: "Color Picker Extension History and Palette View",
    badge: "Palette & History",
  },
  {
    id: "inspector",
    title: "Color Inspector",
    subtitle:
      "Deep format analysis, Tailwind shade generator (50–950), and complementary harmonies",
    image: "/images/projects/color-picker/inspector-framed.png",
    rawImage: "/images/projects/color-picker/inspector.png",
    alt: "Color Picker Extension Inspector View with Tints and Shades",
    badge: "Inspector & Shades",
  },
  {
    id: "contrast",
    title: "WCAG Contrast Checker",
    subtitle:
      "Live AA & AAA accessibility testing for normal and large text with real-time ratio calculation",
    image: "/images/projects/color-picker/contrast-framed.png",
    rawImage: "/images/projects/color-picker/contrast.png",
    alt: "Color Picker Extension Contrast Checker with WCAG Compliance",
    badge: "WCAG 2.1 Contrast",
  },
  {
    id: "scanner",
    title: "Page Palette Scanner",
    subtitle:
      "Scans active web page styles and extracts a complete designer color palette in seconds",
    image: "/images/projects/color-picker/page-scanner-framed.png",
    rawImage: "/images/projects/color-picker/page-scanner.png",
    alt: "Color Picker Extension Extracted Tab Palette View",
    badge: "DOM Palette Extractor",
  },
];

// Color Engine Helper Functions (Client-Side)
function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const num = parseInt(
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean,
    16,
  );
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((x) =>
        Math.max(0, Math.min(255, Math.round(x)))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
      .toUpperCase()
  );
}

function rgbToHsl(r: number, g: number, b: number) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      case bn:
        h = (rn - gn) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number) {
  const sn = s / 100;
  const ln = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) =>
    ln - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4)),
  };
}

function srgbToLinear(c: number) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function rgbToOklch(r: number, g: number, b: number) {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);

  const l_ = Math.cbrt(
    0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb,
  );
  const m_ = Math.cbrt(
    0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb,
  );
  const s_ = Math.cbrt(
    0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb,
  );

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b_val = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const C = Math.sqrt(a * a + b_val * b_val);
  let h = (Math.atan2(b_val, a) * 180) / Math.PI;
  if (h < 0) h += 360;

  return `oklch(${(L * 100).toFixed(1)}% ${C.toFixed(3)} ${h.toFixed(1)})`;
}

function getRelativeLuminance(r: number, g: number, b: number) {
  return (
    0.2126 * srgbToLinear(r) +
    0.7152 * srgbToLinear(g) +
    0.0722 * srgbToLinear(b)
  );
}

function getContrastRatio(fgHex: string, bgHex: string) {
  const fg = hexToRgb(fgHex);
  const bg = hexToRgb(bgHex);
  const l1 = getRelativeLuminance(fg.r, fg.g, fg.b);
  const l2 = getRelativeLuminance(bg.r, bg.g, bg.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);

  return {
    ratio: +ratio.toFixed(2),
    ratioString: `${ratio.toFixed(2)}:1`,
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3.0,
    aaaNormal: ratio >= 7.0,
    aaaLarge: ratio >= 4.5,
  };
}

function generateShades(hex: string) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const steps = [
    { step: "50", l: 96 },
    { step: "100", l: 90 },
    { step: "200", l: 80 },
    { step: "300", l: 70 },
    { step: "400", l: Math.round(50 + (hsl.l - 50) * 0.5) },
    { step: "500", l: hsl.l },
    { step: "600", l: Math.max(12, Math.round(hsl.l * 0.85)) },
    { step: "700", l: Math.max(10, Math.round(hsl.l * 0.68)) },
    { step: "800", l: Math.max(8, Math.round(hsl.l * 0.5)) },
    { step: "900", l: Math.max(6, Math.round(hsl.l * 0.32)) },
    { step: "950", l: Math.max(4, Math.round(hsl.l * 0.18)) },
  ];

  return steps.map((s) => {
    const c = hslToRgb(hsl.h, hsl.s, s.l);
    return {
      step: s.step,
      hex: rgbToHex(c.r, c.g, c.b),
    };
  });
}

// Preset Swatches for the Live Simulator
const PRESET_COLORS = [
  { name: "Indigo", hex: "#615FFF" },
  { name: "Emerald", hex: "#10B981" },
  { name: "Amber", hex: "#F59E0B" },
  { name: "Rose", hex: "#F43F5E" },
  { name: "Cyan", hex: "#06B6D4" },
  { name: "Violet", hex: "#8B5CF6" },
  { name: "Dark Slate", hex: "#1E293B" },
  { name: "Pure White", hex: "#FFFFFF" },
];

const COMPARISON_ROWS = [
  {
    feature: "Screen Eyedropper API",
    extension: "Native Chromium API (Alt+P)",
    browserDevTools: "Limited to web inspect tab",
    otherTools: "Desktop app required",
  },
  {
    feature: "Modern Color Formats",
    extension: "OKLCH, HSL, RGB, HEX, CMYK, Tailwind",
    browserDevTools: "HEX, RGB, HSL only",
    otherTools: "HEX/RGB only",
  },
  {
    feature: "1-Click Copy Tailwind Class",
    extension: "Instant bg-[#615fff] format",
    browserDevTools: "Not available",
    otherTools: "Not available",
  },
  {
    feature: "WCAG 2.1 Contrast Testing",
    extension: "Real-time AA/AAA validator + preview",
    browserDevTools: "Static tooltip only",
    otherTools: "Separate web page needed",
  },
  {
    feature: "Page Palette Extractor",
    extension: "Scans DOM styles + 1-click import",
    browserDevTools: "Manual CSS property search",
    otherTools: "Not supported",
  },
  {
    feature: "Privacy & Analytics",
    extension: "100% Offline • Zero Tracking",
    browserDevTools: "Built-in browser",
    otherTools: "Cloud sync & telemetry",
  },
  {
    feature: "Side Panel & Popup Modes",
    extension: "Both Popup and Alt+S Side Panel",
    browserDevTools: "Takes over screen space",
    otherTools: "Separate window required",
  },
];

export function ColorPickerLanding() {
  const [activeTab, setActiveTab] = useState("palette");
  const [selectedColor, setSelectedColor] = useState("#615FFF");
  const [contrastFg, setContrastFg] = useState("#FFFFFF");
  const [contrastBg, setContrastBg] = useState("#615FFF");
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const currentTab =
    SCREENSHOT_TABS.find((t) => t.id === activeTab) || SCREENSHOT_TABS[0];

  const pageUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "https://prahladinala.in/projects/color-picker";

  const shareText =
    "Check out Color Picker — a fast, privacy-first eyedropper, OKLCH/Tailwind converter, and WCAG contrast tool by @prahladinala:";

  // Color Engine Computations
  const rgb = useMemo(() => hexToRgb(selectedColor), [selectedColor]);
  const hsl = useMemo(
    () => rgbToHsl(rgb.r, rgb.g, rgb.b),
    [rgb.r, rgb.g, rgb.b],
  );
  const oklch = useMemo(
    () => rgbToOklch(rgb.r, rgb.g, rgb.b),
    [rgb.r, rgb.g, rgb.b],
  );
  const shades = useMemo(() => generateShades(selectedColor), [selectedColor]);
  const contrastResult = useMemo(
    () => getContrastRatio(contrastFg, contrastBg),
    [contrastFg, contrastBg],
  );

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedValue(label);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const openShareUrl = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: EXTENSION_NAME,
          text: shareText,
          url: pageUrl,
        });
      } catch {
        setIsShareModalOpen(true);
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
        setIsShareModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="w-full relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-emerald-500/15 via-teal-500/10 to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-96 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-3xl -z-10 pointer-events-none" />

      {/* TOP DEDICATED NAVIGATION BAR (Responsive, Mobile-First) */}
      <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b border-border/70 shadow-xs">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-7xl h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand & Breadcrumbs */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity shrink-0"
              title="Prahlad Inala Home"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                PI
              </div>
            </Link>

            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />

            <Link
              href="/projects"
              className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              Projects
            </Link>

            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0 hidden md:inline" />

            <span className="text-xs sm:text-sm font-semibold text-foreground truncate max-w-[140px] md:max-w-xs lg:max-w-md hidden md:inline">
              Color Picker
            </span>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Install on Chrome Button */}
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "sm" }),
                "rounded-full px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold shadow-xs hover:scale-105 transition-all bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white flex items-center gap-1.5 shrink-0",
              )}
            >
              <ChromeLogo className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">Add to Chrome</span>
              <span className="sm:hidden text-[11px]">Install</span>
            </a>

            {/* Share Button */}
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-full bg-card border border-border hover:border-primary/50 text-xs font-medium text-foreground transition-all hover:scale-105 shadow-xs shrink-0"
              title="Share on social media"
              aria-label="Share project"
            >
              <Share2 className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-6xl">
        {/* HERO SECTION */}
        <div className="text-center max-w-4xl mx-auto pt-4 sm:pt-6 pb-10 sm:pb-14">
          {/* Eyebrow Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 mb-5 sm:mb-6 shadow-xs max-w-full">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>Chrome Extension {EXTENSION_VERSION}</span>
            <span className="text-muted-foreground hidden sm:inline">•</span>
            <span className="hidden sm:inline">Manifest V3 • 100% Offline</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.18] sm:leading-[1.15] mb-5 sm:mb-6 break-words">
            Sample Screen Colors, Explore Formats &amp;{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 bg-clip-text text-transparent">
              Check WCAG Contrast
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2 sm:px-0">
            A fast, lightweight, and privacy-first color eyedropper tool for web
            designers, developers, and digital creators. Sample any screen pixel
            with <strong>Chromium&apos;s native EyeDropper API (Alt+P)</strong>,
            convert instantly into modern color formats (
            <strong>OKLCH, HSL, RGB, Tailwind</strong>), calculate WCAG
            accessibility contrast, and extract page palettes.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 w-full max-w-md sm:max-w-none mx-auto">
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full sm:w-auto rounded-full px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base font-semibold shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:scale-[1.02] bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white flex items-center justify-center gap-2.5",
              )}
            >
              <ChromeLogo className="w-5 h-5 shrink-0" />
              <span>Add to Chrome — It&apos;s Free</span>
            </a>

            <a
              href="#showcase"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-auto rounded-full px-6 sm:px-7 py-4 sm:py-6 text-sm sm:text-base font-semibold border-border hover:border-primary/50 transition-all hover:scale-[1.02] flex items-center justify-center gap-2",
              )}
            >
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span>Explore Live Showcase</span>
            </a>

            <button
              type="button"
              onClick={handleNativeShare}
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "w-full sm:w-auto rounded-full px-5 py-4 sm:py-6 text-sm sm:text-base text-muted-foreground hover:text-foreground flex items-center justify-center gap-2",
              )}
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span>Share App</span>
            </button>
          </div>

          {/* Trust Highlights Strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2.5 text-xs sm:text-sm text-muted-foreground font-medium pt-4 border-t border-border/50 max-w-3xl mx-auto px-2">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" /> 100% Offline
              Execution
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Native
              EyeDropper API (Alt+P)
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-500 shrink-0" /> Zero
              Analytics or Tracking
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-teal-500 shrink-0" /> WCAG 2.1
              Contrast Validator
            </span>
          </div>
        </div>

        {/* INTERACTIVE VISUAL SHOWCASE */}
        <section id="showcase" className="mb-20 sm:mb-24 scroll-mt-20">
          <div className="flex flex-col items-center mb-6 sm:mb-8 text-center">
            <Badge
              variant="outline"
              className="mb-3 px-3 py-1 font-mono text-xs"
            >
              Interactive Product Showcase
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Explore Extension Views &amp; Features
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-xl">
              Switch through the tabs below to explore History, Color Inspector,
              WCAG Contrast, and Page Palette Scanner. Click the image to zoom.
            </p>
          </div>

          {/* Screenshot Navigation Pills (Scrollable on Mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-6 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:justify-center no-scrollbar px-1 -mx-2 sm:mx-0">
            {SCREENSHOT_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-[1.02]"
                      : "bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <span>{tab.title}</span>
                  <span
                    className={cn(
                      "hidden sm:inline text-[10px] px-1.5 py-0.5 rounded-full font-mono uppercase tracking-wider",
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Main Showcase Frame */}
          <div className="relative rounded-2xl md:rounded-3xl border border-border/80 bg-card overflow-hidden shadow-2xl transition-all duration-300">
            {/* Window Title Bar */}
            <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 border-b border-border/70 bg-muted/40">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80 shrink-0" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80 shrink-0" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/80 shrink-0" />
                <span className="text-[11px] sm:text-xs font-mono text-muted-foreground ml-2 sm:ml-3 truncate max-w-[150px] sm:max-w-md">
                  Color Picker {EXTENSION_VERSION} — {currentTab.title}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md bg-background/80 hover:bg-background border border-border/60 text-[11px] font-medium text-foreground transition-all hover:scale-105"
                  title="Expand to Fullscreen"
                >
                  <Maximize2 className="w-3 h-3 text-primary" />
                  <span className="hidden sm:inline">Fullscreen Zoom</span>
                  <span className="sm:hidden">Zoom</span>
                </button>
              </div>
            </div>

            {/* Centered Image Viewer Area (Zero Unwanted Dead Space) */}
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative w-full bg-gradient-to-b from-slate-950/40 to-background flex items-center justify-center p-4 sm:p-8 cursor-zoom-in group overflow-hidden"
            >
              <div className="relative flex items-center justify-center max-w-full">
                <Image
                  src={currentTab.image}
                  alt={currentTab.alt}
                  width={447}
                  height={747}
                  className="rounded-2xl shadow-2xl border border-border/70 max-h-[520px] sm:max-h-[580px] w-auto transition-transform duration-300 group-hover:scale-[1.01]"
                  priority
                />
              </div>

              {/* Floating Zoom Hint Pill */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-md border border-border/80 text-xs text-muted-foreground group-hover:text-foreground flex items-center gap-1.5 shadow-md pointer-events-none transition-all">
                <Maximize2 className="w-3.5 h-3.5 text-primary" />
                <span>Click image to zoom</span>
              </div>
            </div>

            {/* Caption Footer */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-card border-t border-border/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2">
                  <span>{currentTab.title}</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {currentTab.badge}
                  </Badge>
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {currentTab.subtitle}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Open Fullscreen</span>
                </button>
                <a
                  href={currentTab.rawImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground font-medium inline-flex items-center gap-1"
                >
                  <span>Raw Image</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE INTERACTIVE COLOR ENGINE SIMULATOR */}
        <section className="mb-20 sm:mb-24 p-4 sm:p-6 md:p-10 rounded-3xl bg-card border border-border/80 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-border/70">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2">
                <Sliders className="w-3 h-3" />
                <span>Live In-Browser Simulator</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Color Engine &amp; WCAG Simulator
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Select or pick any color below to test live OKLCH conversion,
                Tailwind shades, and WCAG 2.1 contrast ratio.
              </p>
            </div>

            {/* Custom Color Input Control */}
            <div className="flex items-center gap-3">
              <label
                htmlFor="color-input"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60 border border-border/70 text-xs font-medium cursor-pointer hover:bg-muted transition-all"
              >
                <span
                  className="w-5 h-5 rounded-md border border-black/20 shadow-xs"
                  style={{ backgroundColor: selectedColor }}
                />
                <span className="font-mono font-bold uppercase">
                  {selectedColor}
                </span>
                <input
                  id="color-input"
                  type="color"
                  value={selectedColor}
                  onChange={(e) => {
                    setSelectedColor(e.target.value.toUpperCase());
                    setContrastBg(e.target.value.toUpperCase());
                  }}
                  aria-label="Select custom color"
                  className="sr-only"
                />
              </label>

              <span className="text-xs text-muted-foreground hidden sm:inline">
                Click swatch to pick custom
              </span>
            </div>
          </div>

          {/* Quick Preset Swatches Strip */}
          <div className="pt-6">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-3">
              Curated Swatches
            </span>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {PRESET_COLORS.map((c) => {
                const isSelected = selectedColor.toUpperCase() === c.hex;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      setSelectedColor(c.hex);
                      setContrastBg(c.hex);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm scale-105"
                        : "border-border/60 bg-muted/40 hover:bg-muted text-foreground",
                    )}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-xs"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* COLOR FORMAT CONVERSIONS GRID */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* HEX Card */}
            <div
              onClick={() => copyToClipboard(selectedColor, "HEX")}
              className="p-4 rounded-2xl bg-muted/30 border border-border/70 hover:border-primary/50 transition-all cursor-pointer group flex items-center justify-between"
            >
              <div>
                <span className="text-[11px] font-mono text-muted-foreground block uppercase">
                  HEX
                </span>
                <span className="text-sm font-bold font-mono text-foreground">
                  {selectedColor}
                </span>
              </div>
              <button
                type="button"
                className="p-1.5 rounded-lg bg-background/80 group-hover:bg-primary group-hover:text-primary-foreground transition-all text-muted-foreground"
              >
                {copiedValue === "HEX" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500 group-hover:text-primary-foreground" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* RGB Card */}
            <div
              onClick={() =>
                copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "RGB")
              }
              className="p-4 rounded-2xl bg-muted/30 border border-border/70 hover:border-primary/50 transition-all cursor-pointer group flex items-center justify-between"
            >
              <div>
                <span className="text-[11px] font-mono text-muted-foreground block uppercase">
                  RGB
                </span>
                <span className="text-xs sm:text-sm font-bold font-mono text-foreground truncate">
                  rgb({rgb.r}, {rgb.g}, {rgb.b})
                </span>
              </div>
              <button
                type="button"
                className="p-1.5 rounded-lg bg-background/80 group-hover:bg-primary group-hover:text-primary-foreground transition-all text-muted-foreground shrink-0"
              >
                {copiedValue === "RGB" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500 group-hover:text-primary-foreground" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* HSL Card */}
            <div
              onClick={() =>
                copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, "HSL")
              }
              className="p-4 rounded-2xl bg-muted/30 border border-border/70 hover:border-primary/50 transition-all cursor-pointer group flex items-center justify-between"
            >
              <div>
                <span className="text-[11px] font-mono text-muted-foreground block uppercase">
                  HSL
                </span>
                <span className="text-xs sm:text-sm font-bold font-mono text-foreground truncate">
                  hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
                </span>
              </div>
              <button
                type="button"
                className="p-1.5 rounded-lg bg-background/80 group-hover:bg-primary group-hover:text-primary-foreground transition-all text-muted-foreground shrink-0"
              >
                {copiedValue === "HSL" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500 group-hover:text-primary-foreground" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Tailwind Class Card */}
            <div
              onClick={() =>
                copyToClipboard(
                  `bg-[${selectedColor.toLowerCase()}]`,
                  "Tailwind",
                )
              }
              className="p-4 rounded-2xl bg-muted/30 border border-border/70 hover:border-primary/50 transition-all cursor-pointer group flex items-center justify-between"
            >
              <div>
                <span className="text-[11px] font-mono text-muted-foreground block uppercase">
                  Tailwind Class
                </span>
                <span className="text-xs sm:text-sm font-bold font-mono text-foreground truncate">
                  bg-[{selectedColor.toLowerCase()}]
                </span>
              </div>
              <button
                type="button"
                className="p-1.5 rounded-lg bg-background/80 group-hover:bg-primary group-hover:text-primary-foreground transition-all text-muted-foreground shrink-0"
              >
                {copiedValue === "Tailwind" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500 group-hover:text-primary-foreground" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* OKLCH Modern Color Space Callout */}
          <div
            onClick={() => copyToClipboard(oklch, "OKLCH")}
            className="mt-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase">
                Modern CSS Level 4
              </span>
              <span className="text-xs text-muted-foreground">
                Perceptually Uniform Color Space:
              </span>
              <span className="font-mono text-xs sm:text-sm font-bold text-foreground">
                {oklch}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 self-end sm:self-auto">
              <span>
                {copiedValue === "OKLCH" ? "Copied!" : "Click to Copy OKLCH"}
              </span>
              <Copy className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* DYNAMIC TINTS & SHADES (50 - 950) */}
          <div className="mt-8 pt-6 border-t border-border/70">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Tailwind Tints &amp; Shades (50 — 950)
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                Click any shade to copy HEX
              </span>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5 sm:gap-2">
              {shades.map((s) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => copyToClipboard(s.hex, `shade-${s.step}`)}
                  className="flex flex-col items-center gap-1 group/shade focus:outline-hidden"
                  title={`Shade ${s.step}: ${s.hex}`}
                >
                  <div
                    className="w-full aspect-square rounded-xl border border-black/10 shadow-xs transition-transform group-hover/shade:scale-110 relative flex items-center justify-center"
                    style={{ backgroundColor: s.hex }}
                  >
                    {copiedValue === `shade-${s.step}` && (
                      <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground group-hover/shade:text-foreground">
                    {s.step}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* LIVE WCAG 2.1 CONTRAST CHECKER */}
          <div className="mt-8 pt-6 border-t border-border/70">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h4 className="text-base font-bold text-foreground">
                  WCAG 2.1 Contrast Testing
                </h4>
                <p className="text-xs text-muted-foreground">
                  Verify digital accessibility compliance for foreground and
                  background color combinations.
                </p>
              </div>

              {/* Swap Button */}
              <button
                type="button"
                onClick={() => {
                  const temp = contrastFg;
                  setContrastFg(contrastBg);
                  setContrastBg(temp);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-muted border border-border/70 text-xs font-semibold text-foreground transition-all self-start sm:self-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Swap Colors</span>
              </button>
            </div>

            {/* Live Contrast Headline Sample Banner */}
            <div
              className="p-5 sm:p-7 rounded-2xl transition-all shadow-inner mb-6 text-center sm:text-left"
              style={{ backgroundColor: contrastBg, color: contrastFg }}
            >
              <h5 className="text-lg sm:text-2xl font-black tracking-tight mb-1">
                Large Headline Sample (Accessible Contrast)
              </h5>
              <p className="text-xs sm:text-sm opacity-90 leading-relaxed">
                Good design is as little design as possible. Accessible contrast
                ensures everyone can read your text clearly regardless of screen
                glare or visual impairments.
              </p>
            </div>

            {/* Contrast Score & Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
              {/* Ratio Box */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 text-center sm:text-left">
                <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                  Contrast Ratio
                </span>
                <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">
                  {contrastResult.ratioString}
                </span>
              </div>

              {/* AA Normal */}
              <div
                className={cn(
                  "p-3 rounded-2xl border flex flex-col justify-between text-center sm:text-left",
                  contrastResult.aaNormal
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-500",
                )}
              >
                <span className="text-[10px] font-mono font-bold uppercase">
                  AA Normal (≥ 4.5)
                </span>
                <span className="text-sm font-bold">
                  {contrastResult.aaNormal ? "PASS" : "FAIL"}
                </span>
              </div>

              {/* AA Large */}
              <div
                className={cn(
                  "p-3 rounded-2xl border flex flex-col justify-between text-center sm:text-left",
                  contrastResult.aaLarge
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-500",
                )}
              >
                <span className="text-[10px] font-mono font-bold uppercase">
                  AA Large (≥ 3.0)
                </span>
                <span className="text-sm font-bold">
                  {contrastResult.aaLarge ? "PASS" : "FAIL"}
                </span>
              </div>

              {/* AAA Normal */}
              <div
                className={cn(
                  "p-3 rounded-2xl border flex flex-col justify-between text-center sm:text-left",
                  contrastResult.aaaNormal
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-500",
                )}
              >
                <span className="text-[10px] font-mono font-bold uppercase">
                  AAA Normal (≥ 7.0)
                </span>
                <span className="text-sm font-bold">
                  {contrastResult.aaaNormal ? "PASS" : "FAIL"}
                </span>
              </div>

              {/* AAA Large */}
              <div
                className={cn(
                  "p-3 rounded-2xl border flex flex-col justify-between text-center sm:text-left",
                  contrastResult.aaaLarge
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-500",
                )}
              >
                <span className="text-[10px] font-mono font-bold uppercase">
                  AAA Large (≥ 4.5)
                </span>
                <span className="text-sm font-bold">
                  {contrastResult.aaaLarge ? "PASS" : "FAIL"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CORE CAPABILITIES GRID */}
        <section className="mb-20 sm:mb-24">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Precision Engineering for Color Lovers
            </h2>
            <p className="text-muted-foreground text-xs sm:text-base">
              Built on modern web platform APIs to deliver pixel-perfect
              sampling with zero overhead.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Feature 1 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5 shadow-xs">
                  <Pipette className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                  Native EyeDropper API
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                  Powered by Chromium&apos;s OS-level EyeDropper interface.
                  Press{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">
                    Alt+P
                  </kbd>{" "}
                  to sample any pixel from web elements, images, videos, and
                  even outside the browser viewport.
                </p>
              </div>
              <ul className="space-y-1.5 pt-4 border-t border-border/60 text-xs text-foreground/80">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Cross-element pixel precision</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Keyboard shortcut Alt+P</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 hover:border-teal-500/50 transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-5 shadow-xs">
                  <Palette className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                  Page Palette Scanner
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                  Click &ldquo;Scan Page&rdquo; to automatically analyze the DOM
                  stylesheet hierarchy, inline styles, and SVG vectors across
                  your active tab. Import the whole site palette with one click.
                </p>
              </div>
              <ul className="space-y-1.5 pt-4 border-t border-border/60 text-xs text-foreground/80">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Deep computed-style analysis</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>1-Click &ldquo;Import All&rdquo; to palette</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 hover:border-indigo-500/50 transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-5 shadow-xs">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                  Modern OKLCH &amp; Tailwind
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                  Full support for CSS Color Module Level 4 OKLCH for uniform
                  perceptual lightness, along with 1-click Tailwind arbitrary
                  value syntax (e.g. <code>bg-[#615fff]</code>).
                </p>
              </div>
              <ul className="space-y-1.5 pt-4 border-t border-border/60 text-xs text-foreground/80">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>OKLCH, HSL, RGB, HEX, CMYK</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Tailwind 50–950 shade generator</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="mb-20 sm:mb-24">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 sm:mb-3">
              Why Color Picker?
            </h2>
            <p className="text-muted-foreground text-xs sm:text-base">
              Comparing features against browser DevTools and heavy desktop
              apps.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-md">
            {/* Mobile Scroll Hint */}
            <div className="sm:hidden px-4 py-2 bg-muted/40 border-b border-border/70 text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Swipe horizontally to compare</span>
              <span className="font-mono text-xs">→</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[580px] text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/40 font-semibold text-foreground">
                    <th className="p-3.5 sm:p-5">Feature</th>
                    <th className="p-3.5 sm:p-5 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
                      Color Picker
                    </th>
                    <th className="p-3.5 sm:p-5 text-muted-foreground">
                      Browser DevTools
                    </th>
                    <th className="p-3.5 sm:p-5 text-muted-foreground">
                      Other Tools
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {COMPARISON_ROWS.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-3.5 sm:p-5 font-medium text-foreground">
                        {row.feature}
                      </td>
                      <td className="p-3.5 sm:p-5 font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{row.extension}</span>
                      </td>
                      <td className="p-3.5 sm:p-5 text-muted-foreground">
                        {row.browserDevTools}
                      </td>
                      <td className="p-3.5 sm:p-5 text-muted-foreground">
                        {row.otherTools}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* PRIVACY & SECURITY FIRST */}
        <section className="mb-20 sm:mb-24 p-6 sm:p-12 rounded-3xl bg-gradient-to-br from-card via-muted/30 to-card border border-border/80 shadow-lg">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-xs">
              <Lock className="w-7 h-7" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
              100% Offline. Zero Data Collection.
            </h2>

            <p className="text-muted-foreground text-xs sm:text-base leading-relaxed mb-8">
              Color Picker runs entirely in your local browser memory. No
              tracking scripts, no analytics beacons, and no external servers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left mb-8">
              <div className="p-4 rounded-2xl bg-background border border-border/60">
                <div className="font-bold text-sm text-foreground mb-1">
                  Local Palette Storage
                </div>
                <p className="text-xs text-muted-foreground">
                  Your color history is saved strictly to{" "}
                  <code>chrome.storage.local</code> on your device.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-background border border-border/60">
                <div className="font-bold text-sm text-foreground mb-1">
                  Clipboard Convenience
                </div>
                <p className="text-xs text-muted-foreground">
                  The clipboard permission is used solely to copy chosen color
                  values when you tap swatches.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-background border border-border/60">
                <div className="font-bold text-sm text-foreground mb-1">
                  Side Panel &amp; Shortcuts
                </div>
                <p className="text-xs text-muted-foreground">
                  Dock to Chrome side panel with Alt+S or launch instant
                  eyedropper with Alt+P.
                </p>
              </div>
            </div>

            <Link
              href="/privacy-policy/color-picker"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:underline"
            >
              <span>Read the Official Color Picker Privacy Policy</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <div className="p-6 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/20 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3 sm:mb-4">
              Supercharge Your Color Workflow Today
            </h2>
            <p className="text-muted-foreground text-xs sm:text-base mb-6 sm:mb-8">
              Sample any pixel, test accessibility, and build modern palettes in
              one click.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto">
              <a
                href={CHROME_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full sm:w-auto rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white flex items-center justify-center gap-2.5",
                )}
              >
                <ChromeLogo className="w-5 h-5 shrink-0" />
                <span>Add to Chrome — It&apos;s Free</span>
              </a>

              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full sm:w-auto rounded-full px-6 py-5 sm:py-6 text-sm sm:text-base font-semibold hover:border-primary/50 flex items-center justify-center gap-2",
                )}
              >
                <Share2 className="w-4 h-4 text-primary" />
                <span>Share with Friends</span>
              </button>
            </div>

            <p className="text-xs text-muted-foreground mt-6 font-mono">
              Designed &amp; Developed by Prahlad Inala • ToolMate
            </p>
          </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar with Title & Close */}
          <div
            className="w-full max-w-4xl flex items-center justify-between py-3 px-4 mb-2 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-base font-bold">{currentTab.title}</h3>
              <p className="text-xs text-zinc-400">{currentTab.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white"
              title="Close Fullscreen (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Full Resolution Image Container */}
          <div
            className="relative w-full max-w-4xl max-h-[85vh] flex items-center justify-center overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentTab.image}
              alt={currentTab.alt}
              width={600}
              height={900}
              className="rounded-2xl object-contain max-h-[85vh] w-auto shadow-2xl border border-white/15"
              priority
            />
          </div>

          <p className="text-xs text-zinc-400 mt-3 font-mono">
            Press Esc or click anywhere outside to close
          </p>
        </div>
      )}

      {/* MULTI-CHANNEL SHARE MODAL */}
      {isShareModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsShareModalOpen(false)}
        >
          <div
            className="bg-card border border-border rounded-3xl p-5 sm:p-8 max-w-md w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-lg text-foreground">
                  Share Color Picker
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground mb-6">
              Share Color Picker with fellow designers, developers, and digital
              creators.
            </p>

            {/* Social Channels Grid (2 cols mobile, 4 cols desktop) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-6">
              {/* X / Twitter */}
              <button
                type="button"
                onClick={() =>
                  openShareUrl(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      shareText,
                    )}&url=${encodeURIComponent(pageUrl)}`,
                  )
                }
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-muted/50 hover:bg-muted border border-border/60 hover:border-primary/50 transition-all hover:scale-105"
              >
                <Twitter className="w-5 h-5 text-foreground" />
                <span className="text-[11px] font-medium text-foreground">
                  X
                </span>
              </button>

              {/* LinkedIn */}
              <button
                type="button"
                onClick={() =>
                  openShareUrl(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      pageUrl,
                    )}`,
                  )
                }
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-muted/50 hover:bg-muted border border-border/60 hover:border-blue-500/50 transition-all hover:scale-105"
              >
                <Linkedin className="w-5 h-5 text-[#0077b5]" />
                <span className="text-[11px] font-medium text-foreground">
                  LinkedIn
                </span>
              </button>

              {/* WhatsApp */}
              <button
                type="button"
                onClick={() =>
                  openShareUrl(
                    `https://api.whatsapp.com/send?text=${encodeURIComponent(
                      shareText + " " + pageUrl,
                    )}`,
                  )
                }
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-muted/50 hover:bg-muted border border-border/60 hover:border-emerald-500/50 transition-all hover:scale-105"
              >
                <MessageCircle className="w-5 h-5 text-emerald-500" />
                <span className="text-[11px] font-medium text-foreground">
                  WhatsApp
                </span>
              </button>

              {/* Reddit */}
              <button
                type="button"
                onClick={() =>
                  openShareUrl(
                    `https://reddit.com/submit?url=${encodeURIComponent(
                      pageUrl,
                    )}&title=${encodeURIComponent(EXTENSION_NAME)}`,
                  )
                }
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-muted/50 hover:bg-muted border border-border/60 hover:border-orange-500/50 transition-all hover:scale-105"
              >
                <span className="text-base font-bold text-orange-500">r/</span>
                <span className="text-[11px] font-medium text-foreground">
                  Reddit
                </span>
              </button>

              {/* Telegram */}
              <button
                type="button"
                onClick={() =>
                  openShareUrl(
                    `https://t.me/share/url?url=${encodeURIComponent(
                      pageUrl,
                    )}&text=${encodeURIComponent(shareText)}`,
                  )
                }
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-muted/50 hover:bg-muted border border-border/60 hover:border-sky-500/50 transition-all hover:scale-105"
              >
                <Send className="w-5 h-5 text-sky-500" />
                <span className="text-[11px] font-medium text-foreground">
                  Telegram
                </span>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={() =>
                  openShareUrl(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      pageUrl,
                    )}`,
                  )
                }
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-muted/50 hover:bg-muted border border-border/60 hover:border-blue-600/50 transition-all hover:scale-105"
              >
                <span className="text-base font-bold text-blue-600">f</span>
                <span className="text-[11px] font-medium text-foreground">
                  Facebook
                </span>
              </button>

              {/* Hacker News */}
              <button
                type="button"
                onClick={() =>
                  openShareUrl(
                    `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(
                      pageUrl,
                    )}&t=${encodeURIComponent(
                      "Show HN: Color Picker - Fast Eyedropper, OKLCH and WCAG Tool",
                    )}`,
                  )
                }
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-muted/50 hover:bg-muted border border-border/60 hover:border-amber-500/50 transition-all hover:scale-105"
              >
                <span className="w-5 h-5 rounded bg-[#ff6600] text-white flex items-center justify-center font-bold text-xs">
                  Y
                </span>
                <span className="text-[11px] font-medium text-foreground">
                  HN
                </span>
              </button>

              {/* Email */}
              <button
                type="button"
                onClick={() =>
                  openShareUrl(
                    `mailto:?subject=${encodeURIComponent(
                      "Check out Color Picker Extension",
                    )}&body=${encodeURIComponent(shareText + "\n\n" + pageUrl)}`,
                  )
                }
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-muted/50 hover:bg-muted border border-border/60 hover:border-primary/50 transition-all hover:scale-105"
              >
                <FileText className="w-5 h-5 text-muted-foreground" />
                <span className="text-[11px] font-medium text-foreground">
                  Email
                </span>
              </button>
            </div>

            {/* Direct Link Copy Box */}
            <div className="p-3 rounded-2xl bg-muted/50 border border-border/70 flex items-center justify-between gap-2">
              <input
                type="text"
                readOnly
                value={pageUrl}
                className="bg-transparent text-xs text-muted-foreground font-mono truncate w-full outline-hidden"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shrink-0 flex items-center gap-1"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
