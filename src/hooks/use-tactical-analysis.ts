"use client";

import { useCallback, useMemo, useState } from "react";
import { analyzeTactic } from "@/tactics/engine";
import { DEFAULT_BALL_ZONE } from "@/tactics/data/zones";
import type {
  AnalysisConstraints,
  AnalysisResult,
  BallZoneId,
} from "@/types/analysis";
import type { PlayerRoleCategory, TacticBoardState } from "@/types/tactic";

/**
 * Memoized tactical analysis bound to the live builder state.
 * The engine is pure and microsecond-scale; useMemo keyed on the state
 * reference keeps re-analysis off render paths that don't touch the XI.
 */
export function useTacticalAnalysis(state: TacticBoardState) {
  const [ballZone, setBallZone] = useState<BallZoneId>(DEFAULT_BALL_ZONE);
  const [lockedPlayerIds, setLockedPlayerIds] = useState<string[]>([]);
  const [lockedCategories, setLockedCategories] = useState<PlayerRoleCategory[]>([]);

  const constraints = useMemo<AnalysisConstraints>(
    () => ({ lockedPlayerIds, lockedCategories }),
    [lockedPlayerIds, lockedCategories]
  );

  const analysis = useMemo<AnalysisResult>(
    () => analyzeTactic(state, ballZone, constraints),
    [state, ballZone, constraints]
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
