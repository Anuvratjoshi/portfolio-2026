"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Mail, Loader2, Send, Check } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function EnquiryForm({ onBack }: { onBack: () => void }) {
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
            "That domain has no mail server - please use a real email address.",
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
          Anuvrat will get back to you shortly. He&apos;s fast - unlike his API
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
          Drop a message directly to Anuvrat. He responds fast - usually faster
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
