import { getNoteTopics, getNotesByTopic } from "@/lib/mdx";
import { NotesSidebar } from "@/components/notes-sidebar-v3";
import { ProgressBar } from "@/components/progress-bar";

export default function NotesLayout({ children }: { children: React.ReactNode }) {
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
