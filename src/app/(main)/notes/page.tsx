import { getAllNotes } from "@/lib/mdx";
import { NotesList } from "@/components/notes-list";

export const metadata = {
  title: "Digital Notes",
  description: "My personal collection of notes, snippets, and deep dives.",
};

export default function NotesIndexPage() {
  const notes = getAllNotes();

  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Digital Notes</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Welcome to my digital notes. Here you'll find a collection of my technical documentation and deep dives on various topics.
      </p>

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
