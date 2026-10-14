"use client";

import { Sandpack } from "@codesandbox/sandpack-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type SandpackRunnerProps = {
  template?: "react" | "react-ts" | "vanilla" | "vanilla-ts";
  files?: Record<string, string>;
  code?: string;
};

export function SandpackRunner({
  template = "react",
  files,
  code,
}: SandpackRunnerProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="my-8 h-[400px] rounded-xl border border-border bg-muted/20 animate-pulse"></div>
    );
  }

  const sandpackFiles =
    files ||
    (code
      ? {
          [template.startsWith("react") ? "/App.js" : "/index.js"]: code,
        }
      : undefined);

  const hasLucide =
    Boolean(code?.includes("lucide-react")) ||
    Object.values(files || {}).some((f) => f.includes("lucide-react"));

  return (
    <div className="my-8 rounded-xl overflow-hidden border border-border shadow-md print:hidden">
      <Sandpack
        template={template}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        files={sandpackFiles}
        options={{
          showNavigator: false,
          showTabs: true,
          editorHeight: 400,
          editorWidthPercentage: 55,
          recompileMode: "delayed",
          recompileDelay: 500,
          bundlerTimeOut: 120000,
          initMode: "user-visible",
        }}
        customSetup={
          hasLucide
            ? {
                dependencies: {
                  "lucide-react": "^0.292.0",
                },
              }
            : undefined
        }
      />
    </div>
  );
}
