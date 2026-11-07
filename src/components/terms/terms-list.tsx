"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import type { TermsOfService } from "@/data/terms-and-conditions";

interface TermsListProps {
  terms: TermsOfService[];
}

export function TermsList({ terms }: TermsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "General / All Apps",
    "Browser Extension",
    "Mobile App",
  ];

  const filteredTerms = terms.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const generalTerm = terms.find((t) => t.slug === "general");

  return (
    <div className="space-y-12">
      {/* Featured Master Terms Card */}
      {generalTerm && (
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-primary/5 via-card to-card p-6 sm:p-8 lg:p-10 shadow-sm transition-all hover:border-primary/40">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                <Shield className="w-3.5 h-3.5" />
                Master Terms of Service
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {generalTerm.title}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {generalTerm.summary}
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span>Updated: {generalTerm.lastUpdated}</span>
                <span>•</span>
                <span>Applies to all software by Prahlad Inala</span>
              </div>
            </div>
            <div className="shrink-0">
              <Link
                href={`/terms-and-conditions/${generalTerm.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm hover:gap-3"
              >
                Read Master Terms
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search product terms, apps, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground shadow-2xs font-semibold"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs text-muted-foreground">
          Showing {filteredTerms.length} of {terms.length} agreements
        </p>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTerms.map((item) => (
          <Link
            key={item.slug}
            href={`/terms-and-conditions/${item.slug}`}
            className="group relative flex flex-col justify-between p-6 rounded-2xl border border-border bg-card hover:bg-muted/30 hover:border-primary/40 transition-all duration-200 shadow-xs hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-muted text-foreground border border-border/60">
                  <Layers className="w-3 h-3 text-primary" />
                  {item.badge}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {item.lastUpdated}
                </span>
              </div>

              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                {item.productName}
              </h3>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                {item.summary}
              </p>

              {item.keyPoints.length > 0 && (
                <div className="space-y-1.5 pt-3 border-t border-border/50">
                  {item.keyPoints.slice(0, 2).map((kp, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="font-medium text-foreground truncate">
                        {kp.title}:
                      </span>
                      <span className="truncate">{kp.description}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
              <span>View full terms</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
