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

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  if (!fs.existsSync(dirPath)) return [];
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });
  return arrayOfFiles;
}

export function getNoteTopics(): string[] {
  if (!fs.existsSync(NOTES_PATH)) return [];
  const files = getAllFiles(NOTES_PATH).filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));
  
  const topics = new Set<string>();
  files.forEach((filePath) => {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    if (data.topic) topics.add(data.topic);
  });
  
  return Array.from(topics).sort();
}

export function getAllNotes(): NoteMeta[] {
  if (!fs.existsSync(NOTES_PATH)) return [];
  const files = getAllFiles(NOTES_PATH).filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));

  const notes = files.map((filePath) => {
    const fileName = path.basename(filePath);
    const slug = fileName.replace(/\.mdx?$/, "");
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

  const finalNotes = process.env.NODE_ENV === "production" ? notes.filter(n => !n.draft) : notes;
  return finalNotes.sort((a, b) => (a.date > b.date ? 1 : -1));
}

export function getNotesByTopic(topic: string): NoteMeta[] {
  return getAllNotes().filter(note => note.topic === topic);
}

export function getNoteBySlug(topic: string, slug: string): Note | null {
  // We need to find the file that has this slug, since it might be in a subfolder now
  const allFiles = getAllFiles(NOTES_PATH).filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));
  const filePath = allFiles.find(f => path.basename(f).replace(/\.mdx?$/, '') === slug);
  
  if (!filePath) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  if (data.topic !== topic && topic !== "general") return null;

  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

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
