const fs = require("fs");
let content = fs.readFileSync("src/app/(main)/notes/[topic]/[slug]/page.tsx", "utf8");

content = content.replace(
  'return (\n            {settings.showRelatedNotes && (\n          <div className="mt-16 pt-8 border-t border-border print:hidden">',
  'return (\n            <>\n              {settings.showRelatedNotes && (\n          <div className="mt-16 pt-8 border-t border-border print:hidden">'
);

content = content.replace(
  '</div>\n        )}\n\n        {/* Comments */}',
  '</div>\n        )}\n            </>\n          );\n        })()}\n\n        {/* Comments */}'
);

fs.writeFileSync("src/app/(main)/notes/[topic]/[slug]/page.tsx", content);
