import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist or has been moved.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Background Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl -z-10" />

      <div className="container px-4 md:px-6 flex flex-col items-center text-center max-w-2xl mx-auto z-10">
        
        {/* Error Code */}
        <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/40 mb-4">
          404
        </h1>
        
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
          Oops! Page Not Found
        </h2>
        
        {/* Description */}
        <p className="text-lg text-muted-foreground mb-10 max-w-md">
          It seems you've ventured into the unknown. The page you're looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <Link 
            href="/"
            className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8 w-full sm:w-auto group")}
          >
            <Home className="mr-2 w-4 h-4 transition-transform group-hover:scale-110" />
            Back to Home
          </Link>
          
          <Link 
            href="/#contact"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full px-8 w-full sm:w-auto group")}
          >
            <Search className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Contact Me
          </Link>
        </div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />
      </div>
    </div>
  );
}
