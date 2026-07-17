"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import type { Message, View } from "./types";
import {
  LS_KEY,
  SESSION_ID_KEY,
  INIT_MSG,
  getRandomRateLimitMsg,
} from "./constants";
import { loadMessages, saveMessages, formatTime } from "./storage";
import { toast } from "./Toast";

export function useChatBot() {
  // ─── State ─────────────────────────────────────────────────────────────────
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("chat");
  const [messages, setMessages] = useState<Message[]>([INIT_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [unread, setUnread] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [msgFollowUps, setMsgFollowUps] = useState<Record<string, string[]>>(
    {},
  );
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMatchIndex, setSearchMatchIndex] = useState(-1);

  // ─── Search matches ──────────────────────────────────────────────────────
  const searchMatches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return messages
      .filter((m) => m.content.toLowerCase().includes(q))
      .map((m) => m.id);
  }, [messages, searchQuery]);

  // Reset match index when query changes
  useEffect(() => {
    setSearchMatchIndex(-1);
  }, [searchQuery]);

  // ─── Refs ──────────────────────────────────────────────────────────────────
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  // ─── Init: load persisted messages ────────────────────────────────────────
  useEffect(() => {
    const saved = loadMessages();
    if (saved.length > 0)
      setMessages([{ ...INIT_MSG, timestamp: Date.now() }, ...saved]);
    setHydrated(true);
  }, []);

  // ─── First-visit hint bubble ───────────────────────────────────────────────
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

  // ─── Persist messages ──────────────────────────────────────────────────────
  useEffect(() => {
    if (hydrated) saveMessages(messages);
  }, [messages, hydrated]);

  // ─── Smart auto-scroll ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAtBottomRef.current) return;
    const isStreamingNow = messages.some((m) => m.streaming);
    bottomRef.current?.scrollIntoView({
      behavior: isStreamingNow ? "instant" : "smooth",
    });
  }, [messages, loading]);

  // ─── Auto-resize textarea ──────────────────────────────────────────────────
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 100) + "px";
  }, [input]);

  // ─── Focus input when chat opens ──────────────────────────────────────────
  useEffect(() => {
    if (open && view === "chat") {
      setTimeout(() => inputRef.current?.focus(), 300);
      setUnread(0);
    }
  }, [open, view]);

  // ─── ⌘K / Ctrl+K to open/close ────────────────────────────────────────────
  const dismissHint = useCallback(() => {
    setShowHint(false);
    try {
      localStorage.setItem("aj_bot_hint_seen", "1");
    } catch {}
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        dismissHint();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "f" && open) {
        e.preventDefault();
        setIsSearchOpen((v) => !v);
        if (!isSearchOpen) setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [dismissHint, open, isSearchOpen]);

  // ─── Scroll handling ───────────────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    const at = dist < 80;
    isAtBottomRef.current = at;
    setIsAtBottom(at);
  }, []);

  const scrollToBottom = useCallback(() => {
    isAtBottomRef.current = true;
    setIsAtBottom(true);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // ─── Search navigation ─────────────────────────────────────────────────────
  const navigateSearchMatch = useCallback(() => {
    if (searchMatches.length === 0) return;
    const nextIndex = (searchMatchIndex + 1) % searchMatches.length;
    setSearchMatchIndex(nextIndex);
    const id = searchMatches[nextIndex];
    const el = document.getElementById(`msg-${id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [searchMatches, searchMatchIndex]);

  // ─── Reactions ─────────────────────────────────────────────────────────────
  const handleReact = useCallback((id: string, reaction: "up" | "down") => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, reaction } : m)),
    );
  }, []);

  // ─── Bookmarking ───────────────────────────────────────────────────────────
  const handleBookmark = useCallback((id: string) => {
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;

    const next = !msg.bookmarked;
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, bookmarked: next } : m)),
    );
    toast(next ? "Message saved!" : "Bookmark removed");
  }, [messages]);

  // ─── Export ────────────────────────────────────────────────────────────────
  const exportChat = useCallback(() => {
    const lines = messages
      .filter((m) => m.id !== "init")
      .map(
        (m) =>
          `[${formatTime(m.timestamp)}] ${m.role === "user" ? "You" : "AJ Bot"}:\n${m.content}`,
      )
      .join("\n\n---\n\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aj-bot-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("Transcript downloaded!");
  }, [messages]);

  // ─── Stop streaming ────────────────────────────────────────────────────────
  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  // ─── Send message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading || streaming) return;

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
      isAtBottomRef.current = true;
      setIsAtBottom(true);

      const assistantId = crypto.randomUUID();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
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
        setStreaming(true);
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

        // ── Adaptive typewriter engine ─────────────────────────────────────
        const BASE_DELAY = 18;
        const charQueue: string[] = [];
        let displayed = "";
        let streamDone = false;
        let aborted = false;

        const drainInterval = setInterval(() => {
          if (charQueue.length === 0) {
            if (streamDone || aborted) {
              clearInterval(drainInterval);
              setStreaming(false);
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, streaming: false } : m,
                ),
              );
              if (!open) setUnread((n) => n + 1);
              if (!aborted) {
                const sid = localStorage.getItem(SESSION_ID_KEY) ?? "";
                fetch("/api/chat/followups", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    sessionId: sid,
                    responseText: displayed.slice(0, 800),
                  }),
                })
                  .then((r) => (r.ok ? r.json() : null))
                  .then(
                    (
                      data: {
                        questions: { id: string; text: string }[];
                      } | null,
                    ) => {
                      if (data?.questions?.length) {
                        setMsgFollowUps((prev) => ({
                          ...prev,
                          [assistantId]: data.questions.map((q) => q.text),
                        }));
                      }
                    },
                  )
                  .catch(() => {});
              }
            }
            return;
          }
          const batchSize =
            charQueue.length > 60 ? 4 : charQueue.length > 20 ? 2 : 1;
          const batch = charQueue.splice(0, batchSize).join("");
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
        }, BASE_DELAY);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            charQueue.push(
              ...decoder.decode(value, { stream: true }).split(""),
            );
          }
        } catch (readErr: unknown) {
          if ((readErr as { name?: string })?.name === "AbortError") {
            aborted = true;
          }
        }
        streamDone = true;
      } catch (err: unknown) {
        const isAbort = (err as { name?: string })?.name === "AbortError";
        setLoading(false);
        setStreaming(false);
        if (!isAbort) {
          setMessages((prev) => [
            ...prev,
            {
              id: assistantId,
              role: "assistant",
              content:
                "Connection hiccup. Check your network and try again - unlike Anuvrat's skills, my connection isn't always reliable.",
              timestamp: Date.now(),
              error: true,
              failedInput: trimmed,
            },
          ]);
        }
      }
    },
    [messages, loading, streaming, open],
  );

  // ─── Retry ─────────────────────────────────────────────────────────────────
  const handleRetry = useCallback(
    (errorMsgId: string, failedInput: string) => {
      setMessages((prev) => prev.filter((m) => m.id !== errorMsgId));
      sendMessage(failedInput);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sendMessage],
  );

  // ─── Keyboard handler for textarea ────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Escape") {
        if (isSearchOpen) {
          setIsSearchOpen(false);
          setSearchQuery("");
        } else {
          setOpen(false);
        }
        return;
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (input.trim() && !loading && !streaming) sendMessage(input);
      }
      if (e.key === "ArrowUp" && !input.trim()) {
        const lastUser = [...messages].reverse().find((m) => m.role === "user");
        if (lastUser) setInput(lastUser.content);
      }
    },
    [input, loading, streaming, messages, sendMessage, isSearchOpen],
  );

  // ─── Form submit ───────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(input);
    },
    [input, sendMessage],
  );

  // ─── Reset ─────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setMessages([{ ...INIT_MSG, timestamp: Date.now() }]);
    setInput("");
    setView("chat");
    setIsSearchOpen(false);
    setSearchQuery("");
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
  }, []);

  // ─── Derived ───────────────────────────────────────────────────────────────
  const lastBotMsg = [...messages]
    .reverse()
    .find((m) => m.role === "assistant" && !m.streaming);
  const charCount = input.length;

  return {
    // State
    open,
    setOpen,
    view,
    setView,
    messages,
    input,
    setInput,
    loading,
    streaming,
    unread,
    showHint,
    msgFollowUps,
    isAtBottom,
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    searchMatches,
    searchMatchIndex,
    navigateSearchMatch,
    // Refs
    bottomRef,
    inputRef,
    scrollContainerRef,
    // Callbacks
    sendMessage,
    handleReact,
    handleBookmark,
    handleScroll,
    scrollToBottom,
    exportChat,
    stopStreaming,
    handleRetry,
    handleKeyDown,
    handleSubmit,
    reset,
    dismissHint,
    // Derived
    lastBotMsg,
    charCount,
  };
}
