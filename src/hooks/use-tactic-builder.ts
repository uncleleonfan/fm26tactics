"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import { formationPresets, playerRoles } from "@/lib/tactics-data";
import type { TacticTemplate } from "@/lib/tactic-templates";
import type {
  FormationType,
  PlayerNode,
  TeamInstruction,
  TacticBoardState,
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
  return {
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
      mentality: "balanced",
      inPossession: [],
      inTransition: [],
      outOfPossession: [],
    },
  };
}

function loadInitialState(): TacticBoardState {
  if (typeof window !== "undefined") {
    // 1. Shared tactic via URL (?tactic=...) takes priority
    const encoded = new URLSearchParams(window.location.search).get("tactic");
    if (encoded) {
      const decoded = decodeTacticState(encoded);
      if (decoded) return decoded;
    }
    // 2. Last saved draft
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (isValidTacticState(parsed)) return parsed;
      }
    } catch {
      // ignore corrupted storage
    }
  }
  return createDefaultState();
}

export function useTacticBuilder() {
  const [state, setState] = useState<TacticBoardState>(loadInitialState);
  const [sharedLoadMsg, setSharedLoadMsg] = useState<"ok" | "fail" | null>(null);
  const sharedTrackedRef = useRef(false);

  // Fired when the page is opened via a shared link (?tactic=...).
  // The ref guards against StrictMode's double effect run in dev.
  useEffect(() => {
    if (sharedTrackedRef.current) return;
    const encoded =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("tactic")
        : null;
    if (!encoded) return;
    sharedTrackedRef.current = true;
    const ok = !!decodeTacticState(encoded);
    trackEvent("builder_shared_load", { label: ok ? "ok" : "fail" });
    if (ok) {
      setSharedLoadMsg("ok");
      setTimeout(() => setSharedLoadMsg(null), 5000);
    }
  }, []);

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

  const setFormation = useCallback((formation: FormationType) => {
    const preset = formationPresets.find((f) => f.formation === formation);
    if (!preset) return;

    const roles = playerRoles.filter((r) => r.category !== "goalkeeper");
    setState((prev) => ({
      ...prev,
      formation,
      players: preset.positions.map((pos, i) => {
        const existing = prev.players[i];
        if (existing) {
          return { ...existing, x: pos.x, y: pos.y };
        }
        const role = i === 0
          ? playerRoles.find((r) => r.id === "sweeper-keeper") || playerRoles[0]
          : roles[i % roles.length] || roles[0];
        return {
          id: `player-${Date.now()}-${i}`,
          x: pos.x,
          y: pos.y,
          roleId: role.id,
          duty: role.availableDuties[0] || "support",
          individualInstructions: [],
        };
      }),
    }));
  }, []);

  const movePlayer = useCallback((playerId: string, x: number, y: number, snap = false) => {
    const clampedX = Math.max(5, Math.min(95, x));
    const clampedY = Math.max(5, Math.min(95, y));
    const finalX = snap ? Math.round(clampedX / 2.5) * 2.5 : clampedX;
    const finalY = snap ? Math.round(clampedY / 2.5) * 2.5 : clampedY;

    setState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.id === playerId ? { ...p, x: finalX, y: finalY } : p
      ),
    }));
  }, []);

  const setPlayerRole = useCallback((playerId: string, roleId: string) => {
    const role = playerRoles.find((r) => r.id === roleId);
    if (!role) return;

    setState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.id === playerId
          ? {
              ...p,
              roleId,
              duty: role.availableDuties[0] || p.duty,
            }
          : p
      ),
    }));
  }, []);

  const setPlayerDuty = useCallback((playerId: string, duty: PlayerDuty) => {
    setState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.id === playerId ? { ...p, duty } : p
      ),
    }));
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

  /** One-click apply of a curated meta tactic template. */
  const applyTemplate = useCallback((template: TacticTemplate) => {
    const preset = formationPresets.find((f) => f.formation === template.formation);
    if (!preset) return;

    const roles = playerRoles.filter((r) => r.category !== "goalkeeper");
    setState({
      formation: template.formation,
      players: preset.positions.map((pos, i) => {
        const assignment = template.roleAssignments[i];
        const role = assignment
          ? playerRoles.find((r) => r.id === assignment.roleId)
          : undefined;
        const fallback = i === 0
          ? playerRoles.find((r) => r.id === "sweeper-keeper") || playerRoles[0]
          : roles[i % roles.length] || roles[0];
        const chosen = role || fallback;
        return {
          id: `player-${i}`,
          x: pos.x,
          y: pos.y,
          roleId: chosen.id,
          duty: assignment?.duty || chosen.availableDuties[0] || "support",
          individualInstructions: [],
        };
      }),
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
    setState(value);
    return true;
  }, []);

  return {
    state,
    setFormation,
    movePlayer,
    setPlayerRole,
    setPlayerDuty,
    setTeamMentality,
    toggleInstruction,
    applyTemplate,
    resetTactic,
    loadTactic,
    sharedLoadMsg,
  };
}

export type { PlayerNode };
