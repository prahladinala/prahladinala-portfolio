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
    location: "Hyderabad, Telangana, India",
    shortDescription:
      "Leading end-to-end development of Guidewire Digital Portals using Jutro and React JS for enterprise insurance clients.",
    responsibilities: [
      "Led end-to-end design and development of Guidewire Digital Portals using Jutro and React JS.",
      "Owned feature delivery from design through production deployment in an Agile environment.",
      "Resolved critical performance bottlenecks, reducing portal load time by 35%.",
      "Refactored legacy components to build a fully responsive portal with 100% mobile compatibility.",
      "Implemented business-critical features including side-by-side quoting and custom data masking.",
      "Leveraged GenAI tools to accelerate development and improve code quality.",
      "Conducted code reviews and mentored developers to improve engineering standards.",
    ],
    technologies: [
      "React JS",
      "Guidewire Jutro",
      "JavaScript",
      "SCSS",
      "Guidewire EDGE APIs",
      "Storybook",
      "Git",
      "Bitbucket",
      "Figma",
      "Agile/Scrum",
      "ChatGPT",
      "GitHub Copilot",
    ],
  },
  {
    id: "valuemomentum",
    company: "ValueMomentum",
    role: "Software Engineer",
    duration: "June 2021 - July 2025",
    location: "Hyderabad, Telangana, India",
    shortDescription:
      "Developed scalable metadata-driven Guidewire portals for commercial insurance products using React and Jutro.",
    responsibilities: [
      "Developed metadata-driven Guidewire Jutro UI for Workers Compensation and Commercial Auto insurance products.",
      "Integrated Guidewire EDGE APIs for real-time policy data rendering.",
      "Designed reusable UI components, reducing development effort by 40% and production defects by 70%.",
      "Optimized portal performance through component rendering and API handling improvements.",
      "Resolved critical UI issues, ensuring stable sprint releases and improved reliability.",
      "Collaborated with business analysts and stakeholders to gather and implement requirements.",
      "Performed peer code reviews and enforced React and Guidewire best practices.",
    ],
    technologies: [
      "React JS",
      "JavaScript (ES6+)",
      "HTML5",
      "SCSS",
      "Guidewire Jutro",
      "Guidewire EDGE APIs",
      "PolicyCenter",
      "Producer Engage",
      "Customer Engage",
      "Git",
      "GitHub",
      "Bitbucket",
      "Storybook",
      "Agile/Scrum",
    ],
  },
];
