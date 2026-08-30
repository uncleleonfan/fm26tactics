import type { Metadata } from "next";
import { generateLocaleSEO } from "@/lib/metadata";
import { formationPresets } from "@/lib/tactics-data";
import { allTactics } from "contentlayer/generated";
import { JsonLd } from "@/components/shared/json-ld";
import { Link } from "@/i18n/routing";
import { ArrowRight, LayoutGrid, Wrench } from "lucide-react";
import { useTranslations } from "next-intl";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return generateLocaleSEO({
    locale: params.locale,
    path: "/formations",
    en: {
      title: "FM26 Formations — Complete Football Manager 2026 Formation Guide",
      description:
        "Complete guide to Football Manager 2026 formations. Each formation includes strengths, weaknesses, recommended roles, tactical styles, and when to use it. Browse 4-3-3, 4-2-3-1, 4-4-2, 3-5-2, 3-4-3 and more.",
      keywords: [
        "fm26 formations",
        "football manager 2026 formations",
        "fm 26 formations",
        "best fm26 formation",
        "4-3-3 fm26",
        "4-2-3-1 fm26",
        "4-4-2 fm26",
        "3-5-2 fm26",
        "3-4-3 fm26",
        "football manager 2026 best formation",
      ],
    },
    tr: {
      title: "FM26 Formasyonları — Football Manager 2026 Formasyon Rehberi",
      description:
        "Football Manager 2026 formasyonları için eksiksiz rehber. Her formasyon güçlü yönleri, zayıf yönleri, önerilen roller ve taktik stilleriyle açıklanır. 4-3-3, 4-2-3-1, 4-4-2, 3-5-2, 3-4-3 ve daha fazlası.",
      keywords: [
        "fm26 formasyonları",
        "football manager 2026 formasyonları",
        "fm 26 formasyon",
        "en iyi fm26 formasyon",
        "4-3-3 fm26",
        "4-2-3-1 fm26",
        "4-4-2 fm26",
        "3-5-2 fm26",
        "3-4-3 fm26",
        "football manager 2026 en iyi formasyon",
      ],
    },
  });
}

export default function FormationsPage() {
  const t = useTranslations("formations");

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("faqQ1"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faqA1"),
        },
      },
      {
        "@type": "Question",
        name: t("faqQ2"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faqA2"),
        },
      },
      {
        "@type": "Question",
        name: t("faqQ3"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faqA3"),
        },
      },
    ],
  };

  return (
    <div className="min-h-screen -mt-16 pt-16">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        {/* Hero */}
        <section className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold">{t("heroTitle")}</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {t("heroSubtitle")}
          </p>
        </section>

        {/* Formation Cards */}
        <section className="space-y-6">
          {formationPresets.map((formation) => {
            const formationKey = `data.${formation.formation}`;

            let hasSeo = false;
            let strengths: string[] = [];
            let weaknesses: string[] = [];
            let recommendedRoles: string[] = [];
            let description = formation.description;

            try {
              const bestFor = t.raw(`${formationKey}.bestFor`);
              hasSeo = bestFor !== undefined && bestFor !== null;
              if (hasSeo) {
                strengths = t.raw(`${formationKey}.strengths`) as string[];
                weaknesses = t.raw(`${formationKey}.weaknesses`) as string[];
                recommendedRoles = t.raw(`${formationKey}.recommendedRoles`) as string[];
                description = t(`${formationKey}.description`);
              }
            } catch {
              hasSeo = false;
            }

            const relatedTactics = allTactics.filter(
              (tc) => tc.formation === formation.formation
            );

            return (
              <div
                key={formation.formation}
                id={formation.formation}
                className="glass-card rounded-2xl p-6 space-y-4 scroll-mt-20"
              >
                {/* Formation Header */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-2xl font-bold text-primary">
                    {formation.label}
                  </span>
                  <span className="text-text-secondary text-sm">
                    {description}
                  </span>
                </div>

                {hasSeo && (
                  <>
                    {/* Best For */}
                    <div className="text-sm">
                      <span className="font-semibold text-primary">{t("bestForLabel")}</span>{" "}
                      <span className="text-text-secondary">{t(`${formationKey}.bestFor`)}</span>
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-semibold mb-2 text-green-500">{t("strengthsLabel")}</h3>
                        <ul className="space-y-1">
                          {strengths.map((s) => (
                            <li key={s} className="text-xs text-text-secondary flex gap-2">
                              <span className="text-green-500 shrink-0">+</span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold mb-2 text-red-400">{t("weaknessesLabel")}</h3>
                        <ul className="space-y-1">
                          {weaknesses.map((w) => (
                            <li key={w} className="text-xs text-text-secondary flex gap-2">
                              <span className="text-red-400 shrink-0">-</span>
                              {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Recommended Roles */}
                    <div>
                      <h3 className="text-sm font-semibold mb-2">{t("recommendedRolesLabel")}</h3>
                      <div className="flex flex-wrap gap-2">
                        {recommendedRoles.map((role) => (
                          <Link
                            key={role}
                            href="/roles"
                            className="inline-flex px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                          >
                            {role}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Links: Related Tactics + Builder */}
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-primary/10">
                  {relatedTactics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {relatedTactics.map((tactic) => (
                        <Link
                          key={tactic.slug}
                          href={`/tactics/${tactic.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                          {tactic.title}
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      ))}
                    </div>
                  )}
                  <Link
                    href={`/builder?formation=${formation.formation}`}
                    className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors ml-auto"
                  >
                    <Wrench className="w-3 h-3" />
                    {t("tryInBuilder")}
                  </Link>
                </div>
              </div>
            );
          })}
        </section>

        {/* Tactics Guide Links */}
        <section className="grid sm:grid-cols-3 gap-3 pt-4">
          {[
            { label: t("tacticsLibrary"), href: "/tactics", icon: LayoutGrid },
            { label: t("bestTactics"), href: "/best", icon: ArrowRight },
            { label: t("playerRoles"), href: "/roles", icon: ArrowRight },
          ].map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="glass-card p-4 rounded-xl border border-primary/10 hover:border-primary/40 transition-colors flex items-center gap-3 group"
              >
                <Icon className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium">{link.label}</span>
                <ArrowRight className="w-4 h-4 text-primary shrink-0 ml-auto group-hover:translate-x-1 transition-transform" />
              </Link>
            );
          })}
        </section>
      </div>

      <JsonLd data={faqData} />
    </div>
  );
}
