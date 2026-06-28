import Image from "next/image";
import { ArrowUpRight, PlayCircle } from "lucide-react";
import { Github } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/data/projects";

export function FeaturedProject({ project }: { project: Project }) {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-card border border-border group mb-20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-50 transition-opacity group-hover:opacity-100" />
      
      <div className="relative flex flex-col lg:flex-row items-center">
        {/* Content Side */}
        <div className="flex-1 p-8 md:p-12 lg:pr-8 z-10 flex flex-col justify-center h-full">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary tracking-wider uppercase">Featured Showcase</span>
          </div>
          
          <h3 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h3>
          
          <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
            {project.longDescription || project.description}
          </p>
          
          {project.metrics && (
            <div className="flex flex-wrap gap-6 mb-8 py-4 border-y border-border/50">
              {project.metrics.map((metric, i) => (
                <div key={i}>
                  <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{metric.label}</div>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="bg-secondary/50">{tag}</Badge>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-4 mt-auto">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants(), "rounded-full")}>
                View Live <ArrowUpRight className="ml-2 w-4 h-4" />
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}>
                <Github className="mr-2 w-4 h-4" /> Source Code
              </a>
            )}
          </div>
        </div>
        
        {/* Image/Media Side */}
        <div className="flex-1 w-full lg:w-1/2 p-4 md:p-8 pt-0 lg:pt-8 flex items-center justify-center">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border/50 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500 bg-muted flex items-center justify-center">
            {/* Replace with actual video or Image component */}
            <div className="absolute inset-0 bg-gradient-to-tr from-muted to-background flex flex-col items-center justify-center">
              <PlayCircle className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground font-mono text-sm">project_demo.mp4</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
