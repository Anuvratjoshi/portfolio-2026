"use client";

import { useState, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Square, Dice5, Zap } from "lucide-react";
import {
  LUCKY_QUESTIONS,
  INITIAL_SUGGESTIONS,
  getRandomLuckyQuestion,
} from "./constants";

interface ChatInputProps {
  input: string;
  loading: boolean;
  streaming: boolean;
  charCount: number;
  onInputChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onStop: () => void;
  onSendMessage: (text: string) => void;
  showEnquiryCta: boolean;
  onEnquiryCta: () => void;
}

const SUGGESTION_POOL = [
  ...new Set([...LUCKY_QUESTIONS, ...INITIAL_SUGGESTIONS]),
];

export const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
  function ChatInput(
    {
      input,
      loading,
      streaming,
      charCount,
      onInputChange,
      onKeyDown,
      onSubmit,
      onStop,
      onSendMessage,
      showEnquiryCta,
      onEnquiryCta,
    },
    ref,
  ) {
    const [suggestions, setSuggestions] = useState<string[]>([]);

    // Debounced fuzzy suggestions while typing
    useEffect(() => {
      if (input.length < 2) {
        setSuggestions([]);
        return;
      }
      const tid = setTimeout(() => {
        const q = input.toLowerCase();
        const matches = SUGGESTION_POOL.filter((s) =>
          s.toLowerCase().includes(q),
        ).slice(0, 3);
        setSuggestions(matches);
      }, 120);
      return () => clearTimeout(tid);
    }, [input]);

    return (
      <div className="border-t border-slate-100 dark:border-slate-800 shrink-0">
        {/* Enquiry CTA */}
        <AnimatePresence>
          {showEnquiryCta && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mx-3 mt-2">
                <button
                  onClick={onEnquiryCta}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors duration-150"
                >
                  <Zap size={12} /> Interested? Send a direct enquiry
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auto-suggestions */}
        <AnimatePresence>
          {suggestions.length > 0 && !loading && !streaming && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="px-3 pt-2 flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      onSendMessage(s);
                      setSuggestions([]);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300 transition-colors duration-150 max-w-55 truncate"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Char counter */}
        <AnimatePresence>
          {charCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-end px-4 pt-1.5"
            >
              <span
                className={`text-[10px] font-mono ${charCount > 450 ? "text-red-400" : "text-slate-400 dark:text-slate-600"}`}
              >
                {charCount}/500
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input row */}
        <form
          onSubmit={onSubmit}
          className="flex flex-wrap items-center gap-2 px-3 py-3 pt-1.5"
        >
          {/* Feeling Lucky */}
          <button
            type="button"
            onClick={() => onSendMessage(getRandomLuckyQuestion())}
            disabled={loading || streaming}
            aria-label="Ask a random question about Anuvrat"
            title="Ask a random question about Anuvrat"
            className="flex items-center gap-1.5 px-2.5 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600 dark:hover:bg-violet-950/50 dark:hover:text-violet-300 disabled:opacity-40 transition-colors duration-150 shrink-0"
          >
            <Dice5 size={13} />
            <span className="text-xs font-medium whitespace-nowrap">
              Random Q
            </span>
          </button>

          <textarea
            ref={ref}
            rows={1}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask me anything…"
            disabled={loading || streaming}
            maxLength={500}
            className="flex-1 px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-600 transition-colors duration-150 disabled:opacity-50 resize-none overflow-hidden leading-relaxed"
            style={{ minHeight: "36px" }}
          />

          {streaming ? (
            <button
              type="button"
              onClick={onStop}
              aria-label="Stop generating"
              title="Stop generating"
              className="w-9 h-9 rounded-xl bg-red-500 hover:bg-red-400 flex items-center justify-center transition-colors duration-150 shrink-0"
            >
              <Square size={13} className="text-white fill-white" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send message"
              className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-150 shrink-0"
            >
              <Send size={14} className="text-white" />
            </button>
          )}
        </form>
      </div>
    );
  },
);
