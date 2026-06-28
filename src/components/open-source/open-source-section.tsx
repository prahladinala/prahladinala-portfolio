import { openSourceProjects } from "@/data/open-source";
import { Download, Star, Users, ExternalLink, Package, Terminal, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const typeIconMap: Record<string, React.ReactNode> = {
  "VS Code Extension": <Terminal className="w-5 h-5 text-blue-500" />,
  "Library": <Package className="w-5 h-5 text-orange-500" />,
  "Theme": <Palette className="w-5 h-5 text-purple-500" />,
};

export function OpenSourceSection() {
  return (
    <section id="open-source" className="py-24 bg-muted/30 w-full relative">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Open Source</h2>
          <div className="w-12 h-1 bg-primary rounded-full" />
          <p className="mt-4 text-muted-foreground max-w-2xl">
            Tools, libraries, and extensions I&apos;ve built to give back to the developer community.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {openSourceProjects.map((project) => (
            <Card key={project.id} className="bg-background/50 border-border/50 hover:border-primary/50 transition-colors group">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-muted rounded-lg">
                    {typeIconMap[project.type] || <Package className="w-5 h-5 text-primary" />}
                  </div>
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-5 h-5 text-muted-foreground hover:text-primary" />
                  </a>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{project.title}</CardTitle>
                <div className="text-sm font-medium text-muted-foreground mt-1">{project.type}</div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex gap-4 border-t border-border/50 pt-4">
                  {project.metrics.downloads && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Download className="w-4 h-4" /> {project.metrics.downloads}
                    </div>
                  )}
                  {project.metrics.stars && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Star className="w-4 h-4 text-yellow-500" /> {project.metrics.stars}
                    </div>
                  )}
                  {project.metrics.users && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="w-4 h-4 text-blue-400" /> {project.metrics.users}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
