import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import {
  ShieldCheck,
  EyeOff,
  Lock,
  HardDrive,
  Cpu,
  Globe,
  Code2,
  Server,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  Mail,
  ExternalLink,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import {
  getAllPrivacyPolicies,
  getPrivacyPolicyBySlug,
} from "@/data/privacy-policies";
import { PolicyActions } from "@/components/privacy/policy-actions";
import { SITE_CONFIG } from "@/config/constants";

export async function generateStaticParams() {
  const policies = getAllPrivacyPolicies();
  const params: { slug: string }[] = [];

  policies.forEach((policy) => {
    params.push({ slug: policy.slug });
    policy.aliases?.forEach((alias) => {
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
  const policy = getPrivacyPolicyBySlug(slug);

  if (!policy) {
    return {
      title: "Privacy Policy Not Found",
    };
  }

  const canonicalUrl = `${SITE_CONFIG.url}/privacy-policy/${policy.slug}`;

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: `${policy.title} | Prahlad Inala`,
    description: policy.summary,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${policy.title} | Prahlad Inala`,
      description: policy.summary,
      url: canonicalUrl,
      type: "article",
      publishedTime: policy.effectiveDate,
      modifiedTime: policy.lastUpdated,
      authors: ["Prahlad Inala"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${policy.title} | Prahlad Inala`,
      description: policy.summary,
    },
  };
}

function renderKeyPointIcon(name?: string) {
  const className = "w-4 h-4 text-primary";
  switch (name) {
    case "ShieldCheck":
      return <ShieldCheck className={className} />;
    case "EyeOff":
      return <EyeOff className={className} />;
    case "Lock":
      return <Lock className={className} />;
    case "HardDrive":
      return <HardDrive className={className} />;
    case "Cpu":
      return <Cpu className={className} />;
    case "Globe":
      return <Globe className={className} />;
    case "Code2":
      return <Code2 className={className} />;
    case "Server":
      return <Server className={className} />;
    case "MessageSquare":
      return <MessageSquare className={className} />;
    case "ShieldAlert":
      return <ShieldAlert className={className} />;
    default:
      return <ShieldCheck className={className} />;
  }
}

export default async function PrivacyPolicyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = getPrivacyPolicyBySlug(slug);

  if (!policy) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: policy.title,
    description: policy.summary,
    url: `${SITE_CONFIG.url}/privacy-policy/${policy.slug}`,
    datePublished: policy.effectiveDate,
    dateModified: policy.lastUpdated,
    inLanguage: "en-US",
    publisher: {
      "@type": "Person",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const mdxOptions = {
    mdxOptions: {
      rehypePlugins: [rehypeHighlight as any, rehypeSlug as any],
    },
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-4xl">
      <Script
        id="policy-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm font-medium text-muted-foreground mb-4 print:hidden">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
        <Link
          href="/privacy-policy"
          className="hover:text-primary transition-colors"
        >
          Privacy Policies
        </Link>
        <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
        <span className="text-foreground truncate">{policy.shortTitle}</span>
      </nav>

      {/* Action Toolbar (Copy link, Print / Save PDF) */}
      <PolicyActions title={policy.title} slug={policy.slug} />

      {/* Header Container */}
      <header className="mb-10 pb-8 border-b border-border/60">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            {policy.badge}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5 ml-1">
            <Calendar className="w-3.5 h-3.5" />
            Last updated: {policy.lastUpdated}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
          {policy.title}
        </h1>

        {policy.summary && (
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {policy.summary}
          </p>
        )}
      </header>

      {/* Key Guarantees / Highlights Grid */}
      {policy.keyPoints && policy.keyPoints.length > 0 && (
        <div className="mb-12">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2 print:hidden">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Key Privacy Commitments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {policy.keyPoints.map((kp, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-border/70 bg-card/60 flex items-start gap-3.5"
              >
                <div className="p-2 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                  {renderKeyPointIcon(kp.icon)}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {kp.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {kp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Policy Content Body via MDX */}
      <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-h1:hidden prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-p:leading-relaxed prose-p:text-muted-foreground prose-li:text-muted-foreground">
        <MDXRemote source={policy.content} options={mdxOptions} />
      </article>

      {/* Official Contact & Inquiries Card */}
      <div className="mt-16 pt-8 border-t border-border/60">
        <div className="p-6 rounded-2xl border border-border/80 bg-muted/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-base font-bold text-foreground mb-1">
              Have inquiries about this policy?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Contact developer directly for verification, audits, or support.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${policy.contactEmail}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Mail className="w-3.5 h-3.5" />
              {policy.contactEmail}
            </a>
            {policy.contactUrl && (
              <Link
                href={policy.contactUrl}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs sm:text-sm font-medium hover:bg-muted/80 transition-colors"
              >
                <span>Support Page</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="mt-12 flex items-center justify-between text-sm text-muted-foreground print:hidden">
        <Link
          href="/privacy-policy"
          className="hover:text-primary transition-colors flex items-center gap-1.5 font-medium"
        >
          ← All Privacy Policies
        </Link>
        <Link
          href="/"
          className="hover:text-primary transition-colors font-medium"
        >
          Home →
        </Link>
      </div>
    </div>
  );
}
