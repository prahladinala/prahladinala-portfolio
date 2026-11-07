import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface KeyPoint {
  title: string;
  description: string;
  icon?: string;
}

export interface TermsOfService {
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

const TERMS_DIR = path.join(process.cwd(), "src/content/terms-and-conditions");

const DEFAULT_ALIASES: Record<string, string[]> = {
  "universal-ai-chat-to-pdf-export": [
    "universal-ai-chat-pdf-exporter",
    "universal-ai-chat-to-pdf-exporter",
    "ai-chat-pdf-export",
    "universal-ai-chat-export",
  ],
  "color-picker": [
    "colorpicker",
    "com.prahladinala.colorpicker",
    "color-picker-chrome-extension",
    "color-picker-extension",
  ],
  "fullpage-capture": [
    "full-page-capture",
    "fullpagecapture",
    "fullpage-capture-extension",
    "fullpage-capture-chrome-extension",
  ],
  habitflow: [
    "habit-flow",
    "habitflow-android",
    "com.prahladinala.habitflow",
  ],
  "html-code-editor": [
    "htmlcodeeditor",
    "html-code-editor-android",
    "com.prahladinala.htmlcodeeditor",
  ],
  "brain-trainer": [
    "braintrainer",
    "brain-trainer-android",
    "com.prahladinala.braintrainer",
  ],
  general: [
    "all",
    "standard",
    "common",
    "default",
    "overview",
  ],
};

function parseTermsFile(filePath: string): TermsOfService | null {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const slug = path.basename(filePath, path.extname(filePath));

    return {
      id: slug,
      slug,
      aliases: DEFAULT_ALIASES[slug] || [],
      title: data.title || "Terms and Conditions",
      shortTitle: data.shortTitle || data.title || "Terms of Service",
      productName: data.productName || "Software by Prahlad Inala",
      category: data.category || "General / All Apps",
      badge: data.badge || "Terms of Service",
      lastUpdated: data.lastUpdated || "November 2026",
      effectiveDate: data.effectiveDate || "November 2026",
      summary: data.summary || "",
      keyPoints: Array.isArray(data.keyPoints) ? data.keyPoints : [],
      preamble: data.preamble,
      content,
      contactEmail: data.contactEmail || "prahladjngp@gmail.com",
      contactUrl: data.contactUrl || "https://prahladinala.in/#contact",
    };
  } catch (error) {
    console.error(`Error reading terms file: ${filePath}`, error);
    return null;
  }
}

export function getAllTermsOfService(): TermsOfService[] {
  if (!fs.existsSync(TERMS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(TERMS_DIR);
  const terms: TermsOfService[] = [];

  for (const file of files) {
    if (file.endsWith(".mdx") || file.endsWith(".md")) {
      const parsed = parseTermsFile(path.join(TERMS_DIR, file));
      if (parsed) {
        terms.push(parsed);
      }
    }
  }

  const order: Record<string, number> = {
    general: 1,
    "universal-ai-chat-to-pdf-export": 2,
    "fullpage-capture": 3,
    "color-picker": 4,
    habitflow: 5,
    "html-code-editor": 6,
    "brain-trainer": 7,
    portfolio: 8,
  };

  return terms.sort((a, b) => {
    const orderA = order[a.slug] || 99;
    const orderB = order[b.slug] || 99;
    return orderA - orderB;
  });
}

export function getTermsOfServiceBySlug(slug: string): TermsOfService | null {
  const all = getAllTermsOfService();
  const normalized = slug.toLowerCase().trim();

  const direct = all.find(
    (t) =>
      t.slug.toLowerCase() === normalized ||
      t.aliases.some((a) => a.toLowerCase() === normalized)
  );

  if (direct) return direct;

  const fallbackFile = path.join(TERMS_DIR, `${normalized}.mdx`);
  if (fs.existsSync(fallbackFile)) {
    return parseTermsFile(fallbackFile);
  }

  return null;
}
