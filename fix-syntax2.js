const fs = require("fs");
let content = fs.readFileSync("src/app/(main)/notes/[topic]/[slug]/page.tsx", "utf8");

content = content.replace(
  'return (\r\n            {settings.showRelatedNotes && (',
  'return (\r\n            <>\r\n              {settings.showRelatedNotes && ('
);
content = content.replace(
  'return (\n            {settings.showRelatedNotes && (',
  'return (\n            <>\n              {settings.showRelatedNotes && ('
);

content = content.replace(
  '</div>\r\n        )}\r\n\r\n        {/* Comments */}',
  '</div>\r\n        )}\r\n            </>\r\n          );\r\n        })()}\r\n\r\n        {/* Comments */}'
);
content = content.replace(
  '</div>\n        )}\n\n        {/* Comments */}',
  '</div>\n        )}\n            </>\n          );\n        })()}\n\n        {/* Comments */}'
);


fs.writeFileSync("src/app/(main)/notes/[topic]/[slug]/page.tsx", content);
