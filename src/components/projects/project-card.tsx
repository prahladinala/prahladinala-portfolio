import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Github } from "@/components/icons";
import type { Project } from "@/lib/keystatic-data";

type ProjectCardProps = {
  project: Project;
  onSelect?: () => void;
};

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  return (
    <div
      onClick={onSelect}
      className="group flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all hover:-translate-y-1 cursor-pointer shadow-xs"
    >
      <div className="relative aspect-video bg-muted overflow-hidden border-b border-border">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          /* Placeholder when no project image is uploaded */
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-background/50 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
            <span className="text-4xl opacity-20">🚀</span>
          </div>
        )}
        
        {/* Overlay actions */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
            className="px-3.5 py-1.5 bg-card/90 text-foreground border border-border rounded-full text-xs font-bold hover:bg-card hover:scale-105 transition-all shadow-sm"
          >
            Quick View
          </button>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2.5 bg-primary text-primary-foreground rounded-full hover:scale-110 transition-transform shadow-sm"
              title="View Live"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2.5 bg-secondary text-secondary-foreground rounded-full hover:scale-110 transition-transform shadow-sm"
              title="GitHub Repo"
            >
              <Github className="w-4 h-4" />
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
