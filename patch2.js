const fs = require("fs");
let content = fs.readFileSync("src/app/(main)/notes/[topic]/[slug]/page.tsx", "utf8");

content = content.replace(
  /{note\.meta\.readingTime && \([\s\S]*?<\/span>\s*\)\s*}/g,
  `{note.meta.readingTime && (
                  <span className="flex items-center gap-1.5 text-sm print:hidden">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50 hidden sm:block"></span>
                    <Clock className="w-4 h-4" /> {note.meta.readingTime} min read
                  </span>
                )}
                {settings.showViews && <ViewCounter slug={note.slug} />}`
);

fs.writeFileSync("src/app/(main)/notes/[topic]/[slug]/page.tsx", content);
