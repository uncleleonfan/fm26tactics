import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Wrench, LinkIcon, Shapes } from "lucide-react";
import { siteConfig } from "@/lib/metadata";
import {
  buildShareText,
  decodeTacticState,
  encodeTacticParam,
  resolvePhasePlayers,
} from "@/lib/tactic-share";
import { formationPresets } from "@/lib/tactics-data";
import { StaticPhasePitch } from "@/components/builder/static-phase-pitch";

interface SharePageProps {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

function readTactic(
  searchParams: SharePageProps["searchParams"]
): { label: string; tacticParam: string } | null {
  const raw = searchParams.tactic;
  const encoded = typeof raw === "string" ? raw : undefined;
  if (!encoded) return null;
  const state = decodeTacticState(encoded);
  if (!state) return null;
  const label =
    formationPresets.find((f) => f.formation === state.formation)?.label ??
    state.formation;
  // Re-encode from the validated state — a raw (undecoded) param is never
  // echoed back into hrefs or metadata.
  return { label, tacticParam: encodeTacticParam(state) };
}

export function generateMetadata({ searchParams }: SharePageProps): Metadata {
  const tactic = readTactic(searchParams);
  // English-only site — static English metadata (same pattern as /formations).
  const title = tactic
    ? `${buildShareText(tactic.label)} — FM26 Tactics Builder`
    : "Shared FM26 Tactic — FM26 Tactics Builder";
  const description =
    "Open this tactic in the FM26 Tactic Builder: the exact XI, roles, duties and team instructions, ready to edit and export.";

  const ogImage = tactic
    ? `${siteConfig.url}/api/og?tactic=${tactic.tacticParam}`
    : "/images/og/default.jpg";

  return {
    title: { absolute: title },
    description,
    // Crawlers must not index every shared tactic — the builder page is the canonical entry.
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: tactic
        ? `${siteConfig.url}/share?tactic=${tactic.tacticParam}`
        : `${siteConfig.url}/share`,
      siteName: siteConfig.name,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function SharePage({ searchParams }: SharePageProps) {
  const t = useTranslations("shareView");
  const tactic = readTactic(searchParams);

  return (
    <div className="min-h-screen -mt-16 pt-16">
      <div className="max-w-md mx-auto px-4 py-12">
        {tactic ? (
          <div className="space-y-6 text-center">
            <div className="space-y-1.5">
              <h1 className="font-mono text-3xl font-bold gradient-text">
                {tactic.label}
              </h1>
              <p className="text-sm text-text-secondary">{t("subheading")}</p>
            </div>

            <div className="glass-card p-3">
              <SharedTacticPreview tacticParam={tactic.tacticParam} />
            </div>

            <div className="space-y-2">
              <Link
                href={`/builder?tactic=${tactic.tacticParam}`}
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-background-primary text-sm font-semibold hover:shadow-[0_0_24px_rgba(0,230,118,0.4)] transition-all"
              >
                <Wrench className="w-4 h-4" />
                {t("openInBuilder")}
              </Link>
              <p className="text-[11px] leading-snug text-text-muted">{t("openHint")}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <div className="w-14 h-14 rounded-full bg-surface border border-surface-border flex items-center justify-center mx-auto">
              <LinkIcon className="w-6 h-6 text-text-muted" />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold text-text-primary">{t("invalidTitle")}</h1>
              <p className="text-sm text-text-secondary leading-relaxed">{t("invalidBody")}</p>
            </div>
            <Link
              href="/builder"
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-background-primary text-sm font-semibold hover:shadow-[0_0_24px_rgba(0,230,118,0.4)] transition-all"
            >
              <Shapes className="w-4 h-4" />
              {t("buildYourOwn")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * The preview pitch is decoded again here (not passed down) so the server
 * render stays the single source of truth for what the page shows.
 */
function SharedTacticPreview({ tacticParam }: { tacticParam: string }) {
  const state = decodeTacticState(tacticParam);
  if (!state) return null;
  return (
    <StaticPhasePitch
      players={resolvePhasePlayers(state, "in-possession")}
      phase="in-possession"
      className="w-full aspect-square"
    />
  );
}
