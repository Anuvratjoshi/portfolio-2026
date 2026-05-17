"use client";

import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCw,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { formatTime } from "./storage";
import { toast } from "./Toast";
import type { Message } from "./types";

// ─── Typing dots ──────────────────────────────────────────────────────────────
export function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-indigo-400"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast("Message copied!");
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button
      onClick={copy}
      aria-label="Copy message"
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 shrink-0"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
}

// ─── MessageBubble ────────────────────────────────────────────────────────────
export interface MessageBubbleProps {
  msg: Message;
  onReact: (id: string, r: "up" | "down") => void;
  onBookmark: (id: string) => void;
  followUps: string[];
  onFollowUp: (q: string) => void;
  isLast: boolean;
  onRetry: (id: string, failedInput: string) => void;
  /** When set, dims this bubble if content doesn't match */
  searchQuery?: string;
}

export const MessageBubble = memo(function MessageBubble({
  msg,
  onReact,
  onBookmark,
  followUps,
  onFollowUp,
  isLast,
  onRetry,
  searchQuery,
}: MessageBubbleProps) {
  const isUser = msg.role === "user";

  // Search: dim non-matching messages
  const dimmed =
    searchQuery &&
    !msg.content.toLowerCase().includes(searchQuery.toLowerCase());

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: dimmed ? 0.25 : 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.2,
        layout: { duration: 0.18, ease: "easeOut" },
      }}
      className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-4 group`}
    >
      <div
        className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}
      >
        {!isUser && (
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 mr-2 mt-0.5">
            <Bot size={14} className="text-white" />
          </div>
        )}
        <div className="flex flex-col gap-1 max-w-[82%] min-w-0">
          <div
            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed transition-colors ${
              isUser
                ? "bg-indigo-600 text-white rounded-br-sm whitespace-pre-wrap wrap-break-word"
                : `bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm ${msg.bookmarked ? "ring-1 ring-amber-400/50 dark:ring-amber-500/40" : ""}`
            }`}
          >
            {isUser ? (
              msg.content
            ) : (
              <MarkdownRenderer
                content={msg.content}
                streaming={msg.streaming}
              />
            )}
          </div>
          {/* Timestamp + bookmark indicator */}
          <div
            className={`flex items-center gap-1.5 px-1 ${isUser ? "justify-end" : "justify-start"}`}
          >
            <span className="text-[10px] text-slate-400 dark:text-slate-600">
              {formatTime(msg.timestamp)}
            </span>
            {msg.bookmarked && (
              <span className="text-[10px] text-amber-500 dark:text-amber-400 flex items-center gap-0.5">
                <BookmarkCheck size={9} />
                <span>Saved</span>
              </span>
            )}
          </div>
        </div>
        {/* Copy + bookmark buttons for bot messages */}
        {!isUser && !msg.streaming && (
          <div className="flex flex-col gap-0.5 ml-1">
            <CopyButton text={msg.content} />
            <button
              onClick={() => onBookmark(msg.id)}
              aria-label={
                msg.bookmarked ? "Remove bookmark" : "Bookmark message"
              }
              title={msg.bookmarked ? "Remove bookmark" : "Save message"}
              className={`opacity-0 group-hover:opacity-100 transition-all duration-150 p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0 ${
                msg.bookmarked
                  ? "text-amber-500 dark:text-amber-400 opacity-100!"
                  : "text-slate-400 dark:text-slate-500 hover:text-amber-500 dark:hover:text-amber-400"
              }`}
            >
              {msg.bookmarked ? (
                <BookmarkCheck size={12} />
              ) : (
                <Bookmark size={12} />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Retry button for error messages */}
      {msg.error && msg.failedInput && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => onRetry(msg.id, msg.failedInput!)}
          className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300 mt-1 ml-9 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <RotateCw size={11} />
          <span>Retry</span>
        </motion.button>
      )}

      {/* Reactions + follow-up chips — only on last bot message */}
      <AnimatePresence>
        {!isUser && !msg.streaming && isLast && !msg.error && (
          <motion.div
            key={msg.id + "-chips"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col gap-2 ml-9 mt-1 min-w-0"
          >
            {/* Reaction buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onReact(msg.id, "up")}
                aria-label="Helpful"
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all duration-150 ${
                  msg.reaction === "up"
                    ? "bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/50"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400"
                }`}
              >
                <ThumbsUp size={11} />
                {msg.reaction === "up" && <span>Thanks!</span>}
              </button>
              <button
                onClick={() => onReact(msg.id, "down")}
                aria-label="Not helpful"
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all duration-150 ${
                  msg.reaction === "down"
                    ? "bg-red-100 dark:bg-red-950/60 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800/50"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400"
                }`}
              >
                <ThumbsDown size={11} />
                {msg.reaction === "down" && <span>Got it</span>}
              </button>
            </div>

            {/* Follow-up chips */}
            {followUps.length > 0 && !msg.reaction && (
              <div className="flex flex-wrap gap-1.5">
                {followUps.map((q) => (
                  <button
                    key={q}
                    onClick={() => onFollowUp(q)}
                    className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 dark:hover:bg-indigo-950/50 dark:hover:border-indigo-800/50 dark:hover:text-indigo-300 transition-colors duration-150"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
