"use client";

import { useState } from "react";
import { MEMORY_GAME_EMOJIS } from "@/config/constants";

type Difficulty = "easy" | "medium" | "hard" | null;

export function MemoryMatchGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>(null);
  const [cards, setCards] = useState<{ id: number; emoji: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const initializeGame = (level: "easy" | "medium" | "hard") => {
    let pairsCount = 8;
    if (level === "medium") pairsCount = 18;
    if (level === "hard") pairsCount = 50;

    const gameEmojis = MEMORY_GAME_EMOJIS.slice(0, pairsCount);
    const shuffled = [...gameEmojis, ...gameEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({ id: idx, emoji, isFlipped: false, isMatched: false }));
      
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setIsLocked(false);
    setDifficulty(level);
  };

  const handleCardClick = (idx: number) => {
    if (isLocked || cards[idx].isFlipped || cards[idx].isMatched) return;

    const newCards = [...cards];
    newCards[idx].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves((m) => m + 1);
      
      const [first, second] = newFlipped;
      if (newCards[first].emoji === newCards[second].emoji) {
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setCards(newCards);
        setFlippedIndices([]);
        setIsLocked(false);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
          setIsLocked(false);
        }, 800);
      }
    }
  };

  if (!difficulty) {
    return (
      <div className="mt-3 flex flex-col items-center bg-background/50 p-4 rounded-xl border border-border w-full max-w-[280px] mx-auto text-center">
        <span className="text-[11px] font-bold mb-4 uppercase tracking-widest text-primary">Tech Memory</span>
        <span className="text-xs mb-3 text-muted-foreground">Select Difficulty</span>
        <div className="flex flex-col gap-2 w-full">
          <button onClick={() => initializeGame("easy")} className="bg-card border border-border py-2 rounded-lg text-xs font-semibold hover:bg-muted transition-colors">Easy (4x4)</button>
          <button onClick={() => initializeGame("medium")} className="bg-card border border-border py-2 rounded-lg text-xs font-semibold hover:bg-muted transition-colors">Medium (6x6)</button>
          <button onClick={() => initializeGame("hard")} className="bg-card border border-border py-2 rounded-lg text-xs font-semibold hover:bg-muted transition-colors">Extreme (10x10)</button>
        </div>
      </div>
    );
  }

  const isWon = cards.length > 0 && cards.every((c) => c.isMatched);

  const gridClass = difficulty === "easy" ? "grid-cols-4 gap-2" : difficulty === "medium" ? "grid-cols-6 gap-1" : "grid-cols-10 gap-0.5";
  const cardClass = difficulty === "easy" ? "text-2xl rounded-lg" : difficulty === "medium" ? "text-xl rounded-md" : "text-xs rounded-sm";

  return (
    <div className="mt-3 flex flex-col items-center bg-background/50 p-3 rounded-xl border border-border w-full max-w-[280px] mx-auto">
      <div className="flex justify-between w-full mb-3 px-1 items-end">
        <button onClick={() => setDifficulty(null)} className="text-[10px] uppercase font-bold text-muted-foreground hover:text-primary transition-colors">← Back</button>
        <span className="text-[10px] text-muted-foreground font-mono">Moves: {moves}</span>
      </div>
      
      {isWon ? (
        <div className="flex flex-col items-center justify-center py-6 animate-in zoom-in duration-300">
          <span className="text-4xl mb-2">🎉</span>
          <span className="text-primary font-bold text-sm">You did it in {moves} moves!</span>
          <button 
            onClick={() => initializeGame(difficulty)} 
            className="mt-4 text-[11px] font-medium bg-primary/10 text-primary hover:bg-primary/20 px-4 py-1.5 rounded-full transition-colors"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className={`grid ${gridClass} w-full`}>
          {cards.map((card, idx) => (
            <div 
              key={card.id} 
              onClick={() => handleCardClick(idx)}
              className={`aspect-square flex items-center justify-center cursor-pointer transition-all duration-300 transform preserve-3d ${cardClass} ${card.isFlipped || card.isMatched ? "rotate-y-180 bg-card border border-border shadow-sm" : "bg-primary/20 hover:bg-primary/30"}`}
            >
              <div className={`transition-opacity duration-300 ${card.isFlipped || card.isMatched ? 'opacity-100' : 'opacity-0'}`}>
                {card.emoji}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
