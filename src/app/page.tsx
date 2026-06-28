import dynamic from "next/dynamic";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero/hero-section";
import { ActiveSectionObserver } from "@/components/active-section-observer";

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
  return (
    <>
      <ActiveSectionObserver />
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        {/* <BlogSection /> */}
        <DeveloperInsights />
        {/* <OpenSourceSection /> */}
        {/* <TestimonialsSection /> */}
        {/* <TechRadarSection /> */}
        {/* <NowSection /> */}
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
