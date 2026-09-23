import { MetadataRoute } from "next";
import { getAllNotes, getNoteTopics } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://prahladinala.in";
  
  // Base Routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/notes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Topics
  const topics = getNoteTopics();
  topics.forEach((topic) => {
    routes.push({
      url: `${baseUrl}/notes/${topic}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  // Individual Notes
  const notes = getAllNotes();
  notes.forEach((note) => {
    routes.push({
      url: `${baseUrl}/notes/${note.topic}/${note.slug}`,
      lastModified: new Date(note.date),
      changeFrequency: "yearly",
      priority: 0.7,
    });
  });

  return routes;
}
