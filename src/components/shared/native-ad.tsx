"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { useAdToggle } from "@/hooks/use-ad-toggle";

const ADSTERRA_ZONE =
  "caffcdba1878c0c7c8b337c8016e362e";
const CONTAINER_ID = `container-${ADSTERRA_ZONE}`;

/**
 * Adsterra is blocked by Baidu verification inside mainland China.
 * For zh-* locales, hide the slot to avoid an empty placeholder.
 */
function isChineseLocale(): boolean {
  if (typeof navigator === "undefined") return false;
  const lang = (navigator.language || "").toLowerCase();
  return lang.startsWith("zh");
}

export function NativeAd() {
  const [hidden, setHidden] = useState(false);
  const { adsOff } = useAdToggle();

  useEffect(() => {
    if (isChineseLocale()) setHidden(true);
  }, []);

  if (adsOff) return null;

  return (
    <div className="my-10" style={hidden ? { display: "none" } : undefined}>
      <Script
        id="adsterra-native"
        src={`https://pl30662924.effectivecpmnetwork.com/${ADSTERRA_ZONE}/invoke.js`}
        strategy="lazyOnload"
        data-cfasync="false"
      />
      <div
        id={CONTAINER_ID}
        className="min-h-[90px] rounded-xl border border-dashed border-[#1C2436] bg-surface/50 flex items-center justify-center"
      >
        <span className="text-[10px] uppercase tracking-widest text-text-muted select-none">
          Advertisement
        </span>
      </div>
    </div>
  );
}

export { CONTAINER_ID };
