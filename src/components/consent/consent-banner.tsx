"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  needsConsentPromptOnClient,
  openConsentSettings,
  setConsentDecision,
  subscribeToConsentOpen,
} from "@/lib/consent-region";

/**
 * Accept / reject banner for advertising cookies.
 *
 * Only ever shown to visitors in the consent regions (EEA/UK) who have not
 * decided yet — everyone else never sees it. "Reject" is deliberately as
 * prominent and as easy as "Accept", and the decision can be changed later
 * from the footer's cookie settings link.
 *
 * This is sufficient for Adsterra. It is NOT a Google-certified CMP, so when
 * AdSense is approved this should be replaced by Google's Privacy & messaging
 * (or another certified CMP) — see docs/adsense-review-2026-10.md section 9.
 */
export function ConsentBanner() {
  const t = useTranslations("consent");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(needsConsentPromptOnClient());
    return subscribeToConsentOpen(() => setOpen(true));
  }, []);

  if (!open) return null;

  const decide = (decision: "granted" | "denied") => {
    setConsentDecision(decision);
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-label={t("title")}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-surface-border bg-surface/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:gap-6 sm:px-6">
        <div className="flex-1">
          <p className="text-sm font-semibold text-text-primary">{t("title")}</p>
          <p className="mt-1 text-xs leading-relaxed text-text-secondary">
            {t("body")}{" "}
            <Link href="/privacy" className="underline hover:text-primary">
              {t("privacy")}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide("denied")}
            className="rounded-lg border border-surface-border px-4 py-2 text-sm font-semibold text-text-secondary transition-colors hover:border-text-muted hover:text-text-primary"
          >
            {t("reject")}
          </button>
          <button
            type="button"
            onClick={() => decide("granted")}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background-primary transition-all hover:shadow-[0_0_20px_rgba(0,230,118,0.3)]"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Footer counterpart: reopens the banner so the choice can be changed. */
export function CookieSettingsButton() {
  const t = useTranslations("consent");

  return (
    <button
      type="button"
      onClick={() => openConsentSettings()}
      className="text-xs text-text-muted underline-offset-2 transition-colors hover:text-primary hover:underline"
    >
      {t("settings")}
    </button>
  );
}
