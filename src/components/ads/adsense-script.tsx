import Script from "next/script";

const PUBLISHER_ID = "ca-pub-2798522702383698";

/**
 * Loads the AdSense library globally (once per page).
 * Equivalent to the <script async> tag Google provides.
 * Uses afterInteractive so it doesn't block first paint.
 */
export function AdSenseScript() {
  return (
    <Script
      id="adsbygoogle-init"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
