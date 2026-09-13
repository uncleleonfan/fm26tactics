import { describe, expect, it } from "vitest";
import {
  encodeTacticSetupParam,
  decodeTacticState,
} from "@/hooks/use-tactic-builder";

// Mirrors content/tactics/4-3-3-tiki-taka.mdx frontmatter setup
const TIKI_TAKA_SETUP = [
  { roleId: "sweeper-keeper", duty: "support", x: 50, y: 88 },
  { roleId: "full-back", duty: "support", x: 12, y: 74 },
  { roleId: "ball-playing-defender", duty: "defend", x: 38, y: 78 },
  { roleId: "ball-playing-defender", duty: "defend", x: 62, y: 78 },
  { roleId: "full-back", duty: "support", x: 88, y: 74 },
  { roleId: "deep-lying-playmaker", duty: "support", x: 50, y: 58 },
  { roleId: "advanced-playmaker", duty: "support", x: 32, y: 42 },
  { roleId: "channel-midfielder", duty: "support", x: 68, y: 42 },
  { roleId: "inside-forward", duty: "support", x: 20, y: 26 },
  { roleId: "centre-forward", duty: "support", x: 50, y: 13 },
  { roleId: "inside-forward", duty: "attack", x: 80, y: 26 },
];

describe("encodeTacticSetupParam", () => {
  it("round-trips a full 11-man setup through a URL query param", () => {
    const param = encodeTacticSetupParam("4-3-3", TIKI_TAKA_SETUP);
    expect(param).toBeTruthy();

    // Simulate what the builder reads: URLSearchParams.get decodes %XX (and
    // would turn a raw "+" into a space — the param must be encoded).
    const query = new URLSearchParams(`tactic=${param}`);
    const decoded = decodeTacticState(query.get("tactic")!);

    expect(decoded).not.toBeNull();
    expect(decoded!.formation).toBe("4-3-3");
    expect(decoded!.players.map((p) => [p.roleId, p.duty, p.x, p.y])).toEqual(
      TIKI_TAKA_SETUP.map((s) => [s.roleId, s.duty, s.x, s.y])
    );
    // Both phases start at the tactic's base positions
    expect(decoded!.phases!["in-possession"]["player-5"]).toEqual({ x: 50, y: 58 });
    expect(decoded!.phases!["out-of-possession"]["player-9"]).toEqual({ x: 50, y: 13 });
  });

  it("falls back to the role's first duty when the setup duty is unavailable", () => {
    const setup = TIKI_TAKA_SETUP.map((s, i) =>
      i === 2 ? { ...s, duty: "attack" } : s // ball-playing-defender has no attack duty
    );
    const decoded = decodeTacticState(
      decodeURIComponent(encodeTacticSetupParam("4-3-3", setup)!)
    );
    expect(decoded!.players[2].duty).toBe("defend");
  });

  it("returns null for invalid setups", () => {
    expect(encodeTacticSetupParam("4-3-3", undefined)).toBeNull();
    expect(encodeTacticSetupParam("4-3-3", TIKI_TAKA_SETUP.slice(0, 10))).toBeNull();
    expect(encodeTacticSetupParam("4-1-0", TIKI_TAKA_SETUP)).toBeNull(); // unknown formation
    const badRole = TIKI_TAKA_SETUP.map((s, i) =>
      i === 5 ? { ...s, roleId: "does-not-exist" } : s
    );
    expect(encodeTacticSetupParam("4-3-3", badRole)).toBeNull();
  });
});
