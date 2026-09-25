import { AlertCircle, CheckCircle2, Info, Lightbulb, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalloutProps {
  children: React.ReactNode;
  type?: "default" | "info" | "warning" | "danger" | "success";
  title?: string;
}

export function Callout({
  children,
  type = "default",
  title,
}: CalloutProps) {
  const config = {
    default: {
      icon: <Lightbulb className="w-5 h-5 text-foreground" />,
      classes: "bg-muted/50 border-muted-foreground/20 text-foreground",
      titleClasses: "text-foreground",
    },
    info: {
      icon: <Info className="w-5 h-5 text-blue-500" />,
      classes: "bg-blue-500/10 border-blue-500/20 text-blue-900 dark:text-blue-200",
      titleClasses: "text-blue-700 dark:text-blue-400",
    },
    warning: {
      icon: <TriangleAlert className="w-5 h-5 text-amber-500" />,
      classes: "bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-200",
      titleClasses: "text-amber-700 dark:text-amber-400",
    },
    danger: {
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      classes: "bg-red-500/10 border-red-500/20 text-red-900 dark:text-red-200",
      titleClasses: "text-red-700 dark:text-red-400",
    },
    success: {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      classes: "bg-emerald-500/10 border-emerald-500/20 text-emerald-900 dark:text-emerald-200",
      titleClasses: "text-emerald-700 dark:text-emerald-400",
    },
  };

  const selectedConfig = config[type] || config.default;

  return (
    <div
      className={cn(
        "my-6 flex items-start gap-4 rounded-xl border p-4 shadow-sm backdrop-blur-sm print:border-gray-300 print:bg-gray-50",
        selectedConfig.classes
      )}
    >
      <div className="mt-0.5 shrink-0 print:text-black">
        {selectedConfig.icon}
      </div>
      <div className="flex-1 w-full min-w-0">
        {title && (
          <h5 className={cn("mb-1 font-semibold leading-none print:text-black", selectedConfig.titleClasses)}>
            {title}
          </h5>
        )}
        <div className="prose-sm sm:prose-base leading-relaxed [&>p:first-child]:mt-0 [&>p:last-child]:mb-0 print:text-black">
          {children}
        </div>
      </div>
    </div>
  );
}
