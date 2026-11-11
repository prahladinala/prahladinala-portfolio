"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  FileText,
  ChevronRight,
  Share2,
  Copy,
  Sparkles,
  Code2,
  ExternalLink,
  Zap,
  Sliders,
  CheckCircle2,
  Check,
  Eye,
  EyeOff,
  ArrowRight,
  Sigma,
  Network,
} from "lucide-react";
import { Github, Linkedin, Twitter } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const SCREENSHOT_TABS = [
  {
    id: "overview",
    title: "Crisp Light Theme",
    subtitle:
      "Vector-ready, publication-grade layout with interactive document options toolbar",
    image: "/images/projects/universal-ai-chat-pdf-exporter/renderer-light.png",
    alt: "Universal AI Chat PDF Exporter Crisp Light Document Renderer",
    badge: "Document Workspace",
  },
  {
    id: "dark",
    title: "Dark Obsidian Theme",
    subtitle:
      "High-contrast night reading with tailored Prism syntax highlighting",
    image: "/images/projects/universal-ai-chat-pdf-exporter/renderer-dark.png",
    alt: "Universal AI Chat PDF Exporter Dark Theme Document Renderer",
    badge: "Night Mode",
  },
  {
    id: "guarantee",
    title: "Completeness Guarantee",
    subtitle:
      "3-step virtualized sweep (Top History, Slow Sweep, Zero-Loss Check) ensuring 0 messages lost",
    image:
      "/images/projects/universal-ai-chat-pdf-exporter/completeness-guarantee.png",
    alt: "Completeness Guarantee Progress Dialog",
    badge: "Zero-Loss Engine",
  },
  {
    id: "modal",
    title: "Export Options Dialog",
    subtitle:
      "Toggle timestamps, code blocks, table of contents, citations, images, and paper sizes (A4/Letter)",
    image: "/images/projects/universal-ai-chat-pdf-exporter/export-modal.png",
    alt: "Export Options Configuration Dialog",
    badge: "One-Click Config",
  },
  {
    id: "popup",
    title: "Browser Extension Popup",
    subtitle:
      "Real-time AI platform detection with least-privileged, per-site permission grants",
    image: "/images/projects/universal-ai-chat-pdf-exporter/popup.png",
    alt: "Browser Extension Popup showing active chat window detection",
    badge: "Smart Detection",
  },
];

const SUPPORTED_PLATFORMS = [
  {
    name: "OpenAI ChatGPT",
    host: "chatgpt.com",
    badge: "GPT-4o, o1, Canvas",
    description:
      "Extracts full conversation history, custom GPTs, code blocks, and timestamps.",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
  },
  {
    name: "Anthropic Claude",
    host: "claude.ai",
    badge: "Claude 3.5 Sonnet, Artifacts",
    description:
      "Preserves artifacts, nested blockquotes, multi-turn system prompts, and projects.",
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/30",
  },
  {
    name: "Google Gemini",
    host: "gemini.google.com",
    badge: "Gemini 1.5 Pro & Flash",
    description:
      "Cleanly captures web citations, structured code, and multi-modal turns.",
    color: "from-blue-500/20 to-indigo-500/10 border-blue-500/30",
  },
  {
    name: "DeepSeek",
    host: "chat.deepseek.com",
    badge: "DeepSeek-V3 & R1 Reasoning",
    description:
      "Specialized extraction for R1 reasoning and thought processes in formatted callouts.",
    color: "from-sky-500/20 to-blue-500/10 border-sky-500/30",
  },
  {
    name: "Microsoft Copilot",
    host: "copilot.microsoft.com",
    badge: "Pro & Work",
    description:
      "Captures search attributions, formatted code blocks, and conversation turns.",
    color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30",
  },
  {
    name: "Perplexity AI",
    host: "perplexity.ai",
    badge: "Pro Search & Citations",
    description:
      "Preserves search queries, answers, and numbered web reference citations.",
    color: "from-teal-500/20 to-emerald-500/10 border-teal-500/30",
  },
  {
    name: "xAI Grok",
    host: "grok.com",
    badge: "Grok 2",
    description:
      "Accurately extracts chat bubbles, markdown syntax, and conversation headers.",
    color: "from-purple-500/20 to-pink-500/10 border-purple-500/30",
  },
  {
    name: "Mistral AI",
    host: "chat.mistral.ai",
    badge: "Le Chat",
    description:
      "Extracts markdown, code indentation, and fast inference conversation turns.",
    color: "from-orange-500/20 to-red-500/10 border-orange-500/30",
  },
  {
    name: "HuggingChat",
    host: "huggingface.co/chat",
    badge: "Open Source LLMs",
    description:
      "Supports open models with syntax styling and parameter configurations.",
    color: "from-yellow-500/20 to-amber-500/10 border-yellow-500/30",
  },
  {
    name: "v0 by Vercel",
    host: "v0.dev",
    badge: "Generative UI",
    description:
      "Preserves UI component iteration history and design system prompts.",
    color: "from-zinc-500/20 to-slate-500/10 border-zinc-500/30",
  },
  {
    name: "Poe by Quora",
    host: "poe.com",
    badge: "Multi-Bot",
    description:
      "Supports multi-bot conversation history, custom bots, and markdown.",
    color: "from-violet-500/20 to-purple-500/10 border-violet-500/30",
  },
  {
    name: "Cursor Composer",
    host: "cursor.com",
    badge: "Developer IDE Chats",
    description:
      "Exports prompt exchanges and diff summaries into neat architectural docs.",
    color: "from-rose-500/20 to-pink-500/10 border-rose-500/30",
  },
];

const FEATURES_DEEP_DIVE = [
  {
    icon: RefreshCw,
    title: "Zero-Loss Virtualization Traversal",
    subtitle: "Never suffer cut-off or truncated chat exports again",
    description:
      "Modern AI web apps use virtualized DOM lists that aggressively unmount older messages when scrolling down. Our intelligent capture engine automatically sweeps from top to bottom, dynamically loading and deduplicating every turn before safely restoring your exact scroll position.",
    details: [
      "Step 1: Top History scan loads root messages",
      "Step 2: Slow Sweep traverses virtualized turn boundaries",
      "Step 3: Zero-Loss verification check guarantees 0 dropped messages",
    ],
  },
  {
    icon: Code2,
    title: "Syntax-Highlighted Code with Multi-Themes",
    subtitle: "Production-grade code blocks across 15+ languages",
    description:
      "Code is preserved with precise indentation, line numbering, language badges, and sensible line-wrapping that never breaks horizontally or clips off page margins during print.",
    details: [
      "Customizable Themes: GitHub Dark, One Dark, Monokai, VS Code Light, Solarized",
      "Supported: TypeScript, Python, Rust, SQL, Bash, Go, JSON, C++, YAML, and more",
      "CSS page-break-inside avoid prevents awkward splits in code logic",
    ],
  },
  {
    icon: Sigma,
    title: "Mathematical Formulas & Vector Diagrams",
    subtitle: "KaTeX math notation & Mermaid diagrams rendered as vectors",
    description:
      "Complex research and architecture conversations stay readable. Mathematical formulas ($E=mc^2$, matrices, Greek symbols) are compiled through KaTeX, while Mermaid diagram scripts are converted into crisp, high-resolution vector SVG graphics directly inside the PDF.",
    details: [
      "High-resolution KaTeX rendering with sub-pixel equation crispness",
      "Mermaid flowchart, sequence, and entity-relationship diagram support",
      "Clean vector graphics that remain sharp at any zoom level",
    ],
  },
  {
    icon: Sparkles,
    title: "DeepSeek-R1 Thought Process Preservation",
    subtitle: "Capture chain-of-thought reasoning without visual clutter",
    description:
      "DeepSeek-R1 and similar reasoning models generate comprehensive thinking sequences. Our adapter extracts these thought processes into dedicated, collapsible callout sections with custom styling.",
    details: [
      "Distinguishes thinking rationale from final synthesized answers",
      "Collapsible and printable callout formatting with custom badges",
      "Complete auditability for research papers and prompt engineering logs",
    ],
  },
  {
    icon: ShieldCheck,
    title: "1-Click PII & Secret Redaction",
    subtitle: "Built-in privacy filters before sharing with clients or teams",
    description:
      "Accidentally shared an OpenAI API key, email address, or staging phone number during debugging? Toggle the 'Redact PII' switch to automatically mask sensitive credentials before generating your shareable file.",
    details: [
      "Auto-detects API tokens (sk-...), JWTs, Bearer credentials",
      "Redacts email addresses, phone numbers, and IPv4 addresses",
      "Reversible in preview mode; strictly applied to generated export",
    ],
  },
  {
    icon: FileText,
    title: "Multi-Format Export Hub",
    subtitle: "PDF, Markdown (.md), JSON, EPUB, & Standalone HTML",
    description:
      "Freedom from single-format lock-in. Alongside instant 1-Click native PDFs, export your conversation into clean Markdown notes for Obsidian/Notion, raw JSON for datasets, EPUB for e-readers, or standalone HTML.",
    details: [
      "1-Click Native PDF + System Print Dialog (A4 & US Letter)",
      "Standard Markdown (.md) formatted with frontmatter and YAML metadata",
      "Structured JSON schema export for programmatic LLM evaluation pipelines",
    ],
  },
];

const COMPARISON_ROWS = [
  {
    feature: "Long / Virtualized Conversations",
    extension: "Full Zero-Loss Sweep (100+ turns captured)",
    browserPrint: "Cuts off after 5-10 messages",
    otherTools: "Often fails or requires manual copy-paste",
  },
  {
    feature: "Privacy & Data Storage",
    extension: "100% Local (0 servers, memory-only session)",
    browserPrint: "Local but broken layout",
    otherTools: "Uploads your chats to third-party cloud",
  },
  {
    feature: "Code & Math Formatting",
    extension: "Prism syntax highlighting + KaTeX math",
    browserPrint: "Unstyled text, clipping horizontally",
    otherTools: "Plain text or broken typography",
  },
  {
    feature: "Mermaid Diagrams & Surveys",
    extension: "Rendered as crisp vector SVG blocks",
    browserPrint: "Missing or raw text code",
    otherTools: "Usually missing completely",
  },
  {
    feature: "PII & Secret Redaction",
    extension: "1-Click automated redaction filter",
    browserPrint: "Manual editing required",
    otherTools: "No privacy sanitization",
  },
  {
    feature: "Multi-Format Output",
    extension: "PDF, Markdown, JSON, EPUB, HTML",
    browserPrint: "PDF only",
    otherTools: "PDF only (often with watermarks)",
  },
];

function RefreshCw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

const CHROME_STORE_URL =
  "https://chromewebstore.google.com/detail/universal-ai-chat-pdf-exp/encgjibigfmpfagdialjgobjocaooacd?authuser=0&hl=en";

function ChromeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A6 6 0 0 1 12 6h9.948A12.001 12.001 0 0 0 12 0zm-8.823 6.5A11.968 11.968 0 0 0 0 12c0 5.482 3.676 10.106 8.683 11.517l3.952-6.845a6 6 0 0 1-5.698-3.328L3.177 6.5zm9.52 9.5a6 6 0 0 1-2.697-.643l-3.953 6.845A11.97 11.97 0 0 0 12 24c6.627 0 12-5.373 12-12 0-.34-.015-.675-.043-1.008H13.95a5.99 5.99 0 0 1-1.253 5.008z" />
      <circle cx="12" cy="12" r="3.5" />
    </svg>
  );
}

export function UniversalPdfExporterLanding() {
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedLink, setCopiedLink] = useState(false);
  const [simTheme, setSimTheme] = useState<"light" | "dark" | "sepia">("light");
  const [redactPii, setRedactPii] = useState(false);

  const currentTab =
    SCREENSHOT_TABS.find((t) => t.id === activeTab) || SCREENSHOT_TABS[0];

  const pageUrl =
    "https://www.prahladinala.in/projects/universal-ai-chat-pdf-exporter";
  const shareText =
    "Universal AI Chat PDF Exporter by @prahladinala — Export full conversations from ChatGPT, Claude, Gemini & DeepSeek to clean, shareable PDFs with zero loss!";

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(pageUrl);
      setCopiedLink(true);
      toast.success("Page link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText,
    )}&url=${encodeURIComponent(pageUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      pageUrl,
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-primary/15 via-blue-500/10 to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-96 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-3xl -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-6xl">
        {/* Top Breadcrumb & Share Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <nav className="flex items-center text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
            <Link
              href="/projects"
              className="hover:text-primary transition-colors"
            >
              Projects
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
            <span className="text-foreground font-semibold truncate max-w-[220px] sm:max-w-none">
              Universal AI Chat PDF Exporter
            </span>
          </nav>

          {/* Social Share & Store Buttons */}
          <div className="flex items-center gap-2">
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/25 hover:bg-primary/20 text-xs font-semibold transition-all hover:scale-105 shadow-xs"
              title="View on Chrome Web Store"
            >
              <ChromeIcon className="w-3.5 h-3.5" />
              <span>Chrome Web Store</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
            <button
              type="button"
              onClick={handleShareTwitter}
              aria-label="Share on X / Twitter"
              className="p-2 rounded-lg bg-card border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all hover:scale-105 shadow-xs"
              title="Share on X (Twitter)"
            >
              <Twitter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleShareLinkedIn}
              aria-label="Share on LinkedIn"
              className="p-2 rounded-lg bg-card border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all hover:scale-105 shadow-xs"
              title="Share on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border hover:border-primary/50 text-xs font-medium text-foreground transition-all hover:scale-105 shadow-xs"
              title="Copy page link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="text-center max-w-4xl mx-auto pt-4 pb-14">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/25 mb-6 shadow-xs animate-in fade-in duration-500">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Available on Chrome Web Store</span>
            <span className="text-muted-foreground">•</span>
            <span>100% Local-First Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.15] mb-6">
            Export AI Chats into{" "}
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              Beautiful, Presentation-Grade PDFs
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Archive full conversations from <strong>ChatGPT</strong>,{" "}
            <strong>Claude</strong>, <strong>Gemini</strong>,{" "}
            <strong>DeepSeek</strong>, and 12+ platforms with one click.
            Preserves every code snippet, mathematical formula, diagram, and
            thought process with zero cloud transmission.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full px-7 py-6 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all hover:scale-[1.02] bg-gradient-to-r from-blue-600 via-indigo-600 to-primary text-white",
              )}
            >
              <ChromeIcon className="mr-2.5 w-5 h-5 fill-white" />
              Add to Chrome — It&apos;s Free
            </a>

            <a
              href="#showcase"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full px-7 py-6 text-base font-semibold border-border hover:border-primary/50 transition-all hover:scale-[1.02]",
              )}
            >
              <Eye className="mr-2 w-5 h-5 text-primary" />
              Explore Live Showcase
            </a>

            <a
              href="https://github.com/prahladinala/universal-ai-chat-pdf-exporter"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "rounded-full px-5 py-6 text-base text-muted-foreground hover:text-foreground",
              )}
            >
              <Github className="mr-2 w-5 h-5" />
              Source Code
            </a>
          </div>

          {/* Trust Highlights Strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs sm:text-sm text-muted-foreground font-medium pt-4 border-t border-border/50 max-w-3xl mx-auto">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" /> 100% Local Processing
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Zero
              Messages Dropped
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-500 shrink-0" /> Zero Cloud
              Storage
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-500 shrink-0" />{" "}
              Multi-Format Exports
            </span>
          </div>
        </div>

        {/* INTERACTIVE VISUAL SHOWCASE (Using the 5 user images) */}
        <section id="showcase" className="mb-24 scroll-mt-20">
          <div className="flex flex-col items-center mb-8 text-center">
            <Badge
              variant="outline"
              className="mb-3 px-3 py-1 font-mono text-xs"
            >
              Interactive Product Showcase
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Engineered for Perfection &amp; Readability
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl">
              Switch through the live screenshots to see how Universal AI Chat
              PDF Exporter captures, configures, and renders your AI
              conversations.
            </p>
          </div>

          {/* Screenshot Navigation Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {SCREENSHOT_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-[1.02]"
                      : "bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <span>{tab.title}</span>
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-mono uppercase tracking-wider",
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
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border/70 bg-muted/40">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-muted-foreground ml-3 hidden sm:inline">
                  chrome-extension://renderer.html — {currentTab.title}
                </span>
              </div>
              <div className="text-xs font-medium text-muted-foreground">
                {currentTab.badge}
              </div>
            </div>

            {/* Image Viewer */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[16/10] bg-muted/20 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
              <Image
                src={currentTab.image}
                alt={currentTab.alt}
                width={1280}
                height={720}
                className="rounded-lg sm:rounded-xl shadow-lg border border-border/40 object-contain max-h-full w-auto transition-all duration-300"
                priority
              />
            </div>

            {/* Caption Footer */}
            <div className="px-6 py-4 bg-card border-t border-border/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span>{currentTab.title}</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {currentTab.badge}
                  </Badge>
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {currentTab.subtitle}
                </p>
              </div>
              <a
                href={currentTab.image}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1 shrink-0"
              >
                <span>View Full Resolution</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </section>

        {/* SUPPORTED PLATFORMS MATRIX (12+ Platforms) */}
        <section className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
              <Network className="w-3.5 h-3.5" />
              <span>Universal Compatibility</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Works Across Every Major AI Platform
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Tested against live DOM structures with resilient fallback
              selectors. Grant optional permissions strictly to the platforms
              you choose.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUPPORTED_PLATFORMS.map((platform) => (
              <div
                key={platform.name}
                className={cn(
                  "p-5 rounded-2xl border bg-gradient-to-br transition-all hover:scale-[1.02] hover:shadow-md flex flex-col justify-between",
                  platform.color,
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-bold text-foreground text-base">
                      {platform.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="text-[11px] font-mono"
                    >
                      {platform.badge}
                    </Badge>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground mb-3">
                    {platform.host}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {platform.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Supported
                  </span>
                  <span className="font-mono">Active Tab</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CORE CAPABILITIES & DEEP DIVE */}
        <section className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>Engineered For Developers &amp; Researchers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Core Capabilities Under the Hood
            </h2>
            <p className="text-muted-foreground text-base">
              Why Universal AI Chat PDF Exporter succeeds where generic browser
              print dialogs and cloud converters fail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES_DEEP_DIVE.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-7 rounded-3xl bg-card border border-border/80 hover:border-primary/50 transition-all hover:shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs font-medium text-primary uppercase tracking-wider mb-3">
                      {feature.subtitle}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                      {feature.description}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-4 border-t border-border/60">
                    {feature.details.map((detail, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-foreground/85 flex items-start gap-2 leading-snug"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* INTERACTIVE WORKSPACE SIMULATOR */}
        <section className="mb-24 p-6 sm:p-10 rounded-3xl bg-card border border-border/80 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/70">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2">
                <Sliders className="w-3 h-3" />
                <span>Live Interactive Preview</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                Document Customizer Simulator
              </h3>
              <p className="text-sm text-muted-foreground">
                Test the dynamic document themes and 1-Click sensitive data
                redaction filter.
              </p>
            </div>

            {/* Interactive Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/60 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setSimTheme("light")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-all",
                    simTheme === "light"
                      ? "bg-background text-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Crisp Light
                </button>
                <button
                  type="button"
                  onClick={() => setSimTheme("dark")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-all",
                    simTheme === "dark"
                      ? "bg-background text-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Dark Obsidian
                </button>
                <button
                  type="button"
                  onClick={() => setSimTheme("sepia")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-all",
                    simTheme === "sepia"
                      ? "bg-[#f4ecd8] text-[#5b4636] shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Warm Sepia
                </button>
              </div>

              {/* Redaction Toggle */}
              <button
                type="button"
                onClick={() => setRedactPii(!redactPii)}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all shadow-xs",
                  redactPii
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    : "bg-muted/60 text-muted-foreground border-border/60 hover:text-foreground",
                )}
              >
                {redactPii ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
                <span>Redact PII: {redactPii ? "ON" : "OFF"}</span>
              </button>
            </div>
          </div>

          {/* Simulator Document Preview Box */}
          <div
            className={cn(
              "mt-8 p-6 sm:p-8 rounded-2xl border transition-all duration-300 font-sans shadow-inner",
              simTheme === "light" && "bg-white text-zinc-900 border-zinc-200",
              simTheme === "dark" &&
                "bg-zinc-950 text-zinc-100 border-zinc-800",
              simTheme === "sepia" &&
                "bg-[#fbf7ee] text-[#433422] border-[#e7dac2]",
            )}
          >
            {/* Document Header */}
            <div className="border-b pb-4 mb-5 border-current/15">
              <div className="flex items-center justify-between text-xs opacity-70 mb-2">
                <span className="font-mono uppercase font-bold tracking-wider">
                  CHATGPT • GPT-4O
                </span>
                <span>Exported: Nov 11, 2026, 12:25 PM</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold tracking-tight">
                Architectural RFC: Local-First Session Data Isolation
              </h4>
              <p className="text-xs opacity-75 mt-1 font-mono">
                Source: https://chatgpt.com/c/arch-session-rfc-2026
              </p>
            </div>

            {/* Simulated Turn 1: User */}
            <div className="mb-6 p-4 rounded-xl border border-current/10 bg-current/[0.03]">
              <div className="flex items-center justify-between text-xs font-bold mb-2 opacity-80">
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-[10px]">
                    U
                  </span>
                  <span>USER</span>
                </span>
                <span className="font-mono text-[11px] opacity-60">
                  10:14 AM
                </span>
              </div>
              <p className="text-sm">
                How should we authenticate with the staging cluster securely
                without leaking our API key?
              </p>
              <p className="text-xs font-mono mt-2 p-2 rounded bg-current/[0.05]">
                Developer Contact:{" "}
                {redactPii ? (
                  <span className="bg-red-500/20 text-red-500 font-bold px-1 rounded">
                    [REDACTED_EMAIL]
                  </span>
                ) : (
                  <span className="font-semibold">
                    prahlad@internal-staging.dev
                  </span>
                )}
                {" • "}
                API Key:{" "}
                {redactPii ? (
                  <span className="bg-red-500/20 text-red-500 font-bold px-1 rounded">
                    [REDACTED_TOKEN_sk-live-94a2...]
                  </span>
                ) : (
                  <span className="font-semibold">
                    sk-live-94a28b17c99e4f01
                  </span>
                )}
              </p>
            </div>

            {/* Simulated Turn 2: Assistant */}
            <div className="p-4 rounded-xl border border-current/10 bg-current/[0.03]">
              <div className="flex items-center justify-between text-xs font-bold mb-2 opacity-80">
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                    AI
                  </span>
                  <span>ASSISTANT</span>
                </span>
                <span className="font-mono text-[11px] opacity-60">
                  10:15 AM
                </span>
              </div>

              {/* Reasoning Block */}
              <div className="mb-3 p-3 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-xs">
                <div className="font-semibold text-indigo-500 dark:text-indigo-400 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    Thinking Process: Secret Masking &amp; Least Privilege
                  </span>
                </div>
                <p className="opacity-80">
                  Evaluated bearer token scoping vs. client-side memory vaults.
                  Recommended short-lived STS tokens.
                </p>
              </div>

              {/* Code Snippet */}
              <div className="rounded-lg overflow-hidden border border-current/15 text-xs font-mono my-3 bg-current/[0.05] p-3">
                <div className="opacity-50 text-[10px] uppercase mb-1">
                  typescript
                </div>
                <pre className="overflow-x-auto leading-relaxed">
                  <code>{`// Zero-knowledge session handoff
export async function initializeSessionVault(token: string) {
  const ephemeralKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
  return { status: "ready", session: "isolated" };
}`}</code>
                </pre>
              </div>

              <p className="text-sm">
                Always ensure sensitive credentials are scrubbed prior to
                publishing logs to shared channels.
              </p>
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Why Universal AI Chat PDF Exporter?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Comparing native features against standard browser print and
              third-party web converters.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card overflow-x-auto shadow-md">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-muted/40 font-semibold text-foreground">
                  <th className="p-4 sm:p-5">Capability / Requirement</th>
                  <th className="p-4 sm:p-5 text-primary bg-primary/5">
                    Universal AI Chat PDF Exporter
                  </th>
                  <th className="p-4 sm:p-5 text-muted-foreground">
                    Standard Browser Ctrl+P
                  </th>
                  <th className="p-4 sm:p-5 text-muted-foreground">
                    Cloud PDF Converters
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 sm:p-5 font-medium text-foreground">
                      {row.feature}
                    </td>
                    <td className="p-4 sm:p-5 font-semibold text-primary bg-primary/5 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{row.extension}</span>
                    </td>
                    <td className="p-4 sm:p-5 text-muted-foreground">
                      {row.browserPrint}
                    </td>
                    <td className="p-4 sm:p-5 text-muted-foreground">
                      {row.otherTools}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* PRIVACY & SECURITY FIRST */}
        <section className="mb-24 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-card via-muted/30 to-card border border-border/80 shadow-lg">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-xs">
              <Lock className="w-7 h-7" />
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight mb-4">
              Privacy First. Zero Cloud Transmission.
            </h2>

            <p className="text-muted-foreground text-base leading-relaxed mb-8">
              Your conversations often include proprietary software
              architectures, legal queries, medical notes, or personal
              brainstorming. Universal AI Chat PDF Exporter is built with a
              strict <strong>local-first philosophy</strong>:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left mb-8">
              <div className="p-4 rounded-2xl bg-background border border-border/60">
                <div className="font-bold text-sm text-foreground mb-1">
                  0 External Servers
                </div>
                <p className="text-xs text-muted-foreground">
                  Parsing, formatting, and file generation happen 100% inside
                  your local browser process memory.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-background border border-border/60">
                <div className="font-bold text-sm text-foreground mb-1">
                  Memory-Only Handoff
                </div>
                <p className="text-xs text-muted-foreground">
                  The extension passes conversation data via temporary session
                  memory and wipes it the millisecond the renderer opens.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-background border border-border/60">
                <div className="font-bold text-sm text-foreground mb-1">
                  Least-Privileged Scopes
                </div>
                <p className="text-xs text-muted-foreground">
                  Uses optional host permissions. Access is only requested when
                  you choose to export from an authorized AI domain.
                </p>
              </div>
            </div>

            <Link
              href="/privacy-policy/universal-ai-chat-to-pdf-export"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              <span>Read the Official Privacy Policy</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* INSTALLATION & QUICK START */}
        <section className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Quick Start in 3 Easy Steps
            </h2>
            <p className="text-muted-foreground text-sm">
              Start archiving your conversations in less than 60 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border/80 relative flex flex-col justify-between">
              <div>
                <div className="text-3xl font-extrabold text-primary/30 mb-3 font-mono">
                  01
                </div>
                <h3 className="font-bold text-base text-foreground mb-2">
                  Install the Extension
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Add Universal AI Chat PDF Exporter with 1 click directly from
                  the Chrome Web Store or download the unpacked release bundle.
                </p>
              </div>
              <a
                href={CHROME_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mt-auto"
              >
                <span>Open in Chrome Web Store</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/80 relative">
              <div className="text-3xl font-extrabold text-primary/30 mb-3 font-mono">
                02
              </div>
              <h3 className="font-bold text-base text-foreground mb-2">
                Open Any AI Chat
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Navigate to your conversation on ChatGPT, Claude, Gemini,
                DeepSeek, or any supported platform.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/80 relative">
              <div className="text-3xl font-extrabold text-primary/30 mb-3 font-mono">
                03
              </div>
              <h3 className="font-bold text-base text-foreground mb-2">
                Click Export or Press Alt+Shift+E
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Preview your document, pick your favorite theme or toggle PII
                redaction, and click &ldquo;1-Click PDF&rdquo;!
              </p>
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-primary/10 via-indigo-500/10 to-cyan-500/10 border border-primary/20 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Ready to Turn Your Conversations into Lasting Documentation?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-8">
              Open source, 100% private, and built for professionals.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={CHROME_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-full px-8 py-6 text-base font-semibold shadow-lg shadow-primary/25 hover:scale-[1.02] transition-all bg-gradient-to-r from-blue-600 via-indigo-600 to-primary text-white",
                )}
              >
                <ChromeIcon className="mr-2.5 w-5 h-5 fill-white" />
                Add to Chrome — It&apos;s Free
              </a>
              <a
                href="https://github.com/prahladinala/universal-ai-chat-pdf-exporter"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-full px-6 py-6 text-base font-semibold hover:border-primary/50",
                )}
              >
                <Github className="mr-2 w-5 h-5" />
                GitHub Repository
              </a>
              <button
                type="button"
                onClick={handleShareTwitter}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "rounded-full px-6 py-6 text-base font-semibold text-muted-foreground hover:text-foreground",
                )}
              >
                <Share2 className="mr-2 w-4 h-4 text-primary" />
                Share
              </button>
            </div>

            <p className="text-xs text-muted-foreground mt-6 font-mono">
              Designed &amp; Developed by Prahlad Inala • Free &amp; Open Source
              under MIT License
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
