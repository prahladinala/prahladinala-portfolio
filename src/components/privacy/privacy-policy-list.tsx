"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ShieldCheck, Search, ArrowRight } from "lucide-react";
import type { PrivacyPolicy } from "@/data/privacy-policies";

export function PrivacyPolicyList({ policies }: { policies: PrivacyPolicy[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    policies.forEach((p) => set.add(p.category));
    return ["All", ...Array.from(set)];
  }, [policies]);

  const filteredPolicies = useMemo(() => {
    return policies.filter((policy) => {
      const matchesCategory =
        selectedCategory === "All" || policy.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        policy.title.toLowerCase().includes(q) ||
        policy.shortTitle.toLowerCase().includes(q) ||
        policy.productName.toLowerCase().includes(q) ||
        policy.summary.toLowerCase().includes(q) ||
        policy.category.toLowerCase().includes(q) ||
        policy.keyPoints.some(
          (kp) =>
            kp.title.toLowerCase().includes(q) ||
            kp.description.toLowerCase().includes(q),
        );

      return matchesCategory && matchesSearch;
    });
  }, [policies, selectedCategory, searchQuery]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Browser Extension":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Mobile App":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "General / All Apps":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "Web Application":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-8">
      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search policies or applications..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-background border border-border/80 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground/60"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Policies Grid */}
      {filteredPolicies.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-muted/20">
          <ShieldCheck className="w-10 h-10 mx-auto text-muted-foreground mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-foreground mb-1">
            No privacy policies found
          </h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            We couldn&apos;t find any policy matching &quot;{searchQuery}&quot;.
            Try searching with a different term or resetting the filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="inline-flex items-center text-xs font-medium text-primary hover:underline"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredPolicies.map((policy) => (
            <div
              key={policy.id}
              className="group flex flex-col rounded-2xl border border-border/70 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryColor(
                        policy.category,
                      )}`}
                    >
                      {policy.badge}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Updated {policy.lastUpdated}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    <Link href={`/privacy-policy/${policy.slug}`}>
                      {policy.shortTitle}
                    </Link>
                  </h3>

                  <p className="text-sm text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
                    {policy.summary}
                  </p>

                  {/* Highlights list */}
                  <div className="space-y-2.5 mb-6 pt-4 border-t border-border/40">
                    {policy.keyPoints.slice(0, 3).map((kp, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs"
                      >
                        <div className="mt-0.5 w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-2.5 h-2.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-foreground/90">
                            {kp.title}:{" "}
                          </span>
                          <span className="text-muted-foreground">
                            {kp.description}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-mono">
                    /{policy.slug}
                  </span>
                  <Link
                    href={`/privacy-policy/${policy.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:translate-x-0.5 transition-transform"
                  >
                    Read Policy
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
