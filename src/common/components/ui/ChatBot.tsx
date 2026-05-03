"use client";

import { useState, useRef, useEffect, useCallback, memo, useMemo } from "react";
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
  Dice5,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
  timestamp: number;
  reaction?: "up" | "down";
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
];

function getRandomRateLimitMsg() {
  return RATE_LIMIT_MSGS[Math.floor(Math.random() * RATE_LIMIT_MSGS.length)];
}

// ─── Feeling Lucky questions ──────────────────────────────────────────────────

const LUCKY_QUESTIONS = [
  "What's the most complex problem Anuvrat has solved?",
  "What makes Anuvrat different from other full stack developers?",
  "Tell me about TARDIS — what was the hardest part?",
  "What AI tools does Anuvrat use in his workflow?",
  "How did Anuvrat reduce system latency by 30%?",
  "What npm packages has Anuvrat published?",
  "How does Anuvrat handle high-concurrency systems?",
  "What's Anuvrat's approach to code architecture?",
  "Where is Anuvrat currently working?",
  "What's the story behind error-intelligence-layer?",
  "Is Anuvrat open to freelance or remote work?",
  "What's Anuvrat's strongest technical skill?",
  "How does Anuvrat use AI in his daily development?",
  "What's Anuvrat's experience with Azure?",
  "Why should I hire Anuvrat over anyone else?",
  "Can Anuvrat handle both frontend and backend equally well?",
  "What's special about the ANTAYOGA project?",
  "How quickly can Anuvrat get up to speed on a new codebase?",
];

function getRandomLuckyQuestion() {
  return LUCKY_QUESTIONS[Math.floor(Math.random() * LUCKY_QUESTIONS.length)];
}

// ─── Follow-up chip engine ────────────────────────────────────────────────────

const FOLLOWUPS: Array<{ keywords: string[]; questions: string[] }> = [
  {
    keywords: [
      "tardis",
      "pipeline",
      "servicenow",
      "cron",
      "azure",
      "ingestion",
    ],
    questions: [
      "How did he handle high data volumes?",
      "What was the RBAC setup like?",
      "How did caching help performance?",
    ],
  },
  {
    keywords: ["diibs", "auction", "bidding", "redux", "concurrency"],
    questions: [
      "How did he prevent race conditions?",
      "What was the role-based UI like?",
      "How was real-time state managed?",
    ],
  },
  {
    keywords: [
      "antayoga",
      "mental health",
      "conditional",
      "scoring",
      "assessment",
    ],
    questions: [
      "How did the branching logic work?",
      "What privacy measures were in place?",
      "How did he improve user retention?",
    ],
  },
  {
    keywords: [
      "npm",
      "error-intelligence",
      "type-bridge",
      "package",
      "library",
    ],
    questions: [
      "How does error-intelligence-layer work?",
      "What problem does type-bridge solve?",
      "Are these packages production-ready?",
    ],
  },
  {
    keywords: [
      "skill",
      "stack",
      "technology",
      "tech",
      "language",
      "framework",
      "typescript",
      "react",
      "node",
    ],
    questions: [
      "Which skill is his strongest?",
      "Does he know GraphQL?",
      "What databases has he worked with?",
    ],
  },
  {
    keywords: [
      "ai",
      "copilot",
      "groq",
      "claude",
      "cursor",
      "workflow",
      "prompt",
    ],
    questions: [
      "How does he use AI in daily dev?",
      "Does he use AI for code reviews?",
      "What's his prompt engineering approach?",
    ],
  },
  {
    keywords: [
      "hire",
      "available",
      "job",
      "opportunity",
      "work",
      "salary",
      "contact",
    ],
    questions: [
      "How can I contact Anuvrat?",
      "Is he open to remote work?",
      "What roles is he looking for?",
    ],
  },
  {
    keywords: ["experience", "year", "company", "incipient", "acs", "senior"],
    questions: [
      "What did he do at his current role?",
      "How did he improve delivery timelines?",
      "Has he mentored other developers?",
    ],
  },
];

function getFollowUps(content: string): string[] {
  const lower = content.toLowerCase();
  for (const entry of FOLLOWUPS) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      const shuffled = [...entry.questions].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 2);
    }
  }
  return ["What else can you tell me?", "Is he available for hire?"];
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

const LS_KEY = "aj_bot_messages";
const SESSION_ID_KEY = "aj_chat_session";

function loadMessages(): Message[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed: Message[] = JSON.parse(raw);
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    return parsed.filter(
      (m) => m.id !== "init" && m.timestamp > cutoff && !m.streaming,
    );
  } catch {
    return [];
  }
}

function saveMessages(msgs: Message[]) {
  try {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify(msgs.filter((m) => !m.streaming)),
    );
  } catch {}
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

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
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 shrink-0"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
}

interface MessageBubbleProps {
  msg: Message;
  onReact: (id: string, r: "up" | "down") => void;
  followUps: string[];
  onFollowUp: (q: string) => void;
  isLast: boolean;
}

const MessageBubble = memo(function MessageBubble({
  msg,
  onReact,
  followUps,
  onFollowUp,
  isLast,
}: MessageBubbleProps) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
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
            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap wrap-break-word ${
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
          {/* Timestamp */}
          <span
            className={`text-[10px] text-slate-400 dark:text-slate-600 px-1 ${isUser ? "text-right" : "text-left"}`}
          >
            {formatTime(msg.timestamp)}
          </span>
        </div>
        {!isUser && !msg.streaming && <CopyButton text={msg.content} />}
      </div>

      {/* Reactions + follow-up chips — only on last bot message */}
      <AnimatePresence>
        {!isUser && !msg.streaming && isLast && (
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
        className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4 pb-4 flex flex-col gap-3"
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
            className={`w-full px-3 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border ${emailError ? "border-red-400 dark:border-red-600" : "border-slate-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-600"} text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none transition-colors`}
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
  timestamp: Date.now(),
};

const INITIAL_SUGGESTIONS = [
  "What's his tech stack?",
  "Tell me about TARDIS",
  "Is he available for hire?",
  "What npm packages did he build?",
];

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("chat");
  const [messages, setMessages] = useState<Message[]>([INIT_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load persisted messages on mount
  useEffect(() => {
    const saved = loadMessages();
    if (saved.length > 0)
      setMessages([{ ...INIT_MSG, timestamp: Date.now() }, ...saved]);
    setHydrated(true);
  }, []);

  // First-visit hint bubble — show once, auto-dismiss after 6s
  useEffect(() => {
    const HINT_KEY = "aj_bot_hint_seen";
    if (typeof localStorage === "undefined") return;
    if (localStorage.getItem(HINT_KEY)) return;
    const show = setTimeout(() => setShowHint(true), 2200);
    const hide = setTimeout(() => {
      setShowHint(false);
      localStorage.setItem(HINT_KEY, "1");
    }, 8200);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  // Persist whenever messages change
  useEffect(() => {
    if (hydrated) saveMessages(messages);
  }, [messages, hydrated]);

  useEffect(() => {
    const isStreaming = messages.some((m) => m.streaming);
    bottomRef.current?.scrollIntoView({
      behavior: isStreaming ? "instant" : "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    if (open && view === "chat") {
      setTimeout(() => inputRef.current?.focus(), 300);
      setUnread(0);
    }
  }, [open, view]);

  const dismissHint = useCallback(() => {
    setShowHint(false);
    try {
      localStorage.setItem("aj_bot_hint_seen", "1");
    } catch {}
  }, []);

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        dismissHint();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [dismissHint]);

  const handleReact = useCallback((id: string, reaction: "up" | "down") => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, reaction } : m)),
    );
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
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
            sessionId: (() => {
              try {
                let sid = localStorage.getItem(SESSION_ID_KEY);
                if (!sid) {
                  sid = crypto.randomUUID();
                  localStorage.setItem(SESSION_ID_KEY, sid);
                }
                return sid;
              } catch {
                return crypto.randomUUID();
              }
            })(),
            message: trimmed,
            visitorId: (() => {
              try {
                return localStorage.getItem("aj_visitor_id") ?? "anonymous";
              } catch {
                return "anonymous";
              }
            })(),
          }),
        });

        if (res.status === 429) {
          setMessages((prev) => [
            ...prev,
            {
              id: assistantId,
              role: "assistant",
              content: getRandomRateLimitMsg(),
              timestamp: Date.now(),
            },
          ]);
          if (!open) setUnread((n) => n + 1);
          setLoading(false);
          return;
        }

        if (!res.ok || !res.body) throw new Error("Bad response");

        const startTs = Date.now();
        setLoading(false);
        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: "assistant",
            content: "",
            streaming: true,
            timestamp: startTs,
          },
        ]);

        // Typewriter engine
        const CHAR_DELAY = 18;
        const charQueue: string[] = [];
        let displayed = "";
        let streamDone = false;

        const drainInterval = setInterval(() => {
          if (charQueue.length === 0) {
            if (streamDone) {
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

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          charQueue.push(...decoder.decode(value, { stream: true }).split(""));
        }
        streamDone = true;
      } catch {
        setLoading(false);
        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: "assistant",
            content:
              "Connection hiccup. Check your network and try again — unlike Anuvrat's skills, my connection isn't always reliable.",
            timestamp: Date.now(),
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
    setMessages([{ ...INIT_MSG, timestamp: Date.now() }]);
    setInput("");
    setView("chat");
    try {
      const sid = localStorage.getItem(SESSION_ID_KEY);
      if (sid) {
        localStorage.removeItem(SESSION_ID_KEY);
        fetch("/api/chat/session", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sid }),
        }).catch(() => {});
      }
      localStorage.removeItem(LS_KEY);
    } catch {}
  };

  const lastBotMsg = [...messages]
    .reverse()
    .find((m) => m.role === "assistant" && !m.streaming);
  const followUps = useMemo(
    () =>
      lastBotMsg && messages.length > 1 ? getFollowUps(lastBotMsg.content) : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lastBotMsg?.id],
  );
  const charCount = input.length;

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => {
          setOpen((v) => !v);
          dismissHint();
        }}
        aria-label={open ? "Close chat" : "Open AJ Bot"}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ isolation: "isolate" }}
      >
        {/* Glow layer */}
        <span className="absolute inset-0 rounded-2xl bg-linear-to-br from-indigo-500 via-violet-500 to-purple-600 blur-md opacity-70 scale-110" />
        {/* Main gradient face */}
        <span className="absolute inset-0 rounded-2xl bg-linear-to-br from-indigo-500 via-violet-500 to-purple-600 shadow-lg shadow-indigo-700/50" />
        {/* Shine sweep — animated */}
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-2xl overflow-hidden"
            aria-hidden
          >
            <motion.span
              className="absolute top-0 h-full w-1/2 skew-x-[-20deg]"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)",
              }}
              animate={{ left: ["-100%", "200%"] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                repeatDelay: 2.2,
                ease: "easeInOut",
              }}
            />
          </motion.span>
        )}
        {/* Pulse ring */}
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-2xl border-2 border-violet-400"
            animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        {/* Icon */}
        <span className="relative z-10">
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
                <Bot size={22} className="text-white drop-shadow-sm" />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        <AnimatePresence>
          {!open && unread > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center z-20"
            >
              {unread}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* First-visit hint bubble */}
      <AnimatePresence>
        {showHint && !open && (
          <motion.div
            key="hint-bubble"
            initial={{ opacity: 0, scale: 0.85, x: 12 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, x: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="fixed bottom-6 right-22 z-50"
          >
            {/* Bubble */}
            <div
              className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 max-w-50"
              style={{
                boxShadow:
                  "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.08)",
              }}
            >
              <button
                onClick={dismissHint}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-300 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors text-[10px] font-bold"
                aria-label="Dismiss"
              >
                ✕
              </button>
              <p className="text-slate-800 dark:text-white font-semibold text-xs leading-snug">
                👋 Ask me anything!
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 leading-snug">
                I know everything about Anuvrat.
              </p>
              {/* Arrow pointing right toward FAB */}
              <span className="absolute -right-1.75 top-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[7px] border-l-white dark:border-l-slate-800" />
              <span
                className="-right-2 top-1/2 absolute w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-8 border-l-slate-200 dark:border-l-slate-700"
                style={{ zIndex: -1 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⌘K hint */}
      <AnimatePresence>
        {!open && !showHint && (
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
                    {messages.map((msg) => {
                      const isLastBot =
                        msg.role === "assistant" && msg.id === lastBotMsg?.id;
                      return (
                        <MessageBubble
                          key={msg.id}
                          msg={msg}
                          onReact={handleReact}
                          followUps={isLastBot ? followUps : []}
                          onFollowUp={sendMessage}
                          isLast={isLastBot}
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
                    <div ref={bottomRef} />
                  </div>

                  {/* Initial suggestion chips */}
                  {messages.length === 1 && !loading && (
                    <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                      {INITIAL_SUGGESTIONS.map((s) => (
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

                  {/* Enquiry CTA after 5+ messages */}
                  {messages.length >= 5 && !loading && (
                    <div className="mx-4 mb-2 shrink-0">
                      <button
                        onClick={() => setView("enquiry")}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors duration-150"
                      >
                        <Zap size={12} /> Interested? Send a direct enquiry
                      </button>
                    </div>
                  )}

                  {/* Input area */}
                  <div className="border-t border-slate-100 dark:border-slate-800 shrink-0">
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
                    <form
                      onSubmit={handleSubmit}
                      className="flex items-center gap-2 px-3 py-3 pt-1.5"
                    >
                      {/* Feeling Lucky */}
                      <button
                        type="button"
                        onClick={() => sendMessage(getRandomLuckyQuestion())}
                        disabled={loading}
                        aria-label="Ask a random question about Anuvrat"
                        title="Ask a random question about Anuvrat"
                        className="flex items-center gap-1.5 px-2.5 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600 dark:hover:bg-violet-950/50 dark:hover:text-violet-300 disabled:opacity-40 transition-colors duration-150 shrink-0"
                      >
                        <Dice5 size={13} />
                        <span className="text-xs font-medium whitespace-nowrap">
                          Random Q
                        </span>
                      </button>
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
                        className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-150 shrink-0"
                      >
                        <Send size={14} className="text-white" />
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
