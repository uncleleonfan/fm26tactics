"use client";

import { useEffect, useRef, useState } from "react";

const SKYSCRAPER_KEY = "0a10f1179828aa089fc729009bdc247d";

/**
 * Adsterra's ad serving domains are blocked by Baidu's anti-bot
 * verification inside mainland China.  Hide the entire slot for
 * zh-* locales instead of showing an empty placeholder.
 */
function isChineseLocale(): boolean {
  if (typeof navigator === "undefined") return false;
  return (navigator.language || "").toLowerCase().startsWith("zh");
}

/**
 * Skyscraper (160×600) vertical ad.
 *
 * We deliberately avoid `next/script` for the invoke.js payload
 * because Adsterra's `format:'iframe'` script places the iframe at
 * the physical position of the `<script>` tag.  With `next/script`
 * + `lazyOnload` the tag ends up at the bottom of the document,
 * defeating the sidebar placement and occasionally triggering a
 * popunder.  Instead we inject the script directly inside the
 * container div via `useEffect`.
 */
export function SkyscraperAd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const injectedRef = useRef(false);
  const [hidden, setHidden] = useState(false);

  // Hide the entire slot for Chinese locales
  useEffect(() => {
    if (isChineseLocale()) setHidden(true);
  }, []);

  // Inject invoke.js *inside* the container so the iframe is
  // rendered at the correct position.
  useEffect(() => {
    if (hidden) return;
    if (!containerRef.current || injectedRef.current) return;
    injectedRef.current = true;

    // Must be set on `window` BEFORE invoke.js loads
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).atOptions = {
      key: SKYSCRAPER_KEY,
      format: "iframe",
      height: 600,
      width: 160,
      params: {},
    };

    const script = document.createElement("script");
    script.src = `https://www.highperformanceformat.com/${SKYSCRAPER_KEY}/invoke.js`;
    script.async = true;
    containerRef.current.appendChild(script);
  }, [hidden]);

  return (
    <div
      ref={containerRef}
      className="flex justify-center relative w-[160px] h-[600px]"
      style={hidden ? { display: "none" } : undefined}
    >
      {/* Placeholder — absolute-positioned so the iframe overlays it */}
      <div className="absolute inset-0 rounded-xl border border-dashed border-[#1C2436] bg-surface/50 flex items-center justify-center">
        <span className="text-[10px] uppercase tracking-widest text-text-muted select-none">
          Advertisement
        </span>
      </div>
    </div>
  );
}
