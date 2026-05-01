"use client";

/**
 * useAnalytics — lightweight hook for tracking CTA clicks.
 * Reads the persistent visitorId from localStorage and fires
 * POST /api/analytics/cta fire-and-forget (never blocks the user action).
 *
 * Usage:
 *   const track = useAnalytics();
 *   <button onClick={() => { track("hire_me"); doSomething(); }}>
 */

import { useCallback } from "react";

const VISITOR_ID_KEY = "aj_visitor_id";

function getVisitorId(): string {
  try {
    return localStorage.getItem(VISITOR_ID_KEY) ?? "anonymous";
  } catch {
    return "anonymous";
  }
}

export function useAnalytics() {
  const track = useCallback((action: string, meta?: Record<string, string>) => {
    const visitorId = getVisitorId();
    fetch("/api/analytics/cta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, visitorId, meta: meta ?? {} }),
    }).catch(() => {
      // silently ignore — analytics is non-critical
    });
  }, []);

  return track;
}
