"use client";

import { useAdToggle } from "@/hooks/use-ad-toggle";

export function AdToggle() {
  const { adsOff, toggle } = useAdToggle();

  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <span className="text-xs text-text-muted">Ads</span>
      <button
        type="button"
        role="switch"
        aria-checked={!adsOff}
        onClick={toggle}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
          adsOff ? "bg-white/10" : "bg-primary"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
            adsOff ? "translate-x-1" : "translate-x-[18px]"
          }`}
        />
      </button>
    </label>
  );
}
