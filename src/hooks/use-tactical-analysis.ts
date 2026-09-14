"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { analyzeTactic, generateRecommendations } from "@/tactics/engine";
import { DEFAULT_BALL_ZONE } from "@/tactics/data/zones";
import type {
  AnalysisConstraints,
  AnalysisResult,
  BallZoneId,
} from "@/types/analysis";
import type { PlayerRoleCategory, TacticBoardState } from "@/types/tactic";

/**
 * The recommendation search enumerates ~200 role/duty candidates through the
 * full spatial pipeline (~40ms) — cheap once, but disastrous per pointer
 * event while dragging. The core analysis runs without it (sub-millisecond);
 * recommendations recompute on a debounced snapshot of the state instead,
 * the same pattern usePhaseAnalysis uses for phase findings.
 */
const RECOMMENDATION_DEBOUNCE_MS = 250;

export function useTacticalAnalysis(state: TacticBoardState) {
  const [ballZone, setBallZone] = useState<BallZoneId>(DEFAULT_BALL_ZONE);
  const [lockedPlayerIds, setLockedPlayerIds] = useState<string[]>([]);
  const [lockedCategories, setLockedCategories] = useState<PlayerRoleCategory[]>([]);

  const constraints = useMemo<AnalysisConstraints>(
    () => ({ lockedPlayerIds, lockedCategories }),
    [lockedPlayerIds, lockedCategories]
  );

  // Fast path: every dimension, movement and warning follows the live state.
  const core = useMemo<AnalysisResult>(
    () => analyzeTactic(state, ballZone, constraints, { skipRecommendations: true }),
    [state, ballZone, constraints]
  );

  // Debounced snapshot the expensive recommendation search operates on.
  const [deferred, setDeferred] = useState({ state, ballZone });
  useEffect(() => {
    const timer = setTimeout(() => setDeferred({ state, ballZone }), RECOMMENDATION_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [state, ballZone]);

  const deferredCore = useMemo<AnalysisResult>(
    () => analyzeTactic(deferred.state, deferred.ballZone, constraints, { skipRecommendations: true }),
    [deferred, constraints]
  );

  const recommendations = useMemo(
    () =>
      generateRecommendations(
        deferred.state,
        deferred.ballZone,
        {
          attack: deferredCore.attack,
          support: deferredCore.support,
          defence: deferredCore.defence,
          transition: deferredCore.transition,
        },
        constraints
      ),
    [deferred, deferredCore, constraints]
  );

  const analysis = useMemo<AnalysisResult>(
    () => ({ ...core, recommendations }),
    [core, recommendations]
  );

  const togglePlayerLock = useCallback((playerId: string) => {
    setLockedPlayerIds((prev) =>
      prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]
    );
  }, []);

  const toggleCategoryLock = useCallback((category: PlayerRoleCategory) => {
    setLockedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  }, []);

  const clearLocks = useCallback(() => {
    setLockedPlayerIds([]);
    setLockedCategories([]);
  }, []);

  return {
    ballZone,
    setBallZone,
    analysis,
    constraints,
    lockedPlayerIds,
    lockedCategories,
    togglePlayerLock,
    toggleCategoryLock,
    clearLocks,
  };
}
