import { describe, it, expect } from "vitest";
import {
  computeLabelPlacements,
  roleLabelWidth,
  type LabelAnchor,
} from "@/tactics/visualization/label-placement";

/** Standard outfield anchor with the minimum label box (width 5). */
function anchor(id: string, x: number, y: number, extra?: Partial<LabelAnchor>): LabelAnchor {
  return { id, x, y, radius: 3.2, labelWidth: 5, ...extra };
}

describe("roleLabelWidth", () => {
  it("matches the label box formula", () => {
    expect(roleLabelWidth("GK")).toBe(5);
    expect(roleLabelWidth("BPD")).toBe(6.5);
    expect(roleLabelWidth("DMF")).toBe(6.5);
  });
});

describe("computeLabelPlacements", () => {
  it("keeps the label above when nothing overlaps", () => {
    const result = computeLabelPlacements([
      anchor("a", 20, 50),
      anchor("b", 80, 50),
    ]);
    expect(result.get("a")).toBe("above");
    expect(result.get("b")).toBe("above");
  });

  it("moves the label below when the default spot hits another node", () => {
    // a's above-box would sit right on b's node circle
    const result = computeLabelPlacements([anchor("a", 50, 60), anchor("b", 50, 50)]);
    expect(result.get("a")).toBe("below");
    expect(result.get("b")).toBe("above");
  });

  it("falls out to the side when both above and below are blocked", () => {
    const result = computeLabelPlacements([
      anchor("a", 50, 50),
      anchor("top", 50, 41),
      anchor("bottom", 50, 59),
    ]);
    expect(result.get("a")).toBe("left");
  });

  it("tries below first when preferBelow is set", () => {
    const result = computeLabelPlacements([
      anchor("a", 50, 60, { preferBelow: true }),
      anchor("b", 50, 50),
    ]);
    expect(result.get("a")).toBe("below");
  });

  it("skips candidates that leave the pitch bounds", () => {
    // Above-box would extend past the top edge → below must win
    const result = computeLabelPlacements([anchor("gk", 50, 5)]);
    expect(result.get("gk")).toBe("below");
  });

  it("falls back deterministically to the first in-bounds candidate when all spots collide", () => {
    const result = computeLabelPlacements([
      anchor("a", 50, 50),
      anchor("top", 50, 41),
      anchor("bottom", 50, 59),
      anchor("left", 40, 50),
      anchor("right", 60, 50),
    ]);
    expect(result.get("a")).toBe("above");
  });

  it("avoids already-placed label boxes too", () => {
    // b's above-box clears a's node circle but overlaps a's placed label box
    const result = computeLabelPlacements([
      anchor("a", 40, 50),
      anchor("b", 44.5, 50),
    ]);
    expect(result.get("a")).toBe("above");
    expect(result.get("b")).toBe("below");
  });
});
