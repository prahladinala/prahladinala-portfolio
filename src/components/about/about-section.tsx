import { ProfileImage } from "./profile-image";
import { StatsGrid } from "./stats-grid";

export function AboutSection() {
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
            
            <StatsGrid />
          </div>
        </div>
      </div>
    </section>
  );
}
