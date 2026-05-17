"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { toast } from "./Toast";

// ─── Code block with copy button ─────────────────────────────────────────────
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast("Code copied!");
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <div className="relative group/code my-2">
      <pre className="rounded-xl overflow-x-auto bg-slate-900 dark:bg-slate-950 border border-slate-700/60 p-3 pr-10 text-[11px] font-mono leading-relaxed">
        <code className="text-slate-100">{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        aria-label="Copy code"
        title="Copy code"
        className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-700/80 hover:bg-slate-600 text-slate-400 hover:text-white opacity-0 group-hover/code:opacity-100 transition-all duration-150"
      >
        {copied ? <Check size={11} /> : <Copy size={11} />}
      </button>
    </div>
  );
}

// ─── Inline formatting ────────────────────────────────────────────────────────
export function renderInline(text: string, prefix = "il"): ReactNode {
  const nodes: ReactNode[] = [];
  const PATTERN =
    /(\[([^\]]+)\]\(([^)]+)\)|\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = PATTERN.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const k = `${prefix}-${i++}`;
    if (m[2])
      nodes.push(
        <a
          key={k}
          href={m[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-500 dark:text-indigo-400 underline underline-offset-2 break-all"
        >
          {m[2]}
        </a>,
      );
    else if (m[4])
      nodes.push(
        <strong key={k}>
          <em>{m[4]}</em>
        </strong>,
      );
    else if (m[5])
      nodes.push(
        <strong key={k} className="font-semibold">
          {m[5]}
        </strong>,
      );
    else if (m[6]) nodes.push(<em key={k}>{m[6]}</em>);
    else if (m[7])
      nodes.push(
        <code
          key={k}
          className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[0.82em] font-mono text-slate-800 dark:text-slate-200"
        >
          {m[7]}
        </code>,
      );
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  if (nodes.length === 0) return text;
  if (nodes.length === 1) return nodes[0];
  return <>{nodes}</>;
}

// ─── Main renderer ────────────────────────────────────────────────────────────
export function MarkdownRenderer({
  content,
  streaming,
}: {
  content: string;
  streaming?: boolean;
}) {
  const segments: Array<{ type: "text" | "code"; body: string }> = [];
  const CODE_RE = /```(\w*)\n?([\s\S]*?)```/g;
  let last = 0;
  let cm: RegExpExecArray | null;
  while ((cm = CODE_RE.exec(content)) !== null) {
    if (cm.index > last)
      segments.push({ type: "text", body: content.slice(last, cm.index) });
    segments.push({ type: "code", body: cm[2].trim() });
    last = cm.index + cm[0].length;
  }
  if (last < content.length)
    segments.push({ type: "text", body: content.slice(last) });

  let nk = 0;
  const nodes: ReactNode[] = [];

  for (const seg of segments) {
    if (seg.type === "code") {
      nodes.push(<CodeBlock key={`cb-${nk++}`} code={seg.body} />);
      continue;
    }

    const lines = seg.body.split("\n");
    type ListBuf = { kind: "ul" | "ol"; items: ReactNode[] };
    let list: ListBuf | null = null;
    let tableLines: string[] = [];
    let inTable = false;

    const flushList = () => {
      if (!list) return;
      nodes.push(
        list.kind === "ul" ? (
          <ul
            key={`ul-${nk++}`}
            className="list-disc list-inside space-y-0.5 my-1.5 pl-1"
          >
            {list.items}
          </ul>
        ) : (
          <ol
            key={`ol-${nk++}`}
            className="list-decimal list-inside space-y-0.5 my-1.5 pl-1"
          >
            {list.items}
          </ol>
        ),
      );
      list = null;
    };

    const flushTable = () => {
      if (tableLines.length < 2) {
        tableLines.forEach((ln) => {
          if (ln.trim())
            nodes.push(
              <p key={`p-${nk++}`} className="text-sm leading-relaxed">
                {renderInline(ln, `p-${nk}`)}
              </p>,
            );
        });
        tableLines = [];
        inTable = false;
        return;
      }
      const headers = tableLines[0]
        .split("|")
        .filter((c) => c.trim())
        .map((c) => c.trim());
      const rows = tableLines.slice(2).map((r) =>
        r
          .split("|")
          .filter((c) => c.trim())
          .map((c) => c.trim()),
      );
      nodes.push(
        <div
          key={`tbl-${nk++}`}
          className="my-2 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700"
        >
          <table className="w-full text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                {headers.map((h, i) => (
                  <th
                    key={i}
                    className="px-3 py-1.5 text-left font-semibold text-slate-700 dark:text-slate-200"
                  >
                    {renderInline(h, `th-${nk}-${i}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr
                  key={ri}
                  className="border-t border-slate-200 dark:border-slate-700 even:bg-slate-50 dark:even:bg-slate-900/50"
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="px-3 py-1.5 text-slate-600 dark:text-slate-300"
                    >
                      {renderInline(cell, `td-${nk}-${ri}-${ci}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      tableLines = [];
      inTable = false;
    };

    for (const line of lines) {
      if (line.trim().startsWith("|") && line.includes("|", 1)) {
        if (!inTable) {
          flushList();
          inTable = true;
        }
        tableLines.push(line);
        continue;
      } else if (inTable) {
        flushTable();
      }

      const hm = line.match(/^(#{1,4})\s+(.+)/);
      if (hm) {
        flushList();
        const lvl = hm[1].length;
        const cls =
          lvl <= 2
            ? "text-sm font-bold mt-2 mb-0.5"
            : "text-[13px] font-semibold mt-1";
        nodes.push(
          <p key={`h-${nk++}`} className={cls}>
            {renderInline(hm[2], `h-${nk}`)}
          </p>,
        );
        continue;
      }
      if (/^[-*]{3,}$/.test(line.trim())) {
        flushList();
        nodes.push(
          <hr
            key={`hr-${nk++}`}
            className="border-slate-200 dark:border-slate-700 my-2"
          />,
        );
        continue;
      }
      const bm = line.match(/^\s{0,3}[*\-+]\s+(.+)/);
      if (bm) {
        const item = (
          <li key={`li-${nk++}`} className="text-sm leading-relaxed">
            {renderInline(bm[1], `li-${nk}`)}
          </li>
        );
        if (!list || list.kind !== "ul") {
          flushList();
          list = { kind: "ul", items: [item] };
        } else list.items.push(item);
        continue;
      }
      const nm = line.match(/^\d+[.)]\s+(.+)/);
      if (nm) {
        const item = (
          <li key={`li-${nk++}`} className="text-sm leading-relaxed">
            {renderInline(nm[1], `li-${nk}`)}
          </li>
        );
        if (!list || list.kind !== "ol") {
          flushList();
          list = { kind: "ol", items: [item] };
        } else list.items.push(item);
        continue;
      }
      if (!line.trim()) {
        flushList();
        continue;
      }
      flushList();
      nodes.push(
        <p key={`p-${nk++}`} className="text-sm leading-relaxed">
          {renderInline(line, `p-${nk}`)}
        </p>,
      );
    }
    flushList();
    if (inTable) flushTable();
  }

  return (
    <div className="space-y-1 min-w-0 wrap-break-word">
      {nodes}
      {streaming && (
        <motion.span
          className="inline-block w-0.5 h-3.5 bg-indigo-400 ml-0.5 align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </div>
  );
}
