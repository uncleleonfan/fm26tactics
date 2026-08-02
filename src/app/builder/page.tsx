"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCw, Download, Info } from "lucide-react";
import { useTacticBuilder } from "@/hooks/use-tactic-builder";
import { Pitch } from "@/components/builder/pitch";
import { RoleSelector } from "@/components/builder/role-selector";
import { InstructionPanel } from "@/components/builder/instruction-panel";
import { FormationPresets } from "@/components/builder/formation-presets";
import { TacticExport } from "@/components/builder/tactic-export";
import { playerRoles } from "@/lib/tactics-data";
import type { FormationType, PlayerDuty } from "@/types/tactic";

export default function BuilderPage() {
  const {
    state,
    setFormation,
    movePlayer,
    setPlayerRole,
    setPlayerDuty,
    setTeamMentality,
    toggleInstruction,
    resetTactic,
  } = useTacticBuilder();

  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"role" | "instructions">("role");

  const selectedPlayer = state.players.find((p) => p.id === selectedPlayerId);

  return (
    <div className="h-screen bg-background-primary flex flex-col">
      {/* Top Toolbar */}
      <div className="shrink-0 glass-panel border-b border-[#1C2436]/50 px-4 py-3">
        <div className="max-w-full mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <span className="w-px h-5 bg-[#1C2436]" />
            <h1 className="text-sm font-semibold">
              <span className="gradient-text">Tactic Builder</span>
              <span className="text-text-muted ml-2 font-mono text-xs">
                {state.formation}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetTactic}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={() => setShowExport(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-background-primary text-xs font-semibold hover:shadow-[0_0_20px_rgba(0,230,118,0.3)] transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formation Presets Bar */}
      <div className="shrink-0 px-4 py-3 border-b border-[#1C2436]/30 bg-surface/30">
        <div className="max-w-full mx-auto">
          <FormationPresets
            currentFormation={state.formation}
            onSelect={setFormation}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Pitch */}
        <Pitch
          state={state}
          onMovePlayer={movePlayer}
          onSelectPlayer={setSelectedPlayerId}
          selectedPlayerId={selectedPlayerId}
          onChangeRole={setPlayerRole}
          onChangeDuty={setPlayerDuty}
        />

        {/* Right Sidebar */}
        <div className="w-[320px] shrink-0 border-l border-[#1C2436]/50 bg-surface/30 overflow-y-auto">
          {/* Tab toggle */}
          <div className="flex border-b border-[#1C2436]/50">
            <button
              onClick={() => setSidebarTab("role")}
              className={`flex-1 py-3 text-xs font-medium transition-colors ${
                sidebarTab === "role"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              Player Role
            </button>
            <button
              onClick={() => setSidebarTab("instructions")}
              className={`flex-1 py-3 text-xs font-medium transition-colors ${
                sidebarTab === "instructions"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              Team Instructions
            </button>
          </div>

          <div className="p-4">
            {sidebarTab === "role" ? (
              selectedPlayer ? (
                <RoleSelector
                  selectedRoleId={selectedPlayer.roleId}
                  selectedDuty={selectedPlayer.duty}
                  onChangeRole={(roleId) => setPlayerRole(selectedPlayer.id, roleId)}
                  onChangeDuty={(duty) => setPlayerDuty(selectedPlayer.id, duty)}
                />
              ) : (
                <div className="text-center py-8">
                  <Info className="w-8 h-8 text-text-muted mx-auto mb-3" />
                  <p className="text-sm text-text-secondary mb-1">Select a player</p>
                  <p className="text-xs text-text-muted">
                    Click on any player on the pitch to configure their role and duty
                  </p>
                </div>
              )
            ) : (
              <InstructionPanel
                instructions={state.teamInstructions}
                onSetMentality={setTeamMentality}
                onToggleInstruction={toggleInstruction}
              />
            )}
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExport && (
        <TacticExport state={state} onClose={() => setShowExport(false)} />
      )}
    </div>
  );
}
