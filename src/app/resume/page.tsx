"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, CheckCircle, FileText } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ResumePage() {
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    // Auto-download the resume on page load
    const timer = setTimeout(() => {
      const link = document.createElement("a");
      link.href = "/resume.pdf";
      link.download = "Prahlad_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadStarted(true);
    }, 1500); // Small delay for UX so they see the page first

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Background Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      
      <div className="container px-4 md:px-6 flex flex-col items-center text-center max-w-2xl mx-auto z-10">
        
        <div className="w-24 h-24 bg-card border border-border rounded-full flex items-center justify-center mb-8 shadow-xl relative">
          <FileText className="w-10 h-10 text-primary absolute" />
          {downloadStarted && (
            <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 border border-border">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Downloading Resume
        </h1>
        
        <p className="text-lg text-muted-foreground mb-12">
          Your download should begin automatically. Thank you for your interest in my profile!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          {!downloadStarted ? (
            <Button disabled size="lg" className="rounded-full px-8 w-full sm:w-auto">
              <span className="animate-pulse">Preparing download...</span>
            </Button>
          ) : (
            <a 
              href="/resume.pdf" 
              download="Prahlad_Resume.pdf"
              className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8 w-full sm:w-auto group")}
            >
              Download Again
              <Download className="w-4 h-4 transition-transform group-hover:-translate-y-1" />
            </a>
          )}

          <Link 
            href="/"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full px-8 w-full sm:w-auto group")}
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
