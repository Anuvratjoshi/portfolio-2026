"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";

const VISITOR_ID_KEY = "aj_visitor_id";

/** Returns the persistent visitor UUID, creating it on first call. */
function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const visitorId = getVisitorId();
    fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId }),
    })
      .then((r) => r.json())
      .then((data) => setCount(data.count ?? 1))
      .catch(() => setCount(null));
  }, []);

  // Animate counter as soon as count arrives
  useEffect(() => {
    if (count === null) return;
    const duration = 1200;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(eased * count));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [count]);

  if (count === null) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 dark:bg-white/4 border border-slate-200 dark:border-white/8 text-slate-500 dark:text-slate-400 text-xs"
    >
      <Eye size={12} className="text-indigo-400 shrink-0" />
      <span>
        <span className="font-semibold text-indigo-400">
          {formatCount(displayed)}
        </span>{" "}
        portfolio {count === 1 ? "visit" : "visits"}
      </span>
    </motion.div>
  );
}
