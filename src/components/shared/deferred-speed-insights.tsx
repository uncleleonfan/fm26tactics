"use client";

import { useEffect, useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export function DeferredSpeedInsights() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer analytics to idle — avoids competing with critical rendering resources
    const id = requestIdleCallback
      ? requestIdleCallback(() => setMounted(true))
      : setTimeout(() => setMounted(true), 2000);
    return () => {
      if (typeof id === "number") {
        cancelIdleCallback ? cancelIdleCallback(id) : clearTimeout(id);
      }
    };
  }, []);

  if (!mounted) return null;
  return <SpeedInsights />;
}
