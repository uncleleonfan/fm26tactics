"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "fm26tactics_ads_off";

export function useAdToggle() {
  const [adsOff, setAdsOff] = useState(false);

  useEffect(() => {
    try {
      setAdsOff(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {}

    const handler = () => {
      try {
        setAdsOff(localStorage.getItem(STORAGE_KEY) === "1");
      } catch {}
    };

    window.addEventListener("ad-toggle-changed", handler);
    return () => window.removeEventListener("ad-toggle-changed", handler);
  }, []);

  const toggle = useCallback(() => {
    setAdsOff((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {}
      window.dispatchEvent(new Event("ad-toggle-changed"));
      return next;
    });
  }, []);

  return { adsOff, toggle };
}
