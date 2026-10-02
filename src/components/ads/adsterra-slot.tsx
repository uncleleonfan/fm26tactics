"use client";

import { useEffect, useRef, useState } from "react";
import {
  adsAllowedOnClient,
  subscribeToConsentChanges,
} from "@/lib/consent-region";
import { trackEvent } from "@/lib/analytics";

/**
 * Adsterra fixed-size banner slot.
 *
 * Pop-unders, Social Bar and in-page push stay out of this component (they are
 * page-global scripts, not slots) — see adsterra-global-script.tsx, where they
 * are env-gated and off by default.
 *
 * The keys below are client-visible values, like the AdSense publisher id in
 * adsense-script.tsx. They can be overridden per size from the environment.
 *
 * Environment overrides (Vercel → Environment Variables, then redeploy —
 * NEXT_PUBLIC_* values are inlined at build time):
 *   NEXT_PUBLIC_ADSTERRA_ENABLED      = false      # kill switch for every slot
 *   NEXT_PUBLIC_ADSTERRA_KEY_728X90   = <key>      # "" disables this size
 *   NEXT_PUBLIC_ADSTERRA_KEY_320X50   = <key>
 *   NEXT_PUBLIC_ADSTERRA_HOST         = <host>     # if Adsterra moves the host
 *
 * Behaviour:
 * - Renders nothing in consent regions (EEA/UK) — see lib/consent-region.ts.
 * - Renders nothing when the size has no key, so unused sizes stay invisible.
 * - Reserves the banner's exact box in the server-rendered HTML (no CLS).
 * - Injects the ad only once the slot scrolls near the viewport. Because the
 *   hidden responsive variant is `display:none`, it never intersects and never
 *   loads — one slot, two sizes, one request.
 * - Fires trackEvent("ad_slot_view", { label }) once when the slot first
 *   enters the viewport, so GA4 can rank placements by actual viewability.
 *
 * 728x90 exists for the sticky bottom bar (adsterra-sticky.tsx), not for
 * article bodies — article containers cap content width (max-w-3xl ≈ 720px),
 * articles use the native unit instead.
 *
 * One banner per page: Adsterra's `atOptions` is a global that the invoke
 * script reads on load, so two slots with different keys on the same page can
 * clash. The sticky component is route-aware for exactly this reason: on pages
 * that carry a rail, its desktop tiers stand down.
 *
 * Host note: Adsterra assigns the host per banner, not per account — every
 * current size uses www.highrevenueformat.com. A future size may live on a
 * different host; add a per-format host map here if that happens.
 */

const FORMATS = {
  "728x90": { width: 728, height: 90 },
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
  "728x90":
    process.env.NEXT_PUBLIC_ADSTERRA_KEY_728X90 ??
    "c81c015459aed44f796e54a2ba56d359",
  "320x50":
    process.env.NEXT_PUBLIC_ADSTERRA_KEY_320X50 ??
    "4902863f280880059e628b4f1332f04c",
  "468x60": process.env.NEXT_PUBLIC_ADSTERRA_KEY_468X60,
  "300x250": process.env.NEXT_PUBLIC_ADSTERRA_KEY_300X250,
  "160x300": process.env.NEXT_PUBLIC_ADSTERRA_KEY_160X300,
};

const HOST =
  process.env.NEXT_PUBLIC_ADSTERRA_HOST || "www.highrevenueformat.com";

/** Set NEXT_PUBLIC_ADSTERRA_ENABLED=false to switch off every Adsterra slot. */
export const ADSTERRA_ENABLED =
  process.env.NEXT_PUBLIC_ADSTERRA_ENABLED !== "false";

interface AdsterraSlotProps {
  format: AdsterraFormat;
  /**
   * Outer wrapper classes: spacing and responsive visibility, e.g.
   * "hidden lg:block". Defaults to "my-8"; pass only display classes
   * (or "") inside a container that already handles spacing.
   */
  className?: string;
  /**
   * GA4 label for the ad_slot_view event (e.g. "rail-list-160x600",
   * "sticky-728x90"). Defaults to the format, e.g. "160x600".
   */
  label?: string;
}

export function AdsterraSlot({
  format,
  className = "my-8",
  label,
}: AdsterraSlotProps) {
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

  // inView only ever flips false → true once per mount, so this fires once.
  useEffect(() => {
    if (inView) {
      trackEvent("ad_slot_view", { category: "ad", label: label ?? format });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    const el = slotRef.current;
    if (!el || !inView || !ADSTERRA_ENABLED || consentOk !== true || !key) return;
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
  if (!ADSTERRA_ENABLED || !key || consentOk === false) return null;

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
