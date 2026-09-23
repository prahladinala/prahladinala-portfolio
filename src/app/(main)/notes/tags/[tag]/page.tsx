import { getAllTags, getNotesByTag } from "@/lib/mdx";
import { notFound } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import { Hash, Clock, ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  return {
    title: `#${tag} Notes | Digital Notes`,
    description: `All notes tagged with ${tag}`,
  };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag).toLowerCase();
  const notes = getNotesByTag(decodedTag);

  if (notes.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-4xl pb-24">
      <Link href="/notes/tags" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to all tags
      </Link>
      
      <header className="mb-12">
        <h1 className="text-4xl font-black mb-4 tracking-tight flex items-center gap-3">
          <Hash className="w-8 h-8 text-primary" />
          {decodedTag}
        </h1>
        <p className="text-xl text-muted-foreground">
          {notes.length} note{notes.length !== 1 ? 's' : ''} with this tag
        </p>
      </header>

      <div className="grid gap-6">
        {notes.map((note) => (
          <Link 
            key={note.slug} 
            href={`/notes/${note.topic}/${note.slug}`}
            className="group block p-6 rounded-2xl border border-border hover:border-primary/50 bg-card hover:bg-muted/20 transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <h2 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                {note.title}
              </h2>
              <span className="shrink-0 capitalize px-2.5 py-1 bg-primary/10 text-primary rounded-md text-xs font-semibold">
                {note.topic}
              </span>
            </div>
            
            <p className="text-muted-foreground mb-4 line-clamp-2">
              {note.description}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {note.date && <time>{dayjs(note.date).format("MMM D, YYYY")}</time>}
              {note.readingTime && (
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                  <Clock className="w-3.5 h-3.5" /> {note.readingTime} min read
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
