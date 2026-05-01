"use client";

import { motion } from "framer-motion";
import { Bot, FileCode2, Workflow, Lightbulb, Bug } from "lucide-react";
import { SectionHeading } from "@/common/components/sections/SectionHeading";
import {
  StaggerContainer,
  staggerItem,
} from "@/common/components/animations/FadeIn";
import { AI_WORKFLOW } from "@/common/constants/data";

const icons = [Bot, FileCode2, Workflow, Lightbulb, Bug];

export function AIWorkflow() {
  return (
    <section
      id="ai-workflow"
      className="py-24 lg:py-32 bg-white dark:bg-slate-950"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          label="AI Workflow"
          title="Engineering Accelerated by AI"
          subtitle="I don't just use AI tools — I build structured workflows that make them production-ready."
        />

        {/* Central visual */}
        <div className="flex justify-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            <div className="w-28 h-28 rounded-3xl bg-linear-to-br from-indigo-600/30 to-blue-600/20 border border-indigo-700/40 flex items-center justify-center shadow-2xl shadow-indigo-900/30">
              <Bot size={48} className="text-indigo-400" />
            </div>
            {/* Pulsing rings */}
            <div
              className="absolute inset-0 rounded-3xl border border-indigo-600/20 animate-ping"
              style={{ animationDuration: "2.5s" }}
            />
            <div
              className="absolute -inset-2 rounded-3xl border border-indigo-800/15 animate-ping"
              style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}
            />
          </motion.div>
        </div>

        <StaggerContainer
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          staggerDelay={0.1}
        >
          {AI_WORKFLOW.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={item.title}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60 hover:border-indigo-300 dark:hover:border-indigo-800/50 transition-colors duration-300 group shadow-sm dark:shadow-none"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-center mb-4 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/60 transition-colors duration-300">
                  <Icon size={18} className="text-indigo-400" />
                </div>
                <h3 className="text-slate-900 dark:text-white font-semibold mb-2 text-sm">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </StaggerContainer>

        {/* Model badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-12"
        >
          <span className="text-slate-400 dark:text-slate-600 text-sm">
            Powered by:
          </span>
          {[
            "GitHub Copilot",
            "Grok Code Fast 1",
            "Claude Sonnet",
            "Prompt Engineering",
          ].map((tool) => (
            <span
              key={tool}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-300"
            >
              {tool}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
