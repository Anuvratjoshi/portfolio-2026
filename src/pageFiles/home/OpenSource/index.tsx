"use client";

import { motion } from "framer-motion";
import {
  ExternalLink,
  Package,
  GitFork,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { SectionHeading } from "@/common/components/sections/SectionHeading";
import {
  StaggerContainer,
  staggerItem,
} from "@/common/components/animations/FadeIn";
import { NPM_PACKAGES } from "@/common/constants/data";

export function OpenSource() {
  return (
    <section
      id="open-source"
      className="py-24 lg:py-32 bg-slate-50 dark:bg-slate-950"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          label="Open Source"
          title="npm Packages I've Published"
          subtitle="Production-ready libraries solving real developer pain points — available on the public registry."
        />

        <StaggerContainer
          className="grid lg:grid-cols-2 gap-6"
          staggerDelay={0.15}
        >
          {NPM_PACKAGES.map((pkg) => (
            <motion.div
              key={pkg.name}
              variants={staggerItem}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60 hover:border-indigo-300 dark:hover:border-indigo-800/50 transition-colors duration-300 overflow-hidden group shadow-sm dark:shadow-none"
            >
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-center shrink-0">
                      <Package size={18} className="text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-slate-900 dark:text-white font-bold text-base font-mono leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors duration-200">
                        {pkg.name}
                      </h3>
                      <span className="text-xs text-slate-500 font-mono">
                        v{pkg.version}
                      </span>
                    </div>
                  </div>
                  {/* Links */}
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={pkg.npm}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View on npm"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-900/40 text-red-400 hover:bg-red-900/50 text-xs font-semibold transition-colors duration-200"
                    >
                      npm
                      <ExternalLink size={11} />
                    </a>
                    <a
                      href={pkg.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View on GitHub"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors duration-200"
                    >
                      <GitFork size={12} />
                      GitHub
                    </a>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  {pkg.longDescription}
                </p>
              </div>

              {/* Core Features */}
              <div className="px-6 pb-5 flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Key Features
                </p>
                <ul className="space-y-2">
                  {pkg.highlights.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-slate-600 dark:text-slate-400 text-sm"
                    >
                      <CheckCircle2
                        size={14}
                        className="text-indigo-500 shrink-0 mt-0.5"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Callout section — theme-aware, shown when pkg.callout is present */}
              {pkg.callout && (
                <div
                  className={`mx-6 mb-5 p-4 rounded-xl border ${
                    pkg.callout.theme === "amber"
                      ? "bg-amber-950/20 border-amber-800/30"
                      : "bg-teal-950/20 border-teal-800/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    {pkg.callout.theme === "amber" ? (
                      <Sparkles size={14} className="text-amber-400" />
                    ) : (
                      <ShieldCheck size={14} className="text-teal-400" />
                    )}
                    <p
                      className={`text-xs font-semibold uppercase tracking-wider ${
                        pkg.callout.theme === "amber"
                          ? "text-amber-400"
                          : "text-teal-400"
                      }`}
                    >
                      {pkg.callout.label}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {pkg.callout.items.map((item) => (
                      <li
                        key={item}
                        className={`flex items-start gap-2.5 text-sm ${
                          pkg.callout!.theme === "amber"
                            ? "text-amber-200/70"
                            : "text-teal-200/70"
                        }`}
                      >
                        <span
                          className={`mt-2 w-1 h-1 rounded-full shrink-0 ${
                            pkg.callout!.theme === "amber"
                              ? "bg-amber-500"
                              : "bg-teal-500"
                          }`}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800/60 flex flex-wrap gap-1.5">
                {pkg.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
