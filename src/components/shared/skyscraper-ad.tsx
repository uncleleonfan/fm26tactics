"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

const SKYSCRAPER_KEY = "0a10f1179828aa089fc729009bdc247d";

export function SkyscraperAd() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <div className="flex justify-center">
      {/* Only load ad scripts on desktop — saves ~200KB + DNS/TCP/TLS on mobile */}
      {isDesktop && (
        <>
          <Script id="adsterra-skyscraper-config" strategy="lazyOnload">
            {`atOptions={'key':'${SKYSCRAPER_KEY}','format':'iframe','height':600,'width':160,'params':{}}`}
          </Script>
          <Script
            id="adsterra-skyscraper-invoke"
            src={`https://www.highperformanceformat.com/${SKYSCRAPER_KEY}/invoke.js`}
            strategy="lazyOnload"
          />
        </>
      )}
      {/* Placeholder — shows until ad loads */}
      <div className="w-[160px] h-[600px] rounded-xl border border-dashed border-[#1C2436] bg-surface/50 flex items-center justify-center">
        <span className="text-[10px] uppercase tracking-widest text-text-muted select-none">
          Advertisement
        </span>
      </div>
    </div>
  );
}
