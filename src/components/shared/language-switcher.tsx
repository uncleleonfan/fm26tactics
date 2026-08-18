"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useTransition, useState, useRef, useEffect } from "react";
import { routing } from "@/i18n/routing";
import { trackEvent } from "@/lib/analytics";

const localeLabels: Record<string, string> = {
  en: "🇬🇧 EN",
  de: "🇩🇪 DE",
  it: "🇮🇹 IT",
  fr: "🇫🇷 FR",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchTo(nextLocale: string) {
    trackEvent("nav_lang_switch", { label: nextLocale });
    startTransition(() => {
      router.replace(
        pathname,
        { locale: nextLocale }
      );
    });
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1.5 text-sm text-text-secondary hover:text-text-primary rounded-lg hover:bg-background-tertiary transition-colors"
        aria-label="Switch language"
      >
        <span className="text-xs">{localeLabels[locale] || locale.toUpperCase()}</span>
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-36 bg-background-secondary border border-border-primary rounded-lg shadow-lg z-50 py-1 overflow-hidden">
          {routing.locales.map((l) => (
            <button
              key={l}
              onClick={() => switchTo(l)}
              disabled={isPending}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                l === locale
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-text-secondary hover:text-text-primary hover:bg-background-tertiary"
              }`}
            >
              {localeLabels[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
