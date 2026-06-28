export type Experience = {
  id: string;
  company: string;
  role: string;
  duration: string;
  location: string;
  shortDescription: string;
  responsibilities: string[];
  technologies: string[];
  logo?: string;
};

export const experiences: Experience[] = [
  {
    id: "pwc",
    company: "PwC India",
    role: "Senior Associate",
    duration: "Aug 2025 - Present",
    location: "Hyderabad, India",
    shortDescription:
      "Building robust insurance portals and improving UI performance at scale.",
    responsibilities: [
      "Developed and maintained multiple insurance portals using Guidewire Jutro.",
      "Improved UI rendering performance by 40% through code optimization.",
      "Created a centralized reusable component library adopted by 2 cross-functional teams.",
      "Integrated RESTful APIs and optimized state management using React Context and Redux.",
    ],
    technologies: ["React", "Guidewire Jutro", "TypeScript", "SCSS", "Redux"],
  },
  {
    id: "valuemomentum",
    company: "Valuemomentum",
    role: "Software Engineer",
    duration: "June 2021 - July 2025",
    location: "Hyderabad, India",
    shortDescription:
      "Led frontend development for a suite of enterprise web applications.",
    responsibilities: [
      "Migrated legacy jQuery applications to modern React architectures.",
      "Implemented responsive designs ensuring WCAG AA compliance.",
      "Mentored junior developers and conducted code reviews.",
    ],
    technologies: ["React", "JavaScript", "Tailwind CSS", "Jest", "Webpack"],
  },
];
