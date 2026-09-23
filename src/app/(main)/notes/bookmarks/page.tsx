import { getAllNotes } from "@/lib/mdx";
import { BookmarksClient } from "./bookmarks-client";

export const metadata = {
  title: "Bookmarked Notes | Digital Notes",
  description: "View all your saved and bookmarked notes in one place.",
};

export default function BookmarksPage() {
  // Fetch all notes on the server
  const notes = getAllNotes();

  return <BookmarksClient allNotes={notes} />;
}
