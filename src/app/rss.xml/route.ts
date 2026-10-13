import { getAllNotes } from "@/lib/mdx";
import RSS from "rss";
import { SITE_CONFIG } from "@/config/constants";

export async function GET() {
  const notes = getAllNotes();
  const site_url = SITE_CONFIG.url;

  const feedOptions = {
    title: "Prahlad Inala | Digital Notes",
    description: "Thoughts on software engineering, frontend development, Next.js, and Guidewire.",
    site_url: site_url,
    feed_url: `${site_url}/rss.xml`,
    image_url: `${site_url}/avatar.webp`,
    pubDate: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}, Prahlad Inala`,
  };

  const feed = new RSS(feedOptions);

  notes.forEach((note) => {
    feed.item({
      title: note.title,
      description: note.description || "",
      url: `${site_url}/notes/${note.topic}/${note.slug}`,
      date: note.date,
      categories: note.tags || [note.topic],
      author: "Prahlad Inala",
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
