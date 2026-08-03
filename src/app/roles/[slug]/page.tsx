import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Check, Target } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { playerRoles } from "@/lib/tactics-data";
import { NativeAd } from "@/components/shared/native-ad";
import { SkyscraperAd } from "@/components/shared/skyscraper-ad";
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
  params: { slug: string };
}

const dutyColors: Record<PlayerDuty, string> = {
  defend: "#448AFF",
  support: "#FFB300",
  attack: "#FF5252",
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
};

export default function RoleDetailPage({ params }: Props) {
  const role = playerRoles.find((r) => r.id === params.slug);

  if (!role) {
    return (
      <div className="min-h-screen bg-background-primary pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Role not found</h1>
          <Link href="/roles" className="text-primary hover:underline">
            Return to Roles Encyclopedia
          </Link>
        </div>
      </div>
    );
  }

  const chartData = attributeData[role.id] || role.keyAttributes.map((attr) => ({
    attribute: attr,
    rating: 80,
  }));

  const relatedRoles = playerRoles
    .filter((r) => r.category === role.category && r.id !== role.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background-primary pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Player Roles", href: "/roles" },
            { label: role.name },
          ]}
          className="mb-6"
        />

        <Link
          href="/roles"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Roles
        </Link>

        <div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-8">
          {/* Left skyscraper ad */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <SkyscraperAd />
            </div>
          </aside>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider bg-surface px-2.5 py-1 rounded-md">
                {role.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">{role.name}</h1>
            <p className="text-text-primary/80 text-lg leading-relaxed mb-6">{role.description}</p>

            {/* Duties */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-sm text-text-muted">Available Duties:</span>
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
                    {duty.charAt(0).toUpperCase() + duty.slice(1)}
                  </span>
                );
              })}
            </div>

            {/* Key Attributes */}
            <div className="glass-panel p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Key Attributes
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {role.keyAttributes.map((attr) => (
                  <div
                    key={attr}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-surface border border-surface-border"
                  >
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-sm text-text-primary">{attr}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Radar Chart — lazy-loaded recharts (~250KB deferred from critical path) */}
            <RoleRadarChart roleName={role.name} data={chartData} />

            {/* Suitable Formations */}
            <div className="glass-panel p-6">
              <h2 className="text-lg font-semibold mb-4">Best Formations</h2>
              <div className="flex flex-wrap gap-2">
                {role.bestFormations.map((formation) => (
                  <Link
                    key={formation}
                    href={`/tactics?formation=${formation}`}
                    className="px-3 py-2 rounded-lg bg-surface border border-surface-border text-sm font-mono text-text-secondary hover:text-primary hover:border-primary/30 transition-all"
                  >
                    {formation}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Native Ad */}
            <NativeAd />

            {/* FM26 Tactic Builder CTA */}
            <div className="glass-panel p-5 sticky top-24">
              <h3 className="text-sm font-semibold mb-3">Try This Role</h3>
              <p className="text-xs text-text-secondary mb-4">
                Add {role.name} to your custom tactic using our interactive builder.
              </p>
              <Link
                href="/builder"
                className="block w-full py-2.5 text-center rounded-lg bg-primary text-background-primary text-sm font-semibold hover:shadow-[0_0_20px_rgba(0,230,118,0.3)] transition-all"
              >
                Open Tactic Builder
              </Link>
            </div>

            {/* Related Roles */}
            {relatedRoles.length > 0 && (
              <div className="glass-panel p-5">
                <h3 className="text-sm font-semibold mb-3">Related Roles</h3>
                <div className="space-y-2">
                  {relatedRoles.map((r) => (
                    <Link
                      key={r.id}
                      href={`/roles/${r.id}`}
                      className="block p-3 rounded-lg bg-surface border border-surface-border hover:border-primary/20 transition-all"
                    >
                      <p className="text-sm font-medium text-text-primary mb-0.5">{r.name}</p>
                      <p className="text-[10px] text-text-muted line-clamp-1">
                        {r.availableDuties.map((d) => d.charAt(0).toUpperCase() + d.slice(1)).join(" · ")}
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
