import Link from "next/link";
import dynamic from "next/dynamic";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TypingEffect } from "./typing-effect";
import { ArrowRight, Download } from "lucide-react";

const FloatingBlobs = dynamic(() =>
  import("./floating-blobs").then((mod) => mod.FloatingBlobs),
);

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20"
    >
      <FloatingBlobs />

      <div className="container px-4 md:px-6 z-10 flex flex-col items-center text-center">
        <div className="inline-block rounded-full border border-border bg-background/50 backdrop-blur-sm px-3 py-1 text-sm mb-6">
          <span className="text-muted-foreground flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Available for new opportunities
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl">
          Hi, I&apos;m Prahlad <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
            <TypingEffect
              texts={[
                "Software Engineer",
                "Frontend Developer",
                "Guidewire Jutro Expert",
              ]}
            />
          </span>
        </h1>

        <p className="max-w-[700px] text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
          Specializing in Guidewire, React, Next.js, TypeScript and building
          AI-powered developer tools with a focus on performance and minimal
          design.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="#contact"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full px-8 group",
            )}
          >
            Contact Me
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/resume"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-full px-8",
            )}
          >
            View Resume
            <Download className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
