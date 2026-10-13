import { getAllTags } from "@/lib/mdx";
import Link from "next/link";
import { Hash } from "lucide-react";

import { SITE_CONFIG } from "@/config/constants";

export const metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: "All Tags | Digital Notes",
  description: "Browse all tags across my digital notes",
  openGraph: {
    title: "All Tags | Digital Notes",
    description: "Browse all tags across my digital notes",
    url: `${SITE_CONFIG.url}/notes/tags`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent("Topics & Tags")}&topic=${encodeURIComponent("Notes")}`,
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Tags | Digital Notes",
    description: "Browse all tags across my digital notes",
    creator: SITE_CONFIG.twitterHandle,
    images: [
      `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent("Topics & Tags")}&topic=${encodeURIComponent("Notes")}`,
    ],
  },
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="max-w-4xl pb-24">
      <header className="mb-12">
        <h1 className="text-4xl font-black mb-4 tracking-tight">Topics & Tags</h1>
        <p className="text-xl text-muted-foreground">
          Browse notes by their specific concepts and tags.
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <Link 
            key={tag} 
            href={`/notes/tags/${tag}`}
            className="flex items-center gap-1.5 px-4 py-2 bg-muted/40 hover:bg-primary/10 border border-border hover:border-primary/30 rounded-full text-sm font-medium transition-colors"
          >
            <Hash className="w-3.5 h-3.5 text-muted-foreground" />
            {tag}
          </Link>
        ))}
        {tags.length === 0 && (
          <p className="text-muted-foreground">No tags found in any notes.</p>
        )}
      </div>
    </div>
  );
}
