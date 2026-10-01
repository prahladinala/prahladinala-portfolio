"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

export function ViewCounter({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    // In a real app, you would fetch this from your database (e.g., Vercel KV, Supabase)
    // For now, we simulate a view count based on a deterministic hash of the slug
    // so it stays consistent per post, plus a local increment.
    const getSimulatedViews = () => {
      let hash = 0;
      for (let i = 0; i < slug.length; i++) {
        hash = slug.charCodeAt(i) + ((hash << 5) - hash);
      }
      const baseViews = Math.abs(hash) % 5000 + 1200;
      
      const localKey = `view-count-${slug}`;
      const hasViewed = localStorage.getItem(localKey);
      
      if (!hasViewed) {
        localStorage.setItem(localKey, "true");
        return baseViews + 1;
      }
      return baseViews;
    };

    setViews(getSimulatedViews());
  }, [slug]);

  if (views === null) return null;

  return (
    <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/50 px-2 py-1 rounded-md text-xs font-medium border border-border/50">
      <Eye className="w-3.5 h-3.5" />
      <span>{views.toLocaleString()} views</span>
    </div>
  );
}
