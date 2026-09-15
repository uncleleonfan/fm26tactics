"use client";

import { useEffect, useMemo, useState } from "react";
import type { BallZoneId } from "@/types/analysis";
import type { TacticBoardState, PhasePlayerMap } from "@/types/tactic";
import { resolvePhasePlayers } from "@/lib/tactic-share";
import {
  computeDefensiveScenario,
  type DefensiveResult,
} from "@/tactics/engine/defensive-engine";

const DEBOUNCE_MS = 200;

/**
 * Defensive scenario state for the out-of-possession Visualize overlay.
 * Mirrors usePhaseAnalysis: OOP coordinates are debounced so dragging
 * updates the board instantly while the scenario recomputes ~200ms
 * after movement settles; identity/role changes apply immediately.
 *
 * Scope guard (see 2a4d005): results render on the pitch overlay ONLY —
 * they never feed the right-hand analysis panel or recommendations,
 * which always follow the in-possession XI.
 */
export function useDefensiveAnalysis(
  state: TacticBoardState,
  oppBallZone: BallZoneId
): DefensiveResult {
  const [debouncedOop, setDebouncedOop] = useState<PhasePlayerMap | null>(
    () => state.phases?.["out-of-possession"] ?? null
  );

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedOop(state.phases?.["out-of-possession"] ?? null),
      DEBOUNCE_MS
    );
    return () => clearTimeout(timer);
  }, [state.phases]);

  return useMemo(() => {
    // Explicit field construction keeps TacticPhases' required shape — a
    // spread+override widens the untouched map to optional.
    const players = resolvePhasePlayers(
      debouncedOop
        ? {
            ...state,
            phases: {
              "in-possession": state.phases?.["in-possession"] ?? {},
              "out-of-possession": debouncedOop,
            },
          }
        : state,
      "out-of-possession"
    );
    return computeDefensiveScenario({
      players: players.map((p) => ({
        id: p.id,
        roleId: p.roleId,
        duty: p.duty,
        x: p.x,
        y: p.y,
      })),
      oppBallZone,
      mentality: state.teamInstructions.mentality,
      oopInstructions: state.teamInstructions.outOfPossession,
    });
  }, [state, debouncedOop, oppBallZone]);
}
