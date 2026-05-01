"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, Sparkles, RotateCcw } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What's Anuvrat's tech stack?",
  "Tell me about his projects",
  "Is he available for hire?",
  "What npm packages did he publish?",
];

function TypingDots() {
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

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 mr-2 mt-0.5">
          <Bot size={14} className="text-white" />
        </div>
      )}
      <div
        className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-indigo-600 text-white rounded-br-sm"
            : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm"
        }`}
      >
        {msg.content}
      </div>
    </motion.div>
  );
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content:
        "Hey! 👋 I'm AJ Bot — Anuvrat's AI assistant.\nAsk me anything about his skills, projects, experience, or whether he's worth hiring (spoiler: he is).",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
      };
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages.map(({ role, content }) => ({
              role,
              content,
            })),
          }),
        });

        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: data.reply ?? data.error ?? "Something went wrong.",
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Connection error. Check your network and try again.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const reset = () => {
    setMessages([
      {
        id: "init",
        role: "assistant",
        content:
          "Hey! 👋 I'm AJ Bot — Anuvrat's AI assistant.\nAsk me anything about his skills, projects, experience, or whether he's worth hiring (spoiler: he is).",
      },
    ]);
    setInput("");
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chat"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-900/40 flex items-center justify-center transition-colors duration-200"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X size={22} className="text-white" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Bot size={22} className="text-white" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulse ring when closed */}
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-2xl border-2 border-indigo-400"
            animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col"
            style={{ height: "520px" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-600 to-violet-600 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                  <Sparkles size={15} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-tight">
                    AJ Bot
                  </p>
                  <p className="text-indigo-200 text-xs">Anuvrat's assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={reset}
                  aria-label="Reset chat"
                  className="p-1.5 rounded-lg hover:bg-white/15 text-white/70 hover:text-white transition-colors duration-150"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="p-1.5 rounded-lg hover:bg-white/15 text-white/70 hover:text-white transition-colors duration-150"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
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
              <div ref={bottomRef} />
            </div>

            {/* Quick suggestions — shown only at start */}
            {messages.length === 1 && !loading && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors duration-150"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-3 py-3 border-t border-slate-100 dark:border-slate-800 shrink-0"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything…"
                disabled={loading}
                maxLength={500}
                className="flex-1 px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-600 transition-colors duration-150 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-150 shrink-0"
              >
                <Send size={15} className="text-white" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
