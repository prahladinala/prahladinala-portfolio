import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Cpu,
  Mail,
  ChevronRight,
} from "lucide-react";
import { getAllPrivacyPolicies } from "@/data/privacy-policies";
import { PrivacyPolicyList } from "@/components/privacy/privacy-policy-list";
import { SITE_CONFIG } from "@/config/constants";
import { ThemeToggle } from "@/components/theme-toggle-v2";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: "Privacy Policies | Prahlad Inala",
  description:
    "Comprehensive privacy policies for all software applications, browser extensions, and web services created by Prahlad Inala. Local-first, private by design.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/privacy-policy`,
  },
  openGraph: {
    title: "Privacy Policies | Prahlad Inala",
    description:
      "Review privacy documentation for all applications, developer tools, and browser extensions built by Prahlad Inala.",
    url: `${SITE_CONFIG.url}/privacy-policy`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policies | Prahlad Inala",
    description:
      "Review privacy documentation for all applications, developer tools, and browser extensions built by Prahlad Inala.",
  },
};

export default function PrivacyPolicyIndexPage() {
  const policies = getAllPrivacyPolicies();

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Privacy Policies | Prahlad Inala",
    description:
      "Privacy documentation for software applications, browser extensions, and web services created by Prahlad Inala.",
    url: `${SITE_CONFIG.url}/privacy-policy`,
    isPartOf: {
      "@type": "WebSite",
      url: SITE_CONFIG.url,
      name: SITE_CONFIG.name,
    },
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
      <Script
        id="privacy-collection-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Top Bar with Breadcrumbs & Theme Toggle */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <nav className="flex items-center text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
          <span className="text-foreground">Privacy Policies</span>
        </nav>
        <ThemeToggle />
      </div>

      {/* Hero Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Trust & Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          Privacy Policies
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
          I build software under a strict{" "}
          <strong className="text-foreground font-semibold">
            local-first philosophy
          </strong>
          . Your conversations, files, code, and browsing habits should always
          remain private, under your control, and off third-party servers.
          Explore individual application policies below.
        </p>
      </div>

      {/* Privacy Guarantees Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-2xl bg-muted/40 border border-border/70 mb-12">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-background border border-border/60 text-emerald-500 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground mb-1">
              Local Processing First
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Computations and document formatting occur directly inside your
              browser or device runtime.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-background border border-border/60 text-blue-500 shrink-0">
            <EyeOff className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground mb-1">
              Zero Data Monetization
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We never sell, rent, or trade your personal data, logs, or prompt
              histories to advertisers or data brokers.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-background border border-border/60 text-purple-500 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground mb-1">
              Zero Hidden Tracking
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No covert background beacons or behavioral ad networks. Network
              requests require explicit user intent.
            </p>
          </div>
        </div>
      </div>

      {/* Policy List Component */}
      <PrivacyPolicyList policies={policies} />

      {/* Bottom Contact / Inquiries Box */}
      <div className="mt-16 p-8 rounded-2xl border border-border/70 bg-gradient-to-br from-card to-muted/30 text-center max-w-3xl mx-auto">
        <h3 className="text-xl font-bold text-foreground mb-2">
          Questions or Privacy Inquiries?
        </h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
          If you have any questions, security concerns, or requests regarding
          data practices for any of my software, feel free to reach out
          directly.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="mailto:prahladinala@gmail.com"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Mail className="w-4 h-4" />
            Contact Developer
          </a>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
          >
            Contact Form
          </Link>
        </div>
      </div>
    </div>
  );
}
