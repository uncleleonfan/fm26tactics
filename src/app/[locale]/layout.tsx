import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MainWrapper } from "@/components/layout/main-wrapper";
import { JsonLd } from "@/components/shared/json-ld";
import { GoogleAnalytics } from "@/components/shared/google-analytics";
import { DeferredSpeedInsights } from "@/components/shared/deferred-speed-insights";
import { AdSenseScript } from "@/components/ads/adsense-script";
import { siteConfig } from "@/lib/metadata";
import { routing } from "@/i18n/routing";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0E17",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const localeOgMap: Record<string, string> = {
  en: "en_US",
};

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale;
  const ogLocale = localeOgMap[locale] || "en_US";

  return {
    title: {
      default: "Best FM26 Tactics & Formations",
      template: "%s | FM26 Tactics",
    },
    description:
      "Master Football Manager 2026 with expert tactics, proven formations, player roles analysis, and an interactive builder to craft winning strategies.",
    keywords: [
      "fm 26 tactics", "fm26 tactics", "football manager 2026",
      "fm26 formations", "tiki-taka", "player roles",
    ],
    authors: [{ name: "FM26 Tactics", url: "https://www.fm26tactics.com" }],
    metadataBase: new URL("https://www.fm26tactics.com"),
    openGraph: {
      type: "website",
      locale: ogLocale,
      url: "https://www.fm26tactics.com",
      siteName: "FM26 Tactics",
      title: "Best FM26 Tactics & Formations",
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
      images: ["https://www.fm26tactics.com/images/og/default.jpg"],
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
    alternates: {
      canonical: "https://www.fm26tactics.com",
    },
    other: {
      "google-adsense-account": "ca-pub-2798522702383698",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
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
            dateModified: "2026-08-08",
          }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-background-primary text-text-primary min-h-screen`}>
        <NextIntlClientProvider messages={messages}>
          <GoogleAnalytics />
          <AdSenseScript />
          <DeferredSpeedInsights />
          <Header />
          <MainWrapper>{children}</MainWrapper>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
