"use client";

import { useState, useRef, useEffect } from "react";
import { Terminal, X, Maximize2, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type HistoryItem = {
  id: string;
  type: "input" | "output";
  content: React.ReactNode;
};

export function TerminalWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: "init-1", type: "output", content: 'Welcome to PrahladOS v2.0.26' },
    { id: "init-2", type: "output", content: 'Type "help" to see available commands.' }
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    setHistory(prev => [...prev, { id: Date.now().toString(), type: "input", content: cmd }]);
    
    let output: React.ReactNode = "";
    
    switch (trimmedCmd) {
      case "help":
        output = (
          <div className="text-green-400">
            <div>Available commands:</div>
            <div className="grid grid-cols-[100px_1fr] gap-2 mt-2">
              <span className="text-primary">help</span><span>Show this message</span>
              <span className="text-primary">about</span><span>Brief intro about me</span>
              <span className="text-primary">skills</span><span>List my top technical skills</span>
              <span className="text-primary">resume</span><span>Open my resume in a new tab</span>
              <span className="text-primary">contact</span><span>Scroll to contact section</span>
              <span className="text-primary">clear</span><span>Clear the terminal</span>
            </div>
          </div>
        );
        break;
      case "about":
        output = "I'm Prahlad, a Software Engineer specializing in Guidewire, React, Next.js, and TypeScript. Building robust enterprise applications and minimalist digital experiences.";
        break;
      case "skills":
        output = "Frontend: React, Next.js, TypeScript, Tailwind | Backend: Node.js, Express | Niche: Guidewire Jutro";
        break;
      case "resume":
        output = "Navigating to resume download page...";
        router.push("/resume");
        break;
      case "contact":
        output = "Scrolling to contact section...";
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => setIsOpen(false), 1000);
        } else {
          router.push("/#contact");
        }
        break;
      case "clear":
        setHistory([]);
        return;
      case "":
        return;
      default:
        output = <span className="text-red-400">Command not found: {cmd}. Type "help" for a list of commands.</span>;
    }

    setHistory(prev => [...prev, { id: Date.now().toString() + "-out", type: "output", content: output }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center shadow-lg hover:border-primary/50 hover:text-primary transition-all group"
        title="Open Terminal"
      >
        <Terminal className="w-5 h-5 transition-transform group-hover:scale-110" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-24 left-6 z-50 w-[350px] sm:w-[450px] bg-[#0a0a0a] border border-[#333] rounded-xl shadow-2xl overflow-hidden font-mono text-sm"
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-[#333]">
              <div className="flex gap-2">
                <button onClick={() => setIsOpen(false)} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600" />
                <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600" />
                <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600" />
              </div>
              <div className="text-[#888] text-xs font-semibold">guest@prahlad-os:~</div>
              <div className="w-10"></div> {/* Spacer for alignment */}
            </div>

            {/* Terminal Body */}
            <div 
              ref={scrollRef}
              className="p-4 h-[300px] overflow-y-auto text-gray-300 scroll-smooth hide-scrollbar"
              onClick={() => inputRef.current?.focus()}
            >
              <div className="space-y-3">
                {history.map((item) => (
                  <div key={item.id}>
                    {item.type === "input" && (
                      <div className="flex gap-2">
                        <span className="text-green-500">➜</span>
                        <span className="text-blue-400">~</span>
                        <span>{item.content}</span>
                      </div>
                    )}
                    {item.type === "output" && (
                      <div className="text-gray-400 ml-4 break-words">
                        {item.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Input Line */}
              <div className="flex gap-2 mt-3">
                <span className="text-green-500">➜</span>
                <span className="text-blue-400">~</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-gray-300"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
