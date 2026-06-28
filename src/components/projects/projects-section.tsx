"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, projectCategories } from "@/data/projects";
import { FeaturedProject } from "./featured-project";
import { ProjectCard } from "./project-card";
import { Badge } from "@/components/ui/badge";

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const featuredProject = projects.find((p) => p.featured);
  const filteredProjects = projects.filter(
    (p) =>
      !p.featured &&
      (activeCategory === "All" || p.tags.includes(activeCategory)),
  );

  return (
    <section id="projects" className="py-24 w-full relative">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Selected Work
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full" />
          <p className="mt-4 text-muted-foreground max-w-2xl">
            A showcase of my recent projects, featuring web applications, tools,
            and technical experiments.
          </p>
        </div>

        {/* Featured Project */}
        {featuredProject && <FeaturedProject project={featuredProject} />}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <span className="text-sm font-medium mr-2 text-muted-foreground">
            Filter by:
          </span>
          {projectCategories.map((category) => (
            <Badge
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/80 transition-colors text-sm py-1 px-3"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Project Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No projects found in this category.
          </div>
        )}
      </div>
    </section>
  );
}
