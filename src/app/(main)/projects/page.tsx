import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ExternalLink, Sparkles, ArrowRight } from "lucide-react";
import { Github } from "@/components/icons";
import { getProjects } from "@/lib/keystatic-data";
import { SITE_CONFIG } from "@/config/constants";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle-v2";
import { ChromeLogo } from "@/components/projects/universal-pdf-exporter-landing";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: "Projects & Applications | Prahlad Inala",
  description:
    "Explore developer tools, browser extensions, and full-stack web applications created by Prahlad Inala. Featuring Universal AI Chat PDF Exporter, ToolMate, and more.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/projects`,
  },
  openGraph: {
    title: "Projects & Applications | Prahlad Inala",
    description:
      "Explore developer tools, browser extensions, and web apps built by Prahlad Inala.",
    url: `${SITE_CONFIG.url}/projects`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects & Applications | Prahlad Inala",
    description:
      "Explore developer tools, browser extensions, and web apps built by Prahlad Inala.",
  },
};

export default function ProjectsIndexPage() {
  const projects = getProjects();

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects & Applications | Prahlad Inala",
    description:
      "Developer tools, browser extensions, and web applications built by Prahlad Inala.",
    url: `${SITE_CONFIG.url}/projects`,
    isPartOf: {
      "@type": "WebSite",
      url: SITE_CONFIG.url,
      name: SITE_CONFIG.name,
    },
  };

  const aiExporterProject = projects.find(
    (p) =>
      p.id === "universal-ai-chat-pdf-exporter" ||
      p.id === "ai-chat-export-pdf" ||
      p.title.toLowerCase().includes("universal ai chat"),
  );

  const otherProjects = projects.filter((p) => p.id !== aiExporterProject?.id);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
      <Script
        id="projects-collection-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Top Bar with Breadcrumbs & Theme Toggle */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
          <span className="text-foreground font-semibold">Projects</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Hero Header */}
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Software Works</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground mb-4">
          Projects &amp; Developer Tools
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Production applications, browser extensions, and developer utilities
          designed with a relentless focus on performance, aesthetics, and user
          privacy.
        </p>
      </div>

      {/* SPOTLIGHT HERO: Universal AI Chat PDF Exporter */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-card via-card to-primary/5 border border-primary/30 p-8 sm:p-10 mb-16 shadow-xl group">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/25 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Featured Launch</span>
              <span className="text-muted-foreground">•</span>
              <span>Chrome Extension</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
              Universal AI Chat PDF Exporter
            </h2>

            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              Export and archive full conversations from ChatGPT, Claude,
              Gemini, DeepSeek, and 12+ platforms into clean, presentation-grade
              PDFs with a zero-loss completeness guarantee. 100% private and
              runs locally in your browser.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              <Badge variant="secondary">Chrome Extension</Badge>
              <Badge variant="secondary">TypeScript</Badge>
              <Badge variant="secondary">React</Badge>
              <Badge variant="secondary">Local-First</Badge>
              <Badge variant="secondary">Zero-Loss Capture</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/projects/universal-ai-chat-pdf-exporter"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-full shadow-md",
                )}
              >
                <span>View Product Landing Page</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <a
                href="https://chromewebstore.google.com/detail/universal-ai-chat-pdf-exp/encgjibigfmpfagdialjgobjocaooacd?authuser=0&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-full flex items-center gap-2",
                )}
              >
                <ChromeLogo className="w-4 h-4" />
                <span>Add to Chrome</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground ml-1" />
              </a>
            </div>
          </div>

          <div className="w-full lg:w-1/2 aspect-video rounded-2xl overflow-hidden border border-border/80 shadow-2xl relative bg-muted group-hover:scale-[1.01] transition-transform duration-300">
            <Image
              src="/images/projects/universal-ai-chat-pdf-exporter/renderer-dark-framed.png"
              alt="Universal AI Chat PDF Exporter Dark Theme"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* ALL PROJECTS GRID */}
      <div>
        <h3 className="text-2xl font-bold tracking-tight mb-6">
          All Applications
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherProjects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all hover:-translate-y-1 shadow-xs group"
            >
              <div className="relative aspect-video bg-muted border-b border-border overflow-hidden">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-muted to-background/50 flex items-center justify-center">
                    <span className="text-4xl opacity-20">🚀</span>
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h4>
                <p className="text-muted-foreground text-sm mb-6 flex-1">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-md">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="Live App"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
