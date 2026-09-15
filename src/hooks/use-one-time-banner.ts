"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * One-time gate for banners / modals / nudges.
 *
 * The "seen" flag is persisted the first time the banner is actually rendered,
 * not when the user closes it. That is what makes it a true once-per-user
 * (per browser) promise: reloading the page without interacting will not bring
 * it back, and closing it simply re-writes the same flag.
 *
 * Storage access is always guarded — Safari private mode and disabled storage
 * throw on write, and in that case an in-memory set still keeps the promise
 * for the rest of the session.
 */

/** Fallback for browsers where localStorage is unavailable or full. */
const sessionMemory = new Set<string>();

function hasSeen(key: string): boolean {
  if (sessionMemory.has(key)) return true;
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function markSeen(key: string): void {
  sessionMemory.add(key);
  try {
    window.localStorage.setItem(key, "1");
  } catch {
    // Storage unavailable — session memory still prevents a repeat showing.
  }
}

interface Options {
  /** Skip the banner entirely while false (e.g. waiting for another banner). */
  enabled?: boolean;
  /** Delay before revealing, so the page can settle first. */
  delayMs?: number;
}

export function useOneTimeBanner(key: string, options: Options = {}) {
  const { enabled = true, delayMs = 0 } = options;
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!enabled || hasSeen(key)) return;

    const reveal = () => {
      markSeen(key);
      setVisible(true);
    };

    if (delayMs > 0) {
      timerRef.current = window.setTimeout(reveal, delayMs);
      return () => window.clearTimeout(timerRef.current);
    }

    reveal();
  }, [key, enabled, delayMs]);

  /** Hide immediately and make sure it can never come back. */
  const dismiss = useCallback(() => {
    window.clearTimeout(timerRef.current);
    markSeen(key);
    setVisible(false);
  }, [key]);

  return { visible, dismiss };
}
