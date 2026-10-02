const fs = require("fs");
let content = fs.readFileSync("src/app/(resume)/resume/page.tsx", "utf8");

// Remove everything before `export default function ResumePage() {` except the necessary imports.
const newHeader = `import { getExperiences, getProjects, getSkills, getSocials } from "@/lib/keystatic-data";
import { Mail, MapPin } from "lucide-react";
import { Github, Linkedin } from "@/components/icons";

export default function ResumePage() {`;

content = content.replace(/import \{[\s\S]*?export default function ResumePage\(\) \{/m, newHeader);

// Remove the inline header from page
content = content.replace(/<div className="container mx-auto px-4 py-8 flex justify-between items-center print:hidden border-b border-border mb-8">[\s\S]*?<\/div>\s*\{\/\* Resume Document/m, '{/* Resume Document');

fs.writeFileSync("src/app/(resume)/resume/page.tsx", content);
