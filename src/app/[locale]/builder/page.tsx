"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowLeft, RotateCw, Download, Info, X, Settings, LayoutGrid } from "lucide-react";
import { useTacticBuilder } from "@/hooks/use-tactic-builder";
import { trackEvent } from "@/lib/analytics";
import { formationPresets } from "@/lib/tactics-data";
import { Pitch } from "@/components/builder/pitch";
import { RoleSelector } from "@/components/builder/role-selector";
import { InstructionPanel } from "@/components/builder/instruction-panel";
import { FormationPanel } from "@/components/builder/formation-panel";
import { TacticExport } from "@/components/builder/tactic-export";
import type { FormationType, PlayerDuty } from "@/types/tactic";

export default function BuilderPage() {
  const t = useTranslations("builder");
  const cm = useTranslations("common");
  const {
    state,
    setActivePhase,
    setFormation,
    movePlayer,
    setPlayerRole,
    setPlayerDuty,
    setTeamMentality,
    toggleInstruction,
    resetTactic,
    applyTemplate,
    applyDualPhaseTemplate,
    loadTactic,
  } = useTacticBuilder();

  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"role" | "instructions" | "formation">("role");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showNudge, setShowNudge] = useState(false);

  // One-time hint nudging users to the Export button (dismissed forever after close)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = window.localStorage.getItem("fm26-builder-nudge-dismissed");
    if (!dismissed) {
      setShowNudge(true);
      trackEvent("builder_nudge_shown");
    }
  }, []);

  const dismissNudge = () => {
    setShowNudge(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("fm26-builder-nudge-dismissed", "1");
    }
    trackEvent("builder_nudge_dismiss");
  };

  const selectedPlayer = state.players.find((p) => p.id === selectedPlayerId);
  const currentFormationLabel =
    formationPresets.find((f) => f.formation === state.formation)?.label ?? state.formation;

  // Dual-phase helpers — top-level state mirrors the active phase
  const activePhase = state.activePhase ?? "inPossession";
  const phases = state.phases ?? {
    inPossession: { formation: state.formation },
    outOfPossession: { formation: state.formation },
  };
  const ipFormationLabel =
    formationPresets.find((f) => f.formation === phases.inPossession.formation)?.label ??
    phases.inPossession.formation;
  const oopFormationLabel =
    formationPresets.find((f) => f.formation === phases.outOfPossession.formation)?.label ??
    phases.outOfPossession.formation;

  const handleSwitchPhase = (phase: "inPossession" | "outOfPossession") => {
    setActivePhase(phase);
    // player ids differ between phases — reset the selection
    setSelectedPlayerId(null);
    trackEvent("builder_switch_phase", { label: phase });
  };

  const handleSelectPlayer = (playerId: string | null) => {
    setSelectedPlayerId(playerId);
  };

  const handleTapPlayer = (playerId: string) => {
    setSelectedPlayerId(playerId);
    setSidebarTab("role");
    setShowMobileSidebar(true);
    trackEvent("builder_select_player", { label: playerId });
  };

  const openFormationPanel = () => {
    setSidebarTab("formation");
    setShowMobileSidebar(true);
    trackEvent("builder_open_formation");
  };

  const sidebarContent = (
    <>
      <div className="flex border-b border-[#1C2436]/50 shrink-0">
        <button
          onClick={() => {
            setSidebarTab("role");
            trackEvent("builder_tab", { label: "role" });
          }}
          className={`flex-1 py-3 text-xs font-medium transition-colors ${
            sidebarTab === "role"
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          Player Role
        </button>
        <button
          onClick={() => {
            setSidebarTab("instructions");
            trackEvent("builder_tab", { label: "instructions" });
          }}
          className={`flex-1 py-3 text-xs font-medium transition-colors ${
            sidebarTab === "instructions"
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          {t("instructions")}
        </button>
        <button
          onClick={() => {
            setSidebarTab("formation");
            trackEvent("builder_tab", { label: "formation" });
          }}
          className={`flex-1 py-3 text-xs font-medium transition-colors ${
            sidebarTab === "formation"
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          Formation
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
        ) : sidebarTab === "instructions" ? (
          <InstructionPanel
            instructions={state.teamInstructions}
            onSetMentality={setTeamMentality}
            onToggleInstruction={toggleInstruction}
          />
        ) : (
          <FormationPanel
            currentFormation={state.formation}
            onSelect={setFormation}
            onApplyTemplate={applyTemplate}
            onApplyDualPhase={applyDualPhaseTemplate}
          />
        )}
      </div>
    </>
  );

  return (
    <div className="h-dvh bg-background-primary flex flex-col">
      <div className="shrink-0 border-b border-[#1C2436]/50 bg-surface/30 px-3 sm:px-4 py-2 sm:py-2.5">
        <div className="max-w-full mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{cm("backToHome")}</span>
            </Link>
            <span className="w-px h-5 bg-[#1C2436] hidden sm:block" />
            <h1 className="text-sm font-semibold hidden sm:block truncate">
              <span className="gradient-text">Tactic Builder</span>
            </h1>
          </div>

          <button
            onClick={openFormationPanel}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold tracking-wider transition-all ${
              sidebarTab === "formation"
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-[#0E1625] border-[#1C2436] text-text-primary hover:border-primary/40"
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-text-muted" />
            <span className="hidden sm:inline">{currentFormationLabel}</span>
            <span className="sm:hidden">Formation</span>
          </button>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => {
                resetTactic();
                trackEvent("builder_reset");
              }}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all"
              aria-label={t("reset")}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("reset")}</span>
            </button>
            <button
              onClick={() => {
                setShowExport(true);
                trackEvent("builder_open_export");
              }}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg bg-primary text-background-primary text-xs font-semibold hover:shadow-[0_0_20px_rgba(0,230,118,0.3)] transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("export")}</span>
            </button>
          </div>
        </div>
      </div>

      {showNudge && (
        <div className="shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary/10 border-b border-primary/20">
          <button
            onClick={() => {
              setShowExport(true);
              dismissNudge();
              trackEvent("builder_open_export");
            }}
            className="flex items-center gap-2 flex-1 min-w-0 text-left text-xs text-text-primary hover:text-primary transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">{t("exportNudge")}</span>
          </button>
          <button
            onClick={dismissNudge}
            className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Phase switcher — FM26 split team instructions */}
      <div className="shrink-0 flex items-center justify-center gap-1 px-3 py-2 border-b border-[#1C2436]/50 bg-surface/20">
        <div className="flex rounded-lg bg-[#0E1625] border border-[#1C2436]/60 p-0.5">
          <button
            onClick={() => handleSwitchPhase("inPossession")}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activePhase === "inPossession"
                ? "bg-primary/15 text-primary border border-primary/30"
                : "text-text-muted hover:text-text-secondary border border-transparent"
            }`}
          >
            <span>In Possession</span>
            <span className="font-mono text-[10px] text-text-muted">{ipFormationLabel}</span>
          </button>
          <button
            onClick={() => handleSwitchPhase("outOfPossession")}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activePhase === "outOfPossession"
                ? "bg-primary/15 text-primary border border-primary/30"
                : "text-text-muted hover:text-text-secondary border border-transparent"
            }`}
          >
            <span>Out of Possession</span>
            <span className="font-mono text-[10px] text-text-muted">{oopFormationLabel}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        <Pitch
          state={state}
          onMovePlayer={movePlayer}
          onSelectPlayer={handleSelectPlayer}
          onTapPlayer={handleTapPlayer}
          selectedPlayerId={selectedPlayerId}
          onChangeRole={setPlayerRole}
          onChangeDuty={setPlayerDuty}
        />
        <aside className="hidden lg:flex lg:flex-col w-[320px] shrink-0 border-l border-[#1C2436]/50 bg-surface/30">
          {sidebarContent}
        </aside>
      </div>

      <button
        onClick={() => {
          setShowMobileSidebar(true);
          trackEvent("builder_open_sidebar");
        }}
        className="lg:hidden fixed bottom-4 right-4 z-30 w-12 h-12 rounded-full bg-primary text-background-primary shadow-lg flex items-center justify-center hover:shadow-[0_0_20px_rgba(0,230,118,0.4)] transition-all active:scale-95"
        aria-label="Open settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {showMobileSidebar && (
        <>
          <div className="lg:hidden fixed inset-0 z-40 bg-black/60 animate-fade-in" onClick={() => setShowMobileSidebar(false)} />
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 max-h-[65vh] bg-background-secondary rounded-t-2xl shadow-[0_-8px_32px_rgba(0,0,0,0.5)] flex flex-col animate-slide-up">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1C2436]/50 shrink-0">
              <h3 className="text-sm font-semibold text-text-primary">
                {sidebarTab === "role"
                  ? selectedPlayer
                    ? `Player Role — #${state.players.indexOf(selectedPlayer) + 1}`
                    : "Player Role"
                  : sidebarTab === "formation"
                    ? "Formation"
                    : t("instructions")}
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

      {showExport && (
        <TacticExport
          state={state}
          onClose={() => setShowExport(false)}
          onImport={loadTactic}
        />
      )}
    </div>
  );
}
