"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/common/components/sections/SectionHeading";
import {
  FadeIn,
  StaggerContainer,
  staggerItem,
} from "@/common/components/animations/FadeIn";
import { SKILLS } from "@/common/constants/data";

const categoryColors: Record<string, string> = {
  Languages: "text-violet-400 border-violet-900/60 bg-violet-950/30",
  Frontend: "text-blue-400 border-blue-900/60 bg-blue-950/30",
  Backend: "text-emerald-400 border-emerald-900/60 bg-emerald-950/30",
  Databases: "text-amber-400 border-amber-900/60 bg-amber-950/30",
  "Tools & DevOps": "text-slate-400 border-slate-700/60 bg-slate-800/30",
  "AI Tools": "text-pink-400 border-pink-900/60 bg-pink-950/30",
};

export function Skills() {
  return (
    <section
      id="skills"
      className="py-24 lg:py-32 bg-linear-to-b from-slate-950 to-slate-900"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          label="Technical Skills"
          title="Tools I Build With"
          subtitle="A curated stack refined through production deployments and enterprise projects."
        />

        <StaggerContainer
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          staggerDelay={0.08}
        >
          {SKILLS.map((skill) => {
            const colorClass =
              categoryColors[skill.category] ??
              "text-indigo-400 border-indigo-900/60 bg-indigo-950/30";
            return (
              <motion.div
                key={skill.category}
                variants={staggerItem}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/60 hover:border-slate-700/80 transition-colors duration-300"
              >
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                  {skill.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <span
                      key={item}
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${colorClass}`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
