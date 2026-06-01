"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

// ─── Module-level singleton so any component can call toast() ─────────────────
let _push: ((msg: string) => void) | null = null;

export function toast(message: string) {
  _push?.(message);
}

// ─── Container - mount once inside ChatBot ────────────────────────────────────
export function ToastContainer() {
  const [items, setItems] = useState<{ id: string; msg: string }[]>([]);

  useEffect(() => {
    _push = (msg) => {
      const id = crypto.randomUUID();
      setItems((prev) => [...prev.slice(-3), { id, msg }]); // keep max 4
      setTimeout(
        () => setItems((prev) => prev.filter((t) => t.id !== id)),
        2600,
      );
    };
    return () => {
      _push = null;
    };
  }, []);

  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-4 z-300 flex flex-col gap-2 pointer-events-none"
    >
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 48, scale: 0.88 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 48, scale: 0.88 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium shadow-xl pointer-events-auto select-none"
          >
            <Check
              size={11}
              className="text-green-400 dark:text-green-600 shrink-0"
            />
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
