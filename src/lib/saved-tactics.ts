import type { TacticBoardState } from "@/types/tactic";
import { isValidTacticState } from "@/lib/tactic-share";

/**
 * Local "My Tactics" library (analytics report E-9, phase 1).
 *
 * The builder only auto-persisted a single draft before — every finished
 * tactic was overwritten by the next one, which the 8-2026 event analysis
 * flagged as the main reason 89% of builders never came back. This module
 * stores named tactics in localStorage so a user can keep several builds;
 * the cloud/account layer (N19) is deliberately deferred to Q4.
 */

const STORAGE_KEY = "fm26tactics_saved_tactics_v1";

/** Hard cap so a long tail of saves can't blow past the ~5MB quota. */
export const MAX_SAVED_TACTICS = 30;

export interface SavedTactic {
  id: string;
  name: string;
  formation: string;
  /** Epoch ms — shown as "Saved Sep 15" style labels in the dialog. */
  savedAt: number;
  state: TacticBoardState;
}

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Best-effort read: private mode, quota errors and corrupted JSON all yield []. */
export function loadSavedTactics(): SavedTactic[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t): t is SavedTactic =>
        !!t &&
        typeof t === "object" &&
        typeof (t as SavedTactic).id === "string" &&
        typeof (t as SavedTactic).name === "string" &&
        typeof (t as SavedTactic).savedAt === "number" &&
        isValidTacticState((t as SavedTactic).state)
    );
  } catch {
    return [];
  }
}

function persist(tactics: SavedTactic[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tactics));
    return true;
  } catch {
    return false;
  }
}

/** Save the given state as a new entry (newest first). Returns null on storage failure. */
export function saveTactic(state: TacticBoardState, name: string): SavedTactic | null {
  const entry: SavedTactic = {
    id: makeId(),
    name: name.trim().slice(0, 60),
    formation: state.formation,
    savedAt: Date.now(),
    state,
  };
  const next = [entry, ...loadSavedTactics()].slice(0, MAX_SAVED_TACTICS);
  return persist(next) ? entry : null;
}

/**
 * One-click save used by the topbar button: upserts by name so repeated quick
 * saves of the same build refresh the entry instead of piling duplicates.
 * Falls back to the formation label when the caller passes no name.
 */
export function quickSaveTactic(state: TacticBoardState, name?: string): SavedTactic | null {
  const trimmed = (name ?? "").trim().slice(0, 60) || state.formation;
  const list = loadSavedTactics();
  const existing = list.find((t) => t.name === trimmed);
  if (!existing) return saveTactic(state, trimmed);
  const updated: SavedTactic = {
    ...existing,
    formation: state.formation,
    savedAt: Date.now(),
    state,
  };
  const next = [updated, ...list.filter((t) => t.id !== existing.id)];
  return persist(next) ? updated : null;
}

export function deleteSavedTactic(id: string): void {
  persist(loadSavedTactics().filter((t) => t.id !== id));
}

export function renameSavedTactic(id: string, name: string): void {
  const trimmed = name.trim().slice(0, 60);
  if (!trimmed) return;
  persist(
    loadSavedTactics().map((t) => (t.id === id ? { ...t, name: trimmed } : t))
  );
}
