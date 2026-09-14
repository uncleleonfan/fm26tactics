import { describe, expect, it } from "vitest";
import {
  buildShareIntentUrl,
  buildSharePath,
  buildShareText,
  buildShareUrl,
  decodeTacticState,
  encodeTacticParam,
  encodeTacticState,
  isValidTacticState,
} from "@/lib/tactic-share";
import { siteConfig } from "@/lib/metadata";
import type { TacticBoardState } from "@/types/tactic";

function makeState(): TacticBoardState {
  return {
    formation: "4-3-3",
    players: Array.from({ length: 11 }, (_, i) => ({
      id: `player-${i}`,
      x: 10 + i * 8,
      y: 20 + (i % 3) * 25,
      roleId: i === 0 ? "sweeper-keeper" : "deep-lying-playmaker",
      duty: i === 0 ? ("support" as const) : i % 2 === 0 ? ("defend" as const) : ("attack" as const),
      individualInstructions: [],
    })),
    teamInstructions: {
      mentality: "balanced",
      inPossession: ["Short Passing"],
      inTransition: [],
      outOfPossession: [],
    },
  };
}

describe("tactic codec", () => {
  it("round-trips a state through encode/decode, migrating phases on decode", () => {
    const state = makeState();
    const decoded = decodeTacticState(encodeTacticState(state));
    expect(decoded).not.toBeNull();
    expect(decoded!.formation).toBe("4-3-3");
    expect(decoded!.players).toEqual(state.players);
    expect(decoded!.teamInstructions).toEqual(state.teamInstructions);
    // Legacy payloads without phases get both maps backfilled from base positions
    expect(decoded!.phases!["in-possession"]["player-0"]).toEqual({ x: 10, y: 20 });
    expect(decoded!.phases!["out-of-possession"]["player-10"]).toEqual({ x: 90, y: 45 });
  });

  it("stays byte-compatible with links shared by the old escape/unescape encoder", () => {
    // Guards the TextEncoder rewrite: previously shared ?tactic= links must
    // keep decoding, and the same state must encode to the same string.
    const state = makeState();
    const legacy = btoa(unescape(encodeURIComponent(JSON.stringify(state))));
    expect(encodeTacticState(state)).toBe(legacy);
    expect(decodeTacticState(legacy)).toEqual(decodeTacticState(encodeTacticState(state)));
  });

  it("rejects corrupt or invalid payloads instead of throwing", () => {
    expect(decodeTacticState("not-base64!!!")).toBeNull();
    expect(decodeTacticState(btoa(JSON.stringify({ formation: "4-3-3" })))).toBeNull();
    const bad = makeState();
    bad.players.pop(); // 10 players is not football
    expect(isValidTacticState(bad)).toBe(false);
    expect(decodeTacticState(encodeTacticState(bad as unknown as TacticBoardState))).toBeNull();
  });

  it("survives a URLSearchParams round trip (+/= must not corrupt the payload)", () => {
    const param = encodeTacticParam(makeState());
    const decoded = decodeTacticState(new URLSearchParams(`tactic=${param}`).get("tactic")!);
    expect(decoded).not.toBeNull();
    expect(decoded!.players).toHaveLength(11);
  });
});

describe("share builders", () => {
  it("builds a short caption naming the shape", () => {
    const text = buildShareText("4-3-3 Gegenpress");
    expect(text).toBe("My FM26 4-3-3 Gegenpress tactic");
    // X counts the link as 23 chars; text + link must fit 280 comfortably
    expect(text.length).toBeLessThan(100);
  });

  it("points at the share landing page on the canonical site URL", () => {
    const param = encodeURIComponent("abc+/=");
    expect(buildSharePath(param)).toBe(`/share?tactic=${param}`);
    expect(buildShareUrl(param)).toBe(`${siteConfig.url}/share?tactic=${param}`);
  });

  it("builds each platform's intent URL with the encoded link and caption", () => {
    const url = `${siteConfig.url}/share?tactic=abc`;
    const text = "My FM26 4-3-3 tactic";

    const x = buildShareIntentUrl("x", url, text);
    expect(x).toMatch(/^https:\/\/twitter\.com\/intent\/tweet\?text=/);
    expect(x).toContain(`&url=${encodeURIComponent(url)}`);
    expect(decodeURIComponent(x.split("text=")[1].split("&")[0])).toBe(text);

    const fb = buildShareIntentUrl("facebook", url, text);
    expect(fb).toBe(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);

    const reddit = buildShareIntentUrl("reddit", url, text);
    expect(reddit).toMatch(/^https:\/\/www\.reddit\.com\/submit\?url=/);
    expect(decodeURIComponent(reddit.split("title=")[1])).toBe(text);
  });
});
