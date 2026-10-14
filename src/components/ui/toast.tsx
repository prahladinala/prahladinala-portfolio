"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastItem = {
  id: string;
  message: string;
  icon?: React.ReactNode;
  type?: "default" | "success" | "error" | "info";
  duration?: number;
};

type ToastEventDetail = {
  message: string;
  icon?: React.ReactNode;
  type?: "default" | "success" | "error" | "info";
  duration?: number;
};

const TOAST_EVENT = "prahlad-micro-toast";

export function toast(message: string, options?: Omit<ToastEventDetail, "message">) {
  if (typeof window === "undefined") return;
  const detail: ToastEventDetail = {
    message,
    icon: options?.icon,
    type: options?.type || "default",
    duration: options?.duration || 2600,
  };
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail }));
}

toast.success = (message: string, options?: Omit<ToastEventDetail, "message" | "type">) => {
  toast(message, { ...options, type: "success" });
};

toast.error = (message: string, options?: Omit<ToastEventDetail, "message" | "type">) => {
  toast(message, { ...options, type: "error" });
};

toast.info = (message: string, options?: Omit<ToastEventDetail, "message" | "type">) => {
  toast(message, { ...options, type: "info" });
};

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<ToastEventDetail>;
      if (!customEvent.detail) return;

      const newToast: ToastItem = {
        id: `${Date.now()}-${Math.random()}`,
        ...customEvent.detail,
      };

      setToasts((prev) => [...prev.slice(-2), newToast]); // keep max 3 on screen

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, newToast.duration || 2600);
    };

    window.addEventListener(TOAST_EVENT, handleToast);
    return () => window.removeEventListener(TOAST_EVENT, handleToast);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] flex flex-col items-center gap-2 pointer-events-none select-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => {
          let DefaultIcon = null;
          if (t.type === "success") DefaultIcon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
          if (t.type === "error") DefaultIcon = <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
          if (t.type === "info") DefaultIcon = <Info className="w-4 h-4 text-sky-400 shrink-0" />;

          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={cn(
                "pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border shadow-xl backdrop-blur-md text-xs sm:text-sm font-semibold max-w-sm sm:max-w-md",
                "bg-[#18181b]/95 border-border/80 text-foreground text-white"
              )}
            >
              {t.icon ? (
                <span className="shrink-0 flex items-center justify-center text-base">
                  {t.icon}
                </span>
              ) : (
                DefaultIcon
              )}
              <span className="leading-snug">{t.message}</span>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="ml-1 p-0.5 rounded-md text-muted-foreground hover:text-white transition-colors"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
