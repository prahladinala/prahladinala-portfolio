"use client";

import { useRef, useEffect } from "react";
import { Mic, MicOff, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import knowledgeData from "@/content/ai-knowledge-base.json";

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  isTyping: boolean;
  isListening: boolean;
  onSend: (e?: React.FormEvent, overrideInput?: string) => void;
  toggleListening: () => void;
}

export function ChatInput({ input, setInput, isTyping, isListening, onSend, toggleListening }: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input when mounted
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  }, []);

  return (
    <form onSubmit={(e) => onSend(e)} className="p-3 border-t border-border bg-card flex gap-2 shrink-0 items-center">
      <div className="relative flex-1">
        <AnimatePresence>
          {input.startsWith("/") && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full mb-2 left-0 w-full bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50 flex flex-col"
            >
              {knowledgeData.slashCommands.filter(c => c.command.startsWith(input.toLowerCase())).map((cmd) => (
                <button
                  key={cmd.command}
                  type="button"
                  onClick={() => {
                    setInput(cmd.command);
                    onSend(undefined, cmd.command);
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
  );
}
