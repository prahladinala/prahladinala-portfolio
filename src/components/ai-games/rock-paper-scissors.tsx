"use client";

import { useState } from "react";

export function RockPaperScissorsGame() {
  const choices = ["🪨", "📄", "✂️"];
  const [result, setResult] = useState<{ user: string, ai: string, outcome: string } | null>(null);
  const [score, setScore] = useState({ user: 0, ai: 0 });
  const [isPlaying, setIsPlaying] = useState(false);

  const play = (userChoice: string) => {
    setIsPlaying(true);
    setResult(null);
    
    setTimeout(() => {
      const aiChoice = choices[Math.floor(Math.random() * choices.length)];
      let outcome = "Draw";
      
      if (
        (userChoice === "🪨" && aiChoice === "✂️") ||
        (userChoice === "📄" && aiChoice === "🪨") ||
        (userChoice === "✂️" && aiChoice === "📄")
      ) {
        outcome = "You Win!";
        setScore(s => ({ ...s, user: s.user + 1 }));
      } else if (userChoice !== aiChoice) {
        outcome = "AI Wins!";
        setScore(s => ({ ...s, ai: s.ai + 1 }));
      }
      
      setResult({ user: userChoice, ai: aiChoice, outcome });
      setIsPlaying(false);
    }, 400);
  };

  return (
    <div className="mt-3 flex flex-col items-center p-4 border border-border rounded-xl bg-background/50 relative overflow-hidden">
      <div className="flex gap-3 mb-4">
        {choices.map(c => (
          <button 
            key={c} 
            onClick={() => play(c)} 
            disabled={isPlaying}
            className="w-12 h-12 text-2xl bg-card border shadow-sm border-border rounded-full hover:bg-muted hover:scale-105 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
          >
            {c}
          </button>
        ))}
      </div>
      
      <div className="h-16 w-full flex flex-col items-center justify-center">
        {isPlaying ? (
          <div className="text-xs text-muted-foreground animate-pulse">AI is choosing...</div>
        ) : result ? (
          <div className="text-center w-full animate-in slide-in-from-bottom-2 fade-in duration-300">
            <div className="flex justify-center gap-4 items-center text-2xl mb-1">
              <span className="bg-card p-1 rounded-lg border border-border/50">{result.user}</span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">vs</span>
              <span className="bg-card p-1 rounded-lg border border-border/50">{result.ai}</span>
            </div>
            <div className={`text-[11px] font-bold uppercase tracking-wider ${result.outcome.includes("You") ? "text-primary" : result.outcome.includes("AI") ? "text-red-500 dark:text-red-400" : "text-muted-foreground"}`}>
              {result.outcome}
            </div>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">Make your move!</div>
        )}
      </div>
      
      <div className="absolute top-2 left-3 right-3 flex justify-between items-center opacity-40">
        <span className="text-[9px] font-bold uppercase">You: {score.user}</span>
        <span className="text-[9px] font-bold uppercase">AI: {score.ai}</span>
      </div>
    </div>
  );
}