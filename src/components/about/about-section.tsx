import { ProfileImage } from "./profile-image";
import { StatsGrid } from "./stats-grid";
import { getExperiences, getProjects, getSocials } from "@/lib/keystatic-data";
import { getAllNotes } from "@/lib/mdx";

export async function AboutSection() {
  const experiences = getExperiences();
  const projects = getProjects();
  const socials = getSocials();
  
  // Blog count
  const allNotes = getAllNotes();
  const blogCount = allNotes.length;
  
  // Experience count
  let minYear = new Date().getFullYear();
  experiences.forEach(exp => {
    const match = exp.duration?.match(/\b(20\d{2})\b/g);
    if (match) {
      match.forEach(y => {
        const year = parseInt(y, 10);
        if (year < minYear) minYear = year;
      });
    }
  });
  let expCount = new Date().getFullYear() - minYear;
  if (expCount <= 0) expCount = experiences.length;
  
  // Projects count
  const projectCount = projects.length;
  
  // Git Repos
  let repoCount = "0";
  try {
    let username = "prahladinala"; // fallback
    if (socials?.github) {
      const urlParts = socials.github.split('/').filter(Boolean);
      username = urlParts[urlParts.length - 1];
    }
    
    // Fetch from GitHub
    const res = await fetch(`https://api.github.com/users/${username}`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      repoCount = data.public_repos?.toString() || "0";
    }
  } catch (e) {
    console.error("Failed to fetch github repos", e);
  }

  const stats = {
    experience: expCount > 0 ? expCount.toString() : "0",
    projects: projectCount > 0 ? projectCount.toString() : "0",
    blogs: blogCount > 0 ? blogCount.toString() : "0",
    repos: repoCount
  };

  return (
    <section id="about" className="py-24 sm:py-32 w-full relative">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">About Me</h2>
          <div className="w-12 h-1 bg-primary rounded-full" />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center lg:items-start justify-between">
          <ProfileImage />
          
          <div className="flex-1 max-w-2xl">
            <h3 className="text-2xl font-semibold mb-6">
              I build products that are fast, accessible, and beautiful.
            </h3>
            
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                My name is Prahlad, and I am a Software Engineer specialized in the modern web ecosystem. I have a strong focus on building seamless user experiences with React, Next.js, and TypeScript.
              </p>
              <p>
                Currently, I am working as a Guidewire Jutro Developer, where I build robust insurance portals and improve UI performance at scale. When I&apos;m not writing code for work, I&apos;m exploring AI-powered developer tools or contributing to open source.
              </p>
            </div>
            
            <StatsGrid stats={stats} />
          </div>
        </div>
      </div>
    </section>
  );
}
