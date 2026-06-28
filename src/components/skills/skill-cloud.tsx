"use client";

import { motion } from "framer-motion";

export function SkillCloud({ skills }: { skills: string[] }) {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="flex flex-wrap gap-3"
    >
      {skills.map((skill) => (
        <motion.div
          key={skill}
          variants={item}
          whileHover={{ scale: 1.05, y: -2 }}
          className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium shadow-sm hover:shadow-md hover:border-primary/50 hover:text-primary transition-all cursor-default"
        >
          {skill}
        </motion.div>
      ))}
    </motion.div>
  );
}
