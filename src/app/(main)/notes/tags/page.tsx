import { getAllTags } from "@/lib/mdx";
import Link from "next/link";
import { Hash } from "lucide-react";

export const metadata = {
  title: "All Tags | Digital Notes",
  description: "Browse all tags across my digital notes",
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="max-w-4xl pb-24">
      <header className="mb-12">
        <h1 className="text-4xl font-black mb-4 tracking-tight">Topics & Tags</h1>
        <p className="text-xl text-muted-foreground">
          Browse notes by their specific concepts and tags.
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <Link 
            key={tag} 
            href={`/notes/tags/${tag}`}
            className="flex items-center gap-1.5 px-4 py-2 bg-muted/40 hover:bg-primary/10 border border-border hover:border-primary/30 rounded-full text-sm font-medium transition-colors"
          >
            <Hash className="w-3.5 h-3.5 text-muted-foreground" />
            {tag}
          </Link>
        ))}
        {tags.length === 0 && (
          <p className="text-muted-foreground">No tags found in any notes.</p>
        )}
      </div>
    </div>
  );
}
