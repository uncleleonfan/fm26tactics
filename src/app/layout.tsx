import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MainWrapper } from "@/components/layout/main-wrapper";
import { JsonLd } from "@/components/shared/json-ld";
import { GoogleAnalytics } from "@/components/shared/google-analytics";
import { DeferredSpeedInsights } from "@/components/shared/deferred-speed-insights";
import { siteConfig } from "@/lib/metadata";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false, // only used for code snippets, don't compete with Inter on critical path
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0E17",
};

export const metadata: Metadata = {
  title: {
    default: "FM26 Tactics — Master Football Manager 2026",
    template: "%s | FM26 Tactics",
  },
  description:
    "Master Football Manager 2026 with expert tactics, proven formations, player roles analysis, and an interactive builder to craft winning strategies.",
  keywords: [
    "fm 26 tactics", "fm26 tactics", "football manager 2026",
    "fm26 formations", "tiki-taka", "player roles",
  ],
  authors: [{ name: "FM26 Tactics", url: "https://fm26tactics.com" }],
  metadataBase: new URL("https://fm26tactics.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fm26tactics.com",
    siteName: "FM26 Tactics",
    title: "FM26 Tactics — Master Football Manager 2026",
    description:
      "Master Football Manager 2026 with expert tactics, proven formations, and our interactive builder.",
    images: [
      {
        url: "/images/og/default.jpg",
        width: 1200,
        height: 630,
        alt: "FM26 Tactics — Football Manager 2026 Tactics Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FM26 Tactics",
    description: "Master Football Manager 2026 tactics with expert guides and an interactive builder.",
    images: ["https://fm26tactics.com/images/og/default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  verification: {
    google: undefined, // Add your Google Search Console verification code here
  },
  alternates: {
    canonical: "https://fm26tactics.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://pl30662924.effectivecpmnetwork.com" />
        <link rel="preconnect" href="https://www.highperformanceformat.com" />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteConfig.url,
            description: siteConfig.description,
            author: {
              "@type": "Person",
              name: "FM26 Tactics",
              url: siteConfig.url,
            },
            publisher: {
              "@type": "Person",
              name: "FM26 Tactics",
              url: siteConfig.url,
            },
            sameAs: [siteConfig.links.github],
            dateModified: "2026-08-03",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }}
        />
        <link rel="canonical" href="https://fm26tactics.com" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-background-primary text-text-primary min-h-screen`}>
        <GoogleAnalytics />
        <DeferredSpeedInsights />
        <Header />
        <MainWrapper>{children}</MainWrapper>
        <Footer />
      </body>
    </html>
  );
}
