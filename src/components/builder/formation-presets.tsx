"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { formationPresets } from "@/lib/tactics-data";
import type { FormationType } from "@/types/tactic";

interface FormationPresetsProps {
  currentFormation: FormationType;
  onSelect: (formation: FormationType) => void;
}

export function FormationPresets({ currentFormation, onSelect }: FormationPresetsProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = formationPresets.find((p) => p.formation === currentFormation);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-primary/10 border border-primary/40 text-primary font-mono text-sm font-bold tracking-wider hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(0,230,118,0.15)] transition-all"
      >
        <span>{current?.label ?? currentFormation}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 rounded-xl glass-panel border border-[#1C2436] p-1.5 z-50 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
          {formationPresets.map((preset) => {
            const active = preset.formation === currentFormation;
            return (
              <button
                key={preset.formation}
                onClick={() => {
                  onSelect(preset.formation);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  active
                    ? "bg-primary/10 border border-primary/30"
                    : "border border-transparent hover:bg-surface-hover"
                }`}
              >
                <span
                  className={`font-mono text-sm font-bold w-14 shrink-0 ${
                    active ? "text-primary" : "text-text-primary"
                  }`}
                >
                  {preset.label}
                </span>
                <span className="flex-1 text-xs text-text-muted line-clamp-2 leading-snug">
                  {preset.description}
                </span>
                {active && <Check className="w-4 h-4 text-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
