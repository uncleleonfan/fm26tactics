"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Download, Share2, Check, Copy, FileText, FileJson, Upload } from "lucide-react";
import { encodeTacticState } from "@/hooks/use-tactic-builder";
import { trackEvent } from "@/lib/analytics";
import { playerRoles } from "@/lib/tactics-data";
import type { TacticBoardState } from "@/types/tactic";

interface TacticExportProps {
  state: TacticBoardState;
  onClose: () => void;
  onImport: (value: unknown) => boolean;
}

interface SvgOutput {
  svgString: string;
  width: number;
  height: number;
}

const CATEGORY_SHORT: Record<string, string> = {
  goalkeeper: "GK",
  defender: "D",
  midfielder: "M",
  forward: "F",
};

function cap(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

type TFunc = (key: string, values?: Record<string, string | number>) => string;

/** Full human-readable tactic card — formation, every player's role & duty, and all team instructions. */
function buildTacticText(state: TacticBoardState, b: TFunc): string {
  const { formation, players, teamInstructions } = state;
  const lines: string[] = [];

  lines.push(b("txtHeader", { formation }));
  lines.push(b("txtGenerated"));
  lines.push("");

  lines.push(b("txtFormation"));
  lines.push(formation);
  lines.push("");

  lines.push(b("txtLineup"));
  players.forEach((p, i) => {
    const role = playerRoles.find((r) => r.id === p.roleId);
    const category = CATEGORY_SHORT[role?.category ?? ""] ?? "P";
    const roleName = role?.name ?? p.roleId;
    lines.push(`${i + 1}. ${category} — ${roleName} (${cap(p.duty)})`);
  });
  lines.push("");

  lines.push(b("txtTeamInstructions"));
  lines.push(`${b("txtMentalityLabel")}: ${cap(teamInstructions.mentality)}`);
  lines.push(
    `${b("txtInPossessionLabel")}: ${teamInstructions.inPossession.join(", ") || b("txtNone")}`
  );
  lines.push(
    `${b("txtInTransitionLabel")}: ${teamInstructions.inTransition.join(", ") || b("txtNone")}`
  );
  lines.push(
    `${b("txtOutOfPossessionLabel")}: ${teamInstructions.outOfPossession.join(", ") || b("txtNone")}`
  );
  lines.push("");

  lines.push(b("txtHowTo"));
  lines.push(b("txtStep1", { formation }));
  lines.push(b("txtStep2"));
  lines.push(b("txtStep3"));
  lines.push(b("txtStep4"));

  return lines.join("\n");
}

function buildSvgString(state: TacticBoardState): SvgOutput | null {
  const svgEl = document.getElementById("tactic-pitch-svg") as SVGSVGElement | null;
  if (!svgEl) return null;

  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  const originalWidth = svgEl.clientWidth || 400;
  const originalHeight = svgEl.clientHeight || 600;

  clone.setAttribute("width", String(originalWidth));
  clone.setAttribute("height", String(originalHeight));

  // Inline computed styles into the clone so the exported SVG is self-contained
  const inlineStyles = (source: Element, target: Element) => {
    const computed = window.getComputedStyle(source);
    const styles: string[] = [];
    // Only inline styles that actually affect rendering
    const relevant = [
      "fill", "stroke", "stroke-width", "stroke-dasharray", "stroke-linecap",
      "stroke-linejoin", "opacity", "font-size", "font-family", "font-weight",
      "text-anchor", "dominant-baseline", "rx", "ry",
    ];
    for (const prop of relevant) {
      const val = computed.getPropertyValue(prop);
      if (val && val !== "rgba(0, 0, 0, 0)" && val !== "auto") {
        styles.push(`${prop}:${val}`);
      }
    }
    if (styles.length) {
      (target as HTMLElement).style.cssText = styles.join(";");
    }
  };

  // Walk both trees in sync and inline styles
  const walkAndInline = (src: Element, dst: Element) => {
    inlineStyles(src, dst);
    const srcChildren = Array.from(src.children);
    const dstChildren = Array.from(dst.children);
    for (let i = 0; i < Math.min(srcChildren.length, dstChildren.length); i++) {
      walkAndInline(srcChildren[i], dstChildren[i]);
    }
  };
  walkAndInline(svgEl, clone);

  const serializer = new XMLSerializer();
  return {
    svgString: serializer.serializeToString(clone),
    width: originalWidth,
    height: originalHeight,
  };
}

function triggerDownload(href: string, filename: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function TacticExport({ state, onClose, onImport }: TacticExportProps) {
  const b = useTranslations("builder");
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [importMsg, setImportMsg] = useState<"ok" | "fail" | null>(null);
  const [exportError, setExportError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const openTimeRef = useRef(Date.now());

  const fileBase = `fm26-tactic-${state.formation.replace(/-/g, "")}`;

  // ms the export dialog stayed open — distinguishes "opened & closed instantly"
  // from "read the options but didn't download". Sent with every exit/download.
  const dwellTime = () => Date.now() - openTimeRef.current;

  const closeWithDwell = () => {
    trackEvent("builder_export_close", { value: dwellTime() });
    onClose();
  };

  // Surface previously-silent failures (missing SVG node, canvas/blob/clipboard errors)
  // and count them separately from successful downloads.
  const exportFail = (label: string) => {
    trackEvent("builder_download_fail", { label, value: dwellTime() });
    setExportError(true);
    setTimeout(() => setExportError(false), 2500);
  };

  const exportAsSvg = () => {
    const output = buildSvgString(state);
    if (!output) {
      exportFail("svg");
      return;
    }
    trackEvent("builder_download", { label: "svg", value: dwellTime() });
    const blob = new Blob([output.svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `${fileBase}.svg`);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const exportAsPng = () => {
    const output = buildSvgString(state);
    if (!output) {
      exportFail("png");
      return;
    }
    trackEvent("builder_download", { label: "png", value: dwellTime() });

    const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(output.svgString)}`;
    const img = new Image();
    img.onload = () => {
      const scale = 2; // 2x for crisp output
      const canvas = document.createElement("canvas");
      canvas.width = output.width * scale;
      canvas.height = output.height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        exportFail("png");
        return;
      }
      // Solid background so dark text is always visible
      ctx.fillStyle = "#0A0E17";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) {
          exportFail("png");
          return;
        }
        const url = URL.createObjectURL(blob);
        triggerDownload(url, `${fileBase}.png`);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, "image/png");
    };
    img.onerror = () => exportFail("png");
    img.src = svgUrl;
  };

  const exportAsTxt = () => {
    trackEvent("builder_download", { label: "txt", value: dwellTime() });
    const blob = new Blob([buildTacticText(state, b)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `${fileBase}.txt`);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const exportAsJson = () => {
    trackEvent("builder_download", { label: "json", value: dwellTime() });
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `${fileBase}.json`);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const ok = onImport(parsed);
        trackEvent("builder_import", { label: ok ? "ok" : "fail", value: dwellTime() });
        setImportMsg(ok ? "ok" : "fail");
        if (ok) {
          setTimeout(closeWithDwell, 900);
        }
      } catch {
        trackEvent("builder_import", { label: "fail", value: dwellTime() });
        setImportMsg("fail");
      }
      setTimeout(() => setImportMsg(null), 2500);
    };
    reader.readAsText(file);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(buildTacticText(state, b));
      trackEvent("builder_copy_text", { value: dwellTime() });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      exportFail("text");
    }
  };

  const copyShareLink = async () => {
    const encoded = encodeTacticState(state);
    const url = `${window.location.origin}${window.location.pathname}?tactic=${encodeURIComponent(encoded)}`;
    try {
      await navigator.clipboard.writeText(url);
      trackEvent("builder_copy_share_link", { value: dwellTime() });
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      exportFail("share");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={closeWithDwell} />
      <div className="relative glass-panel p-6 w-[340px] max-h-[85vh] overflow-y-auto animate-fade-in">
        <h3 className="text-sm font-semibold text-text-primary mb-2">{b("exportTitle")}</h3>

        <p className="mb-4 text-[10px] leading-relaxed text-text-muted bg-surface border border-surface-border rounded-md px-3 py-2">
          {b("exportNote")}
        </p>

        {exportError && (
          <p className="mb-3 text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
            {b("exportFailed")}
          </p>
        )}

        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">
            {b("images")}
          </p>

          <button
            onClick={exportAsSvg}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-surface border border-surface-border hover:border-primary/30 transition-all group"
          >
            <Download className="w-4 h-4 text-text-secondary group-hover:text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium text-text-primary">{b("downloadSvg")}</p>
              <p className="text-[10px] text-text-muted">{b("downloadSvgDesc")}</p>
            </div>
          </button>

          <button
            onClick={exportAsPng}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-surface border border-surface-border hover:border-primary/30 transition-all group"
          >
            <Download className="w-4 h-4 text-text-secondary group-hover:text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium text-text-primary">{b("downloadPng")}</p>
              <p className="text-[10px] text-text-muted">{b("downloadPngDesc")}</p>
            </div>
          </button>

          <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold pt-2">
            {b("files")}
          </p>

          <button
            onClick={exportAsTxt}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-surface border border-surface-border hover:border-primary/30 transition-all group"
          >
            <FileText className="w-4 h-4 text-text-secondary group-hover:text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium text-text-primary">{b("downloadTxt")}</p>
              <p className="text-[10px] text-text-muted">{b("downloadTxtDesc")}</p>
            </div>
          </button>

          <button
            onClick={exportAsJson}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-surface border border-surface-border hover:border-primary/30 transition-all group"
          >
            <FileJson className="w-4 h-4 text-text-secondary group-hover:text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium text-text-primary">{b("downloadJson")}</p>
              <p className="text-[10px] text-text-muted">{b("downloadJsonDesc")}</p>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-surface border border-surface-border hover:border-primary/30 transition-all group"
          >
            <Upload className="w-4 h-4 text-text-secondary group-hover:text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium text-text-primary">
                {importMsg === "ok" ? b("importLoaded") : importMsg === "fail" ? b("importInvalid") : b("importJson")}
              </p>
              <p className="text-[10px] text-text-muted">{b("importJsonDesc")}</p>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImportFile(file);
              e.target.value = "";
            }}
          />

          <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold pt-2">
            {b("shareTitle")}
          </p>

          <button
            onClick={copyShareLink}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-surface border border-surface-border hover:border-primary/30 transition-all group"
          >
            {shareCopied ? (
              <Check className="w-4 h-4 text-primary" />
            ) : (
              <Share2 className="w-4 h-4 text-text-secondary group-hover:text-primary" />
            )}
            <div className="text-left">
              <p className="text-sm font-medium text-text-primary">
                {shareCopied ? b("shareCopied") : b("copyShareLink")}
              </p>
              <p className="text-[10px] text-text-muted">{b("copyShareLinkDesc")}</p>
            </div>
          </button>

          <button
            onClick={copyToClipboard}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-surface border border-surface-border hover:border-primary/30 transition-all group"
          >
            {copied ? (
              <Check className="w-4 h-4 text-primary" />
            ) : (
              <Copy className="w-4 h-4 text-text-secondary group-hover:text-primary" />
            )}
            <div className="text-left">
              <p className="text-sm font-medium text-text-primary">
                {copied ? b("copied") : b("copyAsText")}
              </p>
              <p className="text-[10px] text-text-muted">{b("copyTextDesc")}</p>
            </div>
          </button>
        </div>

        <button
          onClick={closeWithDwell}
          className="w-full mt-4 py-2 text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          {b("cancel")}
        </button>
      </div>
    </div>
  );
}
