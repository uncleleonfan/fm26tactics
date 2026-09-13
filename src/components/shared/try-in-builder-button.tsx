"use client";

import { useMemo } from "react";
import { Wrench } from "lucide-react";
import { Link } from "@/i18n/routing";
import { formationPresets } from "@/lib/tactics-data";
import { encodeTacticSetupParam } from "@/hooks/use-tactic-builder";
import { trackEvent } from "@/lib/analytics";

interface TryInBuilderButtonProps {
  formation: string;
  /**
   * Optional 11-slot setup ({ roleId, duty, x?, y? }) matching the formation
   * preset slot order. Slots without coordinates fall back to the preset
   * positions, mirroring FormationDiagram's merge behaviour.
   */
  setup?: unknown;
}

/**
 * "Try in Builder" CTA for MDX content (blog/guides). Encodes the optional
 * setup into a ?tactic= payload so the builder opens with the exact roles;
 * falls back to ?formation= when the setup can't be encoded.
 */
export function TryInBuilderButton({ formation, setup }: TryInBuilderButtonProps) {
  const href = useMemo(() => {
    const preset = formationPresets.find((f) => f.formation === formation);
    if (!preset) return `/builder?formation=${formation}`;
    const slots = Array.isArray(setup)
      ? (setup as Array<{ roleId?: string; duty?: string; x?: number; y?: number }>)
      : [];
    const merged = preset.positions.map((pos, i) => {
      const slot = slots[i];
      return {
        roleId: slot?.roleId ?? "",
        duty: slot?.duty ?? "",
        x: typeof slot?.x === "number" ? slot.x : pos.x,
        y: typeof slot?.y === "number" ? slot.y : pos.y,
      };
    });
    const param = encodeTacticSetupParam(formation, merged);
    return param ? `/builder?tactic=${param}` : `/builder?formation=${formation}`;
  }, [formation, setup]);

  return (
    <div className="flex justify-center my-6">
      <Link
        href={href}
        onClick={() => trackEvent("blog_try_in_builder_click", { label: formation })}
        className="inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-xl bg-primary text-background-primary hover:shadow-[0_0_20px_rgba(0,230,118,0.3)] transition-all"
      >
        <Wrench className="w-3.5 h-3.5" />
        Try in Builder
      </Link>
    </div>
  );
}
