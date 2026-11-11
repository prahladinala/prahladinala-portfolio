import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import {
  ChevronRight,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Github } from "@/components/icons";
import { getProjects } from "@/lib/keystatic-data";
import { SITE_CONFIG } from "@/config/constants";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UniversalPdfExporterLanding } from "@/components/projects/universal-pdf-exporter-landing";
import { ColorPickerLanding } from "@/components/projects/color-picker-landing";
import { DevCraftThemesLanding } from "@/components/projects/devcraft-themes-landing";

const AI_PDF_EXPORTER_SLUGS = [
  "universal-ai-chat-pdf-exporter",
  "universal-ai-chat-to-pdf-export",
  "ai-chat-export-pdf",
  "ai-chat-pdf-exporter",
  "universal-ai-chat-export",
];

const COLOR_PICKER_SLUGS = [
  "color-picker",
  "color-picker-eyedropper-palette-tool",
  "colorpicker",
  "color-picker-eyedropper",
];

const DEVCRAFT_SLUGS = [
  "devcraft-vscode-theme",
  "devcraft-themes",
  "devcraft",
  "devcraft-theme",
  "vscode-devcraft",
];

export async function generateStaticParams() {
  const projects = getProjects();
  const params: { slug: string }[] = [];

  // Register all slugs and aliases for AI PDF Exporter
  AI_PDF_EXPORTER_SLUGS.forEach((slug) => {
    params.push({ slug });
  });

  // Register all slugs and aliases for Color Picker
  COLOR_PICKER_SLUGS.forEach((slug) => {
    params.push({ slug });
  });

  // Register all slugs and aliases for DevCraft Themes
  DEVCRAFT_SLUGS.forEach((slug) => {
    params.push({ slug });
  });

  // Register other project slugs
  projects.forEach((p) => {
    if (
      !AI_PDF_EXPORTER_SLUGS.includes(p.id) &&
      !COLOR_PICKER_SLUGS.includes(p.id) &&
      !DEVCRAFT_SLUGS.includes(p.id)
    ) {
      params.push({ slug: p.id });
    }
  });

  // Alias for ToolMate without hyphen
  if (projects.some((p) => p.id === "tool-mate")) {
    params.push({ slug: "toolmate" });
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();

  if (AI_PDF_EXPORTER_SLUGS.includes(normalizedSlug)) {
    const title =
      "Universal AI Chat PDF Exporter | Export ChatGPT, Claude & DeepSeek to PDF";
    const description =
      "Export and archive your AI conversations into beautifully formatted, shareable PDFs with one click. 100% private, local-first Manifest V3 Chrome extension supporting ChatGPT, Claude, Gemini, DeepSeek and 12+ platforms.";
    const url = `${SITE_CONFIG.url}/projects/universal-ai-chat-pdf-exporter`;
    const ogImage = `${SITE_CONFIG.url}/images/projects/universal-ai-chat-pdf-exporter/renderer-dark.png`;

    return {
      metadataBase: new URL(SITE_CONFIG.url),
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url,
        type: "website",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: "Universal AI Chat PDF Exporter by Prahlad Inala",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        creator: SITE_CONFIG.twitterHandle,
        images: [ogImage],
      },
    };
  }

  if (COLOR_PICKER_SLUGS.includes(normalizedSlug)) {
    const title =
      "Color Picker - Eyedropper & Palette Tool | Screen Eyedropper, OKLCH, Tailwind & WCAG";
    const description =
      "Sample screen colors with native Chromium EyeDropper API (Alt+P), explore modern color formats (OKLCH, HSL, RGB, Tailwind), check WCAG 2.1 contrast, and extract page palettes. 100% offline Manifest V3 Chrome extension.";
    const url = `${SITE_CONFIG.url}/projects/color-picker`;
    const ogImage = `${SITE_CONFIG.url}/images/projects/color-picker/inspector.png`;

    return {
      metadataBase: new URL(SITE_CONFIG.url),
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url,
        type: "website",
        images: [
          {
            url: ogImage,
            width: 800,
            height: 600,
            alt: "Color Picker - Eyedropper & Palette Tool by Prahlad Inala",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        creator: SITE_CONFIG.twitterHandle,
        images: [ogImage],
      },
    };
  }

  if (DEVCRAFT_SLUGS.includes(normalizedSlug)) {
    const title = "DevCraft Themes | Premium VS Code Theme Suite";
    const description =
      "A premium suite of 7 handcrafted VS Code themes designed for clarity, comfort, and long coding sessions. From deep dark palettes like Obsidian Ink to crisp Glacier Light and modern Frosted Glass UI.";
    const url = `${SITE_CONFIG.url}/projects/devcraft-vscode-theme`;
    const ogImage = `${SITE_CONFIG.url}/images/projects/devcraft-themes/theme6.png`;

    return {
      metadataBase: new URL(SITE_CONFIG.url),
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url,
        type: "website",
        images: [
          {
            url: ogImage,
            width: 1920,
            height: 1020,
            alt: "DevCraft Themes for VS Code by Prahlad Inala",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        creator: SITE_CONFIG.twitterHandle,
        images: [ogImage],
      },
    };
  }

  const projects = getProjects();
  const lookupSlug =
    normalizedSlug === "toolmate" ? "tool-mate" : normalizedSlug;
  const project = projects.find((p) => p.id === lookupSlug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const title = `${project.title} | Projects | ${SITE_CONFIG.name}`;
  const description = project.longDescription || project.description;
  const url = `${SITE_CONFIG.url}/projects/${project.id}`;

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: project.image ? [{ url: project.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: SITE_CONFIG.twitterHandle,
      images: project.image ? [project.image] : undefined,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();

  // If this is the Universal AI Chat PDF Exporter, show the rich landing page!
  if (AI_PDF_EXPORTER_SLUGS.includes(normalizedSlug)) {
    const softwareSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Universal AI Chat PDF Exporter",
      operatingSystem: "Google Chrome, Chromium, Microsoft Edge, Brave",
      applicationCategory: "ProductivityApplication",
      url: `${SITE_CONFIG.url}/projects/universal-ai-chat-pdf-exporter`,
      image: `${SITE_CONFIG.url}/images/projects/universal-ai-chat-pdf-exporter/renderer-dark.png`,
      description:
        "Export and archive your AI conversations into beautifully formatted, shareable PDFs with one click. 100% private, client-side execution.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      installUrl:
        "https://chromewebstore.google.com/detail/universal-ai-chat-pdf-exp/encgjibigfmpfagdialjgobjocaooacd?authuser=0&hl=en",
      downloadUrl:
        "https://chromewebstore.google.com/detail/universal-ai-chat-pdf-exp/encgjibigfmpfagdialjgobjocaooacd?authuser=0&hl=en",
      author: {
        "@type": "Person",
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5.0",
        reviewCount: "42",
      },
    };

    return (
      <>
        <Script
          id="software-app-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <UniversalPdfExporterLanding />
      </>
    );
  }

  // If this is Color Picker, show its dedicated rich landing page!
  if (COLOR_PICKER_SLUGS.includes(normalizedSlug)) {
    const colorPickerSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Color Picker - Eyedropper & Palette Tool",
      operatingSystem: "Google Chrome, Chromium, Microsoft Edge, Brave",
      applicationCategory: "DeveloperApplication",
      url: `${SITE_CONFIG.url}/projects/color-picker`,
      image: `${SITE_CONFIG.url}/images/projects/color-picker/inspector.png`,
      description:
        "Pick screen colors, explore modern color formats (OKLCH, HSL, RGB), check WCAG contrast, and extract page palettes. 100% offline, local-first Manifest V3 Chrome extension.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      installUrl:
        "https://chromewebstore.google.com/detail/color-picker-eyedropper-p/hncjklpkekgcmbnhjmfpmpmeoeobmook?authuser=0&hl=en",
      downloadUrl:
        "https://chromewebstore.google.com/detail/color-picker-eyedropper-p/hncjklpkekgcmbnhjmfpmpmeoeobmook?authuser=0&hl=en",
      author: {
        "@type": "Person",
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5.0",
        reviewCount: "28",
      },
    };

    return (
      <>
        <Script
          id="color-picker-software-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(colorPickerSchema),
          }}
        />
        <ColorPickerLanding />
      </>
    );
  }

  // If this is DevCraft Themes, show its dedicated rich landing page!
  if (DEVCRAFT_SLUGS.includes(normalizedSlug)) {
    const devcraftSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "DevCraft Themes",
      operatingSystem: "Windows, macOS, Linux",
      applicationCategory: "DeveloperApplication",
      url: `${SITE_CONFIG.url}/projects/devcraft-vscode-theme`,
      image: `${SITE_CONFIG.url}/images/projects/devcraft-themes/theme6.png`,
      description:
        "A premium suite of 7 handcrafted VS Code themes designed for clarity, comfort, and long coding sessions.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      installUrl:
        "https://marketplace.visualstudio.com/items?itemName=PrahladInala.devcraft-themes",
      downloadUrl:
        "https://marketplace.visualstudio.com/items?itemName=PrahladInala.devcraft-themes",
      author: {
        "@type": "Person",
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
      },
    };

    return (
      <>
        <Script
          id="devcraft-themes-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(devcraftSchema),
          }}
        />
        <DevCraftThemesLanding />
      </>
    );
  }

  const projects = getProjects();
  const lookupSlug =
    normalizedSlug === "toolmate" ? "tool-mate" : normalizedSlug;
  const project = projects.find((p) => p.id === lookupSlug);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center text-sm font-medium text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
        <Link href="/projects" className="hover:text-primary transition-colors">
          Projects
        </Link>
        <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
        <span className="text-foreground font-semibold truncate">
          {project.title}
        </span>
      </div>

      <div className="mb-8">
        <Link
          href="/projects"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to all projects
        </Link>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          {project.title}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Project Image */}
      {project.image && (
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border shadow-xl mb-10 bg-muted">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Tags & Links */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border mb-10">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target={
                project.liveUrl.startsWith("http") &&
                !project.liveUrl.includes("prahladinala.in")
                  ? "_blank"
                  : undefined
              }
              rel={
                project.liveUrl.startsWith("http") &&
                !project.liveUrl.includes("prahladinala.in")
                  ? "noopener noreferrer"
                  : undefined
              }
              className={cn(buttonVariants({ size: "sm" }), "rounded-full")}
            >
              {project.id === "blogging-platform"
                ? "Navigate to Notes"
                : "Visit Application"}{" "}
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-full",
              )}
            >
              <Github className="w-3.5 h-3.5 mr-1.5" /> Source
            </a>
          )}
        </div>
      </div>

      {/* About the Project / Long Description */}
      {project.longDescription &&
        project.longDescription !== project.description && (
          <div className="p-6 rounded-2xl bg-card border border-border mb-10">
            <h2 className="text-lg font-semibold text-foreground mb-3">
              About the Project
            </h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line mb-6">
              {project.longDescription}
            </p>

            {project.id === "blogging-platform" && (
              <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  Explore tutorials and guides on AI, Machine Learning, and web
                  engineering.
                </span>
                <Link
                  href="/notes"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "rounded-full w-fit",
                  )}
                >
                  Navigate to Notes{" "}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            )}
          </div>
        )}

      {/* Metrics */}
      {project.metrics && project.metrics.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {project.metrics.map((metric, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-card border border-border text-center"
            >
              <div className="text-2xl font-bold text-foreground">
                {metric.value}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
