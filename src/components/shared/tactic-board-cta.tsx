"use client";

import { FormationDiagram } from "@/components/tactics/formation-diagram";
import { TryInBuilderButton } from "@/components/shared/try-in-builder-button";

interface TacticBoardCtaProps {
  formation: string;
  /**
   * Optional 11-slot setup ({ roleId, duty, x?, y? }) matching the formation
   * preset slot order; omitted coordinates fall back to preset positions.
   */
  setup?: unknown;
  caption?: string;
}

/**
 * MDX composite: a static tactics board followed by a "Try in Builder" CTA.
 * Used across blog articles wherever a tactical shape is discussed.
 */
export function TacticBoardCta({ formation, setup, caption }: TacticBoardCtaProps) {
  return (
    <div className="my-6">
      <FormationDiagram formation={formation} setup={setup} caption={caption} />
      <TryInBuilderButton formation={formation} setup={setup} />
    </div>
  );
}
