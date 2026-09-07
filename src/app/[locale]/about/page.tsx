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

        <div className="glass-panel p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">Who We Are</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            FM26 Tactics is run by a small independent team of long-time Football
            Manager players with thousands of combined hours across the series
            (FM12 through FM26). We are not affiliated with Sports Interactive or
            SEGA — we are fans building the resource we always wished existed.
            Every tactic, guide, and role breakdown on this site is written and
            tested by people who play the game daily.
          </p>
        </div>

        <div className="glass-panel p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">How We Test Tactics</h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Recommendations on this site follow a consistent testing methodology:
          </p>
          <ul className="text-text-secondary text-sm leading-relaxed space-y-2 pl-5">
            <li className="list-disc marker:text-primary">
              <span className="text-text-primary font-medium">Community data first</span> — we track FM-Arena tactic testing tables and large-sample community results as a baseline for what actually performs.
            </li>
            <li className="list-disc marker:text-primary">
              <span className="text-text-primary font-medium">Multiple saves</span> — tactics are validated across at least three different clubs and leagues before we rank or recommend them, to filter out squad-specific luck.
            </li>
            <li className="list-disc marker:text-primary">
              <span className="text-text-primary font-medium">Full-season runs</span> — we look at 30+ match samples, not 5-game streaks, before drawing conclusions about a tactic&apos;s strengths and weaknesses.
            </li>
            <li className="list-disc marker:text-primary">
              <span className="text-text-primary font-medium">Patch awareness</span> — when Sports Interactive ships match-engine patches, we re-test top tactics and update affected pages.
            </li>
          </ul>
        </div>

        <div className="glass-panel p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">Editorial &amp; Updates</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Content is reviewed and updated continuously as the FM26 meta evolves.
            Every guide and tactic page shows its own update history, and we clearly
            mark advice that changes after game patches. Spotted something outdated
            or disagree with a ranking? Reach out via the{" "}
            <Link href="/contact" className="text-primary hover:underline">
              contact page
            </Link>{" "}
            or open an issue on our GitHub — community feedback directly shapes our
            re-tests.
          </p>
        </div>

        <Link href="/" className="text-primary text-sm hover:underline">
          &larr; {a("backToHome")}
        </Link>
      </div>
    </div>
  );
}
