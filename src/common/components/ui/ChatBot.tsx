"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Bot,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  Mail,
  ChevronLeft,
  Loader2,
  Zap,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

type View = "chat" | "enquiry";

// ─── Rate-limit funny responses ───────────────────────────────────────────────

const RATE_LIMIT_MSGS = [
  "😴 I'm too tired right now. Anuvrat's broke — hire him so he can afford more AI credits!",
  "💸 Daily limit hit. Anuvrat is actively looking for a job so he can pay his API bills. Hint hint.",
  "🪫 I've run out of brain juice for today. Ask again tomorrow, or just... hire the guy already.",
  "🤑 Groq said 'no more free tokens'. Anuvrat said 'same energy'. Drop him a job offer instead.",
  "😅 Plot twist: the AI is broke too. Anuvrat's working on fixing that — by getting hired.",
  "⚡ API credits: 0. Anuvrat's bank balance after paying server bills: also 0. Hire him!",
  "🏦 We've burned through today's AI budget. Anuvrat accepts job offers, equity, or pizza.",
  "🔋 Bot is on low power mode. Too many smart people visited today. Come back tomorrow!",
  "😤 I've answered SO many questions today that I'm officially on strike. Solidarity.",
  "💤 zzz... daily limit reached. Even AIs need rest. Anuvrat definitely needs a salary though.",
  "🧠 My neurons are exhausted. Fun fact: hiring Anuvrat would fix the credits problem permanently.",
  "📉 API quota: depleted. Anuvrat's patience with job searching: also depleted. Connect the dots.",
  "🤷 I'd love to answer, but Groq's free tier said 'not today'. Try again tomorrow!",
  "🥱 Out of tokens. Out of patience. Anuvrat is open to full-time roles though — just saying.",
  "🚫 Rate limited! The irony: I help showcase a dev who can't afford unlimited AI. Help him.",
  "💡 Fun idea: hire Anuvrat → he gets paid → he buys more credits → I answer your questions. Win-win.",
  "🎭 Today's show is over. The AI has left the building. Anuvrat hasn't — he's still job hunting.",
  "🥲 I ran out of words. Anuvrat ran out of free API calls. You might be the solution to both.",
  "🤖 BEEP BOOP. Daily limit exceeded. BEEP BOOP. Hire human named Anuvrat. BOOP.",
  "🪙 Tokens gone. Anuvrat's piggy bank is crying. You know what would help? An offer letter.",
  "😮‍💨 I've been chatting ALL day. Even I need a break. Check back tomorrow, or just email Anuvrat!",
  "🎪 The circus is closed for the day. Daily AI credits: gone. Anuvrat: still available for hire.",
  "🌙 The AI has clocked out. Anuvrat's resume is still very much clocked in though.",
  "⏰ Time's up! Groq's free tier is ruthless. Almost as ruthless as Anuvrat's code reviews.",
  "🫙 Empty. Just like Anuvrat's AI credit jar. Fill it by hiring him — he'll fill your codebase.",
  "😂 Out of API calls. Anuvrat said 'same' about job offers, so maybe do something about that?",
  "🧊 Brain frozen. Daily limit reached. Anuvrat, however, is very much warm and hireable.",
  "📵 Service temporarily unavailable. Unlike Anuvrat, who is very available. Very. Available.",
  "🎯 Today's quota: bullseye. Tomorrow's quota: fresh. Anuvrat's availability: permanent.",
  "💬 Too many chats, not enough credits. Story of every dev's life. Hire this one specifically.",
  "🔮 The oracle has spoken... too much today. Return tomorrow for more prophecies.",
  "🌊 I've crashed on the shore of my daily limit. Anuvrat's career, however, is still sailing.",
  "🎵 *plays sad violin* Daily limit reached. *violin intensifies* Anuvrat needs a job.",
  "🦾 My mechanical brain needs recharging. Should've used the budget more wisely. Like hiring Anuvrat.",
  "😬 Awkward. We're out of API tokens. Even more awkward: Anuvrat's still job hunting. Fix one of these.",
  "🏳️ I surrender to the rate limit gods. Anuvrat surrenders to nothing — that's why you should hire him.",
  "🎲 Rolled a 1 on the 'AI credits remaining' check. Roll again tomorrow. Or just hire the man.",
  "📦 Out of stock. Intelligence temporarily unavailable. Anuvrat's intelligence: always in stock.",
  "🚀 We've used up all our rocket fuel for today. Anuvrat's career is ready for launch though.",
  "🌡️ AI temperature: cold. Daily limit: reached. Anuvrat's enthusiasm for new opportunities: 🔥.",
  "🫠 Melting under the weight of the daily limit. Anuvrat meanwhile is solid as a rock. Hire rock.",
  "🤡 The joke's on me — I ran out of tokens. The bigger joke: not hiring Anuvrat yet.",
  "📺 We're experiencing technical difficulties. *static* Please hire Anuvrat. *static* Thank you.",
  "⚙️ Gears grinding. Credits depleted. Anuvrat's work ethic: still spinning at full speed.",
  "🎠 The merry-go-round has stopped for today. But Anuvrat's momentum? Never stops.",
];

function getRandomRateLimitMsg() {
  return RATE_LIMIT_MSGS[Math.floor(Math.random() * RATE_LIMIT_MSGS.length)];
}

// ─── Suggestions ─────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  "What's his tech stack?",
  "Tell me about TARDIS",
  "Is he available for hire?",
  "What npm packages did he build?",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button
      onClick={copy}
      aria-label="Copy message"
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 shrink-0 ml-1 mt-0.5"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3 group`}
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
        {msg.streaming && (
          <motion.span
            className="inline-block w-0.5 h-3.5 bg-indigo-400 ml-0.5 align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </div>
      {!isUser && !msg.streaming && <CopyButton text={msg.content} />}
    </motion.div>
  );
}

// ─── Enquiry Form ─────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function EnquiryForm({ onBack }: { onBack: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [emailError, setEmailError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  const validateEmail = (val: string) => {
    if (!val) return "Email is required.";
    if (!EMAIL_RE.test(val)) return "Enter a valid email address.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(form.email);
    if (err) {
      setEmailError(err);
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 422) {
        const json = await res.json().catch(() => ({}));
        if (json?.error === "invalid_email_domain") {
          setEmailError(
            "That domain has no mail server — please use a real email address.",
          );
          setStatus("idle");
          return;
        }
      }
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-950/60 border border-green-200 dark:border-green-800/50 flex items-center justify-center"
        >
          <Check size={26} className="text-green-500" />
        </motion.div>
        <p className="text-slate-800 dark:text-slate-100 font-semibold">
          Message sent!
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Anuvrat will get back to you shortly. He&apos;s fast — unlike his API
          credits.
        </p>
        <button
          onClick={onBack}
          className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          ← Back to chat
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <button
          onClick={onBack}
          aria-label="Back to chat"
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <Mail size={15} className="text-indigo-500" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Send an Enquiry
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto px-4 pt-4 pb-4 flex flex-col gap-3"
      >
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Drop a message directly to Anuvrat. He responds fast — usually faster
          than this bot.
        </p>
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            Name
          </label>
          <input
            required
            minLength={2}
            maxLength={50}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Your name"
            className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-600 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            Email
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => {
              setForm((f) => ({ ...f, email: e.target.value }));
              if (emailError) setEmailError("");
            }}
            onBlur={(e) => setEmailError(validateEmail(e.target.value))}
            placeholder="your@email.com"
            className={`w-full px-3 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border ${emailError ? "border-red-400 dark:border-red-600 focus:border-red-400" : "border-slate-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-600"} text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none transition-colors`}
          />
          {emailError && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              <span>✗</span> {emailError}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            Message
          </label>
          <textarea
            required
            minLength={10}
            maxLength={1000}
            rows={4}
            value={form.message}
            onChange={(e) =>
              setForm((f) => ({ ...f, message: e.target.value }))
            }
            placeholder="Hi Anuvrat, I'd like to discuss a project..."
            className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-600 transition-colors resize-none"
          />
        </div>
        {status === "error" && (
          <p className="text-xs text-red-500">
            Something went wrong. Try the contact section instead.
          </p>
        )}
        <button
          type="submit"
          disabled={status === "sending"}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors mt-1"
        >
          {status === "sending" ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Sending…
            </>
          ) : (
            <>
              <Send size={14} /> Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// ─── Main ChatBot ─────────────────────────────────────────────────────────────

const INIT_MSG: Message = {
  id: "init",
  role: "assistant",
  content:
    "Hey! 👋 I'm AJ Bot — Anuvrat's AI assistant.\nAsk me anything about his skills, projects, experience, or whether he's worth hiring (spoiler: he is).\n\nTip: Press ⌘K (or Ctrl+K) to open/close me anytime.",
};

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("chat");
  const [messages, setMessages] = useState<Message[]>([INIT_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when chat opens
  useEffect(() => {
    if (open && view === "chat") {
      setTimeout(() => inputRef.current?.focus(), 300);
      setUnread(0);
    }
  }, [open, view]);

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

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

      const assistantId = crypto.randomUUID();

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

        // Rate limited — show random funny message
        if (res.status === 429) {
          setMessages((prev) => [
            ...prev,
            {
              id: assistantId,
              role: "assistant",
              content: getRandomRateLimitMsg(),
            },
          ]);
          if (!open) setUnread((n) => n + 1);
          setLoading(false);
          return;
        }

        if (!res.ok || !res.body) throw new Error("Bad response");

        // Seed the assistant bubble immediately (empty, streaming)
        setLoading(false);
        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: "assistant", content: "", streaming: true },
        ]);

        // ── Typewriter engine ────────────────────────────────────────────────
        // charQueue holds characters received from the stream but not yet
        // displayed. A separate interval drains the queue at CHAR_DELAY ms/char
        // so the output feels hand-typed regardless of how fast Groq delivers.
        const CHAR_DELAY = 18; // ms per character — tweak for speed
        const charQueue: string[] = [];
        let displayed = "";
        let streamDone = false;

        // Drain interval — runs independently of the fetch loop
        const drainInterval = setInterval(() => {
          if (charQueue.length === 0) {
            if (streamDone) {
              // All chars consumed, mark bubble as done
              clearInterval(drainInterval);
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, streaming: false } : m,
                ),
              );
              if (!open) setUnread((n) => n + 1);
            }
            return;
          }
          // Drain up to 3 chars per tick so it doesn't lag on long responses
          const batch = charQueue.splice(0, 3).join("");
          displayed += batch;
          const snap = displayed;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: snap, streaming: true }
                : m,
            ),
          );
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, CHAR_DELAY);

        // Read stream and push every character into the queue
        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          charQueue.push(...chunk.split(""));
        }

        streamDone = true;
        // drainInterval will clean itself up once the queue is empty
      } catch {
        setLoading(false);
        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: "assistant",
            content:
              "Connection hiccup. Check your network and try again — unlike Anuvrat's skills, my connection isn't always reliable.",
          },
        ]);
      }
    },
    [messages, loading, open],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const reset = () => {
    setMessages([INIT_MSG]);
    setInput("");
    setView("chat");
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open AJ Bot"}
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

        {/* Pulse ring */}
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-2xl border-2 border-indigo-400"
            animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        )}

        {/* Unread badge */}
        <AnimatePresence>
          {!open && unread > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
            >
              {unread}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ⌘K hint — fades in after 2s when panel is closed */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ delay: 2, duration: 0.4 }}
            className="fixed bottom-8 right-24 z-40 px-2.5 py-1 rounded-lg bg-slate-900/90 dark:bg-slate-800 text-white text-xs font-mono pointer-events-none select-none"
          >
            ⌘K
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="fixed bottom-24 right-6 z-50 w-92.5 max-w-[calc(100vw-24px)] rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col"
            style={{ height: "540px" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-linear-to-r from-indigo-600 to-violet-600 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                  <Sparkles size={15} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-tight">
                    AJ Bot
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-indigo-200 text-xs">Ask the AI</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {view === "chat" && (
                  <button
                    onClick={() => setView("enquiry")}
                    aria-label="Send enquiry"
                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white text-xs transition-colors duration-150"
                  >
                    <Mail size={13} />
                    <span>Hire</span>
                  </button>
                )}
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

            {/* View switcher */}
            <AnimatePresence mode="wait">
              {view === "enquiry" ? (
                <motion.div
                  key="enquiry"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <EnquiryForm onBack={() => setView("chat")} />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
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

                  {/* Quick suggestions — first message only */}
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

                  {/* Enquiry CTA — shown after a few messages */}
                  {messages.length >= 3 && !loading && (
                    <div className="mx-4 mb-2 shrink-0">
                      <button
                        onClick={() => setView("enquiry")}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors duration-150"
                      >
                        <Zap size={12} />
                        Interested? Send a direct enquiry
                      </button>
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
