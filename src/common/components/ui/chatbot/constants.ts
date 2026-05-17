import type { Message } from "./types";

// ─── Storage keys ─────────────────────────────────────────────────────────────
export const LS_KEY = "aj_bot_messages";
export const SESSION_ID_KEY = "aj_chat_session";

// ─── Rate-limit funny responses ───────────────────────────────────────────────
export const RATE_LIMIT_MSGS = [
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

export function getRandomRateLimitMsg() {
  return RATE_LIMIT_MSGS[Math.floor(Math.random() * RATE_LIMIT_MSGS.length)];
}

// ─── Feeling Lucky questions ──────────────────────────────────────────────────
export const LUCKY_QUESTIONS = [
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
  "Tell me about RentEase — what problem does it solve?",
  "What is RentEase and why is Anuvrat building it?",
  "Is Anuvrat building his own startup?",
];

export function getRandomLuckyQuestion() {
  return LUCKY_QUESTIONS[Math.floor(Math.random() * LUCKY_QUESTIONS.length)];
}

// ─── Initial state ────────────────────────────────────────────────────────────
export const INIT_MSG: Message = {
  id: "init",
  role: "assistant",
  content:
    "Hey! 👋 I'm AJ Bot — Anuvrat's AI assistant.\nAsk me anything about his skills, projects, experience, or whether he's worth hiring (spoiler: he is).\n\nTip: Press ⌘K (or Ctrl+K) to open/close me anytime.",
  timestamp: Date.now(),
};

export const INITIAL_SUGGESTIONS = [
  "What's his tech stack?",
  "Tell me about TARDIS",
  "Is he available for hire?",
  "What npm packages did he build?",
];

// ─── Keyboard shortcuts (shown in ? panel) ────────────────────────────────────
export const KEYBOARD_SHORTCUTS = [
  { keys: ["⌘", "K"], desc: "Open / close chat" },
  { keys: ["Enter"], desc: "Send message" },
  { keys: ["Shift", "↵"], desc: "New line in input" },
  { keys: ["↑"], desc: "Recall last message" },
  { keys: ["⌘", "F"], desc: "Search conversation" },
  { keys: ["Esc"], desc: "Close search / chat" },
] as const;
