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

  // Vercel resolves the visitor country at the edge. Locally (and in any
  // environment without geo data) it is undefined, which resolves to "no
  // consent needed" so development keeps working.
  const country =
    request.geo?.country ?? request.headers.get("x-vercel-ip-country");
  const value = needsAdConsent(country) ? "1" : "0";

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
