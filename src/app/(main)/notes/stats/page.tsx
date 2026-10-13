import { getAllNotes } from "@/lib/mdx";
import { NotesStatsClient } from "./stats-client";

export const metadata = {
  title: "Reading Stats & Learning Streak | Digital Notes",
  description: "Track your personal reading streak, completed notes, bookmarks, and learning activity heatmap.",
  alternates: {
    canonical: "https://prahladinala.in/notes/stats",
  },
};

export default function NotesStatsPage() {
  const notes = getAllNotes();

  return <NotesStatsClient totalNotes={notes.length} />;
}
