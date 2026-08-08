import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const BOT_UA = /googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|facebot|twitterbot|ia_archiver|adsbot/i;

export default function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  const pathname = req.nextUrl.pathname;

  // Determine locale
  // 1. Bots → always English (default), strip locale prefix if present
  if (BOT_UA.test(ua)) {
    const localeMatch = pathname.match(/^\/(de|it|fr)(\/|$)/);
    if (localeMatch) {
      // Redirect bot from /de/tactics → /tactics (served as English)
      const newPath = pathname.replace(/^\/(de|it|fr)(\/|$)/, "/");
      return NextResponse.redirect(new URL(newPath, req.url), 301);
    }
    // English path, pass through
    const res = NextResponse.next();
    res.headers.set("X-Matched-Locale", "en");
    return res;
  }

  // 2. Human user — use locale from cookie or Accept-Language
  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
  let locale = cookieLocale || "en";

  // No cookie: detect from Accept-Language
  if (!cookieLocale) {
    const al = req.headers.get("accept-language") || "";
    const first = al.split(",")[0]?.trim().split("-")[0]?.slice(0, 2);
    if (first && routing.locales.includes(first as typeof routing.locales[number])) {
      locale = first;
    }
  }

  // Redirect to localized URL if needed
  const hasLocalePrefix = pathname.match(/^\/(de|it|fr)(\/|$)/);

  if (locale === "en" && hasLocalePrefix) {
    // English user on /de/tactics → redirect to /tactics
    const newPath = pathname.replace(/^\/(de|it|fr)(\/|$)/, "/");
    const response = NextResponse.redirect(new URL(newPath, req.url));
    response.cookies.set("NEXT_LOCALE", "en", { maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  if (locale !== "en" && !hasLocalePrefix) {
    // Non-English user on /tactics → redirect to /de/tactics
    const newPath = `/${locale}${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.redirect(new URL(newPath, req.url));
    response.cookies.set("NEXT_LOCALE", locale, { maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  // Already on the right URL — set locale header + persist cookie
  const res = NextResponse.next();
  res.headers.set("X-Matched-Locale", locale);
  if (!cookieLocale) {
    res.cookies.set("NEXT_LOCALE", locale, { maxAge: 60 * 60 * 24 * 365 });
  }
  return res;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|images|favicon|.*\\..*).*)"],
};
