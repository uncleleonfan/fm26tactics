import dynamic from "next/dynamic";
import type { Metadata } from "next";
import Script from "next/script";
import { getTranslations } from "next-intl/server";
import { allTactics } from "contentlayer/generated";
import { Link } from "@/i18n/routing";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  MessageCircleQuestion,
  Sparkles,
  Star,
  Target,
  Wrench,
} from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { playerRoles, styleColors, styleLabels } from "@/lib/tactics-data";
import { roleDepth } from "@/lib/role-depth";
import { roleWonderkids } from "@/lib/role-wonderkids";
import { generateSEO } from "@/lib/metadata";
import type { PlayerDuty } from "@/types/tactic";

const RoleRadarChart = dynamic(
  () =>
    import("./role-radar-chart").then((mod) => mod.RoleRadarChart),
  {
    ssr: false,
    loading: () => (
      <div className="glass-panel p-6 mb-8">
        <div className="h-[300px] animate-pulse rounded-lg bg-surface/50" />
      </div>
    ),
  }
);

interface Props {
  params: { locale: string; slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const role = playerRoles.find((r) => r.id === params.slug);
  if (!role) return {};
  return generateSEO({
    title: `${role.name} FM26 — Complete Role Guide | FM26 Tactics`,
    description: role.description,
    path: `/roles/${role.id}`,
    type: "article",
    keywords: [
      `fm26 ${role.name.toLowerCase()}`,
      `${role.name.toLowerCase()} fm26`,
      "fm26 player roles",
      "football manager 2026 player roles",
      `fm 26 ${role.name.toLowerCase()}`,
      "fm26 role guide",
    ],
  });
}

const dutyColors: Record<PlayerDuty, string> = {
  defend: "#448AFF",
  support: "#FFB300",
  attack: "#FF5252",
};

const categoryKeys: Record<string, string> = {
  goalkeeper: "goalkeepers",
  defender: "defenders",
  midfielder: "midfielders",
  forward: "forwards",
};

// "Aerial Reach" -> "aerialReach" (i18n attr dictionary key)
const attrKey = (a: string) =>
  a.replace(/ (.)/g, (_m: string, c: string) => c.toUpperCase()).replace(/^./, (c: string) => c.toLowerCase());
const dutyKey = (d: string) => `duty${d.charAt(0).toUpperCase()}${d.slice(1)}`;

const tierColors: Record<string, string> = {
  Budget: "#00C853",
  Mid: "#FFB300",
  Marquee: "#FF5252",
};

export default async function RoleDetailPage({ params }: Props) {
  const { locale, slug } = params;
  const rl = await getTranslations({ locale, namespace: "roles" });
  const cm = await getTranslations({ locale, namespace: "common" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  const role = playerRoles.find((r) => r.id === slug);

  if (!role) {
    return (
      <div className="min-h-screen bg-background-primary pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">{rl("notFound")}</h1>
          <Link href="/roles" className="text-primary hover:underline">
            {rl("backToEncyclopedia")}
          </Link>
        </div>
      </div>
    );
  }

  const rName = rl.has(`roleName.${role.id}`) ? rl(`roleName.${role.id}`) : role.name;
  const depth = roleDepth[role.id];
  const wkReasons = (rl.raw(`wk.${role.id}`) as string[] | undefined) ?? [];

  const chartData = (depth?.radar ?? role.keyAttributes.map((attr) => ({
    attribute: attr,
    rating: 80,
  }))).map((d) => {
    const k = `attr.${attrKey(d.attribute)}`;
    return { ...d, attribute: rl.has(k) ? rl(k) : d.attribute };
  });

  const relatedRoles = playerRoles
    .filter((r) => r.category === role.category && r.id !== role.id)
    .slice(0, 4);

  // Tactics whose formation matches the role's best formations
  const roleFormations = role.bestFormations as string[];
  const relatedTactics = allTactics
    .filter((t) => roleFormations.includes(t.formation))
    .slice(0, 3);

  // FAQ — visible content mirrors the FAQPage JSON-LD exactly (Google guideline)
  const topAttrs = role.keyAttributes.slice(0, 3);
  const restAttrs = role.keyAttributes.slice(3);
  const faqs: Array<[string, string]> = depth
    ? [
        [
          `What is the ${role.name} role in FM26?`,
          depth.overview[0],
        ],
        [
          `What attributes does a ${role.name} need in Football Manager 2026?`,
          `The core attributes for a ${role.name} are ${topAttrs.join(", ")}${restAttrs.length ? `, supported by ${restAttrs.join(", ")}` : ""}. Prioritise the first three when scouting — they define whether the player can actually perform the role's core actions.`,
        ],
        [
          `What are the best formations for a ${role.name} in FM26?`,
          `The ${role.name} performs best in ${role.bestFormations.join(", ")} systems. ${relatedTactics.length ? `Try our ${relatedTactics[0].title} tactic to see the role working in a complete setup.` : "Check the formations page for full positional breakdowns."}`,
        ],
        [
          `When should I use a ${role.name} in Football Manager 2026?`,
          `Use the ${role.name} when: ${depth.whenToUse.whenToUse.slice(0, 3).map((s) => s.charAt(0).toLowerCase() + s.slice(1)).join("; ")}. Reconsider if ${depth.whenToUse.whenToAvoid[0].charAt(0).toLowerCase() + depth.whenToUse.whenToAvoid[0].slice(1)}.`,
        ],
      ]
    : [];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <div className="min-h-screen bg-background-primary pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Breadcrumb
          items={[
            { label: cm("home"), href: "/" },
            { label: nav("playerRoles"), href: "/roles" },
            { label: rName },
          ]}
          className="mb-6"
        />

        <Link
          href="/roles"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {rl("allRoles")}
        </Link>

        {faqJsonLd.mainEntity.length > 0 && (
          <Script
            id={`role-faq-jsonld-${role.id}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        )}

        <div>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider bg-surface px-2.5 py-1 rounded-md">
                {rl(categoryKeys[role.category])}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">{rName}</h1>
            <p className="text-text-primary/80 text-lg leading-relaxed mb-6">
              {rl.has(`roleDesc.${role.id}`) ? rl(`roleDesc.${role.id}`) : role.description}
            </p>

            {/* Duties */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-sm text-text-muted">{rl("availableDuties")}</span>
              {(["defend", "support", "attack"] as PlayerDuty[]).map((duty) => {
                const available = role.availableDuties.includes(duty);
                return (
                  <span
                    key={duty}
                    className={`text-xs font-medium px-3 py-1 rounded-full border ${
                      available
                        ? `text-${duty === "defend" ? "accent-blue" : duty === "support" ? "amber-400" : "red-400"}`
                        : "text-text-muted/50 line-through"
                    }`}
                    style={{
                      color: available ? dutyColors[duty] : undefined,
                      borderColor: available ? `${dutyColors[duty]}40` : "#1C2436",
                      backgroundColor: available ? `${dutyColors[duty]}1a` : "transparent",
                    }}
                  >
                    {rl(dutyKey(duty))}
                  </span>
                );
              })}
            </div>

            {/* Deep Overview */}
            {depth?.overview?.length ? (
              <div className="mb-8 space-y-4">
                {depth.overview.map((para, i) => (
                  <p
                    key={i}
                    className={`text-sm leading-relaxed text-text-secondary ${
                      i === 0 ? "border-l-2 border-primary pl-4 text-text-primary/85" : ""
                    }`}
                  >
                    {para}
                  </p>
                ))}
              </div>
            ) : null}

            {/* Duty Guide */}
            {depth?.dutyGuide && Object.keys(depth.dutyGuide).length > 0 ? (
              <div className="glass-panel p-6 mb-8">
                <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-primary" />
                  {rName} Duty Guide
                </h2>
                <p className="text-xs text-text-muted mb-4">
                  How the role behaves on each available duty in FM26.
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {role.availableDuties.map((duty) => {
                    const guide = depth.dutyGuide[duty as PlayerDuty];
                    if (!guide) return null;
                    const color = dutyColors[duty as PlayerDuty];
                    return (
                      <div
                        key={duty}
                        className="p-4 rounded-lg bg-surface border border-surface-border hover:border-primary/25 transition-colors"
                      >
                        <span
                          className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border mb-3"
                          style={{
                            color,
                            borderColor: `${color}40`,
                            backgroundColor: `${color}1a`,
                          }}
                        >
                          {rl(dutyKey(duty))}
                        </span>
                        <p className="text-xs text-text-primary/85 leading-relaxed mb-2">{guide.behavior}</p>
                        <p className="text-[11px] text-text-muted leading-relaxed">
                          <span className="text-primary font-medium">Best when: </span>
                          {guide.bestWhen}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Key Attributes — tiered */}
            <div className="glass-panel p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                {rl("attributes")}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {role.keyAttributes.map((attr, idx) => {
                  const k = `attr.${attrKey(attr)}`;
                  const core = idx < 3;
                  return (
                    <div
                      key={attr}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border transition-colors ${
                        core
                          ? "bg-primary/5 border-primary/30 shadow-[0_0_12px_rgba(0,230,118,0.08)]"
                          : "bg-surface border-surface-border"
                      }`}
                    >
                      <Check className={`w-3.5 h-3.5 shrink-0 ${core ? "text-primary" : "text-text-muted"}`} />
                      <span className={`text-sm ${core ? "text-text-primary font-medium" : "text-text-secondary"}`}>
                        {rl.has(k) ? rl(k) : attr}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-text-muted mt-3">
                Highlighted attributes are the non-negotiables for this role.
              </p>
            </div>
            {/* Radar Chart — lazy-loaded recharts (~250KB deferred from critical path) */}
            <RoleRadarChart roleName={rName} data={chartData} />

            {/* Suitable Formations */}
            <div className="glass-panel p-6">
              <h2 className="text-lg font-semibold mb-4">{rl("bestFormations")}</h2>
              <div className="flex flex-wrap gap-2">
                {role.bestFormations.map((formation) => (
                  <Link
                    key={formation}
                    href={`/formations#${formation}`}
                    className="px-3 py-2 rounded-lg bg-surface border border-surface-border text-sm font-mono text-text-secondary hover:text-primary hover:border-primary/30 transition-all"
                  >
                    {formation}
                  </Link>
                ))}
              </div>
            </div>

            {/* Recommended Player Preferred Moves (PPMs) */}
            {depth?.ppms?.length ? (
              <div className="glass-panel p-6 mt-8">
                <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-primary" />
                  Recommended Player Traits (PPMs)
                </h2>
                <p className="text-xs text-text-muted mb-4">
                  Train these preferred moves to get the most out of a {rName}.
                </p>
                <div className="space-y-3">
                  {depth.ppms.map((ppm) => (
                    <div
                      key={ppm.name}
                      className="flex items-start gap-3 p-3 rounded-lg bg-surface border border-surface-border"
                    >
                      <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-1" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary mb-0.5">{ppm.name}</p>
                        <p className="text-xs text-text-secondary leading-relaxed">{ppm.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Related Tactics — derived from formation match */}
            {relatedTactics.length > 0 ? (
              <div className="glass-panel p-6 mt-8">
                <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  FM26 Tactics for the {rName}
                </h2>
                <p className="text-xs text-text-muted mb-4">
                  Complete tactics built in formations where this role thrives.
                </p>
                <div className="space-y-3">
                  {relatedTactics.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/tactics/${t.slug}`}
                      className="block p-4 rounded-lg bg-surface border border-surface-border hover:border-primary/30 transition-all group"
                    >
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                          {t.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-surface-border text-text-muted">
                          {t.formation}
                        </span>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${styleColors[t.style] ?? ""}`}
                        >
                          {styleLabels[t.style] ?? t.style}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">{t.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
            {/* Best Role Partnerships */}
            {depth?.partnerships?.length ? (
              <div className="glass-panel p-6 mt-8">
                <h2 className="text-lg font-semibold mb-4">Best Role Partnerships</h2>
                <div className="space-y-3">
                  {depth.partnerships.map((p) => (
                    <Link
                      key={p.partnerId}
                      href={`/roles/${p.partnerId}`}
                      className="block p-3 rounded-lg bg-surface border border-surface-border hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-primary">{p.partner}</span>
                        <ArrowRight className="w-3 h-3 text-text-muted" />
                      </div>
                      <p className="text-xs text-text-secondary">{p.note}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {/* When to Use / When to Avoid */}
            {depth?.whenToUse ? (
              <div className="glass-panel p-6 mt-8">
                <h2 className="text-lg font-semibold mb-4">When to Use &amp; When to Avoid {rName}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-green-500">When to Use</h3>
                    <ul className="space-y-1.5">
                      {depth.whenToUse.whenToUse.map((item) => (
                        <li key={item} className="text-xs text-text-secondary flex gap-2">
                          <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-red-400">When to Avoid</h3>
                    <ul className="space-y-1.5">
                      {depth.whenToUse.whenToAvoid.map((item) => (
                        <li key={item} className="text-xs text-text-secondary flex gap-2">
                          <span className="text-red-400 shrink-0 mt-0.5">-</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Star Player Examples */}
            {depth?.starPlayers?.length ? (
              <div className="glass-panel p-6 mt-8">
                <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  Star Players for This Role
                </h2>
                <p className="text-xs text-text-muted mb-4">
                  Real-world reference points to scout against in FM26.
                </p>
                <div className="space-y-3">
                  {depth.starPlayers.map((sp) => (
                    <div
                      key={sp.name}
                      className="flex items-start gap-3 p-3 rounded-lg bg-surface border border-surface-border"
                    >
                      <Star className="w-3.5 h-3.5 text-primary shrink-0 mt-1" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-sm font-semibold text-text-primary">{sp.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full border border-primary/20 bg-primary/5 text-primary">
                            {sp.club}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">{sp.why}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Top Wonderkids for This Role */}
            {(() => {
              const picks = roleWonderkids[role.id];
              if (!picks?.length) return null;
              return (
                <div className="glass-panel p-6 mt-8">
                  <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    {rl("wkTitle")}
                  </h2>
                  <p className="text-xs text-text-muted mb-4">{rl("wkNote")}</p>
                  <div className="space-y-3">
                    {picks.map((p, i) => (
                      <div
                        key={p.name}
                        className="flex items-start gap-3 p-3 rounded-lg bg-surface border border-surface-border"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-text-primary">
                              {p.name}
                            </span>
                            <span className="text-xs text-text-muted">
                              {p.club} · {p.age}
                            </span>
                            <span
                              className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                              style={{
                                color: tierColors[p.tier],
                                borderColor: `${tierColors[p.tier]}40`,
                                backgroundColor: `${tierColors[p.tier]}1a`,
                              }}
                            >
                              {rl(`tier${p.tier}`)} · {rl(`price${p.tier}`)}
                            </span>
                          </div>
                          <p className="text-xs mt-1.5 text-text-secondary">{wkReasons[i] ?? p.reason}</p>
                        </div>
                        <span className="shrink-0 text-[11px] font-mono px-2 py-1 rounded-md bg-surface border border-surface-border text-text-secondary">
                          {p.duty}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-text-muted mt-4">
                    {rl("wkMoreList")} →{" "}
                    <Link
                      href="/blog/fm26-wonderkids-by-role"
                      className="text-primary hover:underline"
                    >
                      FM26 Wonderkids by Role
                    </Link>{" "}
                    · {rl("wkMorePicks")} →{" "}
                    <Link
                      href="/blog/fm26-wonderkids-by-formation"
                      className="text-primary hover:underline"
                    >
                      FM26 Wonderkids by Formation
                    </Link>
                  </p>
                </div>
              );
            })()}

            {/* FAQ — content mirrors FAQPage JSON-LD */}
            {faqs.length > 0 ? (
              <div className="glass-panel p-6 mt-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MessageCircleQuestion className="w-4 h-4 text-primary" />
                  {rName} FM26 FAQ
                </h2>
                <div className="divide-y divide-[#1C2436]/50">
                  {faqs.map(([q, a]) => (
                    <div key={q} className="py-4 first:pt-0 last:pb-0">
                      <h3 className="text-sm font-semibold text-text-primary mb-1.5">{q}</h3>
                      <p className="text-xs text-text-secondary leading-relaxed">{a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* FM26 Tactic Builder CTA */}
            <div className="glass-panel p-5 sticky top-24">
              <h3 className="text-sm font-semibold mb-3">{rl("tryThisRole")}</h3>
              <p className="text-xs text-text-secondary mb-4">
                {rl("tryThisRoleDesc", { role: rName })}
              </p>
              <Link
                href="/builder"
                className="block w-full py-2.5 text-center rounded-lg bg-primary text-background-primary text-sm font-semibold hover:shadow-[0_0_20px_rgba(0,230,118,0.3)] transition-all"
              >
                {rl("openBuilder")}
              </Link>
            </div>

            {/* Related Roles */}
            {relatedRoles.length > 0 && (
              <div className="glass-panel p-5">
                <h3 className="text-sm font-semibold mb-3">{rl("relatedRoles")}</h3>
                <div className="space-y-2">
                  {relatedRoles.map((r) => (
                    <Link
                      key={r.id}
                      href={`/roles/${r.id}`}
                      className="block p-3 rounded-lg bg-surface border border-surface-border hover:border-primary/20 transition-all"
                    >
                      <p className="text-sm font-medium text-text-primary mb-0.5">
                        {rl.has(`roleName.${r.id}`) ? rl(`roleName.${r.id}`) : r.name}
                      </p>
                      <p className="text-[10px] text-text-muted line-clamp-1">
                        {r.availableDuties.map((d) => rl(dutyKey(d))).join(" · ")}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
