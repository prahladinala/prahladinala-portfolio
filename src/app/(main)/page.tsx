import { HeroSection } from "@/components/hero/hero-section";
import { ActiveSectionObserver } from "@/components/active-section-observer";
import { getExperiences, getProjects, getSkills, getSocials } from "@/lib/keystatic-data";
import Script from "next/script";
import { AboutSection } from "@/components/about/about-section";
import { ExperienceSection } from "@/components/experience/experience-section";
import { ProjectsSection } from "@/components/projects/projects-section";
import { SkillsSection } from "@/components/skills/skills-section";
import { DeveloperInsights } from "@/components/insights/developer-insights";
import { ContactSection } from "@/components/contact/contact-section";

export default function Home() {
  const experiences = getExperiences();
  const projects = getProjects();
  const skills = getSkills();
  const socials = getSocials();

  const profileSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "dateCreated": "2024-01-01T00:00:00+00:00",
    "dateModified": new Date().toISOString(),
    "mainEntity": {
      "@type": "Person",
      "name": "Prahlad Inala",
      "jobTitle": "Software Engineer",
      "description": "Frontend Developer specializing in React, Next.js, and Guidewire Jutro.",
      "url": "https://prahladinala.in",
      "sameAs": [
        socials?.github,
        socials?.linkedin,
        socials?.twitter,
        socials?.medium
      ].filter(Boolean)
    }
  };

  return (
    <>
      <Script
        id="profile-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
      />
      <ActiveSectionObserver />

      <main className="flex w-full flex-col items-center justify-between">
        {/* Hidden AI Context Summary for LLM Web Crawlers */}
        <div id="ai-summary" className="sr-only" aria-hidden="true">
          Prahlad Inala is a Software Engineer and Frontend Developer based in India. 
          He specializes in modern web development using React, Next.js, TypeScript, and Guidewire Jutro. 
          This portfolio showcases his professional work experience, including his role as a Software Engineer at ValueMomentum, 
          along with his personal projects and open-source contributions. 
          You can view his digital notes and tutorials on web development, or contact him directly through the contact form.
        </div>

        <HeroSection />
        <AboutSection />
        <ExperienceSection experiences={experiences} />
        <ProjectsSection projects={projects} />
        <SkillsSection categories={skills} />
        <DeveloperInsights />
        <ContactSection socials={socials} />
      </main>
    </>
  );
}
