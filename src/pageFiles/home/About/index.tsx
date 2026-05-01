"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Code2, Cpu, Users, Zap } from "lucide-react";
import { SectionHeading } from "@/common/components/sections/SectionHeading";
import {
  FadeIn,
  StaggerContainer,
  staggerItem,
} from "@/common/components/animations/FadeIn";
import { PERSONAL, EDUCATION } from "@/common/constants/data";

const highlights = [
  {
    icon: Code2,
    title: "MERN Stack Expert",
    description:
      "Deep expertise in MongoDB, Express.js, React.js, and Node.js for production-grade applications.",
  },
  {
    icon: Zap,
    title: "Performance-First",
    description:
      "Proven record of reducing latency by 30% and frontend load times by 25% through architectural decisions.",
  },
  {
    icon: Cpu,
    title: "AI-Enhanced Developer",
    description:
      "Leverages GitHub Copilot, prompt engineering, and AI workflows to accelerate delivery without sacrificing quality.",
  },
  {
    icon: Users,
    title: "Tech Lead Mindset",
    description:
      "Mentors junior developers, drives code reviews, and enforces scalable architecture across teams.",
  },
];

export function About() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          label="About Me"
          title="Senior Engineer. Problem Solver. AI Advocate."
          subtitle="I build scalable systems and lead teams to deliver high-impact software."
        />

        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 items-start">
          {/* Left: Profile Photo */}
          <FadeIn direction="left">
            <div className="flex flex-col items-center lg:items-start gap-5">
              {/* Photo */}
              <motion.div
                whileHover={{ scale: 1.02, rotate: 1 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                {/* Glow ring */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-indigo-500/30 via-blue-500/20 to-violet-500/20 blur-xl" />
                <div className="relative w-64 h-72 lg:w-full lg:h-80 rounded-3xl overflow-hidden border border-indigo-800/40 shadow-2xl shadow-indigo-950/60">
                  <Image
                    src="/profile.jpeg"
                    alt="Anuvrat Joshi"
                    fill
                    sizes="(max-width: 1024px) 256px, 300px"
                    className="object-cover object-top"
                    priority
                  />
                  {/* Subtle gradient overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-950/60 to-transparent" />
                </div>
              </motion.div>

              {/* Name card below photo */}
              <div className="text-center lg:text-left w-full">
                <p className="text-white font-bold text-xl">{PERSONAL.name}</p>
                <p className="text-indigo-400 text-sm mt-0.5">{PERSONAL.role}</p>
                <div className="flex items-center justify-center lg:justify-start gap-1.5 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-slate-500 text-xs">{PERSONAL.location}</span>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Middle: Bio */}
          <FadeIn direction="up">
            <div className="space-y-5">
              <p className="text-slate-300 text-lg leading-relaxed">
                I'm a{" "}
                <span className="text-white font-semibold">
                  Senior Full Stack Developer
                </span>{" "}
                with{" "}
                <span className="text-indigo-400 font-semibold">
                  {PERSONAL.yearsOfExperience} years
                </span>{" "}
                of hands-on expertise delivering scalable MERN stack
                applications for production environments.
              </p>
              <p className="text-slate-400 leading-relaxed">
                My work spans architecting data pipelines, building real-time
                systems, and crafting seamless UIs. I've driven measurable
                improvements 30% latency reduction, 25% faster load times
                through deep technical ownership.
              </p>
              <p className="text-slate-400 leading-relaxed">
                I'm also passionate about AI-assisted development. Using GitHub
                Copilot with structured prompt engineering, I've built workflows
                that accelerate feature delivery while maintaining
                enterprise-grade code quality.
              </p>

              {/* Education */}
              <div className="pt-4 space-y-3">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Education
                </p>
                {EDUCATION.map((edu) => (
                  <div key={edu.institution} className="flex items-start gap-3">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm">
                        {edu.degree}
                      </p>
                      <p className="text-slate-500 text-sm">
                        {edu.institution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Right: Highlights grid */}
          <StaggerContainer
            className="grid grid-cols-2 gap-4"
            staggerDelay={0.12}
          >
            {highlights.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                variants={staggerItem}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/60 hover:border-indigo-800/60 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-900/60 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-indigo-400" />
                </div>
                <h3 className="text-white font-semibold mb-2 text-sm">
                  {title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {description}
                </p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
