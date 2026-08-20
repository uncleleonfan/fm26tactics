"use client";

import { useState, useCallback, useEffect } from "react";
import { formationPresets, playerRoles } from "@/lib/tactics-data";
import type { TacticTemplate, DualPhaseTemplate } from "@/lib/tactic-templates";
import type {
  FormationType,
  PlayerNode,
  TeamInstruction,
  TacticBoardState,
  TacticPhase,
  TacticPhaseState,
  Mentality,
  PlayerDuty,
} from "@/types/tactic";

const STORAGE_KEY = "fm26tactics_builder_draft_v1";
const SAVE_DELAY_MS = 400;

function isValidTacticState(value: unknown): value is TacticBoardState {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<TacticBoardState>;
  if (typeof v.formation !== "string") return false;
  if (!Array.isArray(v.players) || v.players.length === 0) return false;
  const playersOk = v.players.every(
    (p) =>
      p &&
      typeof p.id === "string" &&
      typeof p.x === "number" &&
      typeof p.y === "number" &&
      typeof p.roleId === "string" &&
      (p.duty === "defend" || p.duty === "support" || p.duty === "attack")
  );
  if (!playersOk) return false;
  const ti = v.teamInstructions as Partial<TeamInstruction> | undefined;
  if (!ti || typeof ti !== "object") return false;
  return (
    typeof ti.mentality === "string" &&
    Array.isArray(ti.inPossession) &&
    Array.isArray(ti.inTransition) &&
    Array.isArray(ti.outOfPossession)
  );
}

/** Repair a phase so its player count matches its formation preset (older drafts had wrong counts). */
function repairPhaseShape(phase: TacticPhaseState): TacticPhaseState {
  const preset = formationPresets.find((f) => f.formation === phase.formation);
  if (!preset || phase.players.length === preset.positions.length) return phase;
  const nonGkRoles = playerRoles.filter((r) => r.category !== "goalkeeper");
  return {
    ...phase,
    players: preset.positions.map((pos, i) => {
      const existing = phase.players[i];
      if (existing) return existing; // keep custom positions & roles where they exist
      const role =
        i === 0
          ? playerRoles.find((r) => r.id === "sweeper-keeper") || playerRoles[0]
          : nonGkRoles[i % nonGkRoles.length] || nonGkRoles[0];
      return {
        id: `player-${i}`,
        x: pos.x,
        y: pos.y,
        roleId: role.id,
        duty: role.availableDuties[0] || "support",
        individualInstructions: [],
      };
    }),
  };
}

/** Ensure a state always has both phases and each phase matches its formation's player count. */
function normalizePhases(state: TacticBoardState): TacticBoardState {
  const hasPhases = !!state.phases;
  const inPossession = repairPhaseShape(
    hasPhases ? state.phases!.inPossession : { formation: state.formation, players: state.players }
  );
  const outOfPossession = repairPhaseShape(
    hasPhases
      ? state.phases!.outOfPossession
      : { formation: state.formation, players: state.players }
  );
  const top = state.activePhase === "outOfPossession" ? outOfPossession : inPossession;
  return {
    ...state,
    activePhase: state.activePhase ?? "inPossession",
    phases: { inPossession, outOfPossession },
    formation: top.formation,
    players: top.players,
  };
}

/** Return the current phases object, seeding from the top-level shape if absent. */
function ensurePhases(state: TacticBoardState): NonNullable<TacticBoardState["phases"]> {
  return (
    state.phases ?? {
      inPossession: { formation: state.formation, players: state.players },
      outOfPossession: { formation: state.formation, players: state.players },
    }
  );
}

/** Encode a tactic state into a compact URL-safe string. */
export function encodeTacticState(state: TacticBoardState): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(state))));
}

/** Decode a URL-encoded tactic state, or null if invalid. */
export function decodeTacticState(encoded: string): TacticBoardState | null {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    const parsed = JSON.parse(json);
    return isValidTacticState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function createDefaultState(): TacticBoardState {
  const preset = formationPresets[0];
  const roles = playerRoles.filter((r) => r.category !== "goalkeeper");
  const base = {
    formation: preset.formation,
    players: preset.positions.map((pos, i) => {
      const role = i === 0
        ? playerRoles.find((r) => r.id === "sweeper-keeper") || playerRoles[0]
        : roles[i % roles.length] || roles[0];
      return {
        id: `player-${i}`,
        x: pos.x,
        y: pos.y,
        roleId: role.id,
        duty: role.availableDuties[0] || "support",
        individualInstructions: [],
      };
    }),
    teamInstructions: {
      mentality: "balanced" as Mentality,
      inPossession: [] as string[],
      inTransition: [] as string[],
      outOfPossession: [] as string[],
    },
  };
  return normalizePhases(base);
}

function loadInitialState(): TacticBoardState {
  if (typeof window !== "undefined") {
    // 1. Shared tactic via URL (?tactic=...) takes priority
    const encoded = new URLSearchParams(window.location.search).get("tactic");
    if (encoded) {
      const decoded = decodeTacticState(encoded);
      if (decoded) return normalizePhases(decoded);
    }
    // 2. Last saved draft
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (isValidTacticState(parsed)) return normalizePhases(parsed);
      }
    } catch {
      // ignore corrupted storage
    }
  }
  return createDefaultState();
}

/** Build a phase's players from a formation preset + role assignments (falling back to sensible roles). */
function buildPhasePlayers(
  preset: { formation: FormationType; positions: { x: number; y: number }[] },
  assignments: { roleId: string; duty: PlayerDuty }[] | undefined,
  idPrefix: string
): PlayerNode[] {
  const roles = playerRoles.filter((r) => r.category !== "goalkeeper");
  return preset.positions.map((pos, i) => {
    const assignment = assignments?.[i];
    const role = assignment
      ? playerRoles.find((r) => r.id === assignment.roleId)
      : undefined;
    const fallback = i === 0
      ? playerRoles.find((r) => r.id === "sweeper-keeper") || playerRoles[0]
      : roles[i % roles.length] || roles[0];
    const chosen = role || fallback;
    return {
      id: `${idPrefix}-${i}`,
      x: pos.x,
      y: pos.y,
      roleId: chosen.id,
      duty: assignment?.duty || chosen.availableDuties[0] || "support",
      individualInstructions: [],
    };
  });
}

export function useTacticBuilder() {
  const [state, setState] = useState<TacticBoardState>(loadInitialState);

  // Auto-save draft to localStorage (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // storage unavailable — ignore
      }
    }, SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [state]);

  /** Switch the actively edited phase; top-level shape mirrors the chosen phase. */
  const setActivePhase = useCallback((phase: TacticPhase) => {
    setState((prev) => {
      const phases = ensurePhases(prev);
      const target = phases[phase];
      return {
        ...prev,
        activePhase: phase,
        formation: target.formation,
        players: target.players,
      };
    });
  }, []);

  const setFormation = useCallback((formation: FormationType) => {
    const preset = formationPresets.find((f) => f.formation === formation);
    if (!preset) return;

    const roles = playerRoles.filter((r) => r.category !== "goalkeeper");
    setState((prev) => {
      const activePhase = prev.activePhase ?? "inPossession";
      const phases = ensurePhases(prev);
      const players = preset.positions.map((pos, i) => {
        const existing = prev.players[i];
        if (existing) {
          return { ...existing, x: pos.x, y: pos.y };
        }
        const role = i === 0
          ? playerRoles.find((r) => r.id === "sweeper-keeper") || playerRoles[0]
          : roles[i % roles.length] || roles[0];
        return {
          id: `${activePhase}-${i}`,
          x: pos.x,
          y: pos.y,
          roleId: role.id,
          duty: role.availableDuties[0] || "support",
          individualInstructions: [],
        };
      });
      return {
        ...prev,
        formation,
        players,
        phases: {
          ...phases,
          [activePhase]: { formation, players },
        },
      };
    });
  }, []);

  const movePlayer = useCallback((playerId: string, x: number, y: number, snap = false) => {
    const clampedX = Math.max(5, Math.min(95, x));
    const clampedY = Math.max(5, Math.min(95, y));
    const finalX = snap ? Math.round(clampedX / 2.5) * 2.5 : clampedX;
    const finalY = snap ? Math.round(clampedY / 2.5) * 2.5 : clampedY;

    setState((prev) => {
      const activePhase = prev.activePhase ?? "inPossession";
      const phases = ensurePhases(prev);
      const players = prev.players.map((p) =>
        p.id === playerId ? { ...p, x: finalX, y: finalY } : p
      );
      return {
        ...prev,
        players,
        phases: {
          ...phases,
          [activePhase]: { ...phases[activePhase], players },
        },
      };
    });
  }, []);

  const setPlayerRole = useCallback((playerId: string, roleId: string) => {
    const role = playerRoles.find((r) => r.id === roleId);
    if (!role) return;

    setState((prev) => {
      const activePhase = prev.activePhase ?? "inPossession";
      const phases = ensurePhases(prev);
      const players = prev.players.map((p) =>
        p.id === playerId
          ? {
              ...p,
              roleId,
              duty: role.availableDuties[0] || p.duty,
            }
          : p
      );
      return {
        ...prev,
        players,
        phases: {
          ...phases,
          [activePhase]: { ...phases[activePhase], players },
        },
      };
    });
  }, []);

  const setPlayerDuty = useCallback((playerId: string, duty: PlayerDuty) => {
    setState((prev) => {
      const activePhase = prev.activePhase ?? "inPossession";
      const phases = ensurePhases(prev);
      const players = prev.players.map((p) =>
        p.id === playerId ? { ...p, duty } : p
      );
      return {
        ...prev,
        players,
        phases: {
          ...phases,
          [activePhase]: { ...phases[activePhase], players },
        },
      };
    });
  }, []);

  const setTeamMentality = useCallback((mentality: Mentality) => {
    setState((prev) => ({
      ...prev,
      teamInstructions: { ...prev.teamInstructions, mentality },
    }));
  }, []);

  const toggleInstruction = useCallback(
    (category: "inPossession" | "inTransition" | "outOfPossession", instruction: string) => {
      setState((prev) => {
        const current = prev.teamInstructions[category];
        const updated = current.includes(instruction)
          ? current.filter((i) => i !== instruction)
          : [...current, instruction];

        return {
          ...prev,
          teamInstructions: {
            ...prev.teamInstructions,
            [category]: updated,
          },
        };
      });
    },
    []
  );

  /** One-click apply of a curated meta tactic template (both phases share the same shape). */
  const applyTemplate = useCallback((template: TacticTemplate) => {
    const preset = formationPresets.find((f) => f.formation === template.formation);
    if (!preset) return;

    const players = buildPhasePlayers(preset, template.roleAssignments, "player");
    const phaseState = { formation: template.formation, players };
    setState({
      ...phaseState,
      activePhase: "inPossession",
      phases: {
        inPossession: phaseState,
        outOfPossession: phaseState,
      },
      teamInstructions: {
        mentality: template.mentality,
        inPossession: [...template.inPossession],
        inTransition: [...template.inTransition],
        outOfPossession: [...template.outOfPossession],
      },
    });
  }, []);

  /** One-click apply of a dual-phase blueprint — different attacking and defensive shapes. */
  const applyDualPhaseTemplate = useCallback((template: DualPhaseTemplate) => {
    const ipPreset = formationPresets.find((f) => f.formation === template.inPossessionFormation);
    const oopPreset = formationPresets.find((f) => f.formation === template.outOfPossessionFormation);
    if (!ipPreset || !oopPreset) return;

    const inPossession = {
      formation: template.inPossessionFormation,
      players: buildPhasePlayers(ipPreset, template.inPossessionRoles, "ip"),
    };
    const outOfPossession = {
      formation: template.outOfPossessionFormation,
      players: buildPhasePlayers(oopPreset, template.outOfPossessionRoles, "oop"),
    };
    setState({
      ...inPossession,
      activePhase: "inPossession",
      phases: { inPossession, outOfPossession },
      teamInstructions: {
        mentality: template.mentality,
        inPossession: [...template.inPossession],
        inTransition: [...template.inTransition],
        outOfPossession: [...template.outOfPossession],
      },
    });
  }, []);

  const resetTactic = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setState(createDefaultState());
  }, []);

  /** Load a tactic from an external source (e.g. imported .json). Returns false if invalid. */
  const loadTactic = useCallback((value: unknown) => {
    if (!isValidTacticState(value)) return false;
    setState(normalizePhases(value));
    return true;
  }, []);

  return {
    state,
    setActivePhase,
    setFormation,
    movePlayer,
    setPlayerRole,
    setPlayerDuty,
    setTeamMentality,
    toggleInstruction,
    applyTemplate,
    applyDualPhaseTemplate,
    resetTactic,
    loadTactic,
  };
}

export type { PlayerNode };
