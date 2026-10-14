"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ExternalLink, Laptop, Sparkles, Activity, Layers } from "lucide-react";
import { Github } from "@/components/icons";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/keystatic-data";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProjectModalProps = {
  project: Project | null;
  onClose: () => void;
};

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "preview">("overview");

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-background/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold truncate text-foreground m-0">
                {project.title}
              </h3>
              {project.featured && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 shrink-0">
                  Featured
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Tabs for Overview vs Live Interactive Sandbox */}
              {project.liveUrl && (
                <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/50 text-xs font-semibold mr-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("overview")}
                    className={cn(
                      "px-3 py-1 rounded-lg transition-all",
                      activeTab === "overview"
                        ? "bg-card text-foreground shadow-xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Overview
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={cn(
                      "px-3 py-1 rounded-lg transition-all flex items-center gap-1.5",
                      activeTab === "preview"
                        ? "bg-card text-foreground shadow-xs font-bold text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Laptop className="w-3.5 h-3.5" /> Live Demo
                  </button>
                </div>
              )}

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Close modal"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === "preview" && project.liveUrl ? (
              /* Live In-Browser Demo Iframe Sandbox */
              <div className="flex flex-col h-[520px] rounded-2xl border border-border overflow-hidden bg-background">
                <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-b border-border text-xs text-muted-foreground font-mono">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="truncate">{project.liveUrl}</span>
                  </div>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline ml-2"
                  >
                    Open Tab <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <iframe
                  src={project.liveUrl}
                  title={`${project.title} Live Preview`}
                  className="w-full flex-1 border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  loading="lazy"
                />
              </div>
            ) : (
              /* Project Overview & Case Study */
              <>
                {/* Cover Image */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border bg-muted">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 800px"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-muted to-background/50 flex items-center justify-center">
                      <span className="text-6xl opacity-30">🚀</span>
                    </div>
                  )}
                </div>

                {/* Key Performance Metrics */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {project.metrics.map((metric, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 flex flex-col justify-center"
                      >
                        <span className="text-xl sm:text-2xl font-black text-foreground">
                          {metric.value}
                        </span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">
                          {metric.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Description & Case Study */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-primary" /> Architecture & Summary
                    </h4>
                    <p className="text-sm sm:text-base text-foreground leading-relaxed font-medium">
                      {project.longDescription || project.description}
                    </p>
                  </div>

                  {/* Tech Stack Pills */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" /> Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="px-3 py-1 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-border bg-muted/20 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ size: "sm" }), "rounded-full shadow-xs gap-1.5")}
                >
                  Visit Live Application <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "rounded-full gap-1.5"
                  )}
                >
                  <Github className="w-4 h-4" /> View Source Code
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors ml-auto"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
