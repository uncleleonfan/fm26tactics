import { ImageResponse } from "next/og";
import { decodeTacticState, resolvePhasePlayers } from "@/lib/tactic-share";
import { formationPresets, playerRoles } from "@/lib/tactics-data";

/**
 * Dynamic OG card for shared tactics: ?tactic=<encoded state> → 1200×630 PNG
 * drawing the in-possession shape on the site's dark pitch. Shared by X /
 * Facebook / Reddit / Discord link previews (none of their intent URLs accept
 * an image attachment — the picture travels as the landing page's og:image).
 * A missing or corrupt payload degrades to the default 4-3-3 card, never a 500.
 */

const DUTY_COLORS: Record<string, string> = {
  defend: "#448AFF",
  support: "#FFB300",
  attack: "#FF5252",
};

const PITCH_SIZE = 440;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const encoded = searchParams.get("tactic");
  const state = encoded ? decodeTacticState(encoded) : null;

  const formation = state?.formation ?? "4-3-3";
  const preset = formationPresets.find((f) => f.formation === formation);
  const label = preset?.label ?? formation;

  const players = state
    ? resolvePhasePlayers(state, "in-possession").map((p) => ({
        x: p.x,
        y: p.y,
        abbr: playerRoles.find((r) => r.id === p.roleId)?.abbr ?? "",
        color: DUTY_COLORS[p.duty] ?? "#00E676",
      }))
    : // Degraded payload: draw the shape's slots without role labels.
      (preset?.positions ?? []).map((pos) => ({
        x: pos.x,
        y: pos.y,
        abbr: "",
        color: "#00E676",
      }));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#0A0E17",
          padding: "44px 60px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 4,
                color: "#00E676",
                textTransform: "uppercase",
              }}
            >
              FM26 Tactic
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 56,
                fontWeight: 700,
                color: "#F1F5F9",
                marginTop: 6,
              }}
            >
              {label}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: "auto",
              padding: "8px 18px",
              borderRadius: 999,
              border: "1px solid #1C2436",
              background: "#141A26",
              color: "#94A3B8",
              fontSize: 20,
            }}
          >
            In Possession
          </div>
        </div>

        {/* Pitch */}
        <div
          style={{
            position: "relative",
            display: "flex",
            width: PITCH_SIZE,
            height: PITCH_SIZE,
            background: "linear-gradient(180deg, #0E1625 0%, #0C1320 100%)",
            border: "2px solid #2A3750",
            borderRadius: 18,
            overflow: "hidden",
          }}
        >
          {/* Halfway line + centre circle */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              width: "100%",
              height: 2,
              background: "#2A3750",
              opacity: 0.6,
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 110,
              height: 110,
              border: "2px solid #2A3750",
              borderRadius: 999,
              opacity: 0.6,
              display: "flex",
            }}
          />
          {players.map((p, i) => (
            <div
              key={`${p.abbr}-${i}`}
              style={{
                position: "absolute",
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: "translate(-50%, -50%)",
                width: 54,
                height: 54,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#0A0E17",
                border: `3px solid ${p.color}`,
                borderRadius: 999,
                color: p.color,
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              {p.abbr}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", fontSize: 22, color: "#94A3B8" }}>
            Open this tactic in the interactive builder
          </div>
          <div style={{ display: "flex", fontSize: 22, fontWeight: 700, color: "#00E676" }}>
            fm26tactics.com
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
