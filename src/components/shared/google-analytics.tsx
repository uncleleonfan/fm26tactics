"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { GA_MEASUREMENT_ID, trackEvent, trackPageview } from "@/lib/analytics";

export function GoogleAnalytics() {
  const pathname = usePathname();

  // SPA route changes → fire page_view (GA4 needs this on client-side navigation)
  useEffect(() => {
    trackPageview(pathname);
  }, [pathname]);

  // Global click delegation for any [data-track] element.
  // Works for both server-rendered and client-rendered nodes, so markup only
  // needs data-track / data-track-label attributes to be measured.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || typeof target.closest !== "function") return;
      const el = target.closest("[data-track]") as HTMLElement | null;
      if (!el) return;
      const action = el.dataset.track;
      if (!action) return;
      trackEvent(action, {
        category: el.dataset.trackCategory,
        label: el.dataset.trackLabel,
        value: el.dataset.trackValue ? Number(el.dataset.trackValue) : undefined,
      });
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
