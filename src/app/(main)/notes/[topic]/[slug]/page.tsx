import { getNoteBySlug, getNotesByTopic, getNoteTopics } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import dayjs from "dayjs";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight, Clock } from "lucide-react";
import { ReadingToolbar } from "@/components/reading-toolbar-v2";
import { Pre } from "@/components/mdx/pre";
import { TableOfContents } from "@/components/table-of-contents";
import { Callout } from "@/components/mdx/callout";
import { ShareButtons } from "@/components/notes/share-buttons";
import { GiscusComments } from "@/components/notes/giscus-comments";
import { Edit3 } from "lucide-react";
import { getRelatedNotes } from "@/lib/mdx";

export async function generateStaticParams() {
  const topics = getNoteTopics();
  const params: { topic: string; slug: string }[] = [];

  topics.forEach((topic) => {
    const notes = getNotesByTopic(topic);
    notes.forEach((note) => {
      params.push({ topic, slug: note.slug });
    });
  });

  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string; slug: string }> }) {
  const { topic, slug } = await params;
  const note = getNoteBySlug(topic, slug);
  if (!note) return {};
  
  const ogUrl = `https://prahladinala.in/notes/${topic}/${slug}`;
  
  // Create the dynamic OG Image URL
  const ogImage = `https://prahladinala.in/api/og?title=${encodeURIComponent(note.meta.title)}&topic=${encodeURIComponent(topic)}&date=${encodeURIComponent(note.meta.date)}`;
  
  return { 
    title: `${note.meta.title} | ${topic} Notes`,
    description: note.meta.description,
    openGraph: {
      title: note.meta.title,
      description: note.meta.description,
      url: ogUrl,
      type: "article",
      publishedTime: note.meta.date,
      authors: ["Prahlad Inala"],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: note.meta.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: note.meta.title,
      description: note.meta.description,
      images: [ogImage],
    },
    alternates: {
      canonical: ogUrl,
    }
  };
}

export default async function NotePage({ params }: { params: Promise<{ topic: string; slug: string }> }) {
  const { topic, slug } = await params;
  const note = getNoteBySlug(topic, slug);

  if (!note) {
    notFound();
  }

  const topicNotes = getNotesByTopic(topic);
  const currentIndex = topicNotes.findIndex((n) => n.slug === slug);
  // With ascending order, next means mathematically forward (index + 1)
  const prevNote = currentIndex > 0 ? topicNotes[currentIndex - 1] : null;
  const nextNote = currentIndex < topicNotes.length - 1 ? topicNotes[currentIndex + 1] : null;

  const options = {
    mdxOptions: {
      rehypePlugins: [rehypeHighlight as any, rehypeSlug as any],
    },
  };

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: note.meta.title,
    description: note.meta.description,
    author: {
      "@type": "Person",
      name: "Prahlad Inala",
      url: "https://prahladinala.in",
    },
    datePublished: note.meta.date,
    url: `https://prahladinala.in/notes/${topic}/${slug}`,
  };

  return (
    <div className="flex xl:gap-12 relative items-start">
      <article className="flex-1 min-w-0 max-w-3xl pb-24 print:pb-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm font-medium text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap print:hidden">
          <Link href="/notes" className="hover:text-primary transition-colors">Notes</Link>
          <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
          <Link href={`/notes/${topic}`} className="hover:text-primary transition-colors capitalize">{topic}</Link>
          <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
          <span className="text-foreground truncate">{note.meta.title}</span>
        </nav>

        <ReadingToolbar targetId="note-content" pdfTargetId="pdf-content" title={note.meta.title} />
        
        <div id="pdf-content" className="rounded-xl transition-all duration-300">
          <header className="mb-10" id="note-header">
            <h1 className="text-4xl sm:text-5xl font-black mb-6 tracking-tight leading-tight">
              {note.meta.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground print:text-black">
              <Link href={`/notes/${topic}`} className="capitalize px-3 py-1 bg-primary/10 text-primary rounded-md text-xs font-semibold hover:bg-primary/20 transition-colors print:hidden">
                {note.meta.topic}
              </Link>
              {note.meta.date && (
  <div className="flex flex-wrap items-center gap-2 text-sm">
    <time>{dayjs(note.meta.date).format("MMMM D, YYYY")}</time>
    {note.meta.updatedAt && (
      <span className="italic text-muted-foreground/80">
        (Updated: {dayjs(note.meta.updatedAt).format("MMM D, YYYY")})
      </span>
    )}
  </div>
)}
              {note.meta.readingTime && (
                <span className="flex items-center gap-1.5 text-sm print:hidden">
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/50 hidden sm:block"></span>
                  <Clock className="w-4 h-4" /> {note.meta.readingTime} min read
                </span>
              )}
            </div>
            
            {note.meta.tags && note.meta.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-4 print:hidden">
                {note.meta.tags.map(tag => (
                  <Link 
                    key={tag} 
                    href={`/notes/tags/${tag.toLowerCase()}`}
                    className="px-2.5 py-0.5 bg-muted/50 border border-border/50 hover:bg-primary/10 hover:border-primary/30 rounded-full text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
            
            {note.meta.description && (
              <p className="mt-6 text-xl text-muted-foreground leading-relaxed print:text-black">
                {note.meta.description}
              </p>
            )}
          </header>

          {/* Main Content */}
          <div 
            id="note-content"
            className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-h2:mt-12 prose-h3:mt-8 prose-a:text-primary hover:prose-a:text-primary/80 prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border rounded-xl print:text-black print:prose-pre:border-gray-300 print:prose-a:text-blue-600 print:prose-headings:text-black print:prose-strong:text-black transition-all duration-300 ease-out"
          >
            <MDXRemote source={note.content} options={options} components={{ pre: Pre, Callout }} />
          </div>
        </div>

        {/* Footer Navigation */}
        {(prevNote || nextNote) && (
          <footer className="mt-16 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4 print:hidden">
            {prevNote ? (
              <Link href={`/notes/${topic}/${prevNote.slug}`} className="flex flex-col gap-2 p-4 rounded-xl border border-border hover:border-primary/50 transition-colors text-left group">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Previous Note
                </span>
                <span className="font-medium line-clamp-2">{prevNote.title}</span>
              </Link>
            ) : <div />}
            
            {nextNote && (
              <Link href={`/notes/${topic}/${nextNote.slug}`} className="flex flex-col gap-2 p-4 rounded-xl border border-border hover:border-primary/50 transition-colors text-right group">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors flex items-center justify-end">
                  Next Note <ArrowRight className="w-4 h-4 ml-1" />
                </span>
                <span className="font-medium line-clamp-2">{nextNote.title}</span>
              </Link>
            )}
          </footer>
        )}

        {/* Related Notes */}
        {(() => {
          const related = getRelatedNotes(note.meta);
          if (related.length === 0) return null;
          return (
            <div className="mt-16 pt-8 border-t border-border print:hidden">
              <h3 className="text-xl font-bold mb-6">Related Notes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map(r => (
                  <Link key={r.slug} href={`/notes/${r.topic}/${r.slug}`} className="p-4 rounded-xl border border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/50 transition-colors group">
                    <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                      <span className="capitalize text-primary/80">{r.topic}</span>
                      {r.date && <span>• {dayjs(r.date).format("MMM D, YYYY")}</span>}
                    </div>
                    <h4 className="font-medium group-hover:text-primary transition-colors">{r.title}</h4>
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Edit on GitHub */}
        <div className="mt-12 pt-8 border-t border-border text-center print:hidden">
          <a
            href={`https://github.com/prahladinala/prahladinala-portfolio/edit/master/src/content/notes/${topic}/${slug}.mdx`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Spot a typo? Edit this page on GitHub
          </a>
        </div>

        {/* Comments */}
        <GiscusComments />
      </article>
      
      <TableOfContents />
    </div>
  );
}

