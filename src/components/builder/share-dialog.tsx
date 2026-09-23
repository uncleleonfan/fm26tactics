"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { X as XClose } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { ShareActions } from "./share-actions";
import type { TacticBoardState } from "@/types/tactic";

interface ShareDialogProps {
  state: TacticBoardState;
  /** Human formation label, e.g. "4-3-3 Gegenpress" — used in the share text. */
  formationLabel: string;
  onClose: () => void;
}

/**
 * Share dialog: the standalone entry point from the topbar. The actual share
 * controls live in ShareActions, which the post-save success step reuses — see
 * that module for the platform/copy-link behaviour.
 */
export function ShareDialog({ state, formationLabel, onClose }: ShareDialogProps) {
  const b = useTranslations("builder");

  useEffect(() => {
    trackEvent("builder_share_open");
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-label={b("shareDialogTitle")}>
      <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={onClose} />
      <div className="relative glass-panel p-6 w-[92vw] max-w-[340px] animate-fade-in">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
        >
          <XClose className="w-4 h-4" />
        </button>

        <h3 className="text-sm font-semibold text-text-primary mb-1.5">{b("shareDialogTitle")}</h3>
        <p className="mb-4 text-[11px] leading-relaxed text-text-muted">{b("shareDialogDesc")}</p>

        <ShareActions state={state} formationLabel={formationLabel} source="share-dialog" />
      </div>
    </div>
  );
}
