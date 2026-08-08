import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generateSEO } from "@/lib/metadata";
import { Link } from "@/i18n/routing";

export const metadata: Metadata = generateSEO({
  title: "About FM26 Tactics — Your Ultimate FM26 Resource",
  description: "FM26 Tactics is the leading resource for Football Manager 2026 players.",
  path: "/about",
});

export default async function AboutPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const a = await getTranslations({ locale, namespace: "about" });
  const cm = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="min-h-screen bg-background-primary pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-4">
          {a("title")}
        </h1>
        <p className="text-text-secondary leading-relaxed mb-8">
          FM26 Tactics is the ultimate resource for Football Manager 2026 players
          looking to master the art of tactical setup. We provide in-depth guides,
          role analysis, and an interactive tactic builder — all designed to help
          you dominate the virtual dugout.
        </p>

        <div className="glass-panel p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">{a("mission")}</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Football Manager is complex, and tactics can make or break your season.
            Our mission is to demystify FM26&apos;s tactical system and give every player
            the tools to build successful, coherent game plans.
          </p>
        </div>

        <Link href="/" className="text-primary text-sm hover:underline">
          &larr; {a("backToHome")}
        </Link>
      </div>
    </div>
  );
}
