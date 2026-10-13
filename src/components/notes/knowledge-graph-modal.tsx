"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Network, Search, ZoomIn, ZoomOut, RotateCcw, Sparkles } from "lucide-react";
import { NoteMeta } from "@/lib/mdx";

type GraphNode = {
  id: string;
  name: string;
  type: "topic" | "note" | "tag";
  topic?: string;
  slug?: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
};

type GraphLink = {
  source: string;
  target: string;
};

export function KnowledgeGraphModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [notes, setNotes] = useState<NoteMeta[]>([]);
  const [filterQuery, setFilterQuery] = useState("");
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const isDraggingRef = useRef(false);
  const dragNodeRef = useRef<GraphNode | null>(null);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const linksRef = useRef<GraphLink[]>([]);

  useEffect(() => {
    if (!open) return;
    fetch("/api/search")
      .then((res) => res.json())
      .then((data: NoteMeta[]) => {
        setNotes(data);
      })
      .catch((e) => console.error("Failed to load notes for knowledge graph", e));
  }, [open]);

  // Construct Graph Nodes & Links
  useEffect(() => {
    if (notes.length === 0) return;

    const canvasWidth = 800;
    const canvasHeight = 550;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    const topicMap = new Map<string, string>(); // slug -> name
    notes.forEach((n) => {
      topicMap.set(n.topic, n.topicName || n.topic);
    });

    const newNodes: GraphNode[] = [];
    const newLinks: GraphLink[] = [];

    const TOPIC_COLORS = [
      "#6366f1", // indigo
      "#ec4899", // pink
      "#10b981", // emerald
      "#f59e0b", // amber
      "#06b6d4", // cyan
      "#8b5cf6", // purple
    ];

    // 1. Topic Nodes
    let tIdx = 0;
    const topicCoords = new Map<string, { x: number; y: number }>();
    const topicArray = Array.from(topicMap.entries());

    topicArray.forEach(([slug, name]) => {
      const angle = (tIdx / topicArray.length) * Math.PI * 2;
      const dist = Math.min(canvasWidth, canvasHeight) * 0.32;
      const x = centerX + Math.cos(angle) * dist;
      const y = centerY + Math.sin(angle) * dist;
      topicCoords.set(slug, { x, y });

      newNodes.push({
        id: `topic-${slug}`,
        name,
        type: "topic",
        topic: slug,
        x,
        y,
        vx: 0,
        vy: 0,
        radius: 18,
        color: TOPIC_COLORS[tIdx % TOPIC_COLORS.length],
      });
      tIdx++;
    });

    // 2. Note Nodes
    notes.forEach((n, idx) => {
      const topicCenter = topicCoords.get(n.topic) || { x: centerX, y: centerY };
      const noteAngle = (idx * 1.6) + Math.random();
      const noteDist = 45 + (idx % 3) * 25;
      const x = topicCenter.x + Math.cos(noteAngle) * noteDist;
      const y = topicCenter.y + Math.sin(noteAngle) * noteDist;

      newNodes.push({
        id: `note-${n.topic}-${n.slug}`,
        name: n.title,
        type: "note",
        topic: n.topic,
        slug: n.slug,
        x,
        y,
        vx: 0,
        vy: 0,
        radius: 8,
        color: "#38bdf8",
      });

      newLinks.push({
        source: `topic-${n.topic}`,
        target: `note-${n.topic}-${n.slug}`,
      });
    });

    nodesRef.current = newNodes;
    linksRef.current = newLinks;
  }, [notes]);

  // Force simulation loop & Canvas render
  useEffect(() => {
    if (!open) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const nodes = nodesRef.current;
      const links = linksRef.current;

      // Simple force layout iteration
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = (nodes[i].radius + nodes[j].radius) * 2;
          if (dist < minDist) {
            const force = (minDist - dist) / dist * 0.05;
            nodes[i].x -= dx * force;
            nodes[i].y -= dy * force;
            nodes[j].x += dx * force;
            nodes[j].y += dy * force;
          }
        }
      }

      // Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(scale, scale);

      // Draw Links
      links.forEach((l) => {
        const sourceNode = nodes.find((n) => n.id === l.source);
        const targetNode = nodes.find((n) => n.id === l.target);
        if (sourceNode && targetNode) {
          const isHighlighted =
            hoveredNode &&
            (hoveredNode.id === sourceNode.id || hoveredNode.id === targetNode.id);

          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.strokeStyle = isHighlighted
            ? "rgba(99, 102, 241, 0.7)"
            : "rgba(150, 150, 150, 0.15)";
          ctx.lineWidth = isHighlighted ? 2 : 1;
          ctx.stroke();
        }
      });

      // Draw Nodes
      nodes.forEach((n) => {
        const isHovered = hoveredNode?.id === n.id;
        const matchesSearch =
          !filterQuery ||
          n.name.toLowerCase().includes(filterQuery.toLowerCase());

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * (isHovered ? 1.25 : 1), 0, Math.PI * 2);
        ctx.fillStyle = matchesSearch ? n.color : "rgba(100, 100, 100, 0.3)";
        ctx.fill();

        if (isHovered) {
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // Draw Labels
        if (n.type === "topic" || isHovered || matchesSearch) {
          ctx.font = n.type === "topic" ? "bold 11px sans-serif" : "10px sans-serif";
          ctx.fillStyle = matchesSearch
            ? n.type === "topic"
              ? "#f8fafc"
              : "#94a3b8"
            : "#64748b";
          ctx.textAlign = "center";
          ctx.fillText(n.name, n.x, n.y + n.radius + 13);
        }
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [open, scale, pan, hoveredNode, filterQuery]);

  // Mouse Interactivity
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - pan.x) / scale;
    const mouseY = (e.clientY - rect.top - pan.y) / scale;

    const clickedNode = nodesRef.current.find((n) => {
      const dx = n.x - mouseX;
      const dy = n.y - mouseY;
      return Math.sqrt(dx * dx + dy * dy) <= n.radius * 1.5;
    });

    if (clickedNode) {
      dragNodeRef.current = clickedNode;
    } else {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - pan.x) / scale;
    const mouseY = (e.clientY - rect.top - pan.y) / scale;

    if (dragNodeRef.current) {
      dragNodeRef.current.x = mouseX;
      dragNodeRef.current.y = mouseY;
      return;
    }

    if (isDraggingRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    // Hover detection
    const hovered = nodesRef.current.find((n) => {
      const dx = n.x - mouseX;
      const dy = n.y - mouseY;
      return Math.sqrt(dx * dx + dy * dy) <= n.radius * 1.5;
    });
    setHoveredNode(hovered || null);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - pan.x) / scale;
    const mouseY = (e.clientY - rect.top - pan.y) / scale;

    if (dragNodeRef.current) {
      const clicked = dragNodeRef.current;
      dragNodeRef.current = null;
      if (clicked.type === "note" && clicked.topic && clicked.slug) {
        onOpenChange(false);
        router.push(`/notes/${clicked.topic}/${clicked.slug}`);
      } else if (clicked.type === "topic" && clicked.topic) {
        onOpenChange(false);
        router.push(`/notes/${clicked.topic}`);
      }
    }
    isDraggingRef.current = false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-6 bg-zinc-950 text-zinc-100 border-zinc-800 shadow-2xl rounded-2xl flex flex-col">
        <DialogHeader className="mb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Network className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold flex items-center gap-2 text-white">
                  Knowledge Graph
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Second Brain
                  </span>
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-400">
                  Interactive network of topics & notes. Click any note to navigate.
                </DialogDescription>
              </div>
            </div>

            {/* Filter Search */}
            <div className="relative w-full sm:w-56">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search graph..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-hidden focus:border-indigo-500 text-white placeholder-zinc-500"
              />
            </div>
          </div>
        </DialogHeader>

        {/* Canvas Area */}
        <div className="relative w-full h-[480px] bg-zinc-900/40 rounded-xl border border-zinc-800/80 overflow-hidden cursor-grab active:cursor-grabbing">
          <canvas
            ref={canvasRef}
            width={800}
            height={480}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="w-full h-full block"
          />

          {/* Zoom & Reset Controls */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 rounded-xl p-1 shadow-lg">
            <button
              onClick={() => setScale((s) => Math.min(s + 0.2, 2.5))}
              className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-300 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setScale((s) => Math.max(s - 0.2, 0.4))}
              className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-300 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setScale(1);
                setPan({ x: 0, y: 0 });
              }}
              className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-300 hover:text-white transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Hovered node tooltip */}
          {hoveredNode && (
            <div className="absolute top-3 left-3 bg-zinc-950/90 backdrop-blur-md border border-zinc-800 p-2.5 rounded-xl text-xs shadow-xl animate-in fade-in duration-100 max-w-xs">
              <span className="font-bold text-white block truncate">
                {hoveredNode.name}
              </span>
              <span className="text-[10px] text-indigo-400 capitalize">
                {hoveredNode.type} {hoveredNode.topic ? `• ${hoveredNode.topic}` : ""}
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
