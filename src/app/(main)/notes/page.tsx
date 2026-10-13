import { getAllNotes } from "@/lib/mdx";
import { NotesList } from "@/components/notes-list";
import Script from "next/script";
import { ResumeReadingBanner } from "@/components/notes/resume-reading-banner";
import { NotesActionButtons } from "@/components/notes/notes-action-buttons";
import { SITE_CONFIG } from "@/config/constants";

export const metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: "Digital Notes & Tutorials",
  description: "A comprehensive collection of my technical notes, coding tutorials, and deep dives into web development, React, and Next.js.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/notes`,
  },
  openGraph: {
    title: "Digital Notes & Tutorials | Prahlad Inala",
    description: "A comprehensive collection of my technical notes, coding tutorials, and deep dives into web development, React, and Next.js.",
    url: `${SITE_CONFIG.url}/notes`,
    type: "website",
    images: [
      {
        url: `${SITE_CONFIG.url}/api/og?title=Digital%20Notes%20%26%20Tutorials&topic=Software%20Engineering`,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Digital Notes & Tutorials | Prahlad Inala",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Notes & Tutorials | Prahlad Inala",
    description: "A comprehensive collection of my technical notes, coding tutorials, and deep dives into web development, React, and Next.js.",
    images: [`${SITE_CONFIG.url}/api/og?title=Digital%20Notes%20%26%20Tutorials&topic=Software%20Engineering`],
  },
};

export default function NotesIndexPage() {
  const notes = getAllNotes();

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Digital Notes & Tutorials",
    "description": "A comprehensive collection of technical notes, coding tutorials, and deep dives into web development.",
    "url": `${SITE_CONFIG.url}/notes`,
    "isPartOf": {
      "@type": "WebSite",
      "url": SITE_CONFIG.url
    }
  };

  return (
    <div className="max-w-4xl">
      <Script
        id="notes-collection-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      
      <div id="ai-summary" className="sr-only" aria-hidden="true">
        This is the main directory for Prahlad Inala's digital notes and programming tutorials. 
        It contains educational content on software engineering, frontend development, React, Next.js, and related technologies.
      </div>

      <h1 className="text-4xl font-bold mb-4">Digital Notes</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Welcome to my digital notes. Here you'll find a collection of my technical documentation and deep dives on various topics.
      </p>

      <NotesActionButtons />
      <ResumeReadingBanner />

      {notes.length === 0 ? (
        <div className="p-8 text-center bg-muted/50 rounded-2xl border border-border">
          <p className="text-muted-foreground">No notes published yet.</p>
        </div>
      ) : (
        <NotesList notes={notes} />
      )}
    </div>
  );
}
