"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useTheme } from "next-themes";
import { useSectionTitle } from "@/hooks/use-section-title";
import { Experience, Project } from "@/lib/keystatic-data";
import { AI_QUICK_ACTIONS, STORAGE_KEYS } from "@/config/constants";
import knowledgeData from "@/content/ai-knowledge-base.json";

import { Message } from "./types";
import { generateResponse } from "./ai-logic";
import { ChatHeader } from "./chat-header";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";

interface AIAssistantProps {
  experiences: Experience[];
  projects: Project[];
}

export function AIAssistant({ experiences, projects }: AIAssistantProps) {
  const activeSection = useSectionTitle();
  const { setTheme } = useTheme();
  const dragControls = useDragControls();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [lastTopic, setLastTopic] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => setIsListening(false);
        recognitionRef.current.onend = () => setIsListening(false);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return alert("Speech recognition is not supported in this browser.");
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    if (!isLoaded) {
      setTimeout(() => setShowTooltip(true), 2000);
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.aiChat);
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
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded && messages.length === 1 && messages[0].sender === "ai") {
      const baseGreeting = knowledgeData.greetings[Math.floor(Math.random() * knowledgeData.greetings.length)];
      let contextualPrefix = "";
      
      if (activeSection === "projects") {
        contextualPrefix = "I see you're looking at my projects! Want to know which one I'm most proud of? ";
      } else if (activeSection === "experience") {
        contextualPrefix = "Reviewing my work history? I learned a lot at Guidewire. ";
      }

      setMessages([{ id: "msg-0", text: contextualPrefix + baseGreeting, sender: "ai" }]);
    }
  }, [activeSection, isLoaded]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEYS.aiChat, JSON.stringify(messages));
    }
  }, [messages, isTyping]);

  const clearChat = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    setIsTyping(false);
    const randomGreeting = knowledgeData.greetings[Math.floor(Math.random() * knowledgeData.greetings.length)];
    const initialMsg: Message = { id: Date.now().toString(), text: randomGreeting, sender: "ai" };
    setMessages([initialMsg]);
    localStorage.setItem(STORAGE_KEYS.aiChat, JSON.stringify([initialMsg]));
    setLastTopic(null);
  };

  const playPopSound = () => {
    try {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.log("Audio not supported");
    }
  };

  const handleSend = (e?: React.FormEvent, overrideInput?: string) => {
    if (e) e.preventDefault();
    const textToSend = overrideInput || input;
    if (!textToSend.trim()) return;

    if (textToSend.trim() === "/clear") {
      setInput("");
      clearChat();
      return;
    }

    const userMsg: Message = { id: Date.now().toString(), text: textToSend, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setShowTooltip(false);

    const matchProject = projects.find(p => textToSend.toLowerCase().includes(p.title.toLowerCase()));
    if (matchProject) setLastTopic(matchProject.id.toLowerCase());

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      const response = generateResponse(textToSend, lastTopic, experiences, projects);
      
      // Handle UI side-effects
      if (response.themeCommand) setTheme(response.themeCommand);
      if (response.printCommand) setTimeout(() => window.print(), 1500);
      if (response.scrollTarget) {
        const el = document.getElementById(response.scrollTarget);
        if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 300);
      }

      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        text: response.text, 
        actionLink: response.actionLink, 
        game: response.game, 
        sender: "ai" 
      }]);
      setIsTyping(false);
      typingTimeoutRef.current = null;
      playPopSound();
    }, 1000 + Math.random() * 1000);
  };

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
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-background animate-pulse" />
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
            <ChatHeader dragControls={dragControls} onClear={clearChat} onClose={() => setIsOpen(false)} />

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30 relative">
              {messages.map((msg, index) => (
                <div key={msg.id} className="w-full">
                  <ChatMessage msg={msg} />
                  
                  {index === 0 && msg.sender === "ai" && messages.length === 1 && !isTyping && (
                    <div className="flex flex-wrap gap-2 mt-3 pl-1">
                      {AI_QUICK_ACTIONS.map(action => (
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
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] p-3 px-4 rounded-2xl bg-card border border-border text-foreground rounded-bl-sm flex items-center gap-1 h-10">
                    <motion.div className="w-1.5 h-1.5 bg-foreground/50 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }} />
                    <motion.div className="w-1.5 h-1.5 bg-foreground/50 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }} />
                    <motion.div className="w-1.5 h-1.5 bg-foreground/50 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <ChatInput 
              input={input}
              setInput={setInput}
              isTyping={isTyping}
              isListening={isListening}
              onSend={handleSend}
              toggleListening={toggleListening}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
