import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import {
  FileText,
  Shield,
  Layers,
  Scale,
  ChevronRight,
  Mail,
} from "lucide-react";
import { getAllTermsOfService } from "@/data/terms-and-conditions";
import { TermsList } from "@/components/terms/terms-list";
import { SITE_CONFIG } from "@/config/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: "Terms and Conditions | Prahlad Inala",
  description:
    "Official Terms and Conditions and user agreements governing software applications, browser extensions, and web tools built by Prahlad Inala.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/terms-and-conditions`,
  },
  openGraph: {
    title: "Terms and Conditions | Prahlad Inala",
    description:
      "Review terms of service and acceptable use agreements for software, developer tools, and extensions built by Prahlad Inala.",
    url: `${SITE_CONFIG.url}/terms-and-conditions`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms and Conditions | Prahlad Inala",
    description:
      "Review terms of service and acceptable use agreements for software, developer tools, and extensions built by Prahlad Inala.",
  },
};

export default function TermsIndexPage() {
  const terms = getAllTermsOfService();

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Terms and Conditions | Prahlad Inala",
    description:
      "Terms of service documentation for applications and extensions created by Prahlad Inala.",
    url: `${SITE_CONFIG.url}/terms-and-conditions`,
    isPartOf: {
      "@type": "WebSite",
      url: SITE_CONFIG.url,
      name: SITE_CONFIG.name,
    },
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
      <Script
        id="terms-collection-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />

      {/* Header Breadcrumb */}
      <nav className="flex items-center text-sm font-medium text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-foreground">Terms and Conditions</span>
      </nav>

      {/* Hero Title */}
      <div className="space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Scale className="w-3.5 h-3.5" />
          Terms of Service & Agreements
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
          Terms & Conditions
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
          Transparent terms of service, usage licenses, and acceptable use guidelines for all browser extensions, mobile apps, and developer tools created by Prahlad Inala.
        </p>
      </div>

      {/* Interactive List */}
      <TermsList terms={terms} />

      {/* Bottom Inquiries Banner */}
      <div className="mt-20 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-sm text-muted-foreground">
        <div>
          <p className="font-semibold text-foreground">
            Looking for data handling & privacy information?
          </p>
          <p className="text-xs">
            Review how data stays private in our dedicated Privacy Policies.
          </p>
        </div>
        <Link
          href="/privacy-policy"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-foreground font-medium text-xs hover:border-primary transition-colors shrink-0"
        >
          View Privacy Policies
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
