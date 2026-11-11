import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { ChevronRight, ExternalLink, ArrowLeft } from "lucide-react";
import { Github } from "@/components/icons";
import { getProjects } from "@/lib/keystatic-data";
import { SITE_CONFIG } from "@/config/constants";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UniversalPdfExporterLanding } from "@/components/projects/universal-pdf-exporter-landing";

const AI_PDF_EXPORTER_SLUGS = [
  "universal-ai-chat-pdf-exporter",
  "universal-ai-chat-to-pdf-export",
  "ai-chat-export-pdf",
  "ai-chat-pdf-exporter",
  "universal-ai-chat-export",
];

export async function generateStaticParams() {
  const projects = getProjects();
  const params: { slug: string }[] = [];

  // Register all slugs and aliases for AI PDF Exporter
  AI_PDF_EXPORTER_SLUGS.forEach((slug) => {
    params.push({ slug });
  });

  // Register other project slugs
  projects.forEach((p) => {
    if (!AI_PDF_EXPORTER_SLUGS.includes(p.id)) {
      params.push({ slug: p.id });
    }
  });

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

  const projects = getProjects();
  const project = projects.find((p) => p.id === normalizedSlug);

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

  const projects = getProjects();
  const project = projects.find((p) => p.id === normalizedSlug);

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
          {project.longDescription || project.description}
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
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: "sm" }), "rounded-full")}
            >
              Visit Application <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
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
