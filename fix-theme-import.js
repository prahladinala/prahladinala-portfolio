const fs = require("fs");
let content = fs.readFileSync("src/app/(resume)/layout.tsx", "utf8");

content = content.replace(
  'import { ThemeToggle } from "@/components/theme-toggle";',
  'import { ThemeToggle } from "@/components/theme-toggle-v2";'
);
fs.writeFileSync("src/app/(resume)/layout.tsx", content);
