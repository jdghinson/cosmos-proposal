"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import { CheckCircle2 } from "lucide-react";

type Toast = { id: number; text: string };

export function useToaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 1800);
  }, []);
  return { toasts, push };
}

export function Toaster({ toaster }: { toaster: ReturnType<typeof useToaster> }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
      <AnimatePresence>
        {toaster.toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96, transition: { duration: 0.14, ease: [0.2, 0.6, 0.2, 1] } }}
            transition={{ duration: 0.22, ease: [0.2, 0.6, 0.2, 1] }}
            className="flex items-center gap-1.5 rounded-pill bg-fg px-3 py-1.5 text-[11px] font-medium text-bg shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
          >
            <CheckCircle2 size={12} />
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
