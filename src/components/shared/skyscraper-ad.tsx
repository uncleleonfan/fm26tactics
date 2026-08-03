"use client";

import { useState, useEffect, useId } from "react";
import { useAdToggle } from "@/hooks/use-ad-toggle";

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
 * Skyscraper (160×600) vertical ad — left sidebar only.
 *
 * Runs in a sandboxed `<iframe srcDoc>` so:
 * 1. No `atOptions` global variable conflict.
 * 2. The `sandbox` attribute (without `allow-popups`) blocks
 *    popunders / overlays from escaping the iframe.
 */
export function SkyscraperAd() {
  const [hidden, setHidden] = useState(false);
  const { adsOff } = useAdToggle();
  const id = useId();

  useEffect(() => {
    if (isChineseLocale()) setHidden(true);
  }, []);

  if (hidden || adsOff) return null;

  const adHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:transparent;overflow:hidden}
    a,img{max-width:100%;display:block}
  </style>
</head>
<body>
  <script>
    atOptions={key:'${SKYSCRAPER_KEY}',format:'iframe',height:600,width:160,params:{}}
  </script>
  <script src="https://www.highperformanceformat.com/${SKYSCRAPER_KEY}/invoke.js"></script>
</body>
</html>`;

  return (
    <div className="relative w-[160px] h-[600px]">
      <div className="absolute inset-0 rounded-xl border border-dashed border-[#1C2436] bg-surface/50 flex items-center justify-center pointer-events-none">
        <span className="text-[10px] uppercase tracking-widest text-text-muted select-none">
          Advertisement
        </span>
      </div>
      <iframe
        srcDoc={adHtml}
        className="absolute inset-0 w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin"
        scrolling="no"
        title={`skyscraper-ad-${id}`}
      />
    </div>
  );
}
