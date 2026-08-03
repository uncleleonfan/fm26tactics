"use client";

import Script from "next/script";

const SKYSCRAPER_KEY = "0a10f1179828aa089fc729009bdc247d";

export function SkyscraperAd() {
  return (
    <div className="flex justify-center">
      {/* Config must load before the invoke script */}
      <Script id="adsterra-skyscraper-config" strategy="lazyOnload">
        {`atOptions={'key':'${SKYSCRAPER_KEY}','format':'iframe','height':600,'width':160,'params':{}}`}
      </Script>
      <Script
        id="adsterra-skyscraper-invoke"
        src={`https://www.highperformanceformat.com/${SKYSCRAPER_KEY}/invoke.js`}
        strategy="lazyOnload"
      />
      {/* Placeholder — shows until ad loads */}
      <div className="w-[160px] h-[600px] rounded-xl border border-dashed border-[#1C2436] bg-surface/50 flex items-center justify-center">
        <span className="text-[10px] uppercase tracking-widest text-text-muted select-none">
          Advertisement
        </span>
      </div>
    </div>
  );
}
