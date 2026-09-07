import type {
  AnalysisConstraints,
  AnalysisResult,
  BallZoneId,
} from "@/types/analysis";
import { TACTICAL_MODEL_VERSION } from "@/types/analysis";
import type { TacticBoardState } from "@/types/tactic";
import { buildTacticalModel } from "@/tactics/engine/tactical-model";
import { computeSpatial } from "@/tactics/engine/spatial-engine";
import { detectRelationships } from "@/tactics/engine/relationship-engine";
import { analyzeAttack, analyzeSupport, analyseDefence } from "@/tactics/engine/balance-engine";
import { analyzeTransition, generateWarnings } from "@/tactics/engine/risk-engine";
import { generateRecommendations } from "@/tactics/engine/recommendation-engine";

export { TACTICAL_MODEL_VERSION };
export { buildTacticalModel } from "@/tactics/engine/tactical-model";
export { computeSpatial, spatialContextFor } from "@/tactics/engine/spatial-engine";
export { detectRelationships } from "@/tactics/engine/relationship-engine";
export { analyzeAttack, analyzeSupport, analyseDefence } from "@/tactics/engine/balance-engine";
export { analyzeTransition, generateWarnings } from "@/tactics/engine/risk-engine";
export { generateRecommendations } from "@/tactics/engine/recommendation-engine";
export { ballZones, zoneById, DEFAULT_BALL_ZONE, zoneAtPoint } from "@/tactics/data/zones";

/**
 * analyzeTactic — the single orchestration entry point (spec §5).
 * Pure, deterministic, framework-independent: same input → same output.
 */
export function analyzeTactic(
  state: TacticBoardState,
  ballZone: BallZoneId = "central-midfield",
  constraints?: AnalysisConstraints
): AnalysisResult {
  const model = buildTacticalModel(state);

  const { movements, zoneOccupancy } = computeSpatial(model, ballZone);
  const relationships = detectRelationships(model.players, movements);

  const attack = analyzeAttack(model.players, movements, ballZone);
  const support = analyzeSupport(model.players, movements, ballZone);
  const defence = analyseDefence(model.players, movements, ballZone);
  const transition = analyzeTransition(model.players, movements, ballZone, model.mentality);

  const warnings = generateWarnings(
    model.players,
    movements,
    zoneOccupancy,
    ballZone,
    attack,
    support,
    defence,
    transition,
    model.mentality
  );

  const recommendations = generateRecommendations(state, ballZone, {
    attack,
    support,
    defence,
    transition,
  }, constraints);

  return {
    modelVersion: TACTICAL_MODEL_VERSION,
    attack,
    support,
    defence,
    transition,
    movements,
    relationships,
    warnings,
    recommendations,
    zoneOccupancy,
  };
}
