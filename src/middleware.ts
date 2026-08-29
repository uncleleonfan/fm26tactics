import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const BOT_UA =
  /googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|facebot|twitterbot|ia_archiver|adsbot/i;

export default function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  const pathname = req.nextUrl.pathname;

  // Bots: strip locale prefix for untranslated shells (de/fr), serve English.
  // NOTE: tr is intentionally NOT stripped — translated /tr/tactics/* pages
  // must remain crawlable for hreflang (see docs/optimization-plan-2026-09.md §2b).
  if (BOT_UA.test(ua)) {
    const localeMatch = pathname.match(/^\/(de|fr)(\/|$)/);
    if (localeMatch) {
      const newPath = pathname.replace(/^\/(de|fr)(\/|$)/, "/");
      return NextResponse.redirect(new URL(newPath, req.url), 301);
    }
    // No prefix → let next-intl handle as default locale
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|images|favicon|.*\\..*).*)"],
};
