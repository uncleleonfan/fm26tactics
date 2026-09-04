import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// English-only site: old /tr /fr /de URLs are handled by permanent
// redirects in next.config.mjs (which run before this middleware), so the
// former bot-UA locale-strip logic is no longer needed.
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|images|favicon|.*\\..*).*)"],
};
