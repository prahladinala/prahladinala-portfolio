import { experiences } from "@/data/experience";
import { TimelineItem } from "./timeline-item";

export function ExperienceSection() {
  return (
    <section id="experience" className="py-24 bg-muted/30 w-full relative">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="mb-16 text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Experience</h2>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto md:mx-0" />
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto md:mx-0">
            My professional journey building software for the web.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto relative pt-4">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-border -translate-x-1/2" />
          
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <TimelineItem 
                key={exp.id} 
                experience={exp} 
                isLast={index === experiences.length - 1} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
