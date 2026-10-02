/**
 * Advertising consent, scoped to the regions that require it.
 *
 * GDPR / ePrivacy (EEA) and UK GDPR require prior consent before non-essential
 * cookies are set, and that applies to any ad network — Adsterra included. A
 * plain accept/reject banner is enough for that; the stricter requirement is
 * Google's: serving AdSense to EEA/UK traffic needs a **Google-certified CMP**
 * (IAB TCF v2.2), which is a separate step to take when AdSense is approved.
 * See docs/adsense-review-2026-10.md section 9.
 *
 * The visitor's country comes from Vercel's edge geo data, resolved in
 * middleware and stored in a cookie, so this needs no third-party IP lookup.
 */

export const CONSENT_REGION_COOKIE = "fm26-ad-consent-region";
export const CONSENT_COOKIE = "fm26-ad-consent";

export type ConsentDecision = "granted" | "denied";

/** Fired on the window when the decision changes or settings are reopened. */
const CONSENT_CHANGE_EVENT = "fm26-consent-change";
const CONSENT_OPEN_EVENT = "fm26-consent-open";

/** EU 27 + Iceland, Liechtenstein, Norway (the EEA) + the United Kingdom. */
const CONSENT_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE", "IS", "LI", "NO", "GB",
]);

export function needsAdConsent(country?: string | null): boolean {
  if (!country) return false;
  return CONSENT_COUNTRIES.has(country.trim().toUpperCase());
}

/** True when a raw cookie string comes from a consent-region visitor. */
export function isConsentRegionVisitor(cookieString: string): boolean {
  return cookieString
    .split("; ")
    .some((entry) => entry.startsWith(`${CONSENT_REGION_COOKIE}=1`));
}

/** Reads a stored decision out of a raw cookie string. */
export function readConsentDecision(cookieString: string): ConsentDecision | null {
  const entry = cookieString
    .split("; ")
    .find((part) => part.startsWith(`${CONSENT_COOKIE}=`));
  if (!entry) return null;
  const value = entry.slice(CONSENT_COOKIE.length + 1);
  return value === "granted" || value === "denied" ? value : null;
}

/**
 * Whether advertising may load, given a raw cookie string.
 *
 * Outside the consent regions no decision is needed. Inside them, ads load
 * only after an explicit "granted" — a missing or denied decision blocks them.
 */
export function adsAllowed(cookieString: string): boolean {
  if (!isConsentRegionVisitor(cookieString)) return true;
  return readConsentDecision(cookieString) === "granted";
}

/** True when the banner should be shown: consent region, no decision yet. */
export function needsConsentPrompt(cookieString: string): boolean {
  return (
    isConsentRegionVisitor(cookieString) &&
    readConsentDecision(cookieString) === null
  );
}

/**
 * Client-side check used by the ad slots.
 *
 * Fails closed when there is no document (server render). That is safe because
 * the checks run in effects, and because middleware sets the region cookie on
 * every matched request — the browser stores it from the response headers
 * before any page script runs, so even a first visit has it.
 */
export function adsAllowedOnClient(): boolean {
  if (typeof document === "undefined") return false;
  return adsAllowed(document.cookie);
}

export function needsConsentPromptOnClient(): boolean {
  if (typeof document === "undefined") return false;
  return needsConsentPrompt(document.cookie);
}

/** Stores the visitor's decision and notifies the ad slots. */
export function setConsentDecision(decision: ConsentDecision): void {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 180;
  document.cookie = `${CONSENT_COOKIE}=${decision}; path=/; max-age=${maxAge}; samesite=lax`;
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

/** Reopens the banner (used by the footer's cookie settings link). */
export function openConsentSettings(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

export function subscribeToConsentChanges(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CONSENT_CHANGE_EVENT, callback);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, callback);
}

export function subscribeToConsentOpen(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CONSENT_OPEN_EVENT, callback);
  return () => window.removeEventListener(CONSENT_OPEN_EVENT, callback);
}
