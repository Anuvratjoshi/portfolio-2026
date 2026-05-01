"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/common/components/sections/SectionHeading";
import {
  StaggerContainer,
  staggerItem,
} from "@/common/components/animations/FadeIn";
import { PROJECTS } from "@/common/constants/data";

export function Projects() {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <section
      id="projects"
      className="py-24 lg:py-32 bg-white dark:bg-linear-to-b dark:from-slate-900 dark:to-slate-950"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          label="Projects"
          title="Production Systems I've Built"
          subtitle="Real-world applications solving complex problems at scale."
        />

        <StaggerContainer className="space-y-4" staggerDelay={0.1}>
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.title}
              variants={staggerItem}
              className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700/80 transition-colors duration-300 overflow-hidden shadow-sm dark:shadow-none"
            >
              {/* Header */}
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left group"
                aria-expanded={expanded === i}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-center shrink-0">
                    <span className="text-indigo-400 font-bold text-sm">
                      {project.title.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-slate-900 dark:text-white font-bold text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      {project.subtitle}
                    </p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expanded === i ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-slate-500 shrink-0"
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>

              {/* Expanded content */}
              <AnimatePresence initial={false}>
                {expanded === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    <div className="px-6 pb-6 border-t border-slate-200 dark:border-slate-800/60 pt-5">
                      {/* Overview */}
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-5">
                        {project.description}
                      </p>

                      {/* Key contributions */}
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        Key Contributions
                      </p>
                      <ul className="space-y-2.5 mb-5">
                        {project.bullets.map((bullet, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2.5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed"
                          >
                            <span className="mt-2 w-1 h-1 rounded-full bg-indigo-500 shrink-0" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
