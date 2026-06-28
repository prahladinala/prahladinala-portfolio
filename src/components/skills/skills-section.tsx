import { skillCategories } from "@/data/skills";
import { SkillCloud } from "./skill-cloud";

export function SkillsSection() {
  return (
    <section id="skills" className="py-24 bg-muted/30 w-full relative">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="mb-16 text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Technical Skills</h2>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto md:mx-0" />
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto md:mx-0">
            Technologies and tools I use to bring ideas to life.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {skillCategories.map((category) => (
            <div key={category.title} className="flex flex-col">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <span className="w-8 h-px bg-border mr-4" />
                {category.title}
              </h3>
              <SkillCloud skills={category.skills} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
