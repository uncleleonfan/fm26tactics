import { withContentlayer } from "next-contentlayer";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  async redirects() {
    return [
      {
        // it locale removed (zero traffic validation, see docs/optimization-plan-2026-09.md §2b)
        source: "/it",
        destination: "/",
        permanent: true,
      },
      {
        source: "/it/:path*",
        destination: "/:path*",
        permanent: true,
      },
      // tr/fr/de locales removed — English-only site (LOCALE_REMOVAL_AUDIT.md)
      // Old URLs map to the equivalent English page (single hop, no chains).
      {
        source: "/tr",
        destination: "/",
        permanent: true,
      },
      {
        // avoid the /tr/ -> /tr -> / chain for trailing-slash requests
        source: "/tr/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/tr/:path*",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/fr",
        destination: "/",
        permanent: true,
      },
      {
        source: "/fr/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/fr/:path*",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/de",
        destination: "/",
        permanent: true,
      },
      {
        source: "/de/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/de/:path*",
        destination: "/:path*",
        permanent: true,
      },
      // Manager series consolidated (see docs/adsense-review-2026-09.md).
      // Eight near-identical single-club guides became two comparison articles;
      // each retired URL maps to the article that now owns that system, one hop.
      {
        source: "/blog/arteta-tactics-fm26",
        destination: "/blog/fm26-positional-control-managers",
        permanent: true,
      },
      {
        source: "/blog/alonso-tactics-fm26",
        destination: "/blog/fm26-positional-control-managers",
        permanent: true,
      },
      {
        source: "/blog/nagelsmann-tactics-fm26",
        destination: "/blog/fm26-positional-control-managers",
        permanent: true,
      },
      {
        source: "/blog/emery-tactics-fm26",
        destination: "/blog/fm26-positional-control-managers",
        permanent: true,
      },
      {
        source: "/blog/flick-barcelona-tactics-fm26",
        destination: "/blog/fm26-positional-control-managers",
        permanent: true,
      },
      {
        source: "/blog/mourinho-tactics-fm26",
        destination: "/blog/fm26-low-block-counter-managers",
        permanent: true,
      },
      {
        source: "/blog/simeone-tactics-fm26",
        destination: "/blog/fm26-low-block-counter-managers",
        permanent: true,
      },
      {
        source: "/blog/ancelotti-tactics-fm26",
        destination: "/blog/fm26-low-block-counter-managers",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default withNextIntl(withContentlayer(nextConfig));
