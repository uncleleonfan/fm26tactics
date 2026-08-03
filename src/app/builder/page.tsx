"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCw, Download, Info, X, Settings } from "lucide-react";
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
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const selectedPlayer = state.players.find((p) => p.id === selectedPlayerId);

  const handleSelectPlayer = (playerId: string | null) => {
    setSelectedPlayerId(playerId);
    if (playerId) {
      setSidebarTab("role");
      setShowMobileSidebar(true);
    }
  };

  // Shared sidebar content for desktop and mobile
  const sidebarContent = (
    <>
      {/* Tab toggle */}
      <div className="flex border-b border-[#1C2436]/50 shrink-0">
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

      <div className="p-4 overflow-y-auto flex-1">
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
                Tap a player on the pitch to configure their role and duty
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
    </>
  );

  return (
    <div className="h-dvh bg-background-primary flex flex-col">
      {/* Top Toolbar */}
      <div className="shrink-0 border-b border-[#1C2436]/50 bg-surface/30 px-3 sm:px-4 py-2 sm:py-2.5">
        <div className="max-w-full mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <span className="w-px h-5 bg-[#1C2436] hidden sm:block" />
            <h1 className="text-sm font-semibold hidden sm:block truncate">
              <span className="gradient-text">Tactic Builder</span>
            </h1>
          </div>

          <FormationPresets
            currentFormation={state.formation}
            onSelect={setFormation}
          />

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={resetTactic}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all"
              aria-label="Reset tactic"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={() => setShowExport(true)}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg bg-primary text-background-primary text-xs font-semibold hover:shadow-[0_0_20px_rgba(0,230,118,0.3)] transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Pitch — full width on mobile, flex-1 on desktop */}
        <Pitch
          state={state}
          onMovePlayer={movePlayer}
          onSelectPlayer={handleSelectPlayer}
          selectedPlayerId={selectedPlayerId}
          onChangeRole={setPlayerRole}
          onChangeDuty={setPlayerDuty}
        />

        {/* Desktop Sidebar — hidden on mobile */}
        <aside className="hidden lg:flex lg:flex-col w-[320px] shrink-0 border-l border-[#1C2436]/50 bg-surface/30">
          {sidebarContent}
        </aside>
      </div>

      {/* Mobile: Floating settings button */}
      <button
        onClick={() => setShowMobileSidebar(true)}
        className="lg:hidden fixed bottom-4 right-4 z-30 w-12 h-12 rounded-full bg-primary text-background-primary shadow-lg flex items-center justify-center hover:shadow-[0_0_20px_rgba(0,230,118,0.4)] transition-all active:scale-95"
        aria-label="Open settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Mobile: Bottom sheet sidebar */}
      {showMobileSidebar && (
        <>
          {/* Overlay */}
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/60 animate-fade-in"
            onClick={() => setShowMobileSidebar(false)}
          />
          {/* Sheet */}
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 max-h-[65vh] bg-background-secondary rounded-t-2xl shadow-[0_-8px_32px_rgba(0,0,0,0.5)] flex flex-col animate-slide-up">
            {/* Header with close */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1C2436]/50 shrink-0">
              <h3 className="text-sm font-semibold text-text-primary">
                {sidebarTab === "role"
                  ? selectedPlayer
                    ? `Player Role — #${state.players.indexOf(selectedPlayer) + 1}`
                    : "Player Role"
                  : "Team Instructions"}
              </h3>
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </>
      )}

      {/* Export Modal */}
      {showExport && (
        <TacticExport state={state} onClose={() => setShowExport(false)} />
      )}
    </div>
  );
}
