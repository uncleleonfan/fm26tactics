"use client";

import { useEffect, useRef, useState } from "react";
import {
  adsAllowedOnClient,
  subscribeToConsentChanges,
} from "@/lib/consent-region";

/**
 * Adsterra Native Banner slot.
 *
 * A different format from AdsterraSlot (the fixed-size banner). The native unit
 * is a script plus a container div that the script fills:
 *
 *   <script async data-cfasync="false" src="https://<host>/<key>/invoke.js"></script>
 *   <div id="container-<key>"></div>
 *
 * The values below come from the snippet in the Adsterra dashboard — the
 * dashboard's own "ID" field is NOT the key and must not be used here.
 *
 * Environment overrides (Vercel → Environment Variables, then redeploy —
 * NEXT_PUBLIC_* values are inlined at build time):
 *   NEXT_PUBLIC_ADSTERRA_ENABLED        = false   # kill switch for every slot
 *   NEXT_PUBLIC_ADSTERRA_NATIVE_HOST    = <host>
 *   NEXT_PUBLIC_ADSTERRA_NATIVE_KEY     = <key>
 *
 * Behaviour:
 * - Renders nothing in consent regions (EEA/UK) — see lib/consent-region.ts.
 * - Renders nothing when the host or key is empty.
 * - Injects the script only once the slot scrolls near the viewport, and only
 *   after the container div exists in the DOM (the script looks it up by id).
 * - The container id must stay `container-<key>`, which is what the snippet
 *   declares.
 *
 * One native unit per page — two units with the same container id clash.
 *
 * Native units are designed to look like editorial content. That makes the
 * dashboard category blacklist (adult / gambling / dating / fake-antivirus)
 * more important here than for fixed banners: a deceptive creative sitting in
 * the article flow is both a user-experience problem and an AdSense-review
 * problem. See docs/adsense-review-2026-10.md.
 */

// `??` (not `||`) so that setting a variable to "" deliberately disables it.
const HOST =
  process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_HOST ??
  "pl30662924.profitableratecpmnetwork.com";
const KEY =
  process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_KEY ??
  "caffcdba1878c0c7c8b337c8016e362e";

/** Set NEXT_PUBLIC_ADSTERRA_ENABLED=false to switch off every Adsterra slot. */
const ENABLED = process.env.NEXT_PUBLIC_ADSTERRA_ENABLED !== "false";

// Guards against React re-mounts injecting the same script twice.
const injected = new Set<string>();

interface AdsterraNativeBannerProps {
  /** Outer wrapper classes. Defaults to "my-8". */
  className?: string;
}

export function AdsterraNativeBanner({
  className = "my-8",
}: AdsterraNativeBannerProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  // Optimistic for the server render; the effect resolves the real answer.
  const [consentOk, setConsentOk] = useState(true);

  useEffect(() => {
    const update = () => setConsentOk(adsAllowedOnClient());
    update();
    return subscribeToConsentChanges(update);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
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
    if (!inView || !ENABLED || !consentOk || !HOST || !KEY) return;
    // Refuse unexpected values rather than building a script URL out of them.
    if (!/^[A-Za-z0-9.-]+$/.test(HOST) || !/^[A-Za-z0-9_-]+$/.test(KEY)) return;
    // The container div must already be in the DOM for the script to fill it.
    if (!document.getElementById(`container-${KEY}`)) return;

    const src = `https://${HOST}/${KEY}/invoke.js`;
    if (injected.has(src)) return;
    injected.add(src);

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = src;
    // Appended to the body rather than into the React-managed subtree, so a
    // re-render can never wipe the injected node.
    document.body.appendChild(script);

    return () => {
      injected.delete(src);
      script.remove();
    };
  }, [inView, consentOk]);

  if (!ENABLED || !HOST || !KEY || !consentOk) return null;

  return (
    <div ref={wrapRef} className={className}>
      <div id={`container-${KEY}`} />
    </div>
  );
}
