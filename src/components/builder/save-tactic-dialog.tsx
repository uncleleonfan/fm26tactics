"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { BookmarkPlus, Check, X as XClose } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { loadSavedTactics, saveTactic } from "@/lib/saved-tactics";
import { ShareActions } from "./share-actions";
import type { TacticBoardState } from "@/types/tactic";

interface SaveTacticDialogProps {
  state: TacticBoardState;
  /** Pre-filled with the formation label — the user can rename it freely. */
  defaultName: string;
  /** Human formation label, reused as the share text on the success step. */
  formationLabel: string;
  onSaved: () => void;
  onClose: () => void;
}

/**
 * Adds " (2)", " (3)"… suffixes so several copies of the same formation can
 * share a base name without overwriting each other in the library.
 */
function uniqueName(base: string, taken: string[]): string {
  if (!taken.includes(base)) return base;
  let n = 2;
  while (taken.includes(`${base} (${n})`)) n += 1;
  return `${base} (${n})`;
}

/**
 * Name-before-save dialog for the topbar Save button. Every save creates a
 * NEW entry (same formation can have several versions); the "My Tactics"
 * dialog only browses and manages the resulting library.
 *
 * A successful save does not close the dialog: it swaps to a success step
 * with the share controls. Saving and sharing used to be two separate dialogs,
 * and the event analysis showed the share entry point was too deep to ever be
 * found (12 sharers vs 190 people arriving through shared links) — so the
 * ready-to-send link is now handed over at the moment the tactic is saved.
 */
export function SaveTacticDialog({
  state,
  defaultName,
  formationLabel,
  onSaved,
  onClose,
}: SaveTacticDialogProps) {
  const t = useTranslations("builder");
  const [name, setName] = useState(defaultName);
  const [failed, setFailed] = useState(false);
  // Non-null once the tactic is in the library — switches the dialog to the
  // success step and keeps the stored name for the confirmation copy.
  const [savedName, setSavedName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    trackEvent("builder_save_dialog_open");
    // Pre-select so typing replaces the suggested formation label.
    inputRef.current?.select();
  }, []);

  const submit = () => {
    setFailed(false);
    const trimmed = (name.trim() || defaultName).slice(0, 60);
    const result = saveTactic(
      state,
      uniqueName(
        trimmed,
        loadSavedTactics().map((tactic) => tactic.name)
      )
    );
    if ("error" in result) {
      // Without this, a failed write looked identical to a user who simply
      // closed the dialog — the failure branch used to be silent.
      trackEvent("builder_save_fail", { label: result.error });
      setFailed(true);
      return;
    }
    trackEvent("builder_save_tactic", { label: state.formation });
    setSavedName(result.entry.name);
    onSaved();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={t("saveDialogTitle")}
    >
      <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={onClose} />
      <div className="relative glass-panel p-6 w-[92vw] max-w-[380px] max-h-[85vh] overflow-y-auto animate-fade-in">
        <button
          onClick={onClose}
          aria-label={t("close")}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
        >
          <XClose className="w-4 h-4" />
        </button>

        {savedName ? (
          <>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-primary" />
              </span>
              <h3 className="text-sm font-semibold text-text-primary">{t("saveSuccessTitle")}</h3>
            </div>
            <p className="mb-4 text-[11px] leading-relaxed text-text-muted">
              {t("saveSuccessDesc", { name: savedName })}
            </p>

            <ShareActions state={state} formationLabel={formationLabel} source="save-success" />

            <button
              onClick={onClose}
              className="mt-3 w-full py-2 text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              {t("saveSuccessDone")}
            </button>
          </>
        ) : (
          <>
            <h3 className="text-sm font-semibold text-text-primary mb-1.5">
              {t("saveDialogTitle")}
            </h3>
            <p className="mb-4 text-[11px] leading-relaxed text-text-muted">
              {t("saveDialogDesc")}
            </p>

            <input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
                if (e.key === "Escape") onClose();
              }}
              maxLength={60}
              placeholder={t("savedNamePlaceholder")}
              aria-label={t("savedNamePlaceholder")}
              className="w-full px-3 py-2 rounded-lg bg-surface border border-surface-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors"
            />
            {failed && (
              <p className="mt-2 text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2 animate-fade-in">
                {t("savedStorageFail")}
              </p>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-3 py-2 rounded-lg text-xs font-semibold text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
              >
                {t("cancel")}
              </button>
              <button
                onClick={submit}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-primary text-background-primary hover:shadow-[0_0_20px_rgba(0,230,118,0.3)] transition-all"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                {t("save")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
