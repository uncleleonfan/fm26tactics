"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link2, Check, X as XClose } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import {
  buildShareIntentUrl,
  buildShareText,
  buildShareUrl,
  encodeTacticParam,
  type ShareTarget,
} from "@/lib/tactic-share";
import type { TacticBoardState } from "@/types/tactic";

interface ShareDialogProps {
  state: TacticBoardState;
  /** Human formation label, e.g. "4-3-3 Gegenpress" — used in the share text. */
  formationLabel: string;
  onClose: () => void;
}

/**
 * Brand marks — lucide dropped brand icons, and these four platforms are the
 * whole point of the dialog. Inline SVGs keep the site dependency-free.
 */
function BrandMark({ platform }: { platform: "x" | "facebook" | "reddit" | "discord" }) {
  const common = "w-4 h-4";
  switch (platform) {
    case "x":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "reddit":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0zm4.388 3.199a1.566 1.566 0 1 1 0 3.132 1.566 1.566 0 0 1 0-3.132zM12 6.286c2.42 0 4.61.233 6.211.921.975.416 1.831 1.13 2.323 2.02.35.628.582 1.348.582 2.13 0 4.387-4.084 7.943-9.116 7.943S2.884 15.744 2.884 11.357c0-.782.233-1.502.582-2.13.492-.89 1.348-1.604 2.323-2.02C7.39 6.519 9.58 6.286 12 6.286zM8.013 9.732a1.566 1.566 0 1 0 0 3.132 1.566 1.566 0 0 0 0-3.132zm7.974 0a1.566 1.566 0 1 0 0 3.132 1.566 1.566 0 0 0 0-3.132zm-7.655 4.652c.538 1.14 1.99 1.905 3.668 1.905 1.678 0 3.13-.765 3.668-1.905a.4.4 0 0 0-.529-.529c-.616.29-1.49.443-3.139.443s-2.523-.153-3.139-.443a.4.4 0 0 0-.529.529z" />
        </svg>
      );
    case "discord":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
          <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.095 2.157 2.418 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.095 2.157 2.418 0 1.334-.946 2.419-2.157 2.419z" />
        </svg>
      );
  }
}

const PLATFORMS: Array<{
  target: ShareTarget | "discord";
  labelKey: string;
  color: string;
}> = [
  { target: "x", labelKey: "shareX", color: "hover:border-[#1D9BF0]/60 hover:bg-[#1D9BF0]/10 hover:text-[#1D9BF0]" },
  { target: "facebook", labelKey: "shareFacebook", color: "hover:border-[#1877F2]/60 hover:bg-[#1877F2]/10 hover:text-[#1877F2]" },
  { target: "reddit", labelKey: "shareReddit", color: "hover:border-[#FF4500]/60 hover:bg-[#FF4500]/10 hover:text-[#FF4500]" },
  { target: "discord", labelKey: "shareDiscord", color: "hover:border-[#5865F2]/60 hover:bg-[#5865F2]/10 hover:text-[#5865F2]" },
];

/**
 * Share dialog: one click per platform opens its intent URL in a new tab.
 * The link points at the share landing page, whose OG card carries the
 * generated tactic image — the picture travels as the link preview, since
 * no platform's intent URL accepts an image attachment.
 */
export function ShareDialog({ state, formationLabel, onClose }: ShareDialogProps) {
  const b = useTranslations("builder");
  const [copied, setCopied] = useState<"none" | "ok" | "fail">("none");

  useEffect(() => {
    trackEvent("builder_share_open");
  }, []);

  const tacticParam = encodeTacticParam(state);
  const shareUrl = buildShareUrl(tacticParam);
  const shareText = buildShareText(formationLabel);

  const copyLink = async (): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      trackEvent("builder_copy_share_link");
      return true;
    } catch {
      return false;
    }
  };

  // Intent platforms: build the URL first, then open synchronously inside the
  // click handler — an await before window.open risks popup blocking.
  const shareTo = (target: ShareTarget) => {
    window.open(buildShareIntentUrl(target, shareUrl, shareText), "_blank", "noopener,noreferrer");
    trackEvent("builder_share_click", { label: target });
  };

  // Discord has no web intent: copy the link, then open Discord. Clipboard
  // write resolves fast enough to stay inside the click's transient activation.
  const shareToDiscord = async () => {
    trackEvent("builder_share_click", { label: "discord" });
    const ok = await copyLink();
    setCopied(ok ? "ok" : "fail");
    window.open("https://discord.com/channels/@me", "_blank", "noopener,noreferrer");
    setTimeout(() => setCopied("none"), 2500);
  };

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

        <div className="space-y-2">
          {PLATFORMS.map(({ target, labelKey, color }) => (
            <button
              key={target}
              onClick={() => (target === "discord" ? shareToDiscord() : shareTo(target))}
              className={`w-full flex items-center gap-3 p-3 rounded-lg bg-surface border border-surface-border transition-all group cursor-pointer ${color}`}
            >
              <BrandMark platform={target} />
              {/* No explicit color — the button's hover:text-* paints both icon and label. */}
              <span className="text-sm font-medium">{b(labelKey)}</span>
              {target === "discord" && copied === "ok" && (
                <Check className="w-3.5 h-3.5 text-primary ml-auto shrink-0" />
              )}
            </button>
          ))}
        </div>

        {copied !== "none" && (
          <p
            className={`mt-2.5 text-[10px] leading-snug rounded-md px-3 py-2 border animate-fade-in ${
              copied === "ok"
                ? "text-primary bg-primary/5 border-primary/20"
                : "text-red-400 bg-red-500/10 border-red-500/20"
            }`}
          >
            {copied === "ok" ? b("shareDiscordHint") : b("shareDiscordCopyFail")}
          </p>
        )}

        <button
          onClick={async () => {
            const ok = await copyLink();
            setCopied(ok ? "ok" : "fail");
            setTimeout(() => setCopied("none"), 2500);
          }}
          className="mt-3 w-full flex items-center gap-3 p-3 rounded-lg bg-surface border border-surface-border hover:border-primary/30 transition-all group cursor-pointer"
        >
          {copied === "ok" ? (
            <Check className="w-4 h-4 text-primary shrink-0" />
          ) : (
            <Link2 className="w-4 h-4 text-text-secondary group-hover:text-primary shrink-0" />
          )}
          <span className="text-sm font-medium text-text-primary">
            {copied === "ok" ? b("shareCopied") : b("copyShareLink")}
          </span>
        </button>
      </div>
    </div>
  );
}
