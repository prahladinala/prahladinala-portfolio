const fs = require("fs");
let content = fs.readFileSync("src/app/(main)/notes/[topic]/[slug]/page.tsx", "utf8");

content = content.replace(
  'import { ScrollToTop } from "@/components/scroll-to-top";',
  'import { ScrollToTop } from "@/components/scroll-to-top";\nimport { ViewCounter } from "@/components/view-counter";'
);

const insertAfter = '<Clock className="w-4 h-4" /> {note.meta.readingTime} min read\n                  </span>\n                )}';
const replacement = insertAfter + '\n                <ViewCounter slug={note.slug} />';

content = content.replace(insertAfter, replacement);
fs.writeFileSync("src/app/(main)/notes/[topic]/[slug]/page.tsx", content);
