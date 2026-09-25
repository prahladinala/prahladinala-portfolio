"use client";

import { useState } from "react";

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

    // AI Move
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
        setBoard([...newBoard]);
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