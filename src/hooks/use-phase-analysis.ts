"use client";

import { useEffect, useMemo, useState } from "react";
import type { TacticBoardState } from "@/types/tactic";
import {
  computePhaseMetrics,
  computePhaseFindings,
  type PhaseMetrics,
  type PhaseFinding,
} from "@/tactics/phases/phase-analysis";
import { analyzeTransition, type TransitionResult } from "@/tactics/phases/transition-analysis";

/**
 * Aggregated phase analysis with a debounce: dragging players updates the
 * board instantly, shape/findings recompute ~200ms after movement stops.
 */

export interface PhaseAnalysisResult {
  "in-possession": { metrics: PhaseMetrics; findings: PhaseFinding[] };
  "out-of-possession": { metrics: PhaseMetrics; findings: PhaseFinding[] };
  transition: TransitionResult;
}

const DEBOUNCE_MS = 200;

export function usePhaseAnalysis(state: TacticBoardState): PhaseAnalysisResult {
  // Debounce the phase coordinates only — identity/duties are cheap
  const [debouncedPhases, setDebouncedPhases] = useState(state.phases);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedPhases(state.phases), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [state.phases]);

  return useMemo(() => {
    const players = state.players;
    const phases = debouncedPhases ?? {
      "in-possession": Object.fromEntries(players.map((p) => [p.id, { x: p.x, y: p.y }])),
      "out-of-possession": Object.fromEntries(players.map((p) => [p.id, { x: p.x, y: p.y }])),
    };

    const inMetrics = computePhaseMetrics(players, phases["in-possession"]);
    const outMetrics = computePhaseMetrics(players, phases["out-of-possession"]);

    return {
      "in-possession": {
        metrics: inMetrics,
        findings: computePhaseFindings(inMetrics, "in-possession", players, phases["in-possession"]),
      },
      "out-of-possession": {
        metrics: outMetrics,
        findings: computePhaseFindings(outMetrics, "out-of-possession", players, phases["out-of-possession"]),
      },
      transition: analyzeTransition(players, {
        "in-possession": phases["in-possession"],
        "out-of-possession": phases["out-of-possession"],
      }),
    };
  }, [state.players, debouncedPhases]);
}
