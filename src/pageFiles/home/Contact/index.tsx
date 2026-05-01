"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Send, Mail, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import { LinkedinIcon } from "@/common/components/ui/LinkedinIcon";
import { GithubIcon } from "@/common/components/ui/GithubIcon";
import { SectionHeading } from "@/common/components/sections/SectionHeading";
import { FadeIn } from "@/common/components/animations/FadeIn";
import { contactSchema, type ContactFormData } from "@/common/schema/schema";
import { PERSONAL } from "@/common/constants/data";

type FormStatus = "idle" | "loading" | "success" | "error";

export function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(
          json?.error ?? "Something went wrong. Please try again.",
        );
      }
      setStatus("success");
      reset();
      setTimeout(() => setStatus("idle"), 6000);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Failed to send. Please try again.",
      );
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="py-24 lg:py-32 bg-slate-50 dark:bg-slate-950"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          label="Get In Touch"
          title="Let's Build Something Great"
          subtitle="Open to senior engineering roles, freelance projects, and technical collaborations."
        />

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Left: Info */}
          <FadeIn direction="left">
            <div className="space-y-8">
              <div>
                <h3 className="text-slate-900 dark:text-white font-semibold text-xl mb-3">
                  Why work with me?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  I bring 3+ years of production MERN stack experience,
                  AI-enhanced development workflows, and a senior
                  engineer&apos;s approach to architecture and mentorship.
                  Let&apos;s discuss how I can help you ship faster and better.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: Mail,
                    label: "Email",
                    value: PERSONAL.email,
                    href: `mailto:${PERSONAL.email}`,
                  },
                  {
                    icon: MapPin,
                    label: "Location",
                    value: PERSONAL.location,
                    href: null,
                  },
                  {
                    icon: LinkedinIcon,
                    label: "LinkedIn",
                    value: "linkedin.com/in/anuvrat-joshi",
                    href: PERSONAL.linkedin,
                  },
                  {
                    icon: GithubIcon,
                    label: "GitHub",
                    value: "github.com/Anuvratjoshi",
                    href: PERSONAL.github,
                  },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/60 flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 uppercase tracking-wider">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          target={
                            href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm transition-colors"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-slate-700 dark:text-slate-300 text-sm">
                          {value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Right: Form */}
          <FadeIn direction="right">
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  {...register("name")}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-600/60 focus:ring-1 focus:ring-indigo-500/40 dark:focus:ring-indigo-600/40 transition-colors duration-200"
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-600/60 focus:ring-1 focus:ring-indigo-500/40 dark:focus:ring-indigo-600/40 transition-colors duration-200"
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register("message")}
                  placeholder="Tell me about your project or opportunity..."
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-600/60 focus:ring-1 focus:ring-indigo-500/40 dark:focus:ring-indigo-600/40 transition-colors duration-200 resize-none"
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Status feedback */}
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-950/50 border border-emerald-800/50 text-emerald-400 text-sm"
                >
                  <CheckCircle2 size={16} className="shrink-0" />
                  Message sent! I&apos;ll reply within 24–48 hours. Check your
                  inbox for a confirmation.
                </motion.div>
              )}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-950/50 border border-red-800/50 text-red-400 text-sm"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  {errorMsg}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={status === "loading" || status === "success"}
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg shadow-indigo-900/30"
              >
                {status === "loading" ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Sending...
                  </>
                ) : status === "success" ? (
                  <>
                    <CheckCircle2 size={16} />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
