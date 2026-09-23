import { Card, CardContent } from "@/components/ui/card";
import { Code2, GitMerge, PenTool, TerminalSquare } from "lucide-react";

export function StatsGrid({ 
  stats: dynamicStats 
}: { 
  stats: { experience: string; projects: string; blogs: string; repos: string; } 
}) {
  const stats = [
    {
      title: "Years Experience",
      value: dynamicStats.experience + "+",
      icon: <TerminalSquare className="w-5 h-5 text-primary" />,
    },
    {
      title: "Projects Built",
      value: dynamicStats.projects + "+",
      icon: <Code2 className="w-5 h-5 text-purple-500" />,
    },
    {
      title: "Blog Posts",
      value: dynamicStats.blogs + "+",
      icon: <PenTool className="w-5 h-5 text-blue-500" />,
    },
    {
      title: "Git Repos",
      value: dynamicStats.repos + "+",
      icon: <GitMerge className="w-5 h-5 text-orange-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-xl">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="bg-background/50 border-border/50 hover:bg-muted/50 transition-colors"
        >
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="mb-2 p-2 bg-muted rounded-full">{stat.icon}</div>
            <h4 className="text-3xl font-bold mb-1">{stat.value}</h4>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
