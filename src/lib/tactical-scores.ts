import { BALANCE_WEIGHTS } from "@/tactics/data/analysis-config";
import type { AnalysisResult } from "@/types/analysis";

/** Weighted per-dimension scores used by before/after comparison cards. */
export interface DimensionScores {
  attack: number;
  support: number;
  defence: number;
  /** Transition risk 0-1 (lower is better). */
  risk: number;
}

export function dimensionScores(a: AnalysisResult): DimensionScores {
  const weighted = (dim: "attack" | "support" | "defence") => {
    const metrics = a[dim] as unknown as Record<string, number>;
    return Object.entries(BALANCE_WEIGHTS[dim]).reduce(
      (sum, [key, weight]) => sum + (metrics[key] ?? 0) * weight,
      0
    );
  };

  return {
    attack: weighted("attack"),
    support: weighted("support"),
    defence: weighted("defence"),
    risk: a.transition.riskScore,
  };
}
