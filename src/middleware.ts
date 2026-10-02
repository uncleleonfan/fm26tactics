import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { CONSENT_REGION_COOKIE, needsAdConsent } from "@/lib/consent-region";

// English-only site: old /tr /fr /de URLs are handled by permanent
// redirects in next.config.mjs (which run before this middleware), so the
// former bot-UA locale-strip logic is no longer needed.
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  // Country resolution. The domain sits behind Cloudflare, so Vercel only
  // sees CF's egress PoP — whose geo regularly misclassifies visitors (CN
  // routes often land on EU PoPs -> phantom consent prompts). CF reports
  // the real visitor country on every origin pull (CF-IPCountry, "XX" when
  // unknown), so prefer it and keep Vercel's edge geo as the fallback for
  // direct (non-CF) connections and local dev. Spoofing the header only
  // lets the spoofer dismiss their own banner — self-affecting, so an
  // acceptable trade for correct classification of everyone else.
  const cfCountry = request.headers.get("cf-ipcountry");
  const vercelCountry =
    request.geo?.country ?? request.headers.get("x-vercel-ip-country");
  const country =
    cfCountry && cfCountry !== "XX" ? cfCountry : vercelCountry;
  // Consent banner globally OFF for now — small site, pre-revenue, and the
  // CF egress misclassification kept prompting non-EEA visitors. With the
  // flag down the region cookie is always "0": nobody gets prompted and
  // adsAllowed is true for everyone. The full consent stack (region cookie,
  // banner component, adsAllowed gate, footer settings link) stays wired
  // up — flip this to true to re-enable. It MUST be re-enabled before/when
  // AdSense goes live: Google requires consent management for EEA/UK.
  const CONSENT_BANNER_ENABLED = false;
  const value =
    CONSENT_BANNER_ENABLED && needsAdConsent(country) ? "1" : "0";

  if (response.cookies.get(CONSENT_REGION_COOKIE)?.value !== value) {
    response.cookies.set(CONSENT_REGION_COOKIE, value, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|images|favicon|.*\\..*).*)"],
};
