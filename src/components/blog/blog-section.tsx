import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, BookOpen } from "lucide-react";

export function BlogSection() {
  return (
    <section id="blog" className="py-24 w-full relative bg-muted/30">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <BookOpen className="w-12 h-12 text-primary mb-6" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Latest Writing</h2>
          <div className="w-12 h-1 bg-primary rounded-full mb-6" />
          <p className="text-lg text-muted-foreground mb-8">
            I regularly write about software engineering, frontend development, and my experiences building products. Check out my latest thoughts and tutorials on my blog.
          </p>
          <a 
            href="https://prahladinala.hashnode.dev" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8")}
          >
            Visit My Blog <ArrowRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
