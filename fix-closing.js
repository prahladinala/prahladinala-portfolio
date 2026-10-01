const fs = require("fs");
let content = fs.readFileSync("src/app/(main)/notes/[topic]/[slug]/page.tsx", "utf8");

content = content.replace(
  '            </div>\r\n          );\r\n        })()}',
  '            </div>\r\n              )}\r\n            </>\r\n          );\r\n        })()}'
);
content = content.replace(
  '            </div>\n          );\n        })()}',
  '            </div>\n              )}\n            </>\n          );\n        })()}'
);

fs.writeFileSync("src/app/(main)/notes/[topic]/[slug]/page.tsx", content);
