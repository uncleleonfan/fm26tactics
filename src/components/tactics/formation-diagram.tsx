import { PlayerNode } from "@/components/builder/player-node";
import { PitchBackground } from "@/components/builder/pitch-background";
import { formationPresets, playerRoles } from "@/lib/tactics-data";
import {
  computeLabelPlacements,
  roleLabelWidth,
} from "@/tactics/visualization/label-placement";
import {
  arrowGeometry,
  GHOST_RADIUS,
  MOVEMENT_STYLES,
} from "@/tactics/visualization/arrows";
import type { MovementType } from "@/types/analysis";
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

/**
 * One tactical movement arrow for the static diagram: from the setup slot
 * at index `from` toward (`toX`, `toY`). Types reuse the builder's movement
 * vocabulary (see MOVEMENT_STYLES) so both visuals speak the same language.
 */
export interface DiagramMovement {
  /** Index into `setup` (0 = GK). */
  from: number;
  toX: number;
  toY: number;
  type: MovementType;
}

const MOVEMENT_TYPE_KEYS = new Set<string>(Object.keys(MOVEMENT_STYLES));

/** Short English legend labels — the site is English-only. */
const LEGEND_LABELS: Record<MovementType, string> = {
  forward: "Run in behind",
  overlap: "Overlap",
  underlap: "Underlap",
  inside: "Inside channel",
  outside: "Wide run",
  support: "Support run",
  cover: "Cover / recover",
  backward: "Recover",
  press: "Press",
};

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

function isDiagramMovement(value: unknown): value is DiagramMovement {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<DiagramMovement>;
  return (
    typeof v.from === "number" &&
    Number.isInteger(v.from) &&
    v.from >= 0 &&
    v.from <= 10 &&
    typeof v.toX === "number" &&
    v.toX >= 0 &&
    v.toX <= 100 &&
    typeof v.toY === "number" &&
    v.toY >= 0 &&
    v.toY <= 100 &&
    typeof v.type === "string" &&
    MOVEMENT_TYPE_KEYS.has(v.type)
  );
}

interface FormationDiagramProps {
  formation: string;
  /** Raw `setup` frontmatter value — defensively validated, null render on invalid. */
  setup: unknown;
  /** Raw `movements` frontmatter value — defensively validated, skipped on invalid entries. */
  movements?: unknown;
  caption?: string;
  className?: string;
}

/**
 * Static, server-rendered formation diagram reusing the builder's pitch
 * visuals (PitchBackground + PlayerNode + the shared arrow geometry from
 * the visualize layer). No interaction, no client JS — SVG-native <title>
 * provides free hover tooltips.
 */
export function FormationDiagram({
  formation,
  setup,
  movements,
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

  // Keeper separation — out-of-possession shapes in articles often crammed
  // the deepest defender right on top of the keeper (e.g. GK y=91 vs cover
  // CD y=88), making the two tokens overlap. Slide the keeper toward his own
  // goal line until his circle keeps a small gap from every outfield node he
  // already sits behind; x stays centered, and a high sweeper keeper is never
  // dragged back into the defensive line.
  const GK_NODE_RADIUS = 3.6;
  const OUTFIELD_NODE_RADIUS = 3.2;
  const GK_CLEARANCE = 2.5;
  const GK_MAX_Y = 96; // node bottom edge stays inside the pitch (≤ 99.6)
  let gkY = players[0].y;
  for (let i = 1; i < players.length; i++) {
    const p = players[i];
    const need = GK_NODE_RADIUS + OUTFIELD_NODE_RADIUS + GK_CLEARANCE;
    const dx = Math.abs(p.x - players[0].x);
    if (dx >= need || gkY < p.y) continue;
    gkY = Math.max(gkY, p.y + Math.sqrt(need * need - dx * dx));
  }
  players[0].y = Math.min(gkY, GK_MAX_Y);

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

  // Direction arrows — same geometry/semantics as the builder visualize
  // layer; invalid entries and too-short movements are dropped silently.
  const arrows = (Array.isArray(movements) ? movements : [])
    .filter(isDiagramMovement)
    .map((mv, i) => {
      const from = players[mv.from];
      if (!from) return null;
      const geo = arrowGeometry(
        { x: from.x, y: from.y },
        { x: mv.toX, y: mv.toY }
      );
      if (!geo) return null;
      const role = playerRoles.find((r) => r.id === from.roleId);
      const label = from.name ?? role?.name ?? from.roleId;
      return {
        id: `mv-${i}`,
        geo,
        style: MOVEMENT_STYLES[mv.type],
        to: { x: mv.toX, y: mv.toY },
        type: mv.type,
        title: `${label} — ${LEGEND_LABELS[mv.type]}`,
      };
    })
    .filter((a): a is NonNullable<typeof a> => a !== null);

  const legendTypes = arrows.reduce<MovementType[]>(
    (acc, a) => (acc.includes(a.type) ? acc : [...acc, a.type]),
    []
  );

  return (
    <figure className={className ?? "my-8"} itemScope itemType="https://schema.org/ImageObject">
      <div className="mx-auto max-w-lg rounded-xl border border-surface-border bg-surface/50 overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          className="block w-full aspect-square select-none"
          role="img"
          aria-label={`${formation} formation starting eleven with player roles and key movement arrows`}
        >
          <PitchBackground />
          {/* Movement arrows — under the player nodes, ghost marks the expected position */}
          {arrows.map((a) => (
            <g key={a.id} pointerEvents="none">
              <circle
                cx={a.to.x}
                cy={a.to.y}
                r={GHOST_RADIUS}
                fill="none"
                stroke={a.style.stroke}
                strokeWidth="0.3"
                strokeDasharray="1,0.8"
                opacity="0.65"
              />
              <g>
                <title>{a.title}</title>
                <line
                  x1={a.geo.x1}
                  y1={a.geo.y1}
                  x2={a.geo.x2}
                  y2={a.geo.y2}
                  stroke={a.style.stroke}
                  strokeWidth="0.55"
                  strokeDasharray={a.style.dash || undefined}
                  strokeLinecap="round"
                  opacity="0.9"
                />
                <polygon
                  points={`0,${-a.geo.headLen / 2} ${a.geo.headLen},0 0,${a.geo.headLen / 2}`}
                  fill={a.style.stroke}
                  transform={`translate(${a.geo.x2}, ${a.geo.y2}) rotate(${a.geo.angleDeg})`}
                  opacity="0.9"
                />
              </g>
            </g>
          ))}
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
      {legendTypes.length > 0 && (
        <ul
          className="mx-auto mt-3 flex max-w-lg flex-wrap items-center justify-center gap-x-4 gap-y-1.5"
          aria-label="Movement arrow legend"
        >
          {legendTypes.map((type) => {
            const style = MOVEMENT_STYLES[type];
            return (
              <li key={type} className="flex items-center gap-1.5 text-[11px] text-text-muted">
                <span
                  className="inline-block h-0 w-5 shrink-0 rounded"
                  style={{
                    borderTopWidth: 2,
                    borderTopColor: style.stroke,
                    borderTopStyle: style.dash ? "dashed" : "solid",
                  }}
                />
                {LEGEND_LABELS[type]}
              </li>
            );
          })}
        </ul>
      )}
      <figcaption className="mt-2 text-center text-xs text-text-muted">
        {caption ?? `${formation} starting XI — roles, duties & key movements`}
      </figcaption>
    </figure>
  );
}
