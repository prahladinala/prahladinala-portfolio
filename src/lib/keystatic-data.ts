import fs from "fs";
import path from "path";
import { cache } from "react";

// Define the types (mirroring the old hardcoded ones)
export type Experience = {
  id: string; // The slug
  company: string;
  role: string;
  duration: string;
  location: string;
  shortDescription: string;
  responsibilities: string[];
  technologies: string[];
  logo?: string;
};

export type Project = {
  id: string; // The slug
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

export type SkillCategory = {
  title: string;
  skills: string[];
};

export const getExperiences = cache((): Experience[] => {
  const dir = path.join(process.cwd(), "src/content/experience");
  if (!fs.existsSync(dir)) return [];
  
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  return files.map(file => {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(content);
    return {
      id: file.replace('.json', ''),
      ...data,
    } as Experience;
  });
});

export const getProjects = cache((): Project[] => {
  const dir = path.join(process.cwd(), "src/content/projects");
  if (!fs.existsSync(dir)) return [];
  
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  return files.map(file => {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(content);
    return {
      id: file.replace('.json', ''),
      ...data,
    } as Project;
  });
});

export const getSkills = cache((): SkillCategory[] => {
  const filePath = path.join(process.cwd(), "src/content/skills/skills.json");
  if (!fs.existsSync(filePath)) return [];
  
  const content = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(content);
  return data.categories || [];
});

export type Socials = {
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  medium: string;
};

export const getSocials = cache((): Socials | null => {
  const filePath = path.join(process.cwd(), "src/content/socials/socials.json");
  if (!fs.existsSync(filePath)) return null;
  
  const content = fs.readFileSync(filePath, "utf8");
  return JSON.parse(content) as Socials;
});
