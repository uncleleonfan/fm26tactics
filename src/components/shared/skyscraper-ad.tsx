"use client";

import { useId, useState, useEffect } from "react";
import Script from "next/script";

const SKYSCRAPER_KEY = "0a10f1179828aa089fc729009bdc247d";

/**
 * Adsterra's ad serving domains (highperformanceformat.com,
 * effectivecpmnetwork.com) are blocked by Baidu's anti-bot verification
 * inside mainland China. The script gets an HTML captcha page instead
 * of valid JS, so ads never render.
 *
 * For zh-* locales we hide the slot entirely instead of showing a
 * placeholder that will never fill.
 */
function isChineseLocale(): boolean {
  if (typeof navigator === "undefined") return false;
  const lang = (navigator.language || "").toLowerCase();
  return lang.startsWith("zh");
}

export function SkyscraperAd() {
  const uid = useId();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (isChineseLocale()) setHidden(true);
  }, []);

  return (
    <div
      className="flex justify-center"
      style={hidden ? { display: "none" } : undefined}
    >
      <Script id={`adsterra-skyscraper-config-${uid}`} strategy="lazyOnload">
        {`atOptions={'key':'${SKYSCRAPER_KEY}','format':'iframe','height':600,'width':160,'params':{}}`}
      </Script>
      <Script
        id={`adsterra-skyscraper-invoke-${uid}`}
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
