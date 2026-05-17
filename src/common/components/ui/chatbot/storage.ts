import type { Message } from "./types";
import { LS_KEY } from "./constants";

export function loadMessages(): Message[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed: Message[] = JSON.parse(raw);
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    return parsed.filter(
      (m) => m.id !== "init" && m.timestamp > cutoff && !m.streaming,
    );
  } catch {
    return [];
  }
}

export function saveMessages(msgs: Message[]): void {
  try {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify(msgs.filter((m) => !m.streaming)),
    );
  } catch {}
}

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
