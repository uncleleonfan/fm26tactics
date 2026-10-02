"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/routing";
import { AdsterraSlot, ADSTERRA_ENABLED } from "./adsterra-slot";
import {
  adsAllowedOnClient,
  subscribeToConsentChanges,
} from "@/lib/consent-region";
import { trackEvent } from "@/lib/analytics";

/**
 * Route-aware responsive sticky banner (bottom bar on small/mid viewports,
 * right-edge vertical banner on very wide ones).
 *
 * Adsterra's fixed banner reads the `atOptions` global on load, so at most ONE
 * fixed banner may live on a page per viewport width. This component therefore
 * picks exactly one tier and renders exactly one AdsterraSlot, and it stands
 * down on desktop widths where the page already carries a structural rail
 * (rails and this sticky use the same 160x600 key):
 *
 *   tier           | width        | placement
 *   ----------------+--------------+-------------------------------------
 *   mobile         | < 768        | bottom, 320x50 (incl. /builder)
 *   desktop-bottom | 768 … cap-1  | bottom, 728x90
 *   desktop-side   | >= 1600      | right edge, 160x600 (vertical center)
 *   (none)         | >= cap (rail)| the page's own rail takes over
 *
 * Per-route caps (`cap` = first width where the page's rail appears):
 *   - xl+ rails (1280): hub/list pages + /tactics/[slug] detail
 *   - lg+ rails (1024): /roles/[slug] detail
 *   - /builder: mobile only (desktop uses the in-flow slot next to the board)
 *   - /about /contact /privacy /terms: no sticky at all
 *   - everywhere else: full three tiers
 *
 * Dismissible — the close is remembered in sessionStorage for the tab.
 * While a bottom tier is active the body gets the `fm26-sticky-bottom` class
 * so fixed-position UI (e.g. the builder's mobile FAB) can offset itself.
 */

type StickyTier = "mobile" | "desktop-bottom" | "desktop-side";

interface TierPolicy {
  mobile: boolean;
  /** First viewport width where the page's own rail takes over (0 = never). */
  railWidth: number;
  /** Whether the >=1600px right-edge tier is available at all. */
  side: boolean;
}

/**
 * Hub pages whose layout reserves a right rail from xl (1280px) up. The home
 * page is NOT here on purpose: its sections are full-bleed marketing blocks,
 * so it gets the full three sticky tiers instead of a structural rail.
 */
const RAIL_XL_PAGES = new Set([
  "/best",
  "/tactics",
  "/roles",
  "/meta",
  "/formations",
  "/blog",
  "/guides",
]);

/** Pages with no ads at all (about/contact/privacy/terms). */
const NO_AD_PAGES = new Set(["/about", "/contact", "/privacy", "/terms"]);

function tierPolicy(pathname: string): TierPolicy {
  if (NO_AD_PAGES.has(pathname)) {
    return { mobile: false, railWidth: 768, side: false };
  }
  if (pathname === "/builder") {
    return { mobile: true, railWidth: 768, side: false };
  }
  // Hub pages carry an xl+ rail; /tactics/[slug] detail also renders its rail
  // at xl+ (tactic-detail-page.tsx uses `hidden xl:block`).
  if (RAIL_XL_PAGES.has(pathname) || pathname.startsWith("/tactics/")) {
    return { mobile: true, railWidth: 1280, side: false };
  }
  // /roles/[slug] detail renders its rail at lg+ (`hidden lg:block`).
  if (pathname.startsWith("/roles/")) {
    return { mobile: true, railWidth: 1024, side: false };
  }
  return { mobile: true, railWidth: 1600, side: true };
}

const DISMISS_KEY = "fm26-sticky-dismissed";

export function AdsterraSticky() {
  const pathname = usePathname();
  const [tier, setTier] = useState<StickyTier | null>(null);
  const [dismissed, setDismissed] = useState(false);
  // null = not resolved yet (three-state; see adsterra-slot.tsx for why this
  // must not start optimistic).
  const [consentOk, setConsentOk] = useState<boolean | null>(null);

  // Pick the active tier from media queries; re-evaluates on resize crosses.
  useEffect(() => {
    const policy = tierPolicy(pathname);
    const mobileQ = window.matchMedia("(max-width: 767.98px)");
    const railQ = window.matchMedia(`(min-width: ${policy.railWidth}px)`);

    const recompute = () => {
      setTier((prev) => {
        const next: StickyTier | null = mobileQ.matches
          ? policy.mobile
            ? "mobile"
            : null
          : railQ.matches
            ? policy.side
              ? "desktop-side"
              : null
            : "desktop-bottom";
        return next === prev ? prev : next;
      });
    };

    recompute();
    mobileQ.addEventListener("change", recompute);
    railQ.addEventListener("change", recompute);
    return () => {
      mobileQ.removeEventListener("change", recompute);
      railQ.removeEventListener("change", recompute);
    };
  }, [pathname]);

  useEffect(() => {
    const update = () => setConsentOk(adsAllowedOnClient());
    update();
    return subscribeToConsentChanges(update);
  }, []);

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      /* private mode — just don't restore */
    }
  }, []);

  // Signal fixed-position UI (builder FAB) to make room for a bottom bar.
  useEffect(() => {
    const bottomActive =
      (tier === "mobile" || tier === "desktop-bottom") &&
      !dismissed &&
      consentOk === true;
    document.body.classList.toggle("fm26-sticky-bottom", bottomActive);
    return () => document.body.classList.remove("fm26-sticky-bottom");
  }, [tier, dismissed, consentOk]);

  if (
    !ADSTERRA_ENABLED ||
    !tier ||
    dismissed ||
    consentOk !== true
  ) {
    return null;
  }

  const format =
    tier === "mobile" ? "320x50" : tier === "desktop-bottom" ? "728x90" : "160x600";

  const close = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* private mode */
    }
    trackEvent("ad_sticky_closed", { category: "ad", label: `sticky-${format}` });
  };

  return (
    <div
      className={
        tier === "desktop-side"
          ? "fixed right-3 top-1/2 z-40 -translate-y-1/2"
          : "fixed inset-x-0 bottom-0 z-40 flex justify-center"
      }
      aria-hidden="true"
    >
      <div className="relative">
        <AdsterraSlot format={format} className="" label={`sticky-${format}`} />
        <button
          type="button"
          onClick={close}
          aria-label="Close ad"
          title="Close ad"
          className={
            tier === "desktop-side"
              ? "absolute -left-7 top-0 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-black/70 text-xs text-white/80 hover:bg-black"
              : "absolute -top-6 right-0 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-black/70 text-xs text-white/80 hover:bg-black"
          }
        >
          ✕
        </button>
      </div>
    </div>
  );
}
