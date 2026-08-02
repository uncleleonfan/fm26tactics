"use client";

import { useState, useCallback } from "react";
import { formationPresets, playerRoles } from "@/lib/tactics-data";
import type {
  FormationType,
  PlayerNode,
  TeamInstruction,
  TacticBoardState,
  Mentality,
  PlayerDuty,
} from "@/types/tactic";

export function useTacticBuilder() {
  const [state, setState] = useState<TacticBoardState>(() => {
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
  });

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

  const movePlayer = useCallback((playerId: string, x: number, y: number) => {
    const clampedX = Math.max(5, Math.min(95, x));
    const clampedY = Math.max(5, Math.min(95, y));
    const snappedX = Math.round(clampedX / 2.5) * 2.5;
    const snappedY = Math.round(clampedY / 2.5) * 2.5;

    setState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.id === playerId ? { ...p, x: snappedX, y: snappedY } : p
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

  const resetTactic = useCallback(() => {
    const preset = formationPresets[0];
    const roles = playerRoles.filter((r) => r.category !== "goalkeeper");
    setState({
      formation: preset.formation,
      players: preset.positions.map((pos, i) => ({
        id: `player-${i}`,
        x: pos.x,
        y: pos.y,
        roleId: i === 0 ? "sweeper-keeper" : (roles[i % roles.length] || roles[0]).id,
        duty: "support" as PlayerDuty,
        individualInstructions: [],
      })),
      teamInstructions: {
        mentality: "balanced",
        inPossession: [],
        inTransition: [],
        outOfPossession: [],
      },
    });
  }, []);

  return {
    state,
    setFormation,
    movePlayer,
    setPlayerRole,
    setPlayerDuty,
    setTeamMentality,
    toggleInstruction,
    resetTactic,
  };
}
