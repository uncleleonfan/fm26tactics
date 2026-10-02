"use client";

import { useEffect, useRef, useState } from "react";
import {
  adsAllowedOnClient,
  subscribeToConsentChanges,
} from "@/lib/consent-region";

/**
 * Adsterra fixed-size banner slot.
 *
 * Deliberately limited to static banner formats. Pop-unders, Social Bar,
 * in-page push, direct links and interstitials are NOT supported here — they
 * are the formats that jeopardise an AdSense application, and later an AdSense
 * account. Background: docs/adsense-review-2026-10.md.
 *
 * The keys below are client-visible values, like the AdSense publisher id in
 * adsense-script.tsx. They can be overridden per size from the environment.
 *
 * Environment overrides (Vercel → Environment Variables, then redeploy —
 * NEXT_PUBLIC_* values are inlined at build time):
 *   NEXT_PUBLIC_ADSTERRA_ENABLED      = false      # kill switch for every slot
 *   NEXT_PUBLIC_ADSTERRA_KEY_160X600  = <key>      # "" disables this size
 *   NEXT_PUBLIC_ADSTERRA_HOST         = <host>     # if Adsterra moves the host
 *
 * Behaviour:
 * - Renders nothing in consent regions (EEA/UK) — see lib/consent-region.ts.
 * - Renders nothing when the size has no key, so unused sizes stay invisible.
 * - Reserves the banner's exact box in the server-rendered HTML (no CLS).
 * - Injects the ad only once the slot scrolls near the viewport. Because the
 *   hidden responsive variant is `display:none`, it never intersects and never
 *   loads — one slot, two sizes, one request.
 *
 * Sizes: article containers cap content width (max-w-3xl ≈ 720px of inner
 * width), so 728x90 does not fit in a blog article and is intentionally not
 * offered. Article slots use the native unit instead.
 *
 * One banner per page: Adsterra's `atOptions` is a global that the invoke
 * script reads on load, so two slots with different keys on the same page can
 * clash.
 *
 * Host note: Adsterra assigns the host per banner, not per account — the
 * 160x600 uses www.highrevenueformat.com. A future size may live on a
 * different host; add a per-format host map here if that happens.
 */

const FORMATS = {
  "468x60": { width: 468, height: 60 },
  "320x50": { width: 320, height: 50 },
  "300x250": { width: 300, height: 250 },
  "160x300": { width: 160, height: 300 },
  "160x600": { width: 160, height: 600 },
} as const;

export type AdsterraFormat = keyof typeof FORMATS;

// Static references so Next.js can inline them at build time.
// `??` (not `||`) so that setting a variable to "" deliberately disables it.
const KEYS: Record<AdsterraFormat, string | undefined> = {
  "160x600":
    process.env.NEXT_PUBLIC_ADSTERRA_KEY_160X600 ??
    "0a10f1179828aa089fc729009bdc247d",
  "468x60": process.env.NEXT_PUBLIC_ADSTERRA_KEY_468X60,
  "320x50": process.env.NEXT_PUBLIC_ADSTERRA_KEY_320X50,
  "300x250": process.env.NEXT_PUBLIC_ADSTERRA_KEY_300X250,
  "160x300": process.env.NEXT_PUBLIC_ADSTERRA_KEY_160X300,
};

const HOST =
  process.env.NEXT_PUBLIC_ADSTERRA_HOST || "www.highrevenueformat.com";

/** Set NEXT_PUBLIC_ADSTERRA_ENABLED=false to switch off every Adsterra slot. */
const ENABLED = process.env.NEXT_PUBLIC_ADSTERRA_ENABLED !== "false";

interface AdsterraSlotProps {
  format: AdsterraFormat;
  /**
   * Outer wrapper classes: spacing and responsive visibility, e.g.
   * "hidden lg:block". Defaults to "my-8"; pass only display classes
   * (or "") inside a container that already handles spacing.
   */
  className?: string;
}

export function AdsterraSlot({ format, className = "my-8" }: AdsterraSlotProps) {
  const size = FORMATS[format];
  const key = KEYS[format]?.trim();
  const slotRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  /**
   * null = not resolved yet. It must NOT start as true: injecting optimistically
   * and then resolving to "blocked" makes React run the effect cleanup, which
   * removes the still-loading script and aborts the request in the browser
   * (net::ERR_ABORTED).
   */
  const [consentOk, setConsentOk] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setConsentOk(adsAllowedOnClient());
    update();
    return subscribeToConsentChanges(update);
  }, []);

  useEffect(() => {
    const el = slotRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = slotRef.current;
    if (!el || !inView || !ENABLED || consentOk !== true || !key) return;
    // Adsterra keys are alphanumeric; refuse anything else rather than
    // injecting an unexpected string into an inline script.
    if (!/^[A-Za-z0-9_-]+$/.test(key)) return;
    if (el.childElementCount > 0) return;

    const options = document.createElement("script");
    options.type = "text/javascript";
    options.text = `atOptions = {'key':'${key}','format':'iframe','height':${size.height},'width':${size.width},'params':{}};`;
    el.appendChild(options);

    const invoke = document.createElement("script");
    invoke.type = "text/javascript";
    invoke.src = `https://${HOST}/${key}/invoke.js`;
    el.appendChild(invoke);

    return () => {
      el.innerHTML = "";
    };
  }, [inView, key, size.width, size.height, consentOk]);

  // Keep the reserved box while the answer is unknown, drop it once refused.
  if (!ENABLED || !key || consentOk === false) return null;

  return (
    <div className={className}>
      {/*
        The id is required: Adsterra's invoke.js looks up
        `document.getElementById(atOptions.container || "container-" + key)`
        and appends the ad element into that node. An anonymous placeholder
        gives it nothing to fill.
      */}
      <div
        ref={slotRef}
        id={`container-${key}`}
        className="mx-auto"
        style={{ width: size.width, height: size.height }}
        aria-hidden="true"
      />
    </div>
  );
}
