"use client";

import { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ChevronDown, Search, X, BookmarkCheck } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { TypingDots } from "./MessageBubble";
import type { Message } from "./types";

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
  streaming: boolean;
  isAtBottom: boolean;
  lastBotMsgId: string | undefined;
  msgFollowUps: Record<string, string[]>;
  searchQuery: string;
  isSearchOpen: boolean;
  onSearchChange: (q: string) => void;
  onCloseSearch: () => void;
  onReact: (id: string, r: "up" | "down") => void;
  onBookmark: (id: string) => void;
  onFollowUp: (q: string) => void;
  onRetry: (id: string, failedInput: string) => void;
  onScrollToBottom: () => void;
  onScroll: () => void;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(
  function ChatMessages(
    {
      messages,
      loading,
      isAtBottom,
      lastBotMsgId,
      msgFollowUps,
      searchQuery,
      isSearchOpen,
      onSearchChange,
      onCloseSearch,
      onReact,
      onBookmark,
      onFollowUp,
      onRetry,
      onScrollToBottom,
      onScroll,
      bottomRef,
    },
    ref,
  ) {
    // Bookmarked messages strip
    const bookmarked = messages.filter((m) => m.bookmarked && m.id !== "init");

    return (
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {/* ─── Search bar ─────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden shrink-0"
            >
              <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <Search
                  size={13}
                  className="text-slate-400 dark:text-slate-500 shrink-0"
                />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search messages…"
                  className="flex-1 text-xs bg-transparent text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange("")}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    <X size={12} />
                  </button>
                )}
                <button
                  onClick={onCloseSearch}
                  className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors ml-1 font-medium"
                  aria-label="Close search"
                >
                  Esc
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Bookmarked strip ────────────────────────────────────────────────── */}
        <AnimatePresence>
          {bookmarked.length > 0 && !isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden shrink-0"
            >
              <div className="px-4 py-2 border-b border-amber-100 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <BookmarkCheck
                    size={11}
                    className="text-amber-500 dark:text-amber-400"
                  />
                  <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                    Saved ({bookmarked.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {bookmarked.map((m) => (
                    <span
                      key={m.id}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800/50 text-slate-600 dark:text-slate-300 max-w-50 truncate"
                    >
                      {m.content.slice(0, 60)}
                      {m.content.length > 60 ? "…" : ""}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Message list ────────────────────────────────────────────────────── */}
        <div
          ref={ref}
          onScroll={onScroll}
          className="flex-1 overflow-y-auto px-4 pt-4 pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800"
        >
          {messages.map((msg) => {
            const isLastBot =
              msg.role === "assistant" && msg.id === lastBotMsgId;
            return (
              <MessageBubble
                key={msg.id}
                msg={msg}
                onReact={onReact}
                onBookmark={onBookmark}
                followUps={isLastBot ? (msgFollowUps[msg.id] ?? []) : []}
                onFollowUp={onFollowUp}
                isLast={isLastBot}
                onRetry={onRetry}
                searchQuery={isSearchOpen ? searchQuery : ""}
              />
            );
          })}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start mb-3"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                <Bot size={14} className="text-white" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-sm">
                <TypingDots />
              </div>
            </motion.div>
          )}

          {/* Sticky scroll-to-bottom button */}
          <AnimatePresence>
            {!isAtBottom && (
              <motion.div
                key="scroll-btn"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="sticky bottom-2 flex justify-center pointer-events-none"
              >
                <button
                  onClick={onScrollToBottom}
                  className="pointer-events-auto w-7 h-7 rounded-full bg-indigo-600/90 hover:bg-indigo-600 backdrop-blur-sm shadow-lg border border-white/20 flex items-center justify-center transition-colors"
                  aria-label="Scroll to bottom"
                >
                  <ChevronDown size={14} className="text-white" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </div>
    );
  },
);
