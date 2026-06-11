"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Mail,
  Download,
  RotateCcw,
  X,
  Search,
  HelpCircle,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { KEYBOARD_SHORTCUTS } from "./constants";
import type { View } from "./types";

interface ChatHeaderProps {
  view: View;
  messageCount: number;
  isSearchOpen: boolean;
  expanded: boolean;
  isDragging: boolean;
  onEnquiry: () => void;
  onExport: () => void;
  onReset: () => void;
  onClose: () => void;
  onToggleSearch: () => void;
  onToggleExpand: () => void;
}

export function ChatHeader({
  view,
  messageCount,
  isSearchOpen,
  expanded,
  isDragging,
  onEnquiry,
  onExport,
  onReset,
  onClose,
  onToggleSearch,
  onToggleExpand,
}: ChatHeaderProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <div
      data-drag-handle
      className={`flex items-center justify-between px-4 py-3 bg-linear-to-r from-indigo-600 to-violet-600 shrink-0 relative${isDragging ? " cursor-grabbing" : " cursor-grab"}`}
    >
      {/* Brand */}
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

      {/* Actions */}
      <div className="flex items-center gap-1">
        {view === "chat" && (
          <button
            onClick={onEnquiry}
            aria-label="Send enquiry"
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white text-xs transition-colors duration-150"
          >
            <Mail size={13} />
            <span>Hire</span>
          </button>
        )}
        {view === "chat" && (
          <button
            onClick={onToggleSearch}
            aria-label="Search conversation"
            title="Search chat (⌘F)"
            className={`p-1.5 rounded-lg transition-colors duration-150 ${
              isSearchOpen
                ? "bg-white/20 text-white"
                : "hover:bg-white/15 text-white/70 hover:text-white"
            }`}
          >
            <Search size={14} />
          </button>
        )}
        {view === "chat" && messageCount > 1 && (
          <button
            onClick={onExport}
            aria-label="Export conversation"
            title="Download transcript"
            className="p-1.5 rounded-lg hover:bg-white/15 text-white/70 hover:text-white transition-colors duration-150"
          >
            <Download size={14} />
          </button>
        )}
        {/* Expand / collapse panel */}
        <button
          onClick={onToggleExpand}
          aria-label={expanded ? "Collapse chat" : "Expand chat"}
          title={expanded ? "Restore size" : "Expand chat"}
          className="p-1.5 rounded-lg hover:bg-white/15 text-white/70 hover:text-white transition-colors duration-150"
        >
          {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
        {/* Keyboard shortcuts ? button */}
        <div className="relative">
          <button
            onClick={() => setShowShortcuts((v) => !v)}
            aria-label="Keyboard shortcuts"
            title="Keyboard shortcuts"
            className={`p-1.5 rounded-lg transition-colors duration-150 ${
              showShortcuts
                ? "bg-white/20 text-white"
                : "hover:bg-white/15 text-white/70 hover:text-white"
            }`}
          >
            <HelpCircle size={14} />
          </button>

          {/* Shortcuts popover */}
          <AnimatePresence>
            {showShortcuts && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute top-full right-0 mt-2 w-52 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl z-10 overflow-hidden"
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Keyboard shortcuts
                  </p>
                </div>
                <div className="p-2 flex flex-col gap-0.5">
                  {KEYBOARD_SHORTCUTS.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-1.5 py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    >
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {s.desc}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {s.keys.map((k) => (
                          <kbd
                            key={k}
                            className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300"
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={onReset}
          aria-label="Reset chat"
          className="p-1.5 rounded-lg hover:bg-white/15 text-white/70 hover:text-white transition-colors duration-150"
        >
          <RotateCcw size={14} />
        </button>
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="p-1.5 rounded-lg hover:bg-white/15 text-white/70 hover:text-white transition-colors duration-150"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
