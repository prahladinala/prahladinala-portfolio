import knowledgeData from "@/content/ai-knowledge-base.json";
import { Experience, Project } from "@/lib/keystatic-data";
import { GameType } from "./types";

export type AIResponse = {
  text: string;
  actionLink?: { label: string; url: string };
  game?: GameType;
  themeCommand?: "dark" | "light" | "focus";
  scrollTarget?: string;
  printCommand?: boolean;
};

// Utility: Levenshtein distance for fuzzy matching
export function levenshtein(a: string, b: string): number {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  return matrix[b.length][a.length];
}

export const generateResponse = (query: string, lastTopic: string | null, experiences: Experience[], projects: Project[]): AIResponse => {
  const lowerQuery = query.toLowerCase();
  const queryWords = lowerQuery.split(/[^a-z0-9]+/);

  // 1. Easter Egg Commands
  if (lowerQuery === "/tictactoe" || lowerQuery.includes("tic tac toe") || lowerQuery.includes("tictactoe")) {
    return { text: "Let's play Tic-Tac-Toe! You go first (X).", game: "tictactoe" };
  }
  if (lowerQuery === "/rps" || lowerQuery.includes("rock paper scissors")) {
    return { text: "Rock, Paper, Scissors! Make your choice:", game: "rps" };
  }
  if (lowerQuery === "/memory" || lowerQuery.includes("memory match") || lowerQuery.includes("memory game")) {
    return { text: "Tech Memory Match! Can you find all the pairs?", game: "memory" };
  }
  
  if (lowerQuery === "dark" || lowerQuery.includes("dark mode") || lowerQuery.includes("make it dark") || lowerQuery === "/dark") {
    return { text: "Turning off the lights! Dark mode activated.", themeCommand: "dark" };
  }
  if (lowerQuery === "light" || lowerQuery.includes("light mode") || lowerQuery.includes("make it light") || lowerQuery === "/light") {
    return { text: "Let there be light! Light mode activated.", themeCommand: "light" };
  }
  if (lowerQuery === "focus" || lowerQuery.includes("focus mode") || lowerQuery.includes("make it focus") || lowerQuery === "/focus") {
    return { text: "Minimizing distractions! Focus mode activated.", themeCommand: "focus" };
  }
  if ((lowerQuery.includes("print") && lowerQuery.includes("resume")) || lowerQuery === "/print") {
    return { text: "Preparing the print dialog for you...", printCommand: true };
  }
  
  // Auto-Scrolling Navigation
  if (lowerQuery === "/projects" || (lowerQuery.includes("go to") && lowerQuery.includes("projects"))) {
    return { text: "Scrolling down to my projects...", scrollTarget: "projects" };
  }
  if (lowerQuery === "/experience" || (lowerQuery.includes("go to") && lowerQuery.includes("experience"))) {
    return { text: "Scrolling to my experience...", scrollTarget: "experience" };
  }
  if (lowerQuery === "/contact" || (lowerQuery.includes("go to") && lowerQuery.includes("contact"))) {
    return { text: "Scrolling to my contact details...", scrollTarget: "contact" };
  }

  // 2. Follow-Up Context Memory
  if (lastTopic) {
    if (lowerQuery.includes("what is it built with") || lowerQuery.includes("tech stack") || lowerQuery.includes("technologies")) {
      const proj = projects.find(p => p.id.toLowerCase() === lastTopic);
      if (proj) return { text: `${proj.title} is built using: ${proj.tags.join(', ')}.` };
    }
    if (lowerQuery.includes("link") || lowerQuery.includes("visit") || lowerQuery.includes("url")) {
      const proj = projects.find(p => p.id.toLowerCase() === lastTopic);
      if (proj && proj.link) return { text: `You can visit it here:`, actionLink: { label: "Visit Project", url: proj.link } };
    }
  }

  // 3. Dynamic Keystatic Projects Match (Fuzzy & Exact)
  for (const proj of projects) {
    const projName = proj.title.toLowerCase();
    
    let isMatch = false;
    if (lowerQuery.includes(projName)) {
      isMatch = true;
    } else {
      for (const qw of queryWords) {
        if (qw.length > 4 && levenshtein(qw, projName) <= 2) {
          isMatch = true;
          break;
        }
      }
    }

    if (isMatch) {
      return {
        text: `${proj.title} is a project where I ${proj.shortDescription}. It uses ${proj.tags.slice(0, 3).join(', ')}.`,
        actionLink: { label: "View Project details", url: `/#projects` }
      };
    }
  }

  // 4. Dynamic Keystatic Experience Match
  for (const exp of experiences) {
    const company = exp.company.toLowerCase();
    
    let isMatch = false;
    if (lowerQuery.includes(company)) {
      isMatch = true;
    } else {
      for (const qw of queryWords) {
        if (qw.length > 4 && levenshtein(qw, company) <= 2) {
          isMatch = true;
          break;
        }
      }
    }

    if (isMatch) {
      return { text: `I worked at ${exp.company} as a ${exp.role} (${exp.duration}). ${exp.shortDescription}` };
    }
  }
  
  // 5. Existing Knowledge Base Matching
  for (const item of knowledgeData.knowledgeBase) {
    const isMatch = item.keywords.some(keyword => {
      if (lowerQuery.includes(keyword)) return true;
      const keywordWords = keyword.split(/[^a-z0-9]+/);
      for (const kw of keywordWords) {
        if (kw.length < 4) continue;
        if (queryWords.some(qw => qw.length >= 4 && levenshtein(qw, kw) <= 1)) return true;
      }
      return false;
    });

    if (isMatch) {
      const randomResponseIndex = Math.floor(Math.random() * item.responses.length);
      return { 
        text: item.responses[randomResponseIndex], 
        actionLink: item.actionLink 
      };
    }
  }
  
  const randomDefaultIndex = Math.floor(Math.random() * knowledgeData.defaultResponses.length);
  return { text: knowledgeData.defaultResponses[randomDefaultIndex] };
};
