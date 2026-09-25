"use client";

import Link from "next/link";
import { Message } from "./types";
import { TicTacToeGame, RockPaperScissorsGame, MemoryMatchGame } from "../ai-games";

interface ChatMessageProps {
  msg: Message;
}

export function ChatMessage({ msg }: ChatMessageProps) {
  const isUser = msg.sender === "user";
  
  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
        isUser 
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
        {msg.game === "tictactoe" && <TicTacToeGame />}
        {msg.game === "rps" && <RockPaperScissorsGame />}
        {msg.game === "memory" && <MemoryMatchGame />}
      </div>
    </div>
  );
}
