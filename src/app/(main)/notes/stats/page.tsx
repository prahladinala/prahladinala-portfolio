import { getAllNotes } from "@/lib/mdx";
import { NotesStatsClient } from "./stats-client";
import { SITE_CONFIG } from "@/config/constants";

export const metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: "Reading Stats & Learning Streak | Digital Notes",
  description: "Track your personal reading streak, completed notes, bookmarks, and learning activity heatmap.",
  alternates: {
    canonical: "https://prahladinala.in/notes/stats",
  },
  openGraph: {
    title: "Reading Stats & Learning Streak | Digital Notes",
    description: "Track your personal reading streak, completed notes, bookmarks, and learning activity heatmap.",
    url: "https://prahladinala.in/notes/stats",
    type: "website",
    images: [
      {
        url: "https://prahladinala.in/api/og?title=Learning%20Stats%20%26%20Streaks&topic=Digital%20Notes",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Reading Stats & Learning Streak | Digital Notes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reading Stats & Learning Streak | Digital Notes",
    description: "Track your personal reading streak, completed notes, bookmarks, and learning activity heatmap.",
    images: ["https://prahladinala.in/api/og?title=Learning%20Stats%20%26%20Streaks&topic=Digital%20Notes"],
  },
};

export default function NotesStatsPage() {
  const notes = getAllNotes();

  return <NotesStatsClient totalNotes={notes.length} />;
}
