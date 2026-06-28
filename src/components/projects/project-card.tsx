import { ExternalLink } from "lucide-react";
import { Github } from "@/components/icons";
import { Project } from "@/data/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-colors">
      <div className="relative aspect-video bg-muted overflow-hidden border-b border-border">
        {/* Placeholder for project image */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-background/50 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
           <span className="text-4xl opacity-20">🚀</span>
        </div>
        
        {/* Overlay actions */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-primary text-primary-foreground rounded-full hover:scale-110 transition-transform">
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-secondary text-secondary-foreground rounded-full hover:scale-110 transition-transform">
              <Github className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h4>
        <p className="text-muted-foreground text-sm mb-6 flex-1">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-md">
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-md">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
