import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MainWrapper } from "@/components/layout/main-wrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "FM26 Tactics — Master Football Manager 2026",
    template: "%s | FM26 Tactics",
  },
  description:
    "The ultimate Football Manager 2026 tactics guide. Explore formations, player roles, training tips, and use our interactive tactic builder to craft winning strategies.",
  keywords: [
    "FM26", "Football Manager 2026", "tactics", "formations", "gegenpress",
    "tiki-taka", "player roles", "training", "tactic builder",
  ],
  authors: [{ name: "FM26 Tactics" }],
  metadataBase: new URL("https://fm26tactics.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fm26tactics.com",
    siteName: "FM26 Tactics",
    title: "FM26 Tactics — Master Football Manager 2026",
    description:
      "The ultimate Football Manager 2026 tactics guide. Explore formations, player roles, and use our interactive tactic builder.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FM26 Tactics",
    description: "Master Football Manager 2026 tactics",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-background-primary text-text-primary min-h-screen`}>
        <Header />
        <MainWrapper>{children}</MainWrapper>
        <Footer />
      </body>
    </html>
  );
}
