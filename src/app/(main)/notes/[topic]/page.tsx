import { getNoteTopics, getNotesByTopic, getTopicName } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { NotesList } from "@/components/notes-list";
import Script from "next/script";
import { SITE_CONFIG } from "@/config/constants";

export async function generateStaticParams() {
  const topics = getNoteTopics();
  return topics.map((topic) => ({ topic }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const topicName = getTopicName(topic);
  const canonicalUrl = `${SITE_CONFIG.url}/notes/${topic}`;
  const title = `${topicName} Notes & Tutorials | Prahlad Inala`;
  const description = `Read my technical notes, documentation, and deep dives specifically focused on ${topicName}.`;
  const ogImage = `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent(topicName + " Notes")}&topic=${encodeURIComponent(topicName)}`;

  return {
    metadataBase: new URL(SITE_CONFIG.url),
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
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const notes = getNotesByTopic(topic);
  const topicName = getTopicName(topic);

  if (notes.length === 0) {
    notFound();
  }

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${topicName} Notes`,
    description: `Technical notes and documentation focused on ${topicName}.`,
    url: `${SITE_CONFIG.url}/notes/${topic}`,
    isPartOf: {
      "@type": "WebSite",
      url: SITE_CONFIG.url,
    },
  };

  return (
    <div className="max-w-4xl">
      <Script
        id={`topic-${topic}-schema`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div id="ai-summary" className="sr-only" aria-hidden="true">
        This page filters Prahlad Inala's digital notes to only show tutorials
        and documentation related to {topicName}.
      </div>

      <h1 className="text-4xl font-bold mb-4">{topicName} Notes</h1>
      <p className="text-lg text-muted-foreground mb-8">
        All notes and documentation related to {topicName}.
      </p>

      <NotesList notes={notes} />
    </div>
  );
}
