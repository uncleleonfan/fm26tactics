import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // English-only site — /tr /fr /de were removed and now permanently
  // redirect to the equivalent English URLs (see next.config.mjs).
  locales: ["en"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
