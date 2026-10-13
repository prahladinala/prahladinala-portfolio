"use client";

import { useState, useRef, useEffect, ReactNode, isValidElement } from "react";
import { Check, Copy, ExternalLink, Hash, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { STORAGE_KEYS } from "@/config/constants";

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
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      if (preRef.current) {
        await navigator.clipboard.writeText(preRef.current.innerText);
        setIsCopied(true);
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
      setTimeout(() => setIsLineLinkCopied(false), 2000);
    } catch (err) {}
  };

  const openInCodeSandbox = () => {
    try {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://codesandbox.io/api/v1/sandboxes/define";
      form.target = "_blank";

      const files = {
        "package.json": {
          content: {
            dependencies: {
              react: "latest",
              "react-dom": "latest",
            },
          },
        },
        "index.tsx": {
          content: rawText,
        },
      };

      const hiddenField = document.createElement("input");
      hiddenField.type = "hidden";
      hiddenField.name = "parameters";
      hiddenField.value = btoa(unescape(encodeURIComponent(JSON.stringify({ files }))));

      form.appendChild(hiddenField);
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (e) {
      console.error("Failed to open in CodeSandbox", e);
    }
  };

  // Lines split for line numbering
  const lines = rawText.split("\n");
  const isMultiLine = lines.length > 2 && !isPackageManagerCommand;

  return (
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
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition-colors text-[11px] font-medium"
              title="Open in CodeSandbox"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="hidden sm:inline">CodeSandbox</span>
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
        </div>
      </div>

      {/* Code Area */}
      {isPackageManagerCommand ? (
        <div className="p-4 overflow-x-auto font-mono text-sm text-zinc-200">
          <code>{convertPackageManagerCommand(rawText, activePm)}</code>
        </div>
      ) : isMultiLine ? (
        <div className="flex overflow-x-auto text-sm font-mono leading-relaxed p-4 pt-3">
          {/* Clickable Line Numbers Gutter */}
          <div className="select-none pr-4 text-right border-r border-zinc-800/80 text-zinc-600 shrink-0 space-y-0.5">
            {lines.map((_, idx) => {
              const lineNum = idx + 1;
              const isHighlighted = activeHashLines.includes(lineNum);
              return (
                <div
                  key={lineNum}
                  id={`L${lineNum}`}
                  onClick={(e) => handleLineClick(lineNum, e)}
                  className={cn(
                    "cursor-pointer hover:text-zinc-300 transition-colors text-xs px-1 rounded-xs flex items-center justify-end group/line",
                    isHighlighted ? "text-primary font-bold bg-primary/20" : ""
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
            ref={preRef}
            className={cn(className, "pl-4 overflow-x-auto flex-1 !p-0 !m-0 !bg-transparent")}
            {...props}
          >
            {children}
          </pre>
        </div>
      ) : (
        <pre
          ref={preRef}
          className={cn(className, "p-4 overflow-x-auto !m-0 !bg-transparent")}
          {...props}
        >
          {children}
        </pre>
      )}
    </div>
  );
}
