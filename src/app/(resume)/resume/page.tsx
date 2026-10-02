import { getExperiences, getProjects, getSkills, getSocials } from "@/lib/keystatic-data";
import { Mail, MapPin } from "lucide-react";
import { Github, Linkedin } from "@/components/icons";

export default function ResumePage() {
  const experiences = getExperiences();
  const projects = getProjects()
    .filter((p) => p.featured)
    .slice(0, 3);
  const skills = getSkills();
  const socials = getSocials() || {
    email: "",
    github: "",
    linkedin: "",
    twitter: "",
    medium: "",
  };

  return (
    <div className="bg-background print:bg-white text-foreground print:text-black">
      {/* Web Only Controls */}
      

      {/* Resume Document (A4 Constraints for Print) */}
      <div className="max-w-[850px] mx-auto px-4 md:px-8 pb-20 print:p-0 print:max-w-none">
        {/* HEADER */}
        <header className="border-b-2 border-foreground/10 print:border-black/20 pb-6 mb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-primary print:text-black">
            Prahlad Inala
          </h1>
          <p className="text-xl text-muted-foreground print:text-gray-700 font-medium mb-4">
            Software Engineer
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground print:text-gray-600">
            {socials.email && (
              <a
                href={`mailto:${socials.email}`}
                className="flex items-center gap-1 hover:text-primary print:text-black"
              >
                <Mail className="w-4 h-4" /> {socials.email}
              </a>
            )}
            <span className="flex items-center gap-1 print:text-black">
              <MapPin className="w-4 h-4" /> Hyderabad, India
            </span>

            {socials.github && (
              <a
                href={socials.github}
                className="flex items-center gap-1 hover:text-primary print:text-black"
              >
                <Github className="w-4 h-4" /> GitHub
              </a>
            )}
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                className="flex items-center gap-1 hover:text-primary print:text-black"
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 print:grid-cols-1 gap-8">
          {/* MAIN COLUMN */}
          <div className="space-y-8">
            {/* SUMMARY */}
            <section>
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-3 text-primary print:text-black flex items-center gap-2">
                Professional Summary
              </h2>
              <p className="text-muted-foreground print:text-gray-800 leading-relaxed text-sm">
                Software Engineer with expertise in building scalable, modern
                web applications. Proficient in React, Next.js, TypeScript, and
                modern frontend architecture. Passionate about delivering
                exceptional developer experience, high-performance interfaces,
                and robust digital solutions.
              </p>
            </section>

            {/* EXPERIENCE */}
            <section>
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-4 text-primary print:text-black flex items-center gap-2">
                Experience
              </h2>
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                      <h3 className="font-bold text-lg print:text-base print:font-extrabold">
                        {exp.role}
                      </h3>
                      <span className="text-sm font-medium text-muted-foreground print:text-gray-600 bg-muted/50 print:bg-transparent px-2 py-0.5 rounded-md print:px-0">
                        {exp.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-medium print:text-gray-800 text-sm mb-2">
                      <span>{exp.company}</span>
                      <span className="text-muted-foreground print:text-gray-400">
                        •
                      </span>
                      <span className="text-muted-foreground print:text-gray-600">
                        {exp.location}
                      </span>
                    </div>

                    <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-muted-foreground print:text-gray-800">
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i} className="pl-1">
                          {resp}
                        </li>
                      ))}
                    </ul>

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs font-semibold bg-primary/10 text-primary print:bg-gray-100 print:text-gray-700 px-2 py-1 rounded-md"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* FEATURED PROJECTS */}
            <section>
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-4 text-primary print:text-black flex items-center gap-2">
                Featured Projects
              </h2>
              <div className="space-y-5">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                      <h3 className="font-bold text-lg print:text-base">
                        {proj.title}
                      </h3>
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          className="text-sm font-medium text-primary hover:underline print:text-gray-600"
                        >
                          {proj.liveUrl.replace("https://", "")}
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground print:text-gray-800 mb-2">
                      {proj.description}
                    </p>
                    {proj.tags && proj.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {proj.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-semibold bg-muted text-muted-foreground print:bg-gray-100 print:text-gray-600 px-2 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* SKILLS */}
            <section>
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-4 text-primary print:text-black flex items-center gap-2">
                Technical Skills
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skills.map((cat) => (
                  <div key={cat.title}>
                    <h3 className="font-bold text-sm mb-1 print:text-black">
                      {cat.title}
                    </h3>
                    <p className="text-sm text-muted-foreground print:text-gray-800 leading-relaxed">
                      {cat.skills.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
