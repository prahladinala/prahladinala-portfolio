"use client";

import { useState, useEffect } from "react";

export function TicTacToeGame() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const checkWinner = (squares: any[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.includes(null) ? null : "Draw";
  };

  const minimax = (boardState: any[], depth: number, isMaximizing: boolean): number => {
    const win = checkWinner(boardState);
    if (win === "O") return 10 - depth;
    if (win === "X") return depth - 10;
    if (win === "Draw") return 0;
    
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!boardState[i]) {
          boardState[i] = "O";
          const score = minimax(boardState, depth + 1, false);
          boardState[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!boardState[i]) {
          boardState[i] = "X";
          const score = minimax(boardState, depth + 1, true);
          boardState[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const handleClick = (i: number) => {
    if (board[i] || winner || !isXNext) return;
    const newBoard = [...board];
    newBoard[i] = "X";
    setBoard(newBoard);
    setIsXNext(false);
    
    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
      return;
    }

    // AI Move (Minimax - Unbeatable)
    setTimeout(() => {
      let bestScore = -Infinity;
      let move = -1;
      
      for (let j = 0; j < 9; j++) {
        if (!newBoard[j]) {
          newBoard[j] = "O";
          const score = minimax(newBoard, 0, false);
          newBoard[j] = null;
          if (score > bestScore) {
            bestScore = score;
            move = j;
          }
        }
      }
      
      if (move !== -1) {
        newBoard[move] = "O";
        setBoard([...newBoard]); // trigger re-render properly
        setIsXNext(true);
        const win2 = checkWinner(newBoard);
        if (win2) setWinner(win2);
      }
    }, 400);
  };

  return (
    <div className="mt-3 flex flex-col items-center bg-background/50 p-3 rounded-xl border border-border">
      <div className="mb-3 text-xs font-semibold text-foreground/80">
        {winner ? (winner === "Draw" ? "It's a Draw!" : winner === "X" ? "🎉 You Win!" : "AI Wins!") : (isXNext ? "Your turn (X)" : "AI is thinking...")}
      </div>
      <div className="grid grid-cols-3 gap-1 bg-border/50 p-1 rounded-lg">
        {board.map((cell, i) => (
          <button 
            key={i} 
            className="w-12 h-12 bg-card rounded flex items-center justify-center text-xl font-bold shadow-sm hover:bg-muted transition-colors disabled:opacity-100 disabled:cursor-default"
            onClick={() => handleClick(i)}
            disabled={!!winner || !isXNext || cell}
          >
            {cell === "X" ? <span className="text-primary">X</span> : cell === "O" ? <span className="text-red-500 dark:text-red-400">O</span> : ""}
          </button>
        ))}
      </div>
      {winner && (
        <button 
          onClick={() => { setBoard(Array(9).fill(null)); setWinner(null); setIsXNext(true); }} 
          className="mt-3 text-[11px] font-medium bg-primary/10 text-primary hover:bg-primary/20 px-4 py-1.5 rounded-full transition-colors"
        >
          Play Again
        </button>
      )}
    </div>
  );
}

export function RockPaperScissorsGame() {
  const choices = ["🪨", "📄", "✂️"];
  const [result, setResult] = useState<{ user: string, ai: string, outcome: string } | null>(null);
  const [score, setScore] = useState({ user: 0, ai: 0 });
  const [isPlaying, setIsPlaying] = useState(false);

  const play = (userChoice: string) => {
    setIsPlaying(true);
    setResult(null); // Reset for animation
    
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

// Memory Match Game
const EMOJIS = ["⚛️", "🟩", "🦀", "🐍", "🔥", "🐳", "☁️", "🚀"];

export function MemoryMatchGame() {
  const [cards, setCards] = useState<{ id: number; emoji: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({ id: idx, emoji, isFlipped: false, isMatched: false }));
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setIsLocked(false);
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

  const isWon = cards.length > 0 && cards.every((c) => c.isMatched);

  return (
    <div className="mt-3 flex flex-col items-center bg-background/50 p-3 rounded-xl border border-border w-full max-w-[280px] mx-auto">
      <div className="flex justify-between w-full mb-3 px-1 items-end">
        <span className="text-xs font-semibold text-foreground/80">Tech Memory</span>
        <span className="text-[10px] text-muted-foreground font-mono">Moves: {moves}</span>
      </div>
      
      {isWon ? (
        <div className="flex flex-col items-center justify-center py-6 animate-in zoom-in duration-300">
          <span className="text-4xl mb-2">🎉</span>
          <span className="text-primary font-bold text-sm">You did it in {moves} moves!</span>
          <button 
            onClick={initializeGame} 
            className="mt-4 text-[11px] font-medium bg-primary/10 text-primary hover:bg-primary/20 px-4 py-1.5 rounded-full transition-colors"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 w-full">
          {cards.map((card, idx) => (
            <div 
              key={card.id} 
              onClick={() => handleCardClick(idx)}
              className={`aspect-square rounded-lg flex items-center justify-center text-2xl cursor-pointer transition-all duration-300 transform preserve-3d ${card.isFlipped || card.isMatched ? "rotate-y-180 bg-card border border-border shadow-sm" : "bg-primary/20 hover:bg-primary/30"}`}
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
