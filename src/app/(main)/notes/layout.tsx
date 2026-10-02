import { getNoteTopics, getNotesByTopic } from "@/lib/mdx";
import { NotesSidebar } from "@/components/notes-sidebar-v3";
import { ProgressBar } from "@/components/progress-bar";
import { getSettings } from "@/lib/keystatic-data";

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  const settings = getSettings();
  if (!settings.enableNotes) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 w-full">
        <h1 className="text-4xl font-bold mb-4">Notes Coming Soon</h1>
        <p className="text-muted-foreground text-lg max-w-md">
          I am currently writing and organizing my digital notes. Check back later!
        </p>
      </div>
    );
  }
  const topicNames = getNoteTopics();
  const topics = topicNames.map(name => ({
    name,
    notes: getNotesByTopic(name).map(n => ({ title: n.title, slug: n.slug }))
  }));

  return (
    <>
      <ProgressBar />
      <div className="container mx-auto px-4 md:px-6 max-w-7xl pt-24 pb-12 flex flex-col md:flex-row gap-8">
      <NotesSidebar topics={topics} />
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
    </>
  );
}
