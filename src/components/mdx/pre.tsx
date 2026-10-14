"use client";

import { useState, useRef, useEffect, ReactNode, isValidElement } from "react";
import { createPortal } from "react-dom";
import { Check, Copy, ExternalLink, Hash, Link as LinkIcon, Maximize2, Minimize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { STORAGE_KEYS } from "@/config/constants";
import { toast } from "@/components/ui/toast";
import LZString from "lz-string";

type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

function convertPackageManagerCommand(cmd: string, targetPm: PackageManager): string {
  const trimmed = cmd.trim();

  // npx / bunx commands
  if (/^(npx|bunx|pnpm dlx|yarn dlx)\s+/.test(trimmed)) {
    const pkg = trimmed.replace(/^(npx|bunx|pnpm dlx|yarn dlx)\s+/, "");
    if (targetPm === "npm") return `npx ${pkg}`;
    if (targetPm === "pnpm") return `pnpm dlx ${pkg}`;
    if (targetPm === "yarn") return `yarn dlx ${pkg}`;
    if (targetPm === "bun") return `bunx ${pkg}`;
  }

  // Install commands
  if (/^(npm\s+(i|install)|pnpm\s+(add|i|install)|yarn\s+(add)|bun\s+(add|i|install))\b/.test(trimmed)) {
    const isDev = /(-D|--save-dev|-d)\b/.test(trimmed);
    const isGlobal = /(-g|--global)\b/.test(trimmed);

    let pkgs = trimmed
      .replace(/^(npm\s+(i|install)|pnpm\s+(add|i|install)|yarn\s+(add)|bun\s+(add|i|install))\s*/, "")
      .replace(/\s*(-D|--save-dev|-d)\s*/g, " ")
      .replace(/\s*(-g|--global)\s*/g, " ")
      .trim();

    if (targetPm === "npm") {
      if (isGlobal) return `npm install -g ${pkgs}`;
      return isDev ? `npm install -D ${pkgs}` : `npm install ${pkgs}`;
    }
    if (targetPm === "pnpm") {
      if (isGlobal) return `pnpm add -g ${pkgs}`;
      return isDev ? `pnpm add -D ${pkgs}` : `pnpm add ${pkgs}`;
    }
    if (targetPm === "yarn") {
      if (isGlobal) return `yarn global add ${pkgs}`;
      return isDev ? `yarn add -D ${pkgs}` : `yarn add ${pkgs}`;
    }
    if (targetPm === "bun") {
      if (isGlobal) return `bun add -g ${pkgs}`;
      return isDev ? `bun add -d ${pkgs}` : `bun add ${pkgs}`;
    }
  }

  return cmd;
}

export function Pre({ children, className, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const [isCopied, setIsCopied] = useState(false);
  const [isLineLinkCopied, setIsLineLinkCopied] = useState(false);
  const [activePm, setActivePm] = useState<PackageManager>("npm");
  const [activeHashLines, setActiveHashLines] = useState<number[]>([]);
  const [isOpeningSandbox, setIsOpeningSandbox] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const extractText = (node: ReactNode): string => {
    if (typeof node === "string") return node;
    if (typeof node === "number") return node.toString();
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (isValidElement(node)) return extractText((node as any).props.children);
    return "";
  };

  const rawText = extractText(children);
  const isPackageManagerCommand = /^(npm\s+(i|install)|pnpm\s+(add|i|install)|yarn\s+(add)|bun\s+(add|i|install)|npx\s+|bunx\s+|pnpm dlx\s+|yarn dlx\s+)/.test(
    rawText.trim()
  );

  // Sync package manager preference across all instances
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsExpanded(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  useEffect(() => {
    const loadPm = () => {
      try {
        const saved = (localStorage.getItem(STORAGE_KEYS.packageManagerPreference) as PackageManager) || "npm";
        if (["npm", "pnpm", "yarn", "bun"].includes(saved)) {
          setActivePm(saved);
        }
      } catch (e) {}
    };

    loadPm();
    window.addEventListener("prahlad-pm-changed", loadPm);

    // Hash tracking for line highlight e.g. #L15 or #L15-L20
    const parseHash = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith("#L")) {
        const range = hash.replace("#L", "").split("-");
        const start = parseInt(range[0], 10);
        const end = range[1] ? parseInt(range[1], 10) : start;
        if (!isNaN(start)) {
          const lines: number[] = [];
          for (let i = start; i <= end; i++) lines.push(i);
          setActiveHashLines(lines);
        }
      } else {
        setActiveHashLines([]);
      }
    };

    parseHash();
    window.addEventListener("hashchange", parseHash);

    return () => {
      window.removeEventListener("prahlad-pm-changed", loadPm);
      window.removeEventListener("hashchange", parseHash);
    };
  }, []);

  const handlePmChange = (pm: PackageManager) => {
    setActivePm(pm);
    try {
      localStorage.setItem(STORAGE_KEYS.packageManagerPreference, pm);
      window.dispatchEvent(new CustomEvent("prahlad-pm-changed"));
    } catch (e) {}
  };

  const copyToClipboard = async () => {
    try {
      const textToCopy = isPackageManagerCommand
        ? convertPackageManagerCommand(rawText, activePm)
        : rawText;
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      toast.success("Code copied to clipboard", { icon: "📋" });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      if (preRef.current) {
        await navigator.clipboard.writeText(preRef.current.innerText);
        setIsCopied(true);
        toast.success("Code copied to clipboard", { icon: "📋" });
        setTimeout(() => setIsCopied(false), 2000);
      }
    }
  };

  const handleLineClick = async (lineNum: number, e: React.MouseEvent) => {
    e.preventDefault();
    let newHash = `#L${lineNum}`;

    if (e.shiftKey && activeHashLines.length > 0) {
      const start = Math.min(activeHashLines[0], lineNum);
      const end = Math.max(activeHashLines[activeHashLines.length - 1], lineNum);
      newHash = `#L${start}-L${end}`;
    }

    window.history.replaceState(null, "", newHash);
    window.dispatchEvent(new HashChangeEvent("hashchange"));

    try {
      const fullUrl = `${window.location.origin}${window.location.pathname}${newHash}`;
      await navigator.clipboard.writeText(fullUrl);
      setIsLineLinkCopied(true);
      toast.success(`Line ${lineNum} link copied to clipboard`, { icon: "🔗" });
      setTimeout(() => setIsLineLinkCopied(false), 2000);
    } catch (err) {}
  };

  const openInCodeSandbox = async () => {
    if (isOpeningSandbox) return;
    setIsOpeningSandbox(true);

    const newTab = window.open("about:blank", "_blank");
    if (newTab) {
      newTab.document.write(`
        <!DOCTYPE html>
        <html>
          <head><title>Loading CodeSandbox...</title></head>
          <body style="font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#0d1117;color:#c9d1d9;">
            <div style="text-align:center;">
              <div style="font-size:22px;font-weight:600;margin-bottom:8px;">Preparing CodeSandbox...</div>
              <p style="color:#8b949e;margin:0;font-size:14px;">Setting up environment and opening editor</p>
            </div>
          </body>
        </html>
      `);
    }

    try {
      const codeToRun = preRef.current?.innerText || rawText;
      const hasExportDefault = codeToRun.includes("export default");
      const appContent = hasExportDefault
        ? codeToRun
        : `import React from 'react';\n\n${codeToRun}\n\nexport default function App() {\n  return (\n    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>\n      <h2>Code Preview</h2>\n      <p>Snippet loaded from Prahlad Inala Notes</p>\n    </div>\n  );\n}`;

      const parameters = {
        template: "create-react-app",
        files: {
          "package.json": {
            content: {
              name: "prahlad-code-snippet",
              main: "src/index.js",
              dependencies: {
                react: "^18.2.0",
                "react-dom": "^18.2.0",
                "react-scripts": "^5.0.1",
              },
            },
          },
          "public/index.html": {
            content: '<!DOCTYPE html><html><body><div id="root"></div></body></html>',
          },
          "src/App.js": {
            content: appContent,
          },
          "src/index.js": {
            content:
              'import React from "react";\nimport { createRoot } from "react-dom/client";\nimport App from "./App";\n\nconst root = createRoot(document.getElementById("root"));\nroot.render(<App />);',
          },
        },
      };

      const compressed = LZString.compressToBase64(JSON.stringify(parameters))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const response = await fetch("https://codesandbox.io/api/v1/sandboxes/define?json=1", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ parameters: compressed }),
      });

      if (!response.ok) {
        throw new Error(`CodeSandbox API error status: ${response.status}`);
      }

      const data = await response.json();
      if (data?.sandbox_id) {
        const targetUrl = `https://codesandbox.io/s/${data.sandbox_id}`;
        if (newTab && !newTab.closed) {
          newTab.location.href = targetUrl;
        } else {
          window.open(targetUrl, "_blank");
        }
      } else {
        throw new Error("No sandbox_id received");
      }
    } catch (e) {
      console.error("Failed to open in CodeSandbox", e);
      if (newTab && !newTab.closed) {
        newTab.close();
      }
    } finally {
      setIsOpeningSandbox(false);
    }
  };

  // Lines split for line numbering
  const lines = rawText.split("\n");
  const isMultiLine = lines.length > 2 && !isPackageManagerCommand;

  const renderCodeContent = (isModal = false) => {
    if (isPackageManagerCommand) {
      return (
        <div className={cn("p-4 overflow-x-auto font-mono text-sm text-zinc-200", isModal && "p-6 text-base")}>
          <code>{convertPackageManagerCommand(rawText, activePm)}</code>
        </div>
      );
    }

    if (isMultiLine) {
      return (
        <div className={cn("flex overflow-x-auto text-sm font-mono leading-relaxed p-4 pt-3", isModal && "p-6 pt-4 text-base")}>
          {/* Clickable Line Numbers Gutter */}
          <div className="select-none pr-4 text-right border-r border-zinc-800/80 text-zinc-600 shrink-0 space-y-0.5">
            {lines.map((_, idx) => {
              const lineNum = idx + 1;
              const isHighlighted = activeHashLines.includes(lineNum);
              return (
                <div
                  key={lineNum}
                  id={isModal ? undefined : `L${lineNum}`}
                  onClick={(e) => handleLineClick(lineNum, e)}
                  className={cn(
                    "cursor-pointer hover:text-zinc-300 transition-colors text-xs px-1 rounded-xs flex items-center justify-end group/line",
                    isHighlighted ? "text-primary font-bold bg-primary/20" : "",
                    isModal && "text-sm py-0.5"
                  )}
                  title={`Line ${lineNum} (Click to link, Shift+Click for range)`}
                >
                  <span className="opacity-0 group-hover/line:opacity-100 mr-1 text-[10px] text-zinc-400">#</span>
                  {lineNum}
                </div>
              );
            })}
          </div>

          {/* Pre & Children */}
          <pre
            ref={isModal ? undefined : preRef}
            className={cn(className, "pl-4 overflow-x-auto flex-1 !p-0 !m-0 !bg-transparent")}
            {...props}
          >
            {children}
          </pre>
        </div>
      );
    }

    return (
      <pre
        ref={isModal ? undefined : preRef}
        className={cn(className, "p-4 overflow-x-auto !m-0 !bg-transparent", isModal && "p-6 text-base")}
        {...props}
      >
        {children}
      </pre>
    );
  };

  return (
    <>
      <div className="relative group my-6 rounded-2xl border border-border/80 bg-[#0d1117] overflow-hidden shadow-xl">
        {/* Top Header Bar for Code Tabs & Actions */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-zinc-950/60 text-xs text-zinc-400">
          {isPackageManagerCommand ? (
            <div className="flex items-center gap-1 bg-zinc-900/80 p-0.5 rounded-lg border border-zinc-800">
              {(["npm", "pnpm", "yarn", "bun"] as const).map((pm) => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => handlePmChange(pm)}
                  className={cn(
                    "px-2.5 py-1 rounded-md font-mono text-xs font-semibold transition-all",
                    activePm === pm
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  {pm}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70 inline-block" />
              <span className="ml-2 font-semibold text-zinc-400 uppercase tracking-wider">
                Code
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {isLineLinkCopied && (
              <span className="text-[11px] text-green-400 font-medium px-2 py-0.5 bg-green-500/10 rounded-md animate-in fade-in">
                Line link copied!
              </span>
            )}

            {/* 1-Click CodeSandbox */}
            {!isPackageManagerCommand && lines.length > 3 && (
              <button
                type="button"
                onClick={openInCodeSandbox}
                disabled={isOpeningSandbox}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800/80 hover:bg-zinc-700 disabled:opacity-50 text-zinc-300 transition-colors text-[11px] font-medium"
                title="Open in CodeSandbox"
              >
                <ExternalLink className="w-3 h-3" />
                <span className="hidden sm:inline">
                  {isOpeningSandbox ? "Opening..." : "CodeSandbox"}
                </span>
              </button>
            )}

            {/* Copy Button */}
            <button
              type="button"
              onClick={copyToClipboard}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition-colors text-[11px] font-medium"
              aria-label="Copy code to clipboard"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {/* Expand to Full-Screen Button */}
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition-colors text-[11px] font-medium"
              title="Expand code block (Full Screen)"
              aria-label="Expand code block to full screen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Expand</span>
            </button>
          </div>
        </div>

        {/* Code Area */}
        {renderCodeContent(false)}
      </div>

      {/* Full-Screen Code Block Modal Overlay */}
      {mounted && isExpanded && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Expanded Code Block"
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsExpanded(false);
          }}
        >
          <div className="relative w-full max-w-6xl h-full max-h-[92vh] flex flex-col rounded-2xl border border-zinc-700/80 bg-[#0d1117] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 bg-zinc-950/80 text-xs text-zinc-300 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/70 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/70 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-500/70 inline-block" />
                </div>
                <span className="font-semibold text-zinc-200 text-sm font-mono">
                  Full-Screen Code Block
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-zinc-800/90 text-zinc-400 font-mono border border-zinc-700/50">
                  {lines.length} lines
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {!isPackageManagerCommand && lines.length > 3 && (
                  <button
                    type="button"
                    onClick={openInCodeSandbox}
                    disabled={isOpeningSandbox}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-200 transition-colors text-xs font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{isOpeningSandbox ? "Opening..." : "CodeSandbox"}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors text-xs font-medium"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors text-xs font-medium border border-zinc-700/60"
                  title="Close (Esc)"
                  aria-label="Close full-screen code block"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Minimize</span>
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-zinc-900 border border-zinc-700 rounded text-zinc-400">
                    Esc
                  </kbd>
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-auto">
              {renderCodeContent(true)}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
