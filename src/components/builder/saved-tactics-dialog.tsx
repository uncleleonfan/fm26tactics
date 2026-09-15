"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { FolderOpen, Trash2, X as XClose } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import {
  deleteSavedTactic,
  loadSavedTactics,
  type SavedTactic,
} from "@/lib/saved-tactics";
import type { TacticBoardState } from "@/types/tactic";

interface SavedTacticsDialogProps {
  /** Swap the live board to a saved tactic. */
  onLoad: (state: TacticBoardState) => void;
  /** Reports the list size so the topbar badge can update without a remount. */
  onCountChange?: (count: number) => void;
  onClose: () => void;
}

/**
 * "My Tactics" dialog: browse and manage the local library (analytics E-9
 * phase 1). Saving lives in the dedicated dialog behind the topbar Save
 * button, so this list is read/manage only. Everything lives in
 * localStorage — no account required; the copy points at the .json export
 * for cross-device backup, which the export panel already provides.
 */
export function SavedTacticsDialog({
  onLoad,
  onCountChange,
  onClose,
}: SavedTacticsDialogProps) {
  const t = useTranslations("builder");
  const [tactics, setTactics] = useState<SavedTactic[]>([]);
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

        {/* Saved list */}
        <div className="space-y-2">
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
