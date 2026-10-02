"use client";

import { useEffect, useState } from "react";
import {
  adsAllowedOnClient,
  subscribeToConsentChanges,
} from "@/lib/consent-region";
import { ADSTERRA_ENABLED } from "./adsterra-slot";

/**
 * Optional Adsterra page-global scripts: popunder, social bar, in-page push.
 *
 * These formats pay the most and hurt retention the most. They are OFF unless
 * the matching env URL is set at build time, so enabling any of them is a
 * deliberate deployment decision, not a code change:
 *
 *   NEXT_PUBLIC_ADSTERRA_POPUNDER_URL  = https://<host>/<key>/script.js
 *   NEXT_PUBLIC_ADSTERRA_SOCIALBAR_URL = https://<host>/<key>/script.js
 *   NEXT_PUBLIC_ADSTERRA_INPAGE_URL    = https://<host>/<key>/script.js
 *
 * Paste the full script URL from the Adsterra dashboard snippet. Unset or
 * malformed URLs render nothing. The global NEXT_PUBLIC_ADSTERRA_ENABLED=false
 * kill switch disables these too, and EEA/UK visitors without consent never
 * load them.
 */

const SCRIPT_URLS = [
  process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_URL,
  process.env.NEXT_PUBLIC_ADSTERRA_SOCIALBAR_URL,
  process.env.NEXT_PUBLIC_ADSTERRA_INPAGE_URL,
].filter(
  (url): url is string =>
    !!url && /^https:\/\/[A-Za-z0-9.-]+\/[A-Za-z0-9_/.-]+\.js$/.test(url)
);

// Module-level guard: these scripts must load once per page, not once per
// React re-mount of this component.
const loaded = new Set<string>();

export function AdsterraGlobalScript() {
  // null = not resolved yet; see adsterra-slot.tsx for the three-state rule.
  const [consentOk, setConsentOk] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setConsentOk(adsAllowedOnClient());
    update();
    return subscribeToConsentChanges(update);
  }, []);

  useEffect(() => {
    if (!ADSTERRA_ENABLED || consentOk !== true) return;

    for (const url of SCRIPT_URLS) {
      if (loaded.has(url)) continue;
      loaded.add(url);
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = url;
      document.body.appendChild(script);
    }
  }, [consentOk]);

  return null;
}
