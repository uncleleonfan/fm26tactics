import { describe, it, expect } from "vitest";
import { arrowGeometry, MOVEMENT_STYLES } from "@/tactics/visualization/arrows";
import type { MovementType } from "@/types/analysis";

describe("arrow visualization geometry", () => {
  it("clips both ends so the arrow clears the player node and ghost marker", () => {
    const geo = arrowGeometry({ x: 50, y: 50 }, { x: 60, y: 40 });
    expect(geo).not.toBeNull();
    // Direction preserved (up-right)
    expect(geo!.x2).toBeGreaterThan(geo!.x1);
    expect(geo!.y2).toBeLessThan(geo!.y1);
    // Start pushed away from base, end pulled back from target
    expect(geo!.x1).toBeGreaterThan(50);
    expect(geo!.x2).toBeLessThan(60);
    // Angle matches the atan2 of the raw vector
    expect(geo!.angleDeg).toBeCloseTo(-45, 0);
  });

  it("returns null for negligible movement (player already at expected spot)", () => {
    expect(arrowGeometry({ x: 50, y: 50 }, { x: 50.5, y: 50.2 })).toBeNull();
    expect(arrowGeometry({ x: 50, y: 50 }, { x: 50, y: 50 })).toBeNull();
  });

  it("keeps every movement type renderable with distinct semantics", () => {
    const expected: MovementType[] = [
      "forward",
      "backward",
      "inside",
      "outside",
      "overlap",
      "underlap",
      "support",
      "cover",
      "press",
    ];
    for (const type of expected) {
      const style = MOVEMENT_STYLES[type];
      expect(style).toBeDefined();
      expect(style.stroke).toMatch(/^#[0-9A-F]{6}$/i);
      expect(style.labelKey).toMatch(/^movements\./);
    }
    // Phase encoding: attacking runs solid, recoveries dashed
    expect(MOVEMENT_STYLES.forward.dash).toBe("");
    expect(MOVEMENT_STYLES.overlap.dash).toBe("");
    expect(MOVEMENT_STYLES.backward.dash).not.toBe("");
    expect(MOVEMENT_STYLES.cover.dash).not.toBe("");
  });
});
