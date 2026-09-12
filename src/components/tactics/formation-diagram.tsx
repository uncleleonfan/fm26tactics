import { PlayerNode } from "@/components/builder/player-node";
import { PitchBackground } from "@/components/builder/pitch-background";
import { formationPresets, playerRoles } from "@/lib/tactics-data";
import {
  computeLabelPlacements,
  roleLabelWidth,
} from "@/tactics/visualization/label-placement";
import type { PlayerDuty } from "@/types/tactic";

/**
 * One starting-XI slot for the static formation diagram on tactic pages.
 * Coordinates follow the formation preset position order (index 0 = GK,
 * y=88 own goal → y=10 attack direction); x/y optionally override the
 * preset so an article can render its exact in-possession shape.
 */
export interface FormationSetupSlot {
  roleId: string;
  duty: PlayerDuty;
  x?: number;
  y?: number;
  /** Display abbreviation override (e.g. "DM", "CAR" for roles without a preset entry). */
  abbr?: string;
  /** Full display name override for the hover tooltip. */
  name?: string;
}

const DUTY_LABELS: Record<string, string> = {
  defend: "Defend",
  support: "Support",
  attack: "Attack",
};

function isSetupSlot(value: unknown): value is FormationSetupSlot {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<FormationSetupSlot>;
  return (
    typeof v.roleId === "string" &&
    (v.duty === "defend" || v.duty === "support" || v.duty === "attack")
  );
}

interface FormationDiagramProps {
  formation: string;
  /** Raw `setup` frontmatter value — defensively validated, null render on invalid. */
  setup: unknown;
  caption?: string;
  className?: string;
}

/**
 * Static, server-rendered formation diagram reusing the builder's pitch
 * visuals (PitchBackground + PlayerNode). No interaction, no client JS —
 * SVG-native <title> provides free hover tooltips.
 */
export function FormationDiagram({
  formation,
  setup,
  caption,
  className,
}: FormationDiagramProps) {
  const preset = formationPresets.find((f) => f.formation === formation);
  if (!preset || !Array.isArray(setup)) return null;

  const slots = (setup as unknown[]).filter(isSetupSlot);
  if (slots.length !== 11) return null;

  // Merge preset coordinates with per-article overrides.
  const players = slots.map((slot, i) => {
    const pos = preset.positions[i] ?? { x: 50, y: 50 };
    return {
      id: `slot-${i}`,
      x: typeof slot.x === "number" ? slot.x : pos.x,
      y: typeof slot.y === "number" ? slot.y : pos.y,
      roleId: slot.roleId,
      duty: slot.duty,
      individualInstructions: [],
      abbr: slot.abbr,
      name: slot.name,
    };
  });

  // Same collision-avoidance layout as the builder pitch.
  const labelPlacements = computeLabelPlacements(
    players.map((p, i) => {
      const role = playerRoles.find((r) => r.id === p.roleId);
      const abbr = p.abbr ?? role?.abbr ?? "";
      return {
        id: p.id,
        x: p.x,
        y: p.y,
        radius: i === 0 ? 3.6 : 3.2,
        labelWidth: roleLabelWidth(abbr),
      };
    })
  );

  return (
    <figure className={className ?? "my-8"} itemScope itemType="https://schema.org/ImageObject">
      <div className="mx-auto max-w-sm rounded-xl border border-surface-border bg-surface/50 overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          className="block w-full aspect-[2/3] select-none"
          role="img"
          aria-label={`${formation} formation starting eleven with player roles`}
        >
          <PitchBackground />
          {players.map((p, i) => {
            const role = playerRoles.find((r) => r.id === p.roleId);
            const abbr = p.abbr ?? role?.abbr ?? "";
            const name = p.name ?? role?.name ?? p.roleId;
            const dutyLabel = DUTY_LABELS[p.duty] ?? p.duty;
            return (
              <g key={p.id}>
                <title>{`${name} (${dutyLabel}) — ${abbr}`}</title>
                <PlayerNode
                  player={p}
                  number={i + 1}
                  isGoalkeeper={i === 0}
                  isSelected={false}
                  isDragging={false}
                  labelPlacement={labelPlacements.get(p.id)}
                  labelAbbr={p.abbr}
                />
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="mt-3 text-center text-xs text-text-muted">
        {caption ?? `${formation} starting XI — roles & duties`}
      </figcaption>
    </figure>
  );
}
