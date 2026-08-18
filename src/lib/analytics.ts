/**
 * GA4 event tracking helpers.
 *
 * Usage:
 *   trackEvent("builder_download", { label: "png" });
 *   trackPageview("/tactics/4-3-3-tiki-taka");
 *
 * All helpers are safe no-ops when gtag is unavailable
 * (SSR, ad-blockers, or the script hasn't loaded yet).
 */

export type TrackParams = {
  category?: string;
  label?: string;
  value?: number;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID = "G-VRVQP5CPK2";

/** Fire a GA4 event. */
export function trackEvent(action: string, params: TrackParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", action, {
    event_category: params.category,
    event_label: params.label,
    value: params.value,
  });
}

/** Fire a page_view for client-side (SPA) navigations. */
export function trackPageview(path: string) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_title: typeof document !== "undefined" ? document.title : undefined,
    page_location:
      typeof window !== "undefined" ? window.location.href : undefined,
  });
}
