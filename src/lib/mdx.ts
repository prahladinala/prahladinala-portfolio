import fs from "fs";
import path from "path";
import matter from "gray-matter";

const NOTES_PATH = path.join(process.cwd(), "src/content/notes");

export type NoteMeta = {
  title: string;
  date: string;
  description: string;
  slug: string;
  topic: string;
  readingTime: number;
  tags?: string[];
  draft?: boolean;
  updatedAt?: string;
};

export type Note = {
  meta: NoteMeta;
  content: string;
};

// Get all topics (folders in src/content/notes)
export function getNoteTopics(): string[] {
  if (!fs.existsSync(NOTES_PATH)) return [];
  const files = fs.readdirSync(NOTES_PATH).filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));
  
  const topics = new Set<string>();
  files.forEach((file) => {
    const filePath = path.join(NOTES_PATH, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    if (data.topic) topics.add(data.topic);
  });
  
  return Array.from(topics).sort();
}

// Get all notes across all topics
export function getAllNotes(): NoteMeta[] {
  if (!fs.existsSync(NOTES_PATH)) return [];
  const files = fs.readdirSync(NOTES_PATH).filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));

  const notes = files.map((file) => {
    const slug = file.replace(/\.mdx?$/, "");
    const filePath = path.join(NOTES_PATH, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    return {
      title: data.title || slug,
      date: data.date || "",
      description: data.description || "",
      slug,
      topic: data.topic || "general",
      readingTime,
      tags: data.tags || [],
      draft: data.draft === true,
      updatedAt: data.updatedAt || "",
    };
  });

  // Filter out drafts in production mode
  let finalNotes = process.env.NODE_ENV === "production" ? notes.filter(n => !n.draft) : notes;

  // Sort by date ascending
  return finalNotes.sort((a, b) => (a.date > b.date ? 1 : -1));
}

// Get all notes for a specific topic
export function getNotesByTopic(topic: string): NoteMeta[] {
  return getAllNotes().filter(note => note.topic === topic);
}

// Get a specific note by topic and slug
export function getNoteBySlug(topic: string, slug: string): Note | null {
  const mdxPath = path.join(NOTES_PATH, `${slug}.mdx`);
  const mdPath = path.join(NOTES_PATH, `${slug}.md`);
  
  let filePath = "";
  if (fs.existsSync(mdxPath)) filePath = mdxPath;
  else if (fs.existsSync(mdPath)) filePath = mdPath;
  else return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  // Validate topic matches
  if (data.topic !== topic && topic !== "general") return null;

  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Prevent direct URL access to drafts in production
  if (data.draft && process.env.NODE_ENV === "production") return null;

  return {
    meta: {
      title: data.title || slug,
      date: data.date || "",
      description: data.description || "",
      slug,
      topic: data.topic || "general",
      readingTime,
      tags: data.tags || [],
      draft: data.draft === true,
      updatedAt: data.updatedAt || "",
    },
    content,
  };
}

// Get all unique tags across all notes
export function getAllTags(): string[] {
  const notes = getAllNotes();
  const tags = new Set<string>();
  notes.forEach((note) => {
    if (note.tags) {
      note.tags.forEach((tag) => tags.add(tag.toLowerCase()));
    }
  });
  return Array.from(tags).sort();
}

// Get notes by a specific tag
export function getNotesByTag(tag: string): NoteMeta[] {
  const notes = getAllNotes();
  return notes.filter((note) => 
    note.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getRelatedNotes(currentMeta: NoteMeta, limit = 3) {
  const all = getAllNotes().filter(n => n.slug !== currentMeta.slug);
  
  const scored = all.map(note => {
    let score = 0;
    if (note.topic === currentMeta.topic) score += 2;
    if (note.tags && currentMeta.tags) {
      const common = note.tags.filter(t => currentMeta.tags?.includes(t));
      score += common.length;
    }
    return { note, score };
  });
  
  return scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, limit).map(s => s.note);
}
