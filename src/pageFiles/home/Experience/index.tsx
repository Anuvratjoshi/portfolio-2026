"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import { SectionHeading } from "@/common/components/sections/SectionHeading";
import { FadeIn } from "@/common/components/animations/FadeIn";
import { EXPERIENCES } from "@/common/constants/data";

export function Experience() {
  return (
    <section id="experience" className="py-24 lg:py-32 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          label="Experience"
          title="Where I've Worked"
          subtitle="A track record of technical ownership and measurable engineering impact."
        />

        <div className="relative max-w-3xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-linear-to-b from-indigo-600/80 via-indigo-800/40 to-transparent" />

          <div className="space-y-10">
            {EXPERIENCES.map((exp, i) => (
              <FadeIn
                key={`${exp.company}-${i}`}
                delay={i * 0.12}
                direction="left"
              >
                <div className="relative flex gap-6">
                  {/* Timeline dot */}
                  <div className="shrink-0 relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.12 + 0.2 }}
                      className="w-16 h-16 rounded-2xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center shadow-lg"
                    >
                      <span className="text-indigo-400 font-bold text-lg">
                        {exp.company.slice(0, 2)}
                      </span>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/60 hover:border-slate-700/80 transition-colors duration-300">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-white font-bold text-lg">
                            {exp.role}
                          </h3>
                          <p className="text-indigo-400 font-semibold text-sm">
                            {exp.company}
                          </p>
                        </div>
                        {i === 0 && (
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-400">
                            Current
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} />
                          {exp.period}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} />
                          {exp.location}
                        </span>
                      </div>

                      <ul className="space-y-2">
                        {exp.bullets.map((bullet, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2.5 text-slate-400 text-sm leading-relaxed"
                          >
                            <span className="mt-2 w-1 h-1 rounded-full bg-indigo-500 shrink-0" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
