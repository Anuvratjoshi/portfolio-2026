"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bot, X } from "lucide-react";
import { useChatBot } from "./useChatBot";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { EnquiryForm } from "./EnquiryForm";
import { ToastContainer } from "./Toast";
import { INITIAL_SUGGESTIONS } from "./constants";

export function ChatBot() {
  const {
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
    bottomRef,
    inputRef,
    scrollContainerRef,
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
    lastBotMsg,
    charCount,
  } = useChatBot();

  return (
    <>
      <ToastContainer />

      {/* ─── FAB ─────────────────────────────────────────────────────────── */}
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
        {/* Gradient face */}
        <span className="absolute inset-0 rounded-2xl bg-linear-to-br from-indigo-500 via-violet-500 to-purple-600 shadow-lg shadow-indigo-700/50" />
        {/* Shine sweep */}
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
        {/* Unread badge */}
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

      {/* ─── First-visit hint bubble ──────────────────────────────────────── */}
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
              <span className="absolute -right-1.75 top-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[7px] border-l-white dark:border-l-slate-800" />
              <span
                className="-right-2 top-1/2 absolute w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-8 border-l-slate-200 dark:border-l-slate-700"
                style={{ zIndex: -1 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⌘K hint pill */}
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

      {/* ─── Chat panel ───────────────────────────────────────────────────── */}
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
            <ChatHeader
              view={view}
              messageCount={messages.length}
              isSearchOpen={isSearchOpen}
              onEnquiry={() => setView("enquiry")}
              onExport={exportChat}
              onReset={reset}
              onClose={() => setOpen(false)}
              onToggleSearch={() => {
                setIsSearchOpen((v) => !v);
                if (isSearchOpen) setSearchQuery("");
              }}
            />

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
                  <ChatMessages
                    ref={scrollContainerRef}
                    messages={messages}
                    loading={loading}
                    streaming={streaming}
                    isAtBottom={isAtBottom}
                    lastBotMsgId={lastBotMsg?.id}
                    msgFollowUps={msgFollowUps}
                    searchQuery={searchQuery}
                    isSearchOpen={isSearchOpen}
                    searchMatchIndex={searchMatchIndex}
                    searchMatchCount={searchMatches.length}
                    activeMatchId={
                      searchMatchIndex >= 0
                        ? searchMatches[searchMatchIndex]
                        : undefined
                    }
                    onSearchChange={setSearchQuery}
                    onCloseSearch={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                    onSearchNavigate={navigateSearchMatch}
                    onReact={handleReact}
                    onBookmark={handleBookmark}
                    onFollowUp={sendMessage}
                    onRetry={handleRetry}
                    onScrollToBottom={scrollToBottom}
                    onScroll={handleScroll}
                    bottomRef={bottomRef}
                  />

                  {/* Initial suggestion chips */}
                  {messages.length === 1 && !loading && !streaming && (
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

                  {/* Input */}
                  <ChatInput
                    ref={inputRef}
                    input={input}
                    loading={loading}
                    streaming={streaming}
                    charCount={charCount}
                    onInputChange={setInput}
                    onKeyDown={handleKeyDown}
                    onSubmit={handleSubmit}
                    onStop={stopStreaming}
                    onSendMessage={sendMessage}
                    showEnquiryCta={
                      messages.length >= 5 && !loading && !streaming
                    }
                    onEnquiryCta={() => setView("enquiry")}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
