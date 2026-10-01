const fs = require("fs");
let content = fs.readFileSync("src/app/(main)/notes/[topic]/[slug]/page.tsx", "utf8");

// Add ViewCounter
content = content.replace(
  '<Clock className="w-4 h-4" /> {note.meta.readingTime} min read\r\n                  </span>\r\n                )}',
  '<Clock className="w-4 h-4" /> {note.meta.readingTime} min read\n                  </span>\n                )}\n                {settings.showViews && <ViewCounter slug={note.slug} />}'
);
content = content.replace(
  '<Clock className="w-4 h-4" /> {note.meta.readingTime} min read\n                  </span>\n                )}',
  '<Clock className="w-4 h-4" /> {note.meta.readingTime} min read\n                  </span>\n                )}\n                {settings.showViews && <ViewCounter slug={note.slug} />}'
);

// Wrap ShareButtons
content = content.replace(
  '<ShareButtons title={note.meta.title} url={currentUrl} />',
  '{settings.showShareButtons && <ShareButtons title={note.meta.title} url={currentUrl} />}'
);

fs.writeFileSync("src/app/(main)/notes/[topic]/[slug]/page.tsx", content);
