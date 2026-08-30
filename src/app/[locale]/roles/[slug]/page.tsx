import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowLeft, ArrowRight, Check, Sparkles, Target, Wrench } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { playerRoles } from "@/lib/tactics-data";
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

// Best partnerships data per role
const rolePartnerships: Record<string, Array<{ partner: string; partnerId: string; note: string }>> = {
  "deep-lying-playmaker": [
    { partner: "Box-to-Box Midfielder", partnerId: "box-to-box-midfielder", note: "BBM covers the ground DLP can't, creating the perfect defensive shield while DLP orchestrates" },
    { partner: "Ball-Winning Midfielder", partnerId: "ball-winning-midfielder", note: "BWM wins the ball and gives it to DLP to distribute — classic Serie A pairing" },
    { partner: "Mezzala", partnerId: "mezzala", note: "Mezzala drifts wide and creates overloads while DLP controls the center" },
  ],
  "box-to-box-midfielder": [
    { partner: "Deep-Lying Playmaker", partnerId: "deep-lying-playmaker", note: "DLP provides the creativity, BBM provides the engine — the most balanced midfield duo" },
    { partner: "Ball-Winning Midfielder", partnerId: "ball-winning-midfielder", note: "BWM anchors defensively, allowing BBM to roam box-to-box" },
    { partner: "Advanced Playmaker", partnerId: "advanced-playmaker", note: "AP creates while BBM carries the ball forward — vertical tiki-taka setup" },
  ],
  "ball-playing-defender": [
    { partner: "No-Nonsense Centre-Back", partnerId: "no-nonsense-centre-back", note: "BPD plays, NN-CB defends — perfect complementary CB pairing" },
    { partner: "Ball-Winning Midfielder", partnerId: "ball-winning-midfielder", note: "BWM presses high, BPD steps into midfield to build from the back" },
    { partner: "Sweeper Keeper", partnerId: "sweeper-keeper", note: "SK sweeps behind the BPD, allowing the BPD to push into a high line" },
  ],
  "advanced-forward": [
    { partner: "Deep-Lying Forward", partnerId: "deep-lying-forward", note: "DLF drops deep and creates, AF stretches the defense — classic big-man/little-man" },
    { partner: "Pressing Forward", partnerId: "pressing-forward", note: "PF creates chaos pressing CBs, AF capitalizes on the space" },
    { partner: "Inside Forward", partnerId: "inside-forward", note: "IF cuts inside and links with AF in the box — devastating combination" },
  ],
};

// When to Use / When to Avoid data per role
const roleWhenToUse: Record<string, { whenToUse: string[]; whenToAvoid: string[] }> = {
  "deep-lying-playmaker": {
    whenToUse: [
      "You want to control possession and tempo",
      "You have a technically gifted passer in the DM/CM position",
      "Your tactic uses a patient build-up from the back",
      "You play with a deeper defensive line",
    ],
    whenToAvoid: [
      "Your team is slow and gets pressed high — DLP needs time on the ball",
      "You play a fast counter-attacking style",
      "Your player has low Composure and Decisions attributes",
    ],
  },
  "box-to-box-midfielder": {
    whenToUse: [
      "You want an all-action midfielder who contributes at both ends",
      "Your tactic requires runners covering large distances",
      "You have an athletic midfielder with high Stamina and Work Rate",
      "You play a pressing or high-tempo style",
    ],
    whenToAvoid: [
      "Your player has low Stamina or Natural Fitness",
      "You already have two attack-minded midfielders",
      "You need a specialist defensive midfielder instead",
    ],
  },
  "ball-playing-defender": {
    whenToUse: [
      "You want to build attacks from the back",
      "Your CB has excellent Passing, Vision, and Composure",
      "You play with a high defensive line",
      "Your tactic uses Gegenpress or Possession styles",
    ],
    whenToAvoid: [
      "Your CB has poor Passing or Technique",
      "You play a low block / defensive style",
      "Your CB has low Decisions — risk of costly turnovers",
    ],
  },
  "advanced-forward": {
    whenToUse: [
      "You need a pure goalscorer who stays high and finishes chances",
      "Your striker has elite Finishing, Composure, and Off the Ball",
      "You play with creative midfielders who can feed the AF",
      "You want a focal point for crosses and through balls",
    ],
    whenToAvoid: [
      "Your striker has poor Finishing or Composure",
      "You want a forward who drops deep and creates — use DLF instead",
      "Your team struggles to create chances — AF won't help in buildup",
    ],
  },
  "sweeper-keeper": {
    whenToUse: [
      "You play with a high defensive line",
      "Your GK is good at rushing out and distribution",
      "You want your keeper to act as a sweeper behind the defense",
    ],
    whenToAvoid: [
      "Your GK has poor Rushing Out or One-on-Ones",
      "You play with a deep defensive line",
    ],
  },
  "inside-forward": {
    whenToUse: [
      "You have a pacy, skillful winger who can cut inside",
      "You want goals from wide positions",
      "Your striker benefits from wide players creating central overloads",
    ],
    whenToAvoid: [
      "Your wide player has poor Dribbling or Finishing",
      "You want traditional crossing wingers — use Winger role instead",
    ],
  },
};

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

// Simulated attribute ratings for the radar chart
const attributeData: Record<string, Array<{ attribute: string; rating: number }>> = {
  "sweeper-keeper": [
    { attribute: "Rushing Out", rating: 95 },
    { attribute: "Passing", rating: 80 },
    { attribute: "First Touch", rating: 75 },
    { attribute: "Composure", rating: 85 },
    { attribute: "Acceleration", rating: 70 },
    { attribute: "Decisions", rating: 90 },
  ],
  "ball-playing-defender": [
    { attribute: "Passing", rating: 85 },
    { attribute: "Composure", rating: 90 },
    { attribute: "Vision", rating: 80 },
    { attribute: "First Touch", rating: 75 },
    { attribute: "Technique", rating: 70 },
    { attribute: "Decisions", rating: 85 },
  ],
  "deep-lying-playmaker": [
    { attribute: "Passing", rating: 95 },
    { attribute: "Vision", rating: 90 },
    { attribute: "Technique", rating: 85 },
    { attribute: "Decisions", rating: 90 },
    { attribute: "Composure", rating: 80 },
    { attribute: "First Touch", rating: 85 },
  ],
  "box-to-box-midfielder": [
    { attribute: "Stamina", rating: 95 },
    { attribute: "Work Rate", rating: 90 },
    { attribute: "Passing", rating: 75 },
    { attribute: "Tackling", rating: 70 },
    { attribute: "Long Shots", rating: 65 },
    { attribute: "Off the Ball", rating: 75 },
  ],
  "inside-forward": [
    { attribute: "Dribbling", rating: 90 },
    { attribute: "Finishing", rating: 85 },
    { attribute: "Acceleration", rating: 85 },
    { attribute: "Off the Ball", rating: 80 },
    { attribute: "Composure", rating: 75 },
    { attribute: "Technique", rating: 85 },
  ],
  "line-holding-keeper": [
    { attribute: "Aerial Reach", rating: 90 },
    { attribute: "Reflexes", rating: 90 },
    { attribute: "Handling", rating: 85 },
    { attribute: "Positioning", rating: 85 },
    { attribute: "Command of Area", rating: 80 },
    { attribute: "Decisions", rating: 80 },
  ],
  "overlapping-centre-back": [
    { attribute: "Pace", rating: 85 },
    { attribute: "Off the Ball", rating: 85 },
    { attribute: "Passing", rating: 75 },
    { attribute: "Work Rate", rating: 80 },
    { attribute: "Acceleration", rating: 85 },
    { attribute: "Positioning", rating: 80 },
  ],
  "playmaking-wing-back": [
    { attribute: "Passing", rating: 90 },
    { attribute: "Crossing", rating: 85 },
    { attribute: "Vision", rating: 85 },
    { attribute: "Dribbling", rating: 80 },
    { attribute: "Work Rate", rating: 85 },
    { attribute: "Stamina", rating: 85 },
  ],
  "channel-midfielder": [
    { attribute: "Off the Ball", rating: 90 },
    { attribute: "Acceleration", rating: 85 },
    { attribute: "Passing", rating: 80 },
    { attribute: "First Touch", rating: 80 },
    { attribute: "Decisions", rating: 85 },
    { attribute: "Teamwork", rating: 85 },
  ],
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
  const wkReasons = (rl.raw(`wk.${role.id}`) as string[] | undefined) ?? [];

  const chartData = (attributeData[role.id] || role.keyAttributes.map((attr) => ({
    attribute: attr,
    rating: 80,
  }))).map((d) => {
    const k = `attr.${attrKey(d.attribute)}`;
    return { ...d, attribute: rl.has(k) ? rl(k) : d.attribute };
  });

  const relatedRoles = playerRoles
    .filter((r) => r.category === role.category && r.id !== role.id)
    .slice(0, 4);

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

            {/* Key Attributes */}
            <div className="glass-panel p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                {rl("attributes")}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {role.keyAttributes.map((attr) => {
                  const k = `attr.${attrKey(attr)}`;
                  return (
                    <div
                      key={attr}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-surface border border-surface-border"
                    >
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="text-sm text-text-primary">{rl.has(k) ? rl(k) : attr}</span>
                    </div>
                  );
                })}
              </div>
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

            {/* Best Role Partnerships */}
            {(() => {
              const partnerships = rolePartnerships[role.id];
              if (!partnerships?.length) return null;
              return (
                <div className="glass-panel p-6 mt-8">
                  <h2 className="text-lg font-semibold mb-4">Best Role Partnerships</h2>
                  <div className="space-y-3">
                    {partnerships.map((p) => (
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
              );
            })()}

            {/* When to Use / When to Avoid */}
            {(() => {
              const guide = roleWhenToUse[role.id];
              if (!guide) return null;
              return (
                <div className="glass-panel p-6 mt-8">
                  <h2 className="text-lg font-semibold mb-4">When to Use &amp; When to Avoid {rName}</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold mb-2 text-green-500">When to Use</h3>
                      <ul className="space-y-1.5">
                        {guide.whenToUse.map((item) => (
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
                        {guide.whenToAvoid.map((item) => (
                          <li key={item} className="text-xs text-text-secondary flex gap-2">
                            <span className="text-red-400 shrink-0 mt-0.5">-</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })()}

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
