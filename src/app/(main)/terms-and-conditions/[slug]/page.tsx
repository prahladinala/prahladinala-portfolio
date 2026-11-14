import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { MdxLink } from "@/components/mdx/link";
import { Table, THead, TBody, TR, TH, TD } from "@/components/mdx/table";
import { InlineCode } from "@/components/mdx/inline-code";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import {
  FileText,
  Scale,
  Shield,
  Layers,
  ChevronRight,
  Mail,
  ExternalLink,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  getAllTermsOfService,
  getTermsOfServiceBySlug,
} from "@/data/terms-and-conditions";
import { ThemeToggle } from "@/components/theme-toggle-v2";
import { SITE_CONFIG } from "@/config/constants";

export async function generateStaticParams() {
  const terms = getAllTermsOfService();
  const params: { slug: string }[] = [];

  terms.forEach((term) => {
    params.push({ slug: term.slug });
    term.aliases?.forEach((alias) => {
      params.push({ slug: alias });
    });
  });

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const term = getTermsOfServiceBySlug(slug);

  if (!term) return {};

  const pageUrl = `${SITE_CONFIG.url}/terms-and-conditions/${term.slug}`;

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: `${term.title} | Prahlad Inala`,
    description: term.summary,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${term.title} | Prahlad Inala`,
      description: term.summary,
      url: pageUrl,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${term.title} | Prahlad Inala`,
      description: term.summary,
    },
  };
}

export default async function TermDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const term = getTermsOfServiceBySlug(slug);

  if (!term) {
    notFound();
  }

  const mdxOptions = {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rehypePlugins: [rehypeHighlight as any, rehypeSlug as any],
    },
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: term.title,
    description: term.summary,
    url: `${SITE_CONFIG.url}/terms-and-conditions/${term.slug}`,
    publisher: {
      "@type": "Person",
      name: "Prahlad Inala",
      url: SITE_CONFIG.url,
    },
    dateModified: term.lastUpdated,
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
      <Script
        id="term-article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      {/* Top Bar with Breadcrumbs & Theme Toggle */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <nav className="flex items-center text-sm font-medium text-muted-foreground truncate">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
          <Link
            href="/terms-and-conditions"
            className="hover:text-primary transition-colors flex-shrink-0"
          >
            Terms & Conditions
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
          <span className="text-foreground truncate max-w-xs sm:max-w-md">
            {term.shortTitle}
          </span>
        </nav>
        <ThemeToggle />
      </div>

      {/* Header Info Banner */}
      <header className="mb-10 pb-8 border-b border-border/80 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            <Scale className="w-3.5 h-3.5" />
            {term.badge}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border/60">
            <Calendar className="w-3 h-3" />
            Updated: {term.lastUpdated}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
          {term.title}
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          {term.summary}
        </p>

        {/* Quick Highlights Summary Box */}
        {term.keyPoints.length > 0 && (
          <div className="mt-6 p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>Key Terms at a Glance</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {term.keyPoints.map((point, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{point.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-5.5 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* MDX Body Content */}
      <article
        id="terms-content"
        className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:mt-12 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-li:leading-relaxed prose-code:before:content-none prose-code:after:content-none text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground"
      >
        <MDXRemote
          source={term.content}
          options={mdxOptions}
          components={{
            a: MdxLink,
            table: Table,
            thead: THead,
            tbody: TBody,
            tr: TR,
            th: TH,
            td: TD,
            code: InlineCode,
          }}
        />
      </article>

      {/* Official Inquiries Card */}
      <div className="mt-16 pt-8 border-t border-border/60">
        <div className="p-6 rounded-2xl border border-border bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-foreground">
              Questions or License Inquiries?
            </h4>
            <p className="text-xs text-muted-foreground">
              Reach out directly to the developer for clarifications or
              commercial requests.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`mailto:${term.contactEmail}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              Email Developer
            </a>
            {term.contactUrl && (
              <a
                href={term.contactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-background text-foreground font-medium text-xs hover:bg-muted transition-colors"
              >
                <span>Contact Page</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
