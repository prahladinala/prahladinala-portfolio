import { getNoteTopics, getNotesByTopic } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { NotesList } from "@/components/notes-list";
import Script from "next/script";

export async function generateStaticParams() {
  const topics = getNoteTopics();
  return topics.map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const canonicalUrl = `https://prahladinala.in/notes/${topic}`;
  const title = `${topic.charAt(0).toUpperCase() + topic.slice(1)} Notes & Tutorials | Prahlad Inala`;
  const description = `Read my technical notes, documentation, and deep dives specifically focused on ${topic}.`;

  return { 
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
    }
  };
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const notes = getNotesByTopic(topic);

  if (notes.length === 0) {
    notFound();
  }

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${topic} Notes`,
    "description": `Technical notes and documentation focused on ${topic}.`,
    "url": `https://prahladinala.in/notes/${topic}`,
    "isPartOf": {
      "@type": "WebSite",
      "url": "https://prahladinala.in"
    }
  };

  return (
    <div className="max-w-4xl">
      <Script
        id={`topic-${topic}-schema`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      
      <div id="ai-summary" className="sr-only" aria-hidden="true">
        This page filters Prahlad Inala's digital notes to only show tutorials and documentation related to {topic}.
      </div>

      <h1 className="text-4xl font-bold mb-4 capitalize">{topic} Notes</h1>
      <p className="text-lg text-muted-foreground mb-8">
        All notes and documentation related to {topic}.
      </p>

      <NotesList notes={notes} />
    </div>
  );
}
