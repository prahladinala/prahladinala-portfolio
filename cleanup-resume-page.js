const fs = require("fs");
let content = fs.readFileSync("src/app/(resume)/resume/page.tsx", "utf8");

content = content.replace(
  /<div className="container mx-auto px-4 py-8 flex justify-between items-center print:hidden border-b border-border mb-8">[\s\S]*?<\/div>/m,
  ''
);
// Also remove unnecessary imports
content = content.replace('import { PrintButton } from "@/components/print-button";\n', '');
content = content.replace('import Link from "next/link";\n', '');
content = content.replace('import { ArrowLeft } from "lucide-react";\n', '');
content = content.replace('import { buttonVariants } from "@/components/ui/button";\n', '');
content = content.replace('import { cn } from "@/lib/utils";\n', '');

// Remove the `min-h-screen bg-background print:bg-white text-foreground print:text-black` from outer div because layout handles it, or keep the print styles.
content = content.replace(
  '<div className="min-h-screen bg-background print:bg-white text-foreground print:text-black">',
  '<div className="bg-background print:bg-white text-foreground print:text-black">'
);

// Remove the old metadata
content = content.replace(/export const metadata = \{[\s\S]*?\};\n\n/, '');

fs.writeFileSync("src/app/(resume)/resume/page.tsx", content);
