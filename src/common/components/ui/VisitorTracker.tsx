"use client";

/**
 * VisitorTracker — invisible component mounted once in the root layout.
 * Fires a single POST /api/visitors per browser session (sessionStorage guard)
 * so refreshes and navigations within the same tab don't double-count.
 */

import { useEffect } from "react";

const SESSION_KEY = "aj_visit_tracked";

export function VisitorTracker() {
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
      // fire-and-forget — don't block anything
    })
      .then(() => sessionStorage.setItem(SESSION_KEY, "1"))
      .catch(() => {
        /* silently ignore — visitor tracking is non-critical */
      });
  }, []);

  return null;
}
