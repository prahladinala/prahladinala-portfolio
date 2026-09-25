import dynamic from "next/dynamic";

import { HeroSection } from "@/components/hero/hero-section";
import { ActiveSectionObserver } from "@/components/active-section-observer";
import { getExperiences, getProjects, getSkills, getSocials } from "@/lib/keystatic-data";
import Script from "next/script";

// Lazy load all sections below the fold for better initial page load performance
const AboutSection = dynamic(() =>
  import("@/components/about/about-section").then((mod) => mod.AboutSection),
);
const ExperienceSection = dynamic(() =>
  import("@/components/experience/experience-section").then(
    (mod) => mod.ExperienceSection,
  ),
);
const ProjectsSection = dynamic(() =>
  import("@/components/projects/projects-section").then(
    (mod) => mod.ProjectsSection,
  ),
);
const SkillsSection = dynamic(() =>
  import("@/components/skills/skills-section").then((mod) => mod.SkillsSection),
);
const BlogSection = dynamic(() =>
  import("@/components/blog/blog-section").then((mod) => mod.BlogSection),
);
const DeveloperInsights = dynamic(() =>
  import("@/components/insights/developer-insights").then(
    (mod) => mod.DeveloperInsights,
  ),
);
const OpenSourceSection = dynamic(() =>
  import("@/components/open-source/open-source-section").then(
    (mod) => mod.OpenSourceSection,
  ),
);
const TestimonialsSection = dynamic(() =>
  import("@/components/testimonials/testimonials-section").then(
    (mod) => mod.TestimonialsSection,
  ),
);
const TechRadarSection = dynamic(() =>
  import("@/components/tech-radar/tech-radar-section").then(
    (mod) => mod.TechRadarSection,
  ),
);
const NowSection = dynamic(() =>
  import("@/components/now/now-section").then((mod) => mod.NowSection),
);
const ContactSection = dynamic(() =>
  import("@/components/contact/contact-section").then(
    (mod) => mod.ContactSection,
  ),
);
const Footer = dynamic(() =>
  import("@/components/footer").then((mod) => mod.Footer),
);

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
        {/* <BlogSection /> */}
        <DeveloperInsights />
        {/* <OpenSourceSection /> */}
        {/* <TestimonialsSection /> */}
        {/* <TechRadarSection /> */}
        {/* <NowSection /> */}
        <ContactSection socials={socials} />
      </main>
    </>
  );
}
