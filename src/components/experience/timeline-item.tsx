"use client";

import { useState } from "react";
import { ChevronDown, MapPin, Calendar, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Experience } from "@/data/experience";

export function TimelineItem({ experience, isLast }: { experience: Experience; isLast: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative pl-8 md:pl-0">
      {/* Timeline Line (Desktop: center, Mobile: left) */}
      <div className="md:hidden absolute left-[11px] top-8 bottom-0 w-[2px] bg-border" />
      <div className={`hidden md:block absolute left-1/2 top-8 bottom-0 w-[2px] bg-border -translate-x-1/2 ${isLast ? "hidden" : ""}`} />

      <div className="md:flex items-center justify-between w-full mb-8">
        {/* Date for Desktop (Left side for even, Right for odd - we'll just stack for simplicity or keep it clean) */}
        
        {/* Timeline Dot */}
        <div className="absolute left-0 md:left-1/2 w-6 h-6 rounded-full bg-background border-4 border-primary z-10 md:-translate-x-1/2 mt-1.5 md:mt-0" />

        {/* Content Card */}
        <div className="md:w-[calc(50%-2rem)] md:ml-auto w-full bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-bold">{experience.role}</h3>
              <div className="flex items-center gap-2 text-primary font-medium mt-1">
                <Building2 className="w-4 h-4" />
                <span>{experience.company}</span>
              </div>
            </div>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="text-muted-foreground p-1">
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </div>
          
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4 mt-3">
            <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {experience.duration}</div>
            <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {experience.location}</div>
          </div>
          
          <p className="text-muted-foreground">{experience.shortDescription}</p>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-border">
                  <h4 className="font-semibold mb-2">Key Responsibilities:</h4>
                  <ul className="list-disc pl-5 space-y-1 mb-4 text-muted-foreground text-sm">
                    {experience.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {experience.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
