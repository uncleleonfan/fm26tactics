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
