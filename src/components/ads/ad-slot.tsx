"use client";

import { useEffect, useRef } from "react";

const PUBLISHER_ID = "ca-pub-2798522702383698";

interface AdSlotProps {
  /** Ad unit slot ID (from AdSense dashboard). Leave empty for auto-fill. */
  slot?: string;
  /** Layout hint — "horizontal" | "rectangle" | "vertical" | "auto" */
  format?: "auto" | "horizontal" | "rectangle" | "vertical";
  /** Responsive = true (recommended). Fixed width/height when false. */
  responsive?: boolean;
  /** Optional className for custom spacing/alignment */
  className?: string;
  /** Optional style overrides */
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Renders a single AdSense ad unit.
 * Must be used on pages where <AdSenseScript /> is loaded in the layout.
 */
export function AdSlot({
  slot,
  format = "auto",
  responsive = true,
  className = "",
  style,
}: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      // Push a new ad request — AdSense expects this call per <ins> element
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not yet loaded or blocked by ad-blocker — silently skip
    }
  }, []);

  return (
    <div className={`flex justify-center w-full ${className}`}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{
          display: "block",
          minWidth: "100%",
          ...style,
        }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
