import { getNoteTopics, getNotesByTopic } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { NotesList } from "@/components/notes-list";

export async function generateStaticParams() {
  const topics = getNoteTopics();
  return topics.map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  return { title: `${topic} Notes | Digital Notes` };
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const notes = getNotesByTopic(topic);

  if (notes.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4 capitalize">{topic} Notes</h1>
      <p className="text-lg text-muted-foreground mb-8">
        All notes and documentation related to {topic}.
      </p>

      <NotesList notes={notes} />
    </div>
  );
}
