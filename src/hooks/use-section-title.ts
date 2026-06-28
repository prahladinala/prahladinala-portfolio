"use client";

import { useEffect, useState } from "react";

export function useSectionTitle() {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the section that is currently intersecting the most
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by intersection ratio to find the most visible section
          visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          const currentSectionId = visibleEntries[0].target.id;
          setActiveSection(currentSectionId);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px", // Trigger when section is in the middle of viewport
        threshold: [0, 0.25, 0.5, 0.75, 1], // Check at multiple visibility thresholds
      }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  useEffect(() => {
    if (activeSection) {
      const sectionName = activeSection.charAt(0).toUpperCase() + activeSection.slice(1);
      if (activeSection === "home") {
        document.title = "Prahlad | Software Engineer";
      } else {
        document.title = `${sectionName} | Prahlad`;
      }
    } else {
      document.title = "Prahlad | Software Engineer";
    }
  }, [activeSection]);

  return activeSection;
}
