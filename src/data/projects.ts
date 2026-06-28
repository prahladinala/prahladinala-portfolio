export type Project = {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  metrics?: { label: string; value: string }[];
};

export const projects: Project[] = [
  {
    id: "tool-mate",
    title: "ToolMate - Everyday tools, in one place.",
    description: "Fast browser tools. Built for devs — friendly for everyone.",
    longDescription:
      "Fast browser tools. Built for devs — friendly for everyone.",
    image: "/placeholder-project.svg",
    tags: ["Next.js", "AI", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/prahladinala/toolmate",
    liveUrl: "https://www.toolmate.co.in/",
    featured: true,
    // metrics: [
    //   { label: "Resumes Optimized", value: "10k+" },
    //   { label: "Success Rate", value: "85%" },
    //   { label: "Active Users", value: "2k/mo" },
    // ],
  },
  {
    id: "interview-prep-portal",
    title: "Interview Prep Portal",
    description:
      "A web application that provides curated interview questions and answers for various technical topics.",
    image: "/placeholder-project.svg",
    tags: ["React", "Guidewire", "SCSS"],
    liveUrl: "https://www.interview.toolmate.co.in/",
  },
  {
    id: "blogging-platform",
    title: "Blogging Platform",
    description:
      "A blogging platform that allows users to create, edit, and publish their own blogs with a rich text editor and customizable themes.",
    image: "/placeholder-project.svg",
    tags: ["React", "TypeScript", "Node.js", "AI", "Tailwind CSS"],
    liveUrl: "https://www.blog.toolmate.co.in/",
  },
  {
    id: "toolmate-ui",
    title: "Toolmate UI",
    description:
      "A modern and responsive portfolio website built with Next.js, showcasing my projects, skills, and experience.",
    image: "/placeholder-project.svg",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion"],
    githubUrl: "https://github.com/prahladinala/toolmate-ui",
    liveUrl: "https://www.ui.toolmate.co.in/",
  },
  {
    id: "devcraft-vscode-theme",
    title: "DevCraft VS Code Theme",
    description:
      "A VS Code extension that provides a modern and customizable theme for developers.",
    image: "/placeholder-project.svg",
    tags: ["VS Code", "Theme", "UI", "Tools"],
    liveUrl:
      "https://marketplace.visualstudio.com/items?itemName=PrahladInala.devcraft-themes",
  },
];

export const projectCategories = [
  "All",
  "Next.js",
  "React",
  "AI",
  "Guidewire",
  "Tools",
];
