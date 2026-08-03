"use client";

import { useEffect, useState } from "react";

/**
 * Defers loading @vercel/speed-insights until well after the critical
 * rendering path is complete.  The module is NEVER imported at module
 * level — only inside a useEffect callback on the client — so an
 * import-time error in a fringe mobile browser cannot crash the whole
 * application.
 */
export function DeferredSpeedInsights() {
  const [ready, setReady] = useState(false);
  const [Comp, setComp] = useState<React.ComponentType | null>(null);

  // Wait 2 s before even attempting to load the chunk
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 2_000);
    return () => clearTimeout(timer);
  }, []);

  // Load the chunk lazily on the client only
  useEffect(() => {
    if (!ready || Comp) return;

    import("@vercel/speed-insights/next")
      .then((m) => setComp(() => m.SpeedInsights))
      .catch(() => {
        // Silently ignore — analytics failure must never crash the app
      });
  }, [ready, Comp]);

  if (!Comp) return null;
  return <Comp />;
}
