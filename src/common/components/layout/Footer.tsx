"use client";

import { Mail } from "lucide-react";
import { LinkedinIcon } from "@/common/components/ui/LinkedinIcon";
import { GithubIcon } from "@/common/components/ui/GithubIcon";
import { PERSONAL } from "@/common/constants/data";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            © {new Date().getFullYear()}{" "}
            <span className="text-slate-700 dark:text-slate-300">
              {PERSONAL.name}
            </span>
            . Built with Next.js & Framer Motion.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={PERSONAL.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
            >
              <GithubIcon size={18} />
            </a>
            <a
              href={PERSONAL.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
            >
              <LinkedinIcon size={18} />
            </a>
            <a
              href={`mailto:${PERSONAL.email}`}
              aria-label="Email"
              className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
