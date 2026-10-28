import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface KeyPoint {
  title: string;
  description: string;
  icon?: string;
}

export interface PrivacyPolicy {
  id: string;
  slug: string;
  aliases: string[];
  title: string;
  shortTitle: string;
  productName: string;
  category:
    | "Browser Extension"
    | "General / All Apps"
    | "Web Application"
    | "Mobile App"
    | "CLI Tool"
    | "Other";
  badge: string;
  lastUpdated: string;
  effectiveDate: string;
  summary: string;
  keyPoints: KeyPoint[];
  preamble?: string;
  content: string;
  contactEmail: string;
  contactUrl?: string;
}

const POLICIES_DIR = path.join(process.cwd(), "src/content/privacy-policies");

const DEFAULT_ALIASES: Record<string, string[]> = {
  "universal-ai-chat-to-pdf-export": [
    "universal-ai-chat-pdf-exporter",
    "universal-ai-chat-to-pdf-exporter",
    "ai-chat-pdf-export",
    "universal-ai-chat-export",
  ],
  general: ["all-apps", "general-privacy-policy", "apps", "software"],
  portfolio: ["website", "this-app", "portfolio-website", "prahladinala-in"],
};

export function getAllPrivacyPolicies(): PrivacyPolicy[] {
  if (!fs.existsSync(POLICIES_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(POLICIES_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const policies: PrivacyPolicy[] = files.map((file) => {
    const slug = file.replace(/\.mdx?$/, "");
    const filePath = path.join(POLICIES_DIR, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    const aliases = DEFAULT_ALIASES[slug] || [];

    return {
      id: slug,
      slug,
      aliases,
      title: data.title || slug,
      shortTitle: data.shortTitle || data.title || slug,
      productName: data.productName || data.title || slug,
      category: data.category || "Browser Extension",
      badge: data.badge || data.category || "General",
      lastUpdated: data.lastUpdated || "October 2026",
      effectiveDate: data.effectiveDate || "October 2026",
      summary: data.summary || "",
      keyPoints: Array.isArray(data.keyPoints) ? data.keyPoints : [],
      preamble: data.preamble || "",
      content,
      contactEmail: data.contactEmail || "prahladinala@gmail.com",
      contactUrl: data.contactUrl || "https://prahladinala.in/#contact",
    };
  });

  // Sort: Universal AI Chat first, then General, then Website, then others
  const order: Record<string, number> = {
    "universal-ai-chat-to-pdf-export": 1,
    general: 2,
    portfolio: 3,
  };

  return policies.sort((a, b) => {
    const orderA = order[a.slug] ?? 99;
    const orderB = order[b.slug] ?? 99;
    return orderA - orderB;
  });
}

export function getPrivacyPolicyBySlug(
  slug: string,
): PrivacyPolicy | undefined {
  if (!slug) return undefined;
  const normalized = decodeURIComponent(slug)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

  const policies = getAllPrivacyPolicies();

  return policies.find((policy) => {
    if (policy.slug.toLowerCase() === normalized) return true;
    if (policy.id.toLowerCase() === normalized) return true;
    if (policy.aliases?.some((alias) => alias.toLowerCase() === normalized))
      return true;
    return false;
  });
}
