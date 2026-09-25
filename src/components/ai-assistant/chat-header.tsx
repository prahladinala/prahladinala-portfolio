"use client";

import { Bot, Trash2, X } from "lucide-react";
import { DragControls } from "framer-motion";

interface ChatHeaderProps {
  dragControls: DragControls;
  onClear: () => void;
  onClose: () => void;
}

export function ChatHeader({ dragControls, onClear, onClose }: ChatHeaderProps) {
  return (
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
          onClick={onClear} 
          title="Clear Chat"
          className="p-1 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/20 rounded-md transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button 
          onClick={onClose} 
          title="Close"
          className="p-1 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/20 rounded-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
