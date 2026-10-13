import { getAllNotes } from "@/lib/mdx";
import { BookmarksClient } from "./bookmarks-client";
import { SITE_CONFIG } from "@/config/constants";

export const metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: "Bookmarked Notes | Digital Notes",
  description: "View all your saved and bookmarked notes in one place.",
  alternates: {
    canonical: "https://prahladinala.in/notes/bookmarks",
  },
  openGraph: {
    title: "Bookmarked Notes | Digital Notes",
    description: "View all your saved and bookmarked notes in one place.",
    url: "https://prahladinala.in/notes/bookmarks",
    type: "website",
    images: [
      {
        url: "https://prahladinala.in/api/og?title=Bookmarked%20Notes&topic=Digital%20Notes",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Bookmarked Notes | Digital Notes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bookmarked Notes | Digital Notes",
    description: "View all your saved and bookmarked notes in one place.",
    images: ["https://prahladinala.in/api/og?title=Bookmarked%20Notes&topic=Digital%20Notes"],
  },
};

export default function BookmarksPage() {
  // Fetch all notes on the server
  const notes = getAllNotes();

  return <BookmarksClient allNotes={notes} />;
}
