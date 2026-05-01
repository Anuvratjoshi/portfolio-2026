"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  MessageSquareHeart,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Quote,
} from "lucide-react";
import { SectionHeading } from "@/common/components/sections/SectionHeading";
import { FadeIn } from "@/common/components/animations/FadeIn";

interface GuestbookEntry {
  _id: string;
  name: string;
  message: string;
  timestamp: string;
}

/** Deterministic pastel color from a name string */
const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-violet-500",
  "bg-pink-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-emerald-500",
];
function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function relativeTime(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type FormStatus = "idle" | "loading" | "success" | "error";

export function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch("/api/guestbook");
      const data = await res.json();
      setEntries(data.entries ?? []);
    } catch {
      // silently fail
    } finally {
      setLoadingEntries(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimName = name.trim();
    const trimMsg = message.trim();
    if (!trimName || !trimMsg) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimName, message: trimMsg }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      // Entry is pending approval — don't add to list yet
      setStatus("success");
      setName("");
      setMessage("");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to submit.");
      setStatus("error");
    }
  };

  const charLeft = 280 - message.length;

  return (
    <section
      id="guestbook"
      className="py-24 lg:py-32 bg-white dark:bg-slate-900"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          label="Guestbook"
          title="Leave a Note"
          subtitle="Sign the guestbook — say hi, leave feedback, or just let me know you visited."
        />

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Submit form */}
          <FadeIn direction="left">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
              <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-6 flex items-center gap-2">
                <MessageSquareHeart size={20} className="text-indigo-500" />
                Sign the Guestbook
              </h3>

              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center gap-3 py-12 text-center"
                >
                  <CheckCircle2 size={40} className="text-green-500" />
                  <p className="text-slate-900 dark:text-white font-medium text-lg">
                    Thanks for signing!
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Your note is under review and will appear here once approved.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-2 text-indigo-600 dark:text-indigo-400 text-sm hover:underline"
                  >
                    Leave another note
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="gb-name"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                      Your name
                    </label>
                    <input
                      id="gb-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={50}
                      placeholder="e.g. Jane Smith"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="gb-message"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                      Message
                    </label>
                    <textarea
                      id="gb-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value.slice(0, 280))}
                      rows={4}
                      placeholder="Say something nice..."
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm resize-none"
                    />
                    <p
                      className={`text-right text-xs mt-1 ${
                        charLeft < 30 ? "text-amber-500" : "text-slate-400"
                      }`}
                    >
                      {charLeft} chars left
                    </p>
                  </div>

                  {status === "error" && errorMsg && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                      <p className="text-red-700 dark:text-red-300 text-sm">{errorMsg}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading" || !name.trim() || !message.trim()}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors duration-200 text-sm"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Submit
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </FadeIn>

          {/* Entries list */}
          <FadeIn direction="right">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-900 dark:text-white font-semibold text-lg">
                  Recent notes
                </h3>
                {entries.length > 0 && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                    {entries.length} {entries.length === 1 ? "note" : "notes"}
                  </span>
                )}
              </div>

              {loadingEntries ? (
                <div className="flex items-center gap-2 text-slate-400 text-sm py-8">
                  <Loader2 size={16} className="animate-spin" />
                  Loading entries...
                </div>
              ) : entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                  <MessageSquareHeart size={32} className="text-slate-300 dark:text-slate-600" />
                  <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
                    No notes yet
                  </p>
                  <p className="text-slate-400 dark:text-slate-600 text-xs">
                    Be the first to sign!
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-130 overflow-y-auto pr-1 -mr-1">
                  <AnimatePresence initial={false}>
                    {entries.map((entry) => (
                      <motion.div
                        key={entry._id}
                        initial={{ opacity: 0, y: -16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className={`relative group rounded-2xl p-4 border transition-colors bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600`}
                      >
                        {/* Quote icon */}
                        <Quote
                          size={14}
                          className="absolute top-4 right-4 text-slate-200 dark:text-slate-700 rotate-180"
                        />

                        {/* Top row: avatar + name + time */}
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${avatarColor(entry.name)}`}
                          >
                            {initials(entry.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-slate-900 dark:text-white text-sm leading-none block truncate">
                              {entry.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                              {relativeTime(entry.timestamp)}
                            </span>
                          </div>
                        </div>

                        {/* Message */}
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed pl-11">
                          {entry.message}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

