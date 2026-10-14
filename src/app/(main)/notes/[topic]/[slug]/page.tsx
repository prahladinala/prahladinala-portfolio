import {
  getNoteBySlug,
  getNotesByTopic,
  getNoteTopics,
  getTopicName,
} from "@/lib/mdx";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import dayjs from "dayjs";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReadingToolbar } from "@/components/reading-toolbar-v2";
import { Pre } from "@/components/mdx/pre";
import { MdxImage } from "@/components/mdx/image";
import { TableOfContents } from "@/components/table-of-contents";
import { Callout } from "@/components/mdx/callout";
import { SandpackRunner } from "@/components/mdx/sandpack-runner";
import { Checklist } from "@/components/mdx/checklist";
import { Flashcard } from "@/components/mdx/flashcard";
import { Quiz } from "@/components/mdx/quiz";
import { Tabs } from "@/components/mdx/tabs";
import { BeforeAfter } from "@/components/mdx/before-after";
import { Steps } from "@/components/mdx/steps";
import { Accordion } from "@/components/mdx/accordion";
import { H1, H2, H3, H4 } from "@/components/mdx/heading";
import { ShareButtons } from "@/components/notes/share-buttons";
import { GiscusComments } from "@/components/notes/giscus-comments";
import { Edit3 } from "lucide-react";
import { getRelatedNotes } from "@/lib/mdx";
import { getSettings } from "@/lib/keystatic-data";
import { SITE_CONFIG } from "@/config/constants";
import { ReadingProgress } from "@/components/reading-progress";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ViewCounter } from "@/components/view-counter";
import { NoteHighlighter } from "@/components/notes/note-highlighter";
import { ReadingTracker } from "@/components/notes/reading-tracker";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string; slug: string }>;
}) {
  const { topic, slug } = await params;
  const note = getNoteBySlug(topic, slug);
  if (!note) return {};

  const topicName = getTopicName(topic);
  const ogUrl = `${SITE_CONFIG.url}/notes/${topic}/${slug}`;

  // Create the dynamic OG Image URL
  const ogImage = `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent(note.meta.title)}&topic=${encodeURIComponent(topicName)}&date=${encodeURIComponent(note.meta.date)}`;

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: `${note.meta.title} | ${topicName} Notes`,
    description: note.meta.description,
    keywords: note.meta.tags?.join(", "), // Injected tags for SEO
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
          type: "image/png",
          alt: note.meta.title,
        },
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
    },
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ topic: string; slug: string }>;
}) {
  const { topic, slug } = await params;
  const note = getNoteBySlug(topic, slug);

  if (!note) {
    notFound();
  }

  const topicName = getTopicName(topic);
  const topicNotes = getNotesByTopic(topic);
  const currentIndex = topicNotes.findIndex((n) => n.slug === slug);
  // With ascending order, next means mathematically forward (index + 1)
  const prevNote = currentIndex > 0 ? topicNotes[currentIndex - 1] : null;
  const nextNote =
    currentIndex < topicNotes.length - 1 ? topicNotes[currentIndex + 1] : null;

  const settings = getSettings();

  const options = {
    mdxOptions: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rehypePlugins: [rehypeHighlight as any, rehypeSlug as any],
    },
  };

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: note.meta.title,
    image: [
      `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent(note.meta.title)}&topic=${encodeURIComponent(topicName)}&date=${encodeURIComponent(note.meta.date)}`,
    ],
    description: note.meta.description,
    author: {
      "@type": "Person",
      name: "Prahlad Inala",
      url: SITE_CONFIG.url,
    },
    datePublished: note.meta.date,
    dateModified: note.meta.updatedAt || note.meta.date,
    publisher: {
      "@type": "Organization",
      name: "Prahlad Inala",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    url: `${SITE_CONFIG.url}/notes/${topic}/${slug}`,
  };

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_CONFIG.url}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Notes",
        item: `${SITE_CONFIG.url}/notes`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: topicName,
        item: `${SITE_CONFIG.url}/notes/${topic}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: note.meta.title,
        item: `${SITE_CONFIG.url}/notes/${topic}/${slug}`,
      },
    ],
  };

  return (
    <>
      <ReadingProgress />
      <NoteHighlighter />
      <ReadingTracker
        slug={slug}
        topic={topic}
        topicName={topicName}
        title={note.meta.title}
      />
      <div className="flex xl:gap-12 relative items-start">
        <article className="flex-1 min-w-0 max-w-3xl pb-24 print:pb-0">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
          />

          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm font-medium text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap print:hidden">
            <Link
              href="/notes"
              className="hover:text-primary transition-colors"
            >
              Notes
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
            <Link
              href={`/notes/${topic}`}
              className="hover:text-primary transition-colors"
            >
              {topicName}
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
            <span className="text-foreground truncate">{note.meta.title}</span>
          </nav>

          <ReadingToolbar
            targetId="note-content"
            pdfTargetId="pdf-content"
            title={note.meta.title}
          />

          <NoteHighlighter />

          <div
            id="pdf-content"
            className="rounded-xl transition-all duration-300"
          >
            <header className="mb-10" id="note-header">
              <h1 className="text-4xl sm:text-5xl font-black mb-6 tracking-tight leading-tight">
                {note.meta.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground print:text-black">
                <Link
                  href={`/notes/${topic}`}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-md text-xs font-semibold hover:bg-primary/20 transition-colors print:hidden"
                >
                  {note.meta.topicName || topicName}
                </Link>

                {note.meta.date && (
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <time>{dayjs(note.meta.date).format("MMMM D, YYYY")}</time>
                    {note.meta.updatedAt && (
                      <span className="italic text-muted-foreground/80">
                        (Updated:{" "}
                        {dayjs(note.meta.updatedAt).format("MMM D, YYYY")})
                      </span>
                    )}
                  </div>
                )}
                {note.meta.readingTime && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-muted/60 text-muted-foreground border border-border/60 rounded-full text-xs font-semibold print:hidden">
                    ⚡ {note.meta.readingTime} min read
                  </span>
                )}
                {note.meta.difficulty && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border print:hidden",
                      note.meta.difficulty === "Beginner" &&
                        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
                      note.meta.difficulty === "Intermediate" &&
                        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
                      note.meta.difficulty === "Advanced" &&
                        "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25"
                    )}
                  >
                    <span>🎯</span> {note.meta.difficulty}
                  </span>
                )}
                {settings.showViews && <ViewCounter slug={slug} />}
              </div>

              {note.meta.tags && note.meta.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-4 print:hidden">
                  {note.meta.tags.map((tag) => (
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

            {/* Series Navigation (Only show if there are multiple notes in this topic) */}
            {topicNotes.length > 1 && (
              <div className="mb-10 p-4 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-sm">
                      {currentIndex + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {topicName} Series
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Part {currentIndex + 1} of {topicNotes.length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {prevNote && (
                    <Link
                      id="prev-note-link"
                      href={`/notes/${topic}/${prevNote.slug}`}
                      className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title={`Previous: ${prevNote.title} (Key: K)`}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  )}
                  <span className="text-xs text-muted-foreground px-2">
                    Navigate
                  </span>
                  {nextNote && (
                    <Link
                      id="next-note-link"
                      href={`/notes/${topic}/${nextNote.slug}`}
                      className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title={`Next: ${nextNote.title} (Key: J)`}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Main Content */}
            <div
              id="note-content"
              className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-h2:mt-12 prose-h3:mt-8 prose-a:text-primary hover:prose-a:text-primary/80 prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border rounded-xl print:text-black print:prose-pre:border-gray-300 print:prose-a:text-blue-600 print:prose-headings:text-black print:prose-strong:text-black transition-all duration-300 ease-out"
            >
              <MDXRemote
                source={note.content}
                options={options}
                components={{
                  pre: Pre,
                  Callout,
                  img: MdxImage,
                  SandpackRunner,
                  Checklist,
                  Flashcard,
                  Quiz,
                  Tabs,
                  BeforeAfter,
                  Steps,
                  Accordion,
                  h1: H1,
                  h2: H2,
                  h3: H3,
                  h4: H4,
                }}
              />
            </div>
          </div>

          {/* Footer Navigation */}
          {(prevNote || nextNote) && (
            <footer className="mt-16 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4 print:hidden">
              {prevNote ? (
                <Link
                  href={`/notes/${topic}/${prevNote.slug}`}
                  className="flex flex-col gap-2 p-4 rounded-xl border border-border hover:border-primary/50 transition-colors text-left group"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Previous Note
                  </span>
                  <span className="font-medium line-clamp-2">
                    {prevNote.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {nextNote && (
                <Link
                  href={`/notes/${topic}/${nextNote.slug}`}
                  className="flex flex-col gap-2 p-4 rounded-xl border border-border hover:border-primary/50 transition-colors text-right group"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors flex items-center justify-end">
                    Next Note <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                  <span className="font-medium line-clamp-2">
                    {nextNote.title}
                  </span>
                </Link>
              )}
            </footer>
          )}

          {/* Up Next / Recommended Notes */}
          {(() => {
            const related = getRelatedNotes(note.meta);
            if (related.length === 0) return null;
            return (
              <>
                {settings.showRelatedNotes && (
                  <div className="mt-16 pt-8 border-t border-border print:hidden">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight m-0">
                        Up Next: Recommended For You
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                      Readers who finished this note also explored these next:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {related.map((r) => (
                        <Link
                          key={r.slug}
                          href={`/notes/${r.topic}/${r.slug}`}
                          className="p-5 rounded-2xl border border-border hover:border-primary/50 bg-card hover:bg-muted/30 transition-all hover:-translate-y-1 group shadow-xs flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[11px] font-semibold">
                                {r.topicName || getTopicName(r.topic)}
                              </span>
                              <span className="text-[11px] font-medium text-muted-foreground">
                                ⚡ {r.readingTime} min read
                              </span>
                              <span className={cn(
                                "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                                r.difficulty === "Beginner" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                                r.difficulty === "Intermediate" && "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                                r.difficulty === "Advanced" && "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                              )}>
                                🎯 {r.difficulty}
                              </span>
                            </div>

                            <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-1.5 line-clamp-2">
                              {r.title}
                            </h4>
                            {r.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                {r.description}
                              </p>
                            )}
                          </div>

                          <div className="mt-4 pt-3 border-t border-border/40 flex items-center text-xs font-semibold text-primary gap-1 group-hover:gap-2 transition-all">
                            Read Next <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}

          {/* Share Buttons */}
          {settings.showShareButtons && (
            <div className="mt-12 pt-8 border-t border-border flex items-center justify-between print:hidden">
              <ShareButtons
                title={note.meta.title}
                url={`${SITE_CONFIG.url}/notes/${topic}/${slug}`}
              />
            </div>
          )}

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
          {settings.showComments && <GiscusComments />}
        </article>

        {settings.showTableOfContents && <TableOfContents />}
      </div>
      <ScrollToTop />
    </>
  );
}
