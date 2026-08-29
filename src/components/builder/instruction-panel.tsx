"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp } from "lucide-react";
import { mentalityDescriptions } from "@/lib/tactics-data";
import { trackEvent } from "@/lib/analytics";
import type { TeamInstruction, Mentality } from "@/types/tactic";

interface InstructionPanelProps {
  instructions: TeamInstruction;
  onSetMentality: (mentality: Mentality) => void;
  onToggleInstruction: (
    category: "inPossession" | "inTransition" | "outOfPossession",
    instruction: string
  ) => void;
}

const mentalities: Mentality[] = [
  "very-defensive", "defensive", "cautious", "balanced",
  "positive", "attacking", "very-attacking",
];

const inPossessionInstructions = [
  "Play Out of Defense",
  "Work Ball Into Box",
  "Hit Early Crosses",
  "Shoot On Sight",
  "Run At Defense",
  "Be More Expressive",
  "Be More Disciplined",
  "Dribble Less",
];

const inTransitionInstructions = [
  "Counter-Press",
  "Regroup",
  "Hold Shape",
  "Counter",
  "Distribute Quickly",
  "Distribute to Target Forward",
  "Take Short Kicks",
  "Distribute to Full-Backs",
];

const outOfPossessionInstructions = [
  "Higher Defensive Line",
  "Lower Defensive Line",
  "Much Higher Defensive Line",
  "Much Lower Defensive Line",
  "High Press",
  "Low Block",
  "Get Stuck In",
  "Stay On Feet",
  "Offside Trap",
  "Tighter Marking",
  "Prevent Short GK Distribution",
  "Invite Crosses",
];

export function InstructionPanel({
  instructions,
  onSetMentality,
  onToggleInstruction,
}: InstructionPanelProps) {
  const b = useTranslations("builder");
  const [activeTab, setActiveTab] = useState<
    "mentality" | "inPossession" | "inTransition" | "outOfPossession"
  >("mentality");

  const tabs = [
    { key: "mentality" as const, label: b("mentality") },
    { key: "inPossession" as const, label: b("inPossession") },
    { key: "inTransition" as const, label: b("inTransition") },
    { key: "outOfPossession" as const, label: b("outOfPossession") },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-[#1C2436]/50 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              trackEvent("builder_instructions_tab", { label: tab.key });
            }}
            className={`flex-1 pb-2 text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? "text-primary border-b-2 border-primary"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mentality Tab */}
      {activeTab === "mentality" && (
        <div className="space-y-2">
          <p className="text-xs text-text-muted mb-3">
            {b("mentalityHint")}
          </p>
          {mentalities.map((m) => {
            const isSelected = instructions.mentality === m;
            const desc = mentalityDescriptions[m];
            return (
              <button
                key={m}
                onClick={() => {
                  onSetMentality(m);
                  trackEvent("builder_set_mentality", { label: m });
                }}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  isSelected
                    ? "bg-primary/10 border-primary/30"
                    : "bg-surface border-surface-border hover:border-[#1C2436]"
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-sm font-medium ${
                    isSelected ? "text-primary" : "text-text-primary"
                  }`}>
                    {m.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <p className="text-[10px] text-text-muted leading-relaxed">{desc}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* In Possession */}
      {activeTab === "inPossession" && (
        <div className="space-y-1">
          {inPossessionInstructions.map((inst) => (
            <label
              key={inst}
              className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all ${
                instructions.inPossession.includes(inst)
                  ? "bg-primary/10 border border-primary/20"
                  : "bg-surface border border-transparent hover:bg-surface-hover"
              }`}
            >
              <span className={`text-xs ${
                instructions.inPossession.includes(inst)
                  ? "text-primary font-medium"
                  : "text-text-secondary"
              }`}>
                {inst}
              </span>
              <input
                type="checkbox"
                checked={instructions.inPossession.includes(inst)}
                onChange={() => {
                  onToggleInstruction("inPossession", inst);
                  trackEvent("builder_toggle_instruction", { label: `inPossession:${inst}` });
                }}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                instructions.inPossession.includes(inst)
                  ? "bg-primary border-primary"
                  : "border-text-muted/60"
              }`}>
                {instructions.inPossession.includes(inst) && (
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <path d="M2 5l2 2 4-4" stroke="#0A0E17" strokeWidth="1.5" fill="none" />
                  </svg>
                )}
              </div>
            </label>
          ))}
        </div>
      )}

      {/* In Transition */}
      {activeTab === "inTransition" && (
        <div className="space-y-1">
          {inTransitionInstructions.map((inst) => (
            <label
              key={inst}
              className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all ${
                instructions.inTransition.includes(inst)
                  ? "bg-primary/10 border border-primary/20"
                  : "bg-surface border border-transparent hover:bg-surface-hover"
              }`}
            >
              <span className={`text-xs ${
                instructions.inTransition.includes(inst)
                  ? "text-primary font-medium"
                  : "text-text-secondary"
              }`}>
                {inst}
              </span>
              <input
                type="checkbox"
                checked={instructions.inTransition.includes(inst)}
                onChange={() => {
                  onToggleInstruction("inTransition", inst);
                  trackEvent("builder_toggle_instruction", { label: `inTransition:${inst}` });
                }}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                instructions.inTransition.includes(inst)
                  ? "bg-primary border-primary"
                  : "border-text-muted/60"
              }`}>
                {instructions.inTransition.includes(inst) && (
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <path d="M2 5l2 2 4-4" stroke="#0A0E17" strokeWidth="1.5" fill="none" />
                  </svg>
                )}
              </div>
            </label>
          ))}
        </div>
      )}

      {/* Out of Possession */}
      {activeTab === "outOfPossession" && (
        <div className="space-y-1">
          {outOfPossessionInstructions.map((inst) => (
            <label
              key={inst}
              className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all ${
                instructions.outOfPossession.includes(inst)
                  ? "bg-primary/10 border border-primary/20"
                  : "bg-surface border border-transparent hover:bg-surface-hover"
              }`}
            >
              <span className={`text-xs ${
                instructions.outOfPossession.includes(inst)
                  ? "text-primary font-medium"
                  : "text-text-secondary"
              }`}>
                {inst}
              </span>
              <input
                type="checkbox"
                checked={instructions.outOfPossession.includes(inst)}
                onChange={() => {
                  onToggleInstruction("outOfPossession", inst);
                  trackEvent("builder_toggle_instruction", { label: `outOfPossession:${inst}` });
                }}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                instructions.outOfPossession.includes(inst)
                  ? "bg-primary border-primary"
                  : "border-text-muted/60"
              }`}>
                {instructions.outOfPossession.includes(inst) && (
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <path d="M2 5l2 2 4-4" stroke="#0A0E17" strokeWidth="1.5" fill="none" />
                  </svg>
                )}
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
