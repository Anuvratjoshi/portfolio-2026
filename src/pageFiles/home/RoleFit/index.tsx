"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Code2,
  Gauge,
  Layers3,
  ServerCog,
  Users,
} from "lucide-react";
import { SectionHeading } from "@/common/components/sections/SectionHeading";
import { FadeIn } from "@/common/components/animations/FadeIn";
import { PERSONAL } from "@/common/constants/data";

const ROLE_FITS = [
  {
    id: "full-stack",
    label: "Full Stack",
    title: "End-to-end product delivery",
    icon: Layers3,
    accent: "text-sky-500",
    dot: "bg-sky-500",
    bg: "bg-sky-50 dark:bg-sky-950/30",
    border: "border-sky-200 dark:border-sky-900/50",
    summary:
      "Best fit for teams that need one engineer to own features across React, Node.js, APIs, data modeling, and production polish.",
    proof: [
      "Delivered scalable MERN modules across enterprise and SaaS-style products.",
      "Built role-based interfaces, REST integrations, and data-heavy dashboards.",
      "Comfortable moving from architecture decisions to UI details without losing context.",
    ],
    evidence: "React, Next.js, Node.js, Express.js, MongoDB, TypeScript",
  },
  {
    id: "backend",
    label: "Backend/API",
    title: "Scalable systems and data workflows",
    icon: ServerCog,
    accent: "text-emerald-500",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-900/50",
    summary:
      "Strong match for API-heavy work, integrations, database optimization, and backend systems that need reliability under real load.",
    proof: [
      "Optimized MongoDB queries and caching paths for high-volume production data.",
      "Integrated Azure Event Grid, Logic Apps, Blob Storage, cron jobs, and external services.",
      "Built secure APIs with auth, RBAC, validation, and operational guardrails.",
    ],
    evidence: "Node.js, Express.js, MongoDB, Redis, Azure, REST APIs",
  },
  {
    id: "ai",
    label: "AI Product",
    title: "Practical AI inside real products",
    icon: BrainCircuit,
    accent: "text-violet-500",
    dot: "bg-violet-500",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    border: "border-violet-200 dark:border-violet-900/50",
    summary:
      "Useful for teams adding AI features that need product sense, retrieval strategy, prompt design, streaming UX, and cost-aware backend controls.",
    proof: [
      "Built in-house RAG and function-calling assistants without third-party chatbot SDKs.",
      "Added token budgeting, prompt-injection defenses, and static fallbacks for quota control.",
      "Designed AI workflows for documentation, error intelligence, and recruiter engagement.",
    ],
    evidence: "RAG, Groq, Azure OpenAI, SSE streaming, prompt engineering",
  },
  {
    id: "leadership",
    label: "Tech Lead",
    title: "Mentorship with delivery discipline",
    icon: Users,
    accent: "text-amber-500",
    dot: "bg-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-900/50",
    summary:
      "A good fit where the role needs code ownership, junior mentoring, review discipline, and pragmatic architecture decisions.",
    proof: [
      "Mentored junior developers and improved team code quality through reviews.",
      "Led architectural enhancements that reduced latency and improved delivery timelines.",
      "Balances shipping speed with maintainability, security, and clear handoff paths.",
    ],
    evidence: "Architecture, code reviews, mentoring, delivery ownership",
  },
];

const METRICS = [
  { label: "Latency improvement", value: "30%", icon: Gauge },
  { label: "Delivery lift", value: "20%", icon: ArrowRight },
  { label: "Frontend speed-up", value: "25%", icon: Code2 },
  { label: "AI workflow depth", value: "5+", icon: Bot },
];

export function RoleFit() {
  const [selectedId, setSelectedId] = useState(ROLE_FITS[0].id);
  const selected = useMemo(
    () => ROLE_FITS.find((fit) => fit.id === selectedId) ?? ROLE_FITS[0],
    [selectedId],
  );
  const SelectedIcon = selected.icon;

  return (
    <section
      id="role-fit"
      className="py-24 lg:py-32 bg-white dark:bg-linear-to-b dark:from-slate-950 dark:to-slate-900"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          label="Role Fit"
          title="Find the Fastest Match"
          subtitle="A quick recruiter-friendly view of where my experience creates the strongest signal."
        />

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6 items-stretch">
          <FadeIn direction="left" className="space-y-3">
            {ROLE_FITS.map((fit) => {
              const Icon = fit.icon;
              const isActive = selected.id === fit.id;

              return (
                <button
                  key={fit.id}
                  type="button"
                  onClick={() => setSelectedId(fit.id)}
                  aria-pressed={isActive}
                  className={`w-full flex items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
                    isActive
                      ? `${fit.bg} ${fit.border} shadow-sm`
                      : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${fit.bg} ${fit.border}`}
                    >
                      <Icon size={18} className={fit.accent} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                        {fit.label}
                      </span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400">
                        {fit.title}
                      </span>
                    </span>
                  </span>
                  <ArrowRight
                    size={16}
                    className={`shrink-0 transition-transform duration-200 ${
                      isActive
                        ? `${fit.accent} translate-x-0.5`
                        : "text-slate-400"
                    }`}
                  />
                </button>
              );
            })}
          </FadeIn>

          <FadeIn direction="right">
            <div className="h-full rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60 p-6 lg:p-8 shadow-sm dark:shadow-none overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="h-full flex flex-col"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Selected Track
                      </p>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {selected.title}
                      </h3>
                    </div>
                    <div
                      className={`h-12 w-12 rounded-xl border ${selected.bg} ${selected.border} flex items-center justify-center`}
                    >
                      <SelectedIcon size={20} className={selected.accent} />
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {selected.summary}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    {METRICS.map(({ label, value, icon: Icon }) => (
                      <div
                        key={label}
                        className="rounded-xl bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/70 p-4"
                      >
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-2">
                          <Icon size={14} className="text-slate-400" />
                          {label}
                        </div>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 mb-6">
                    {selected.proof.map((point) => (
                      <div key={point} className="flex items-start gap-3">
                        <span
                          className={`mt-2 h-1.5 w-1.5 rounded-full shrink-0 ${selected.dot}`}
                        />
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800/70 pt-5">
                    <p className="max-w-xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Evidence:
                      </span>{" "}
                      {selected.evidence}
                    </p>
                    <a
                      href={`mailto:${PERSONAL.email}?subject=${encodeURIComponent(
                        `${selected.label} opportunity`,
                      )}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white px-4 py-2.5 text-sm font-semibold text-white dark:text-slate-950 hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors"
                    >
                      Discuss Fit
                      <ArrowRight size={15} />
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
