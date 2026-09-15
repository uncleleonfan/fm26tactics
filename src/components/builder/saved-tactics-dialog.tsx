"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { BookmarkPlus, Check, FolderOpen, Trash2, X as XClose } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import {
  deleteSavedTactic,
  loadSavedTactics,
  saveTactic,
  type SavedTactic,
} from "@/lib/saved-tactics";
import type { TacticBoardState } from "@/types/tactic";

interface SavedTacticsDialogProps {
  state: TacticBoardState;
  /** Human formation label, used as the default tactic name. */
  formationLabel: string;
  /** Swap the live board to a saved tactic. */
  onLoad: (state: TacticBoardState) => void;
  /** Reports the list size so the topbar badge can update without a remount. */
  onCountChange?: (count: number) => void;
  onClose: () => void;
}

/**
 * "My Tactics" dialog: save the current build under a name and manage the
 * local library (analytics E-9 phase 1). Everything lives in localStorage —
 * no account required; the dialog copy points at the .json export for
 * cross-device backup, which the export panel already provides.
 */
export function SavedTacticsDialog({
  state,
  formationLabel,
  onLoad,
  onCountChange,
  onClose,
}: SavedTacticsDialogProps) {
  const t = useTranslations("builder");
  const [tactics, setTactics] = useState<SavedTactic[]>([]);
  const [name, setName] = useState(formationLabel);
  const [justSaved, setJustSaved] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  // Two-step delete: first click arms the button, second click confirms —
  // a native confirm() modal felt heavy for a localStorage entry.
  const [armedDeleteId, setArmedDeleteId] = useState<string | null>(null);

  useEffect(() => {
    trackEvent("builder_saved_open");
    const list = loadSavedTactics();
    setTactics(list);
    onCountChange?.(list.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = () => {
    setSaveFailed(false);
    const entry = saveTactic(state, name || formationLabel);
    if (!entry) {
      setSaveFailed(true);
      return;
    }
    setTactics(loadSavedTactics());
    onCountChange?.(loadSavedTactics().length);
    setJustSaved(true);
    trackEvent("builder_save_tactic", { label: state.formation });
    setTimeout(() => setJustSaved(false), 2000);
  };

  const handleLoad = (tactic: SavedTactic) => {
    trackEvent("builder_saved_load", { label: tactic.formation });
    onLoad(tactic.state);
    onClose();
  };

  const handleDelete = (id: string) => {
    if (armedDeleteId !== id) {
      setArmedDeleteId(id);
      return;
    }
    setArmedDeleteId(null);
    deleteSavedTactic(id);
    setTactics(loadSavedTactics());
    onCountChange?.(loadSavedTactics().length);
    trackEvent("builder_saved_delete");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-label={t("savedTitle")}>
      <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={onClose} />
      <div className="relative glass-panel p-6 w-[92vw] max-w-[380px] max-h-[80vh] overflow-y-auto animate-fade-in">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
        >
          <XClose className="w-4 h-4" />
        </button>

        <h3 className="text-sm font-semibold text-text-primary mb-1.5">{t("savedTitle")}</h3>
        <p className="mb-4 text-[11px] leading-relaxed text-text-muted">{t("savedDesc")}</p>

        {/* Save current build */}
        <div className="flex gap-2 mb-1.5">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            placeholder={t("savedNamePlaceholder")}
            aria-label={t("savedNamePlaceholder")}
            className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-surface border border-surface-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button
            onClick={handleSave}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              justSaved
                ? "bg-primary/15 text-primary border border-primary/30"
                : "bg-primary text-background-primary hover:shadow-[0_0_20px_rgba(0,230,118,0.3)]"
            }`}
          >
            {justSaved ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
            {justSaved ? t("savedSaved") : t("savedSaveButton")}
          </button>
        </div>
        {saveFailed && (
          <p className="mb-2 text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2 animate-fade-in">
            {t("savedStorageFail")}
          </p>
        )}

        {/* Saved list */}
        <div className="mt-4 space-y-2">
          {tactics.length === 0 ? (
            <p className="text-[11px] text-text-muted text-center py-4">{t("savedEmpty")}</p>
          ) : (
            tactics.map((tactic) => (
              <div
                key={tactic.id}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-surface border border-surface-border"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-primary truncate">{tactic.name}</p>
                  <p className="text-[10px] text-text-muted">
                    {tactic.formation} · {t("savedSavedAt", { date: new Date(tactic.savedAt).toLocaleDateString() })}
                  </p>
                </div>
                <button
                  onClick={() => handleLoad(tactic)}
                  className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-semibold text-primary hover:bg-primary/10 transition-colors"
                >
                  <FolderOpen className="w-3 h-3" />
                  {t("savedLoad")}
                </button>
                <button
                  onClick={() => handleDelete(tactic.id)}
                  aria-label={armedDeleteId === tactic.id ? t("savedConfirmDelete") : t("savedDelete")}
                  className={`shrink-0 p-1.5 rounded-md transition-colors ${
                    armedDeleteId === tactic.id
                      ? "text-red-400 bg-red-500/15"
                      : "text-text-muted hover:text-red-400 hover:bg-surface-hover"
                  }`}
                  title={armedDeleteId === tactic.id ? t("savedConfirmDelete") : t("savedDelete")}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
