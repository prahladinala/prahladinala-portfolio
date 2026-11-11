"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Check,
  Copy,
  Share2,
  ExternalLink,
  X,
  Maximize2,
  ChevronRight,
  Eye,
  Terminal,
  Code2,
  Layers,
  Sun,
  Moon,
  ShieldCheck,
  Zap,
  Sliders,
  Send,
  MessageCircle,
  FileText,
  Palette,
} from "lucide-react";
import { Github, Linkedin, Twitter, VSCode } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle-v2";
import { cn } from "@/lib/utils";

// Extension Constants
const EXTENSION_ID = "PrahladInala.devcraft-themes";
const EXTENSION_NAME = "DevCraft Themes";
const EXTENSION_VERSION = "v1.0.0";
const MARKETPLACE_URL =
  "https://marketplace.visualstudio.com/items?itemName=PrahladInala.devcraft-themes";
const GITHUB_URL = "https://github.com/prahladinala/devcraft-themes/";
const VSCODE_URI = `vscode:extension/${EXTENSION_ID}`;
const VSCODE_INSIDERS_URI = `vscode-insiders:extension/${EXTENSION_ID}`;
const CLI_INSTALL_COMMAND = `code --install-extension ${EXTENSION_ID}`;

// 7 Handcrafted Themes
export interface DevCraftTheme {
  id: string;
  name: string;
  style: "Dark" | "Light";
  accentName: string;
  accentColor: string;
  bgHex: string;
  previewImage: string;
  description: string;
  highlights: string[];
}

export const DEVCRAFT_THEMES: DevCraftTheme[] = [
  {
    id: "obsidian-ink",
    name: "Obsidian Ink",
    style: "Dark",
    accentName: "Electric Cyan",
    accentColor: "#00f0ff",
    bgHex: "#0d1117",
    previewImage: "/images/projects/devcraft-themes/theme6.png",
    description:
      "A deep, high-contrast dark theme with electric cyan and mint syntax accents. Meticulously tuned for nighttime hacking and high-focus deep work.",
    highlights: [
      "Electric Cyan (#00f0ff)",
      "Deep Obsidian Slate (#0d1117)",
      "High-contrast keyword scoping",
      "Crisp comment visibility",
    ],
  },
  {
    id: "aurora-borealis",
    name: "Aurora Borealis",
    style: "Dark",
    accentName: "Nordic Green",
    accentColor: "#10b981",
    bgHex: "#0b1512",
    previewImage: "/images/projects/devcraft-themes/theme1.png",
    description:
      "Inspired by Nordic night skies. Balances calm emerald greens, arctic teals, and soft purples to soothe the eyes during long coding sessions.",
    highlights: [
      "Nordic Green (#10b981)",
      "Arctic Teal & Frost accents",
      "Low eye-fatigue background",
      "Reduced blue light stress",
    ],
  },
  {
    id: "ember-forge",
    name: "Ember Forge",
    style: "Dark",
    accentName: "Molten Orange",
    accentColor: "#f97316",
    bgHex: "#140e0b",
    previewImage: "/images/projects/devcraft-themes/theme2.png",
    description:
      "Warm, energetic, and intense. Molten oranges, gold amber, and volcanic char make code structures and variable assignments pop with clarity.",
    highlights: [
      "Molten Orange (#f97316)",
      "Charcoal ember background",
      "Glowing constants & numbers",
      "High-clarity error & diff states",
    ],
  },
  {
    id: "glacier-light",
    name: "Glacier Light",
    style: "Light",
    accentName: "Icy Blue",
    accentColor: "#0284c7",
    bgHex: "#f8fafc",
    previewImage: "/images/projects/devcraft-themes/theme7.png",
    description:
      "A clean, glare-free light mode engineered for daytime productivity. Crisp icy blues and deep slate typography eliminate harsh reflections in sunlit offices.",
    highlights: [
      "Icy Blue (#0284c7)",
      "Anti-glare paper canvas (#f8fafc)",
      "Deep slate syntax tokens",
      "Ideal for bright sunlight & offices",
    ],
  },
  {
    id: "neon-katana",
    name: "Neon Katana",
    style: "Dark",
    accentName: "Razor Pink",
    accentColor: "#ec4899",
    bgHex: "#120d18",
    previewImage: "/images/projects/devcraft-themes/theme5.png",
    description:
      "Cyberpunk aesthetic with razor pink and neon violet highlights against deep synthwave shadows. Dynamic, futuristic, and full of character.",
    highlights: [
      "Razor Pink (#ec4899)",
      "Neon Violet & Synthwave hues",
      "Deep violet-black background",
      "Distinct operator & punctuation colors",
    ],
  },
  {
    id: "forest-monk",
    name: "Forest Monk",
    style: "Dark",
    accentName: "Earthy Green",
    accentColor: "#84cc16",
    bgHex: "#0f140f",
    previewImage: "/images/projects/devcraft-themes/theme3.png",
    description:
      "A zen-inspired palette rooted in moss green, sage, and deep bamboo tones. Built to create a calm, centered mindset for complex problem solving.",
    highlights: [
      "Earthy Green (#84cc16)",
      "Bamboo & Sage foliage tones",
      "Natural visual equilibrium",
      "Zero cognitive clutter",
    ],
  },
  {
    id: "frosted-glass",
    name: "Frosted Glass",
    style: "Dark",
    accentName: "Soft Indigo",
    accentColor: "#818cf8",
    bgHex: "#11131f",
    previewImage: "/images/projects/devcraft-themes/theme4.png",
    description:
      "Modern, translucent, and aesthetic. Soft indigos, lavender accents, and subtle glowing borders create a sleek, frosted glass UI experience.",
    highlights: [
      "Soft Indigo (#818cf8)",
      "Lavender & Iris highlights",
      "Modern translucent aesthetic",
      "Subtle glowing active borders",
    ],
  },
];

export function DevCraftThemesLanding() {
  const [selectedThemeId, setSelectedThemeId] =
    useState<string>("obsidian-ink");
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [shareCopied, setShareCopied] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const activeTheme = useMemo(() => {
    return (
      DEVCRAFT_THEMES.find((t) => t.id === selectedThemeId) ||
      DEVCRAFT_THEMES[0]
    );
  }, [selectedThemeId]);

  const copyInstallCommand = () => {
    navigator.clipboard.writeText(CLI_INSTALL_COMMAND);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2200);
  };

  const handleShareCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const shareText =
    "DevCraft Themes for VS Code — 7 handcrafted themes engineered for clarity, comfort, and zero eye strain:";
  const pageUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "https://www.prahladinala.in/projects/devcraft-vscode-theme";

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[520px] rounded-full blur-[140px] opacity-20 transition-all duration-700"
          style={{ backgroundColor: activeTheme.accentColor }}
        />
        <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute top-2/3 -right-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      {/* Glassmorphic Sticky Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl border-b border-border/40 transition-all">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm font-medium text-muted-foreground truncate">
            <Link
              href="/"
              className="hover:text-foreground transition-colors hidden sm:inline"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 mx-2 flex-shrink-0 hidden sm:inline opacity-60" />
            <Link
              href="/projects"
              className="hover:text-foreground transition-colors"
            >
              Projects
            </Link>
            <ChevronRight className="w-3.5 h-3.5 mx-2 flex-shrink-0 opacity-60" />
            <span className="text-foreground font-semibold truncate flex items-center gap-1.5">
              <VSCode className="w-4 h-4 text-[#007acc] shrink-0" />
              <span>DevCraft Themes</span>
            </span>
          </nav>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setShareModalOpen(true)}
              className="h-9 px-3 rounded-full border border-border/80 bg-background/50 hover:bg-muted text-xs font-medium text-foreground transition-all flex items-center gap-1.5 shadow-xs"
              title="Share DevCraft Themes"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <ThemeToggle />

            {/* Direct Open in VS Code Button */}
            <a
              href={VSCODE_URI}
              className={cn(
                buttonVariants({ size: "sm" }),
                "rounded-full shadow-md gap-1.5 font-medium bg-[#007acc] hover:bg-[#0062a3] text-white border-0 transition-all text-xs sm:text-sm px-3 sm:px-4",
              )}
              title="Direct 1-Click Install in VS Code"
            >
              <VSCode className="w-3.5 h-3.5 shrink-0" />
              <span>Open in VS Code</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 max-w-6xl">
        {/* HERO SECTION */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-6 shadow-xs">
            <VSCode className="w-4 h-4 text-[#007acc]" />
            <span>VS Code Extension · 7 Handcrafted Themes · MIT License</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground mb-6 leading-[1.1]">
            Code in Comfort.{" "}
            <span
              className="transition-colors duration-500"
              style={{ color: activeTheme.accentColor }}
            >
              Craft with Clarity.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            A premium suite of <strong>7 handcrafted VS Code themes</strong>{" "}
            engineered for clarity, balanced contrast, and reduced visual
            fatigue during marathon coding sessions.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8 w-full">
            {/* Primary: 1-Click Open in VS Code */}
            <a
              href={VSCODE_URI}
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-xl shadow-lg shadow-blue-500/20 gap-2 font-semibold bg-[#007acc] hover:bg-[#0062a3] text-white border-0 h-12 px-6",
              )}
            >
              <VSCode className="w-5 h-5 shrink-0" />
              <span>Install in VS Code</span>
            </a>

            {/* Secondary: VS Code Marketplace */}
            <a
              href={MARKETPLACE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-xl gap-2 font-medium h-12 px-5 bg-card/60 backdrop-blur-md hover:bg-card border-border/80",
              )}
            >
              <span>VS Marketplace</span>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>

            {/* GitHub */}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-xl gap-2 font-medium h-12 px-5 bg-card/60 backdrop-blur-md hover:bg-card border-border/80",
              )}
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>

          {/* Quick Copy Terminal Command */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-card border border-border text-xs sm:text-sm font-mono text-muted-foreground shadow-xs max-w-full overflow-x-auto">
            <Terminal className="w-4 h-4 text-primary shrink-0" />
            <code className="text-foreground select-all truncate">
              {CLI_INSTALL_COMMAND}
            </code>
            <button
              onClick={copyInstallCommand}
              className="ml-1 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all shrink-0"
              title="Copy install command"
            >
              {copiedCmd ? (
                <span className="flex items-center gap-1 text-emerald-500 font-sans text-xs font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </span>
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* INTERACTIVE THEME SHOWCASE */}
        <section className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                <Palette className="w-3.5 h-3.5" />
                <span>Interactive Theme Showcase</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Explore the 7 Environments
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Click any theme below to preview its syntax highlighting, color
              accents, and balanced contrast design.
            </p>
          </div>

          {/* Theme Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-8">
            {DEVCRAFT_THEMES.map((theme) => {
              const isSelected = theme.id === selectedThemeId;
              return (
                <button
                  key={theme.id}
                  onClick={() => setSelectedThemeId(theme.id)}
                  className={cn(
                    "relative flex flex-col items-start p-3 rounded-xl border text-left transition-all group overflow-hidden",
                    isSelected
                      ? "bg-card border-primary ring-2 ring-primary/20 shadow-md"
                      : "bg-card/40 border-border/70 hover:bg-card hover:border-border",
                  )}
                >
                  {/* Top color indicator */}
                  <div className="flex items-center justify-between w-full mb-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs ring-1 ring-black/20"
                      style={{ backgroundColor: theme.accentColor }}
                    />
                    <Badge
                      variant="secondary"
                      className="text-[10px] h-4 px-1.5 font-mono"
                    >
                      {theme.style}
                    </Badge>
                  </div>

                  <span className="font-semibold text-xs sm:text-sm text-foreground truncate w-full group-hover:text-primary transition-colors">
                    {theme.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground truncate w-full">
                    {theme.accentName}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Theme Preview Showcase */}
          <div className="relative rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xl">
            {/* Top Showcase Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-muted/40 border-b border-border/80">
              <div className="flex items-center gap-3">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: activeTheme.accentColor }}
                />
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                    <span>DevCraft: {activeTheme.name}</span>
                    <Badge
                      variant="outline"
                      className="text-xs font-mono font-medium"
                    >
                      {activeTheme.style} Mode
                    </Badge>
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLightboxImage(activeTheme.previewImage)}
                  className="px-3 py-1.5 rounded-lg bg-background/80 hover:bg-background border border-border text-xs font-medium text-foreground flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-primary" />
                  <span>Inspect Fullscreen</span>
                </button>

                <a
                  href={VSCODE_URI}
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "rounded-lg gap-1.5 text-xs font-semibold bg-[#007acc] hover:bg-[#0062a3] text-white border-0 h-8",
                  )}
                >
                  <VSCode className="w-3.5 h-3.5" />
                  <span>Apply in VS Code</span>
                </a>
              </div>
            </div>

            {/* High Resolution Image Container */}
            <div
              className="relative w-full aspect-[16/9] bg-zinc-950 flex items-center justify-center p-2 sm:p-4 cursor-zoom-in group"
              onClick={() => setLightboxImage(activeTheme.previewImage)}
            >
              <Image
                src={activeTheme.previewImage}
                alt={`${activeTheme.name} VS Code Theme Preview`}
                width={1920}
                height={1020}
                className="rounded-lg shadow-xl border border-border/30 object-contain w-full h-full transition-transform duration-300 group-hover:scale-[1.01]"
                priority
              />

              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-md border border-border text-xs text-muted-foreground group-hover:text-foreground flex items-center gap-1.5 shadow-md pointer-events-none transition-all">
                <Maximize2 className="w-3.5 h-3.5 text-primary" />
                <span>Click image to zoom</span>
              </div>
            </div>

            {/* Theme Info & Highlights Footer */}
            <div className="p-4 sm:p-6 bg-card border-t border-border/80 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Theme Philosophy &amp; Experience
                </h4>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {activeTheme.description}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Signature Token Colors
                </h4>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {activeTheme.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: activeTheme.accentColor }}
                      />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* WHY DEVCRAFT - CORE CAPABILITIES */}
        <section className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
              Why DevCraft Themes?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Most themes are built for screenshots. DevCraft is engineered for
              8-hour development sprints, debugging sessions, and code reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all shadow-xs flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-4">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Designed for Readability
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                Carefully calibrated WCAG contrast ratios ensure every token,
                variable, and symbol is instantly recognizable without causing
                eye strain or headaches.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all shadow-xs flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
                <Moon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                6 Rich Dark Variants
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                Not just one generic dark theme. Choose between deep obsidian,
                calm aurora green, energetic molten ember, neon cyberpunk,
                earthy zen, or frosted lavender.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all shadow-xs flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Glacier Light Theme
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                A sharp, crisp light palette that remains glare-free in daylight
                and brightly lit office environments with deep slate text and
                icy blue accents.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all shadow-xs flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Frosted Glass Modern UI
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                Features modern translucent window aesthetics, subtle glowing
                borders, and soft lavender accents that make your editor feel
                like a high-end IDE.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all shadow-xs flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Full Semantic Highlighting
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                Equipped with native <code>semanticHighlighting: true</code>.
                Variables, parameters, object properties, interfaces, and enums
                are distinctly colored beyond basic TextMate scopes.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all shadow-xs flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Instant Hot-Reload Customization
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                Each theme is a clean, single JSON file. Tweak any hex code and
                press <code>Ctrl+Shift+P</code> &rarr; <em>Reload Window</em> to
                test your custom variants instantly.
              </p>
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="mb-20">
          <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                  Complete Theme Roster
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  7 distinct colorways tailored for every workflow and mood.
                </p>
              </div>

              <a
                href={VSCODE_URI}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "rounded-full gap-1.5 text-xs font-semibold bg-[#007acc] hover:bg-[#0062a3] text-white border-0 w-fit",
                )}
              >
                <VSCode className="w-3.5 h-3.5" />
                <span>Install All 7 in VS Code</span>
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/80 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                    <th className="py-3 px-4">Theme Name</th>
                    <th className="py-3 px-4">Style</th>
                    <th className="py-3 px-4">Accent</th>
                    <th className="py-3 px-4">Color Swatch</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {DEVCRAFT_THEMES.map((t) => (
                    <tr
                      key={t.id}
                      className={cn(
                        "hover:bg-muted/40 transition-colors cursor-pointer",
                        t.id === selectedThemeId && "bg-primary/5",
                      )}
                      onClick={() => setSelectedThemeId(t.id)}
                    >
                      <td className="py-3.5 px-4 font-bold text-foreground flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: t.accentColor }}
                        />
                        <span>{t.name}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={t.style === "Dark" ? "secondary" : "outline"}
                          className="text-xs font-mono"
                        >
                          {t.style}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground font-medium">
                        {t.accentName}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-5 h-5 rounded-md border border-border/50 shrink-0 shadow-xs"
                            style={{ backgroundColor: t.accentColor }}
                          />
                          <code className="text-xs text-muted-foreground font-mono">
                            {t.accentColor}
                          </code>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedThemeId(t.id);
                            setLightboxImage(t.previewImage);
                          }}
                          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <span>Preview</span>
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* INSTALLATION METHODS */}
        <section className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
              How to Install DevCraft
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Choose whatever method fits your terminal or editor setup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Method 1: 1-Click Launch */}
            <div className="p-6 rounded-2xl bg-card border border-border shadow-xs flex flex-col">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-[#007acc] flex items-center justify-center font-bold text-sm mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">
                1-Click Direct Launch
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6 flex-1">
                Opens VS Code directly via native protocol handler and navigates
                straight to the extension install panel.
              </p>
              <a
                href={VSCODE_URI}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "rounded-xl gap-2 font-semibold bg-[#007acc] hover:bg-[#0062a3] text-white border-0 w-full justify-center",
                )}
              >
                <VSCode className="w-4 h-4 shrink-0" />
                <span>Open in VS Code</span>
              </a>
            </div>

            {/* Method 2: Command Palette */}
            <div className="p-6 rounded-2xl bg-card border border-border shadow-xs flex flex-col">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">
                Quick Open (Ctrl+P)
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
                Press{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[11px]">
                  Ctrl+P
                </kbd>{" "}
                or{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[11px]">
                  Cmd+P
                </kbd>{" "}
                in VS Code and paste:
              </p>
              <div className="p-2.5 rounded-xl bg-muted/60 border border-border font-mono text-xs text-foreground select-all break-all">
                ext install PrahladInala.devcraft-themes
              </div>
            </div>

            {/* Method 3: Terminal CLI */}
            <div className="p-6 rounded-2xl bg-card border border-border shadow-xs flex flex-col">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-sm mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">
                Command Line (CLI)
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
                Run this single command in your bash, PowerShell, or zsh
                terminal:
              </p>
              <button
                onClick={copyInstallCommand}
                className="p-2.5 rounded-xl bg-muted/60 hover:bg-muted border border-border font-mono text-xs text-foreground flex items-center justify-between gap-2 text-left transition-all group"
              >
                <span className="truncate">{CLI_INSTALL_COMMAND}</span>
                {copiedCmd ? (
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0" />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="rounded-3xl p-8 sm:p-12 border border-border bg-gradient-to-br from-card via-card to-muted/40 text-center relative overflow-hidden shadow-xl">
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[100px] opacity-25"
            style={{ backgroundColor: activeTheme.accentColor }}
          />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
              Upgrade Your Coding Workspace
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Available for free on the Visual Studio Code Marketplace and Open
              Source on GitHub under the MIT License.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href={VSCODE_URI}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-xl shadow-lg gap-2 font-semibold bg-[#007acc] hover:bg-[#0062a3] text-white border-0 h-12 px-6",
                )}
              >
                <VSCode className="w-5 h-5 shrink-0" />
                <span>Open in VS Code</span>
              </a>

              <a
                href={MARKETPLACE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-xl gap-2 font-medium h-12 px-5 bg-card/60 backdrop-blur-md hover:bg-card border-border",
                )}
              >
                <span>Marketplace Listing</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => setShareModalOpen(true)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-xl gap-2 font-medium h-12 px-5 bg-card/60 backdrop-blur-md hover:bg-card border-border",
                )}
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all shadow-lg"
            title="Close zoom preview"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="relative max-w-6xl max-h-[90vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxImage}
              alt="Theme Screenshot Fullscreen Preview"
              width={1920}
              height={1080}
              className="rounded-xl shadow-2xl border border-white/10 object-contain max-h-[85vh] w-auto"
            />
          </div>
        </div>
      )}

      {/* MULTI-CHANNEL SHARE MODAL */}
      {shareModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShareModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg text-foreground">
                  Share DevCraft Themes
                </h3>
              </div>
              <button
                onClick={() => setShareModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Share DevCraft Themes with developers, designers, and engineering
              teams on your favorite network.
            </p>

            {/* Share Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  shareText,
                )}&url=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted hover:border-primary/50 text-foreground transition-all text-xs font-semibold"
              >
                <Twitter className="w-4 h-4 text-[#1da1f2]" />
                <span>X / Twitter</span>
              </a>

              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  pageUrl,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted hover:border-primary/50 text-foreground transition-all text-xs font-semibold"
              >
                <Linkedin className="w-4 h-4 text-[#0a66c2]" />
                <span>LinkedIn</span>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `${shareText} ${pageUrl}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted hover:border-primary/50 text-foreground transition-all text-xs font-semibold"
              >
                <MessageCircle className="w-4 h-4 text-[#25d366]" />
                <span>WhatsApp</span>
              </a>

              {/* Reddit */}
              <a
                href={`https://reddit.com/submit?url=${encodeURIComponent(
                  pageUrl,
                )}&title=${encodeURIComponent(
                  "DevCraft Themes for VS Code — 7 handcrafted themes for clarity and comfort",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted hover:border-primary/50 text-foreground transition-all text-xs font-semibold"
              >
                <span className="w-4 h-4 rounded-full bg-[#ff4500] text-white flex items-center justify-center font-bold text-[10px]">
                  r
                </span>
                <span>Reddit</span>
              </a>
            </div>

            {/* Direct Copy Link */}
            <div className="pt-2">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-muted/60 border border-border">
                <input
                  type="text"
                  readOnly
                  value={pageUrl}
                  className="bg-transparent text-xs text-foreground flex-1 outline-none px-2 font-mono truncate"
                />
                <button
                  onClick={handleShareCopy}
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "rounded-lg text-xs font-semibold h-8 px-3 shrink-0",
                  )}
                >
                  {shareCopied ? (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
