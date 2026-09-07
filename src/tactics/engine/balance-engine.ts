import type {
  AttackAnalysis,
  DefenceAnalysis,
  PlayerMovement,
  Rating,
  SupportAnalysis,
} from "@/types/analysis";
import { BALANCE_WEIGHTS, RATING_THRESHOLDS, REST_DEFENCE, FINAL_THIRD } from "@/tactics/data/analysis-config";
import { zoneById } from "@/tactics/data/zones";
import type { TacticalPlayer } from "@/tactics/engine/tactical-model";
import { horizontalBand } from "@/tactics/engine/tactical-model";

/**
 * Balance engine — aggregates role behaviors and expected positions into
 * attack / support / defence dimension scores (spec §14-15).
 * All outputs normalized 0-1; ratings derived from RATING_THRESHOLDS.
 */

function rate(score: number): Rating {
  if (score < RATING_THRESHOLDS.weak) return "weak";
  if (score < RATING_THRESHOLDS.moderate) return "moderate";
  return "strong";
}

function avg(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

function weighted(entries: Array<[number, number]>): number {
  const totalW = entries.reduce((s, [, w]) => s + w, 0);
  if (!totalW) return 0;
  return entries.reduce((s, [v, w]) => s + v * w, 0) / totalW;
}

export function analyzeAttack(
  players: TacticalPlayer[],
  movements: PlayerMovement[],
  ballZoneId: string
): AttackAnalysis {
  const zone = zoneById[ballZoneId as keyof typeof zoneById];
  const posById = new Map(movements.map((m) => [m.playerId, m.expectedPosition]));
  const outfield = players.filter((p) => p.roleCategory !== "goalkeeper");

  const leftWide = outfield.filter((p) => horizontalBand(p.x) === "left");
  const rightWide = outfield.filter((p) => horizontalBand(p.x) === "right");

  // Width: both flanks need presence; one-sided width is partial credit.
  const leftW = Math.max(0, ...leftWide.map((p) => p.behavior.possession.width));
  const rightW = Math.max(0, ...rightWide.map((p) => p.behavior.possession.width));
  const width = (leftW * 0.55 + rightW * 0.55 + Math.min(leftW, rightW) * 0.9) / 2;

  // Penetration: average of the top-3 penetrators.
  const pens = outfield.map((p) => p.behavior.possession.penetration).sort((a, b) => b - a);
  const penetration = avg(pens.slice(0, 3));

  // Chance creation: best creator plus diminishing support from a second one.
  const creators = outfield
    .map((p) => p.behavior.possession.chanceCreation)
    .sort((a, b) => b - a);
  const chanceCreation = creators[0] * 0.7 + (creators[1] ?? 0) * 0.3;

  // Finishing: forwards' attacking + penetration mix, top-2.
  const fwds = outfield
    .filter((p) => p.roleCategory === "forward")
    .map((p) => (p.behavior.possession.attacking + p.behavior.possession.penetration) / 2)
    .sort((a, b) => b - a);
  const finishing = avg(fwds.slice(0, 2));

  // Central presence in attack: central players advanced past midfield.
  const centralAdvanced = outfield.filter((p, i) => {
    void i;
    const pos = posById.get(p.id)!;
    return horizontalBand(pos.x) === "central" && pos.y < 45;
  });
  const centralPresence = Math.min(1, centralAdvanced.length / 3);

  // Final-third presence from expected positions (attacking scenario weighting).
  const finalThirdCount = movements.filter((m) => m.expectedPosition.y < 33).length;
  const baseFinalThird =
    (finalThirdCount / FINAL_THIRD.strong) * 0.8 + (finalThirdCount >= FINAL_THIRD.moderate ? 0.2 : 0);
  const scenarioBoost = zone?.third === "attacking" ? 1.15 : 1;
  const finalThirdPresence = Math.min(1, baseFinalThird * scenarioBoost);

  const score = weighted([
    [width, BALANCE_WEIGHTS.attack.width],
    [penetration, BALANCE_WEIGHTS.attack.penetration],
    [chanceCreation, BALANCE_WEIGHTS.attack.chanceCreation],
    [finishing, BALANCE_WEIGHTS.attack.finishing],
    [centralPresence, BALANCE_WEIGHTS.attack.centralPresence],
    [Math.min(1, finalThirdPresence), BALANCE_WEIGHTS.attack.finalThirdPresence],
  ]);

  return {
    width,
    penetration,
    chanceCreation,
    finishing,
    centralPresence,
    finalThirdPresence: Math.min(1, finalThirdPresence),
    rating: rate(score),
  };
}

export function analyzeSupport(
  players: TacticalPlayer[],
  movements: PlayerMovement[],
  ballZoneId: string
): SupportAnalysis {
  const zone = zoneById[ballZoneId as keyof typeof zoneById];
  const posById = new Map(movements.map((m) => [m.playerId, m.expectedPosition]));

  // Build-up: deep players with support/composure attributes near own goal.
  const deepPlayers = players.filter((p) => {
    const pos = posById.get(p.id)!;
    return pos.y > 60;
  });
  const buildUp = Math.min(
    1,
    avg(deepPlayers.map((p) => (p.behavior.possession.support + p.behavior.possession.chanceCreation) / 2)) *
      Math.min(1, deepPlayers.length / 3)
  );

  // Midfield support density around the ball.
  const midPlayers = players.filter((p) => {
    const pos = posById.get(p.id)!;
    return pos.y >= 33 && pos.y <= 60;
  });
  const midfield = Math.min(
    1,
    avg(midPlayers.map((p) => p.behavior.possession.support)) * Math.min(1, midPlayers.length / 3)
  );

  // Wide/central support relative to ball band.
  const ballBand = zone?.band ?? "central";
  const nearBall = players.filter((p) => {
    const pos = posById.get(p.id)!;
    return horizontalBand(pos.x) === ballBand && p.roleCategory !== "goalkeeper";
  });
  const wide = ballBand === "central"
    ? avg(players
        .filter((p) => horizontalBand(posById.get(p.id)!.x) !== "central" && p.roleCategory !== "goalkeeper")
        .map((p) => p.behavior.possession.support))
    : avg(nearBall.map((p) => p.behavior.possession.support));
  const central = avg(
    players
      .filter((p) => horizontalBand(posById.get(p.id)!.x) === "central")
      .map((p) => p.behavior.possession.support)
  );

  const score = weighted([
    [buildUp, BALANCE_WEIGHTS.support.buildUp],
    [midfield, BALANCE_WEIGHTS.support.midfield],
    [wide, BALANCE_WEIGHTS.support.wide],
    [central, BALANCE_WEIGHTS.support.central],
  ]);

  return { buildUp, midfield, wide, central, rating: rate(score) };
}

export function analyseDefence(
  players: TacticalPlayer[],
  movements: PlayerMovement[],
  ballZoneId: string
): DefenceAnalysis {
  const zone = zoneById[ballZoneId as keyof typeof zoneById];
  const posById = new Map(movements.map((m) => [m.playerId, m.expectedPosition]));
  const outfield = players.filter((p) => p.roleCategory !== "goalkeeper");

  const coverage =
    avg(outfield.map((p) => p.behavior.outOfPossession.defensiveResponsibility)) *
    Math.min(1, outfield.length / 10);

  // Central protection: central-lane players' centralProtection aggregate.
  const centralDefenders = outfield.filter((p) => horizontalBand(posById.get(p.id)!.x) === "central");
  const centralProtection = Math.min(
    1,
    centralDefenders.reduce((s, p) => s + p.behavior.outOfPossession.centralProtection, 0) / 2.6
  );

  // Wide protection: weakest flank matters (chains break at the weakest link).
  const leftProt = outfield
    .filter((p) => horizontalBand(posById.get(p.id)!.x) === "left")
    .reduce((s, p) => s + p.behavior.outOfPossession.defensiveWidth * p.behavior.outOfPossession.defensiveResponsibility, 0);
  const rightProt = outfield
    .filter((p) => horizontalBand(posById.get(p.id)!.x) === "right")
    .reduce((s, p) => s + p.behavior.outOfPossession.defensiveWidth * p.behavior.outOfPossession.defensiveResponsibility, 0);
  const wideProtection = Math.min(1, (Math.min(leftProt, rightProt) * 1.2 + (leftProt + rightProt) * 0.4) / 2);

  // Rest defence: players goal-side of the ball with real defensive duty.
  const ballY = zone?.y ?? 44;
  const restDefenders = players.filter((p) => {
    const pos = posById.get(p.id)!;
    return (
      p.roleCategory !== "goalkeeper" &&
      pos.y > ballY + 6 &&
      p.behavior.outOfPossession.defensiveResponsibility > 0.5
    );
  });
  const restDefence =
    restDefenders.length >= REST_DEFENCE.strong
      ? 1
      : restDefenders.length >= REST_DEFENCE.moderate
        ? 0.6
        : Math.max(0, restDefenders.length / REST_DEFENCE.moderate) * 0.5;

  const defensiveDepth = avg(players.map((p) => p.behavior.outOfPossession.defensiveDepth));

  const score = weighted([
    [coverage, BALANCE_WEIGHTS.defence.coverage],
    [centralProtection, BALANCE_WEIGHTS.defence.centralProtection],
    [wideProtection, BALANCE_WEIGHTS.defence.wideProtection],
    [restDefence, BALANCE_WEIGHTS.defence.restDefence],
    [defensiveDepth, BALANCE_WEIGHTS.defence.defensiveDepth],
  ]);

  return { coverage, centralProtection, wideProtection, restDefence, defensiveDepth, rating: rate(score) };
}
