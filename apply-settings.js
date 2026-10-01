const fs = require("fs");
let content = fs.readFileSync("src/app/(main)/notes/[topic]/[slug]/page.tsx", "utf8");

// Import getSettings
content = content.replace(
  'import { getRelatedNotes } from "@/lib/mdx";',
  'import { getRelatedNotes } from "@/lib/mdx";\nimport { getSettings } from "@/lib/keystatic-data";'
);

// Fetch settings in the component
content = content.replace(
  'const nextNote = allNotes[noteIndex + 1];',
  'const nextNote = allNotes[noteIndex + 1];\n\n  const settings = getSettings();'
);

// Wrap ViewCounter
content = content.replace(
  '<ViewCounter slug={note.slug} />',
  '{settings.showViews && <ViewCounter slug={note.slug} />}'
);

// Wrap ShareButtons
content = content.replace(
  '<ShareButtons title={note.meta.title} url={currentUrl} />',
  '{settings.showShareButtons && <ShareButtons title={note.meta.title} url={currentUrl} />}'
);

// Wrap GiscusComments
content = content.replace(
  '<GiscusComments />',
  '{settings.showComments && <GiscusComments />}'
);

// Wrap TableOfContents
content = content.replace(
  '<TableOfContents />',
  '{settings.showTableOfContents && <TableOfContents />}'
);

// Wrap Related Notes
// Need to find the related notes section
const relatedNotesStart = '<div className="mt-16 pt-8 border-t border-border print:hidden">';
const relatedNotesWrap = '{settings.showRelatedNotes && (\n          <div className="mt-16 pt-8 border-t border-border print:hidden">';

content = content.replace(relatedNotesStart, relatedNotesWrap);
// And close it after the section
content = content.replace(
  '</div>\n\n        {/* Comments */}',
  '</div>\n        )}\n\n        {/* Comments */}'
);

fs.writeFileSync("src/app/(main)/notes/[topic]/[slug]/page.tsx", content);
