import { CheckCircle2, BookOpen, Target, Hammer } from "lucide-react";

export function NowSection() {
  return (
    <section id="now" className="py-24 w-full relative">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">What I'm doing now</h2>
          <div className="w-12 h-1 bg-primary rounded-full" />
          <p className="mt-4 text-muted-foreground text-sm">
            Updated June 2026
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-8">
              <h3 className="flex items-center text-xl font-bold mb-4"><Hammer className="w-5 h-5 mr-3 text-primary" /> Building</h3>
              <ul className="space-y-3">
                <li className="flex items-start text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-muted-foreground/50 shrink-0 mt-0.5" />
                  <span>A new developer tool for managing local environments.</span>
                </li>
                <li className="flex items-start text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-muted-foreground/50 shrink-0 mt-0.5" />
                  <span>Complex state architectures in Guidewire Jutro for enterprise clients.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-card border border-border rounded-2xl p-8">
              <h3 className="flex items-center text-xl font-bold mb-4"><BookOpen className="w-5 h-5 mr-3 text-blue-500" /> Reading</h3>
              <ul className="space-y-3">
                <li className="flex items-start text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-muted-foreground/50 shrink-0 mt-0.5" />
                  <span>"Designing Data-Intensive Applications" by Martin Kleppmann</span>
                </li>
                <li className="flex items-start text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-muted-foreground/50 shrink-0 mt-0.5" />
                  <span>"Staff Engineer: Leadership beyond the management track" by Will Larson</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-8">
              <h3 className="flex items-center text-xl font-bold mb-4"><Target className="w-5 h-5 mr-3 text-green-500" /> Current Goals</h3>
              <ul className="space-y-3">
                <li className="flex items-start text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-muted-foreground/50 shrink-0 mt-0.5" />
                  <span>Achieve 100% test coverage on my open source projects.</span>
                </li>
                <li className="flex items-start text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-muted-foreground/50 shrink-0 mt-0.5" />
                  <span>Publish one technical article per month on Hashnode.</span>
                </li>
                <li className="flex items-start text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-muted-foreground/50 shrink-0 mt-0.5" />
                  <span>Contribute to the Next.js core repository.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
