"use client";

import Script from "next/script";

const ADSTERRA_ZONE =
  "caffcdba1878c0c7c8b337c8016e362e";
const CONTAINER_ID = `container-${ADSTERRA_ZONE}`;

export function NativeAd() {
  return (
    <div className="my-10">
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
