"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X, Send, Bot, Trash2, Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useTheme } from "next-themes";
import knowledgeData from "@/content/ai-knowledge-base.json";
import Link from "next/link";
import { useSectionTitle } from "@/hooks/use-section-title";
import { Experience, Project } from "@/lib/keystatic-data";

type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
  actionLink?: { label: string; url: string };
};

type AIResponse = {
  text: string;
  actionLink?: { label: string; url: string };
};

const QUICK_ACTIONS = ["View Resume", "Tech Stack", "Recent Projects"];

const SLASH_COMMANDS = [
  { command: "/dark", label: "Dark Mode", desc: "Turn off the lights" },
  { command: "/light", label: "Light Mode", desc: "Turn on the lights" },
  { command: "/focus", label: "Focus Mode", desc: "Minimize distractions" },
  { command: "/projects", label: "Projects", desc: "Scroll to projects" },
  { command: "/experience", label: "Experience", desc: "Scroll to experience" },
  { command: "/contact", label: "Contact", desc: "Scroll to contact info" },
  { command: "/clear", label: "Clear Chat", desc: "Wipe history" },
  { command: "/print", label: "Print Resume", desc: "Open print dialog" }
];

// Utility: Levenshtein distance for fuzzy matching
function levenshtein(a: string, b: string): number {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  for (let i = 0; i <= a.length; i += 1) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
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

// Utility: Play subtle UI pop sound
function playPopSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch(e) {}
}

export function AIAssistant({ 
  experiences = [], 
  projects = [] 
}: { 
  experiences?: Experience[], 
  projects?: Project[] 
}) {
  const pathname = usePathname();
  const activeSection = useSectionTitle();
  const { setTheme } = useTheme();
  
  const dragControls = useDragControls();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Follow-up Memory State
  const [lastTopic, setLastTopic] = useState<{ type: 'project'|'experience'|'general', id: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Engagement Tooltip Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen && messages.length <= 1) {
        setShowTooltip(true);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [isOpen, messages]);

  // Hide tooltip when opened
  useEffect(() => {
    if (isOpen) setShowTooltip(false);
  }, [isOpen]);

  // Voice Recognition setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return alert("Speech recognition is not supported in this browser.");
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Auto-focus input when the chat window is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Load from local storage or set initial greeting
  useEffect(() => {
    try {
      const saved = localStorage.getItem("prahlad-ai-chat");
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        const randomGreeting = knowledgeData.greetings[Math.floor(Math.random() * knowledgeData.greetings.length)];
        setMessages([{ id: "msg-0", text: randomGreeting, sender: "ai" }]);
      }
    } catch (e) {
      const randomGreeting = knowledgeData.greetings[Math.floor(Math.random() * knowledgeData.greetings.length)];
      setMessages([{ id: "msg-0", text: randomGreeting, sender: "ai" }]);
    }
    setIsLoaded(true);
  }, []);

  // Contextual Greetings: update first message if no chat history
  useEffect(() => {
    if (isLoaded && messages.length === 1 && messages[0].sender === "ai") {
      const baseGreeting = knowledgeData.greetings[Math.floor(Math.random() * knowledgeData.greetings.length)];
      let contextualPrefix = "";
      
      if (activeSection === "projects") {
        contextualPrefix = "I see you're looking at my projects! Want to know which one I'm most proud of? ";
      } else if (activeSection === "experience") {
        contextualPrefix = "Checking out my work history? Feel free to ask me for more details! ";
      } else if (activeSection === "skills") {
        contextualPrefix = "Curious about my tech stack? Ask me what I use on a daily basis! ";
      } else if (activeSection === "contact") {
        contextualPrefix = "Ready to get in touch? I can help you find the best way to reach out. ";
      }

      setMessages([{ ...messages[0], text: contextualPrefix + baseGreeting }]);
    }
  }, [activeSection, isLoaded]);

  // Save to local storage whenever messages change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("prahlad-ai-chat", JSON.stringify(messages));
    }
  }, [messages, isLoaded]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const generateResponse = (query: string): AIResponse => {
    const lowerQuery = query.toLowerCase();
    const queryWords = lowerQuery.split(/[^a-z0-9]+/);

    // 1. Easter Egg Commands
    if (lowerQuery === "dark" || lowerQuery.includes("dark mode") || lowerQuery.includes("make it dark") || lowerQuery === "/dark") {
      setTheme("dark");
      return { text: "Turning off the lights! Dark mode activated." };
    }
    if (lowerQuery === "light" || lowerQuery.includes("light mode") || lowerQuery.includes("make it light") || lowerQuery === "/light") {
      setTheme("light");
      return { text: "Let there be light! Light mode activated." };
    }
    if (lowerQuery === "focus" || lowerQuery.includes("focus mode") || lowerQuery.includes("make it focus") || lowerQuery === "/focus") {
      setTheme("focus");
      return { text: "Minimizing distractions! Focus mode activated." };
    }
    if ((lowerQuery.includes("print") && lowerQuery.includes("resume")) || lowerQuery === "/print") {
      setTimeout(() => window.print(), 1500);
      return { text: "Preparing the print dialog for you..." };
    }
    
    // Auto-Scrolling Navigation
    if (lowerQuery === "/projects" || (lowerQuery.includes("go to") && lowerQuery.includes("projects"))) {
      const el = document.getElementById("projects");
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 300);
        return { text: "Scrolling down to my projects..." };
      }
      return { text: "You can find my projects at the /#projects URL.", actionLink: { label: "Go to Projects", url: "/#projects" } };
    }
    if (lowerQuery === "/experience" || (lowerQuery.includes("go to") && lowerQuery.includes("experience"))) {
      const el = document.getElementById("experience");
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 300);
        return { text: "Scrolling to my experience..." };
      }
      return { text: "You can find my experience at the /#experience URL.", actionLink: { label: "Go to Experience", url: "/#experience" } };
    }
    if (lowerQuery === "/contact" || (lowerQuery.includes("go to") && lowerQuery.includes("contact"))) {
      const el = document.getElementById("contact");
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 300);
        return { text: "Scrolling to my contact details..." };
      }
      return { text: "You can find my contact info at the /#contact URL.", actionLink: { label: "Go to Contact", url: "/#contact" } };
    }

    // 2. Follow-Up Context Memory
    if (lastTopic) {
      if (lowerQuery.includes("what") && (lowerQuery.includes("built with") || lowerQuery.includes("tech stack") || lowerQuery.includes("technologies"))) {
        if (lastTopic.type === "project") {
          const proj = projects.find(p => p.id === lastTopic.id);
          if (proj && proj.tags) {
             return { text: `It was built using: ${proj.tags.join(', ')}.` };
          }
        }
      }
    }

    // 3. Dynamic Content Indexing (Projects)
    for (const proj of projects) {
      if (lowerQuery.includes(proj.title?.toLowerCase() || "") || lowerQuery.includes(proj.id?.toLowerCase() || "")) {
        setLastTopic({ type: "project", id: proj.id });
        return {
          text: `Ah, ${proj.title}! It's an awesome project where I ${proj.description?.toLowerCase() || ""} You can check it out in the Projects section.`,
          actionLink: proj.liveUrl ? { label: `View ${proj.title}`, url: proj.liveUrl } : undefined
        };
      }
    }

    // 4. Dynamic Content Indexing (Experiences)
    for (const exp of experiences) {
      if (lowerQuery.includes(exp.company?.toLowerCase() || "")) {
        setLastTopic({ type: "experience", id: exp.company });
        return {
          text: `At ${exp.company}, I worked as a ${exp.role} from ${exp.duration}. ${exp.shortDescription}`
        };
      }
    }
    
    // 5. Existing Knowledge Base Matching
    for (const item of knowledgeData.knowledgeBase) {
      const isMatch = item.keywords.some(keyword => {
        if (lowerQuery.includes(keyword)) return true;
        const keywordWords = keyword.split(/[^a-z0-9]+/);
        for (const kw of keywordWords) {
          if (kw.length < 4) continue;
          for (const qw of queryWords) {
            if (qw.length < 4) continue;
            const dist = levenshtein(qw, kw);
            if (dist <= 1 && kw.length >= 4) return true;
            if (dist <= 2 && kw.length >= 6) return true;
          }
        }
        return false;
      });

      if (isMatch) {
        setLastTopic({ type: "general", id: item.keywords[0] });
        const randomIndex = Math.floor(Math.random() * item.responses.length);
        const actionLink = item.actionLink?.url ? item.actionLink : undefined;
        return { text: item.responses[randomIndex], actionLink };
      }
    }
    
    const randomDefaultIndex = Math.floor(Math.random() * knowledgeData.defaultResponses.length);
    return { text: knowledgeData.defaultResponses[randomDefaultIndex] };
  };

  const handleSend = (e?: React.FormEvent, overrideInput?: string) => {
    if (e) e.preventDefault();
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isTyping) return;
    
    if (textToSend.toLowerCase() === "/clear") {
      clearChat();
      setInput("");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMsg: Message = { id: Date.now().toString(), text: textToSend, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking delay
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      const { text, actionLink } = generateResponse(textToSend);
      setMessages(prev => [...prev, { id: Date.now().toString(), text, actionLink, sender: "ai" }]);
      setIsTyping(false);
      typingTimeoutRef.current = null;
      
      // Play pop sound
      if (isOpen) playPopSound();
      
      // Auto-focus input
      setTimeout(() => inputRef.current?.focus(), 10);
    }, 1000);
  };

  const clearChat = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    setIsTyping(false);
    
    const randomGreeting = knowledgeData.greetings[Math.floor(Math.random() * knowledgeData.greetings.length)];
    const initialMsg: Message = { id: Date.now().toString(), text: randomGreeting, sender: "ai" };
    setMessages([initialMsg]);
    localStorage.setItem("prahlad-ai-chat", JSON.stringify([initialMsg]));
    setLastTopic(null);
  };

  if (pathname.startsWith("/notes")) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded-2xl rounded-br-sm shadow-lg whitespace-nowrap cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              👋 Hi! I'm Prahlad's AI. Ask me anything!
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform relative"
          title="Ask me about Prahlad"
        >
          <MessageSquare className="w-6 h-6" />
          {showTooltip && !isOpen && (
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-background rounded-full animate-pulse" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            drag
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[380px] h-[500px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div 
              className="bg-primary text-primary-foreground p-4 flex items-center justify-between shrink-0 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <h3 className="font-semibold">Prahlad&apos;s AI Assistant</h3>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={clearChat} 
                  title="Clear Chat"
                  className="p-1 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/20 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  title="Close"
                  className="p-1 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/20 rounded-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30 relative">
              {messages.map((msg, index) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.sender === "user" 
                      ? "bg-primary text-primary-foreground rounded-br-sm" 
                      : "bg-card border border-border text-foreground rounded-bl-sm"
                  }`}>
                    {msg.text}
                    {msg.actionLink && (
                      <div className="mt-3">
                        <Link 
                          href={msg.actionLink.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 rounded-lg text-xs font-semibold transition-colors"
                        >
                          {msg.actionLink.label}
                        </Link>
                      </div>
                    )}
                  </div>
                  
                  {/* Quick Action Pills */}
                  {index === 0 && msg.sender === "ai" && messages.length === 1 && !isTyping && (
                    <div className="flex flex-wrap gap-2 mt-3 pl-1">
                      {QUICK_ACTIONS.map(action => (
                        <button
                          key={action}
                          onClick={() => handleSend(undefined, action)}
                          className="text-xs font-medium px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary transition-colors"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Typing Animation */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] p-3 px-4 rounded-2xl bg-card border border-border text-foreground rounded-bl-sm flex items-center gap-1 h-10">
                    <motion.div 
                      className="w-1.5 h-1.5 bg-foreground/50 rounded-full"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div 
                      className="w-1.5 h-1.5 bg-foreground/50 rounded-full"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                    />
                    <motion.div 
                      className="w-1.5 h-1.5 bg-foreground/50 rounded-full"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={(e) => handleSend(e)} className="p-3 border-t border-border bg-card flex gap-2 shrink-0 items-center">
              <div className="relative flex-1">
                <AnimatePresence>
                  {input.startsWith("/") && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full mb-2 left-0 w-full bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50 flex flex-col"
                    >
                      {SLASH_COMMANDS.filter(c => c.command.startsWith(input.toLowerCase())).map((cmd) => (
                        <button
                          key={cmd.command}
                          type="button"
                          onClick={() => {
                            setInput(cmd.command);
                            handleSend(undefined, cmd.command);
                          }}
                          className="px-4 py-2 text-left hover:bg-muted text-sm transition-colors border-b border-border last:border-0 flex justify-between items-center"
                        >
                          <span className="font-mono text-primary font-bold">{cmd.command}</span>
                          <span className="text-muted-foreground text-xs">{cmd.desc}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? "Listening..." : "Ask something..."}
                  disabled={isTyping}
                  className={`w-full bg-muted px-4 py-2 pr-10 rounded-full text-sm outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 transition-colors ${isListening ? 'ring-2 ring-red-500 bg-red-500/10' : ''}`}
                />
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${isListening ? 'text-red-500 hover:bg-red-500/20' : 'text-muted-foreground hover:bg-foreground/10'}`}
                  title="Voice Input"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center disabled:opacity-50 transition-opacity shrink-0"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
