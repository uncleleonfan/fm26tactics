"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Download, Share2, Check, Copy, FileText, FileJson, Upload, Columns2 } from "lucide-react";
import { encodeTacticState, resolvePhasePlayers } from "@/hooks/use-tactic-builder";
import { trackEvent } from "@/lib/analytics";
import { playerRoles } from "@/lib/tactics-data";
import { computePhaseMetrics } from "@/tactics/phases/phase-analysis";
import { MOVEMENT_LABELS } from "./movement-arrow";
import { StaticPhasePitch } from "./static-phase-pitch";
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

  // Designed phase shapes & key movement arrows
  if (state.phases) {
    const inMetrics = computePhaseMetrics(players, state.phases["in-possession"]);
    const outMetrics = computePhaseMetrics(players, state.phases["out-of-possession"]);
    lines.push(b("txtPhaseShapes"));
    lines.push(b("txtInPossessionShape", { shape: inMetrics.shape.label }));
    lines.push(b("txtOutOfPossessionShape", { shape: outMetrics.shape.label }));
    lines.push("");

    const movements = players.flatMap((p) => {
      const inM = state.phases!["in-possession"][p.id]?.movement;
      const outM = state.phases!["out-of-possession"][p.id]?.movement;
      const role = playerRoles.find((r) => r.id === p.roleId);
      const parts: string[] = [];
      if (inM) parts.push(`${b("phaseInPossession")}: ${MOVEMENT_LABELS[inM.type]}`);
      if (outM) parts.push(`${b("phaseOutOfPossession")}: ${MOVEMENT_LABELS[outM.type]}`);
      if (parts.length === 0) return [];
      return [`${role?.abbr ?? p.roleId} — ${parts.join(", ")}`];
    });
    lines.push(b("txtKeyMovements"));
    if (movements.length > 0) {
      lines.push(...movements);
    } else {
      lines.push(b("txtNoMovements"));
    }
    lines.push("");
  }

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

/** Inline computed styles into a clone so exported SVGs are self-contained. */
function inlineStyles(source: Element, target: Element) {
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
}

/** Walk source & clone trees in sync, inlining styles as we go. */
function walkAndInline(src: Element, dst: Element) {
  inlineStyles(src, dst);
  const srcChildren = Array.from(src.children);
  const dstChildren = Array.from(dst.children);
  for (let i = 0; i < Math.min(srcChildren.length, dstChildren.length); i++) {
    walkAndInline(srcChildren[i], dstChildren[i]);
  }
}

function buildSvgString(state: TacticBoardState): SvgOutput | null {
  const svgEl = document.getElementById("tactic-pitch-svg") as SVGSVGElement | null;
  if (!svgEl) return null;

  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  const originalWidth = svgEl.clientWidth || 400;
  const originalHeight = svgEl.clientHeight || 600;

  clone.setAttribute("width", String(originalWidth));
  clone.setAttribute("height", String(originalHeight));
  walkAndInline(svgEl, clone);

  const serializer = new XMLSerializer();
  return {
    svgString: serializer.serializeToString(clone),
    width: originalWidth,
    height: originalHeight,
  };
}

const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * Both-phases export: wraps the two hidden static pitches into one
 * side-by-side SVG with phase titles and a solid background.
 */
function buildPhasesSvgString(
  state: TacticBoardState,
  b: TFunc
): SvgOutput | null {
  const inSvg = document.getElementById("tactic-phase-in-svg") as SVGSVGElement | null;
  const outSvg = document.getElementById("tactic-phase-out-svg") as SVGSVGElement | null;
  if (!inSvg || !outSvg) return null;

  const embed = (src: SVGSVGElement, x: number) => {
    const clone = src.cloneNode(true) as SVGSVGElement;
    clone.removeAttribute("id");
    clone.removeAttribute("class");
    clone.setAttribute("x", String(x));
    clone.setAttribute("y", "10");
    clone.setAttribute("width", "100");
    clone.setAttribute("height", "100");
    clone.setAttribute("viewBox", "0 0 100 100");
    walkAndInline(src, clone);
    return clone;
  };

  // Layout: 1px margin | pitch | 2px gap | pitch | 1px margin, 10px header
  const W = 204;
  const H = 111;

  const wrapper = document.createElementNS(SVG_NS, "svg");
  wrapper.setAttribute("xmlns", SVG_NS);
  wrapper.setAttribute("width", String(W * 3));
  wrapper.setAttribute("height", String(H * 3));
  wrapper.setAttribute("viewBox", `0 0 ${W} ${H}`);

  const bg = document.createElementNS(SVG_NS, "rect");
  bg.setAttribute("width", String(W));
  bg.setAttribute("height", String(H));
  bg.setAttribute("fill", "#0A0E17");
  wrapper.appendChild(bg);

  const addTitle = (text: string, x: number, color: string) => {
    const title = document.createElementNS(SVG_NS, "text");
    title.setAttribute("x", String(x));
    title.setAttribute("y", "6.5");
    title.setAttribute("fill", color);
    title.setAttribute("font-size", "4.5");
    title.setAttribute("font-weight", "700");
    title.setAttribute("font-family", "ui-sans-serif, system-ui, sans-serif");
    title.setAttribute("text-anchor", "middle");
    title.textContent = text;
    wrapper.appendChild(title);
  };
  addTitle(b("phaseInPossession").toUpperCase(), 51, "#00E676");
  addTitle(b("phaseOutOfPossession").toUpperCase(), 153, "#448AFF");

  wrapper.appendChild(embed(inSvg, 1));
  wrapper.appendChild(embed(outSvg, 103));

  const serializer = new XMLSerializer();
  return {
    svgString: serializer.serializeToString(wrapper),
    width: W * 3,
    height: H * 3,
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

  const exportBothPhasesAsSvg = () => {
    const output = buildPhasesSvgString(state, b);
    if (!output) {
      exportFail("svg-both");
      return;
    }
    trackEvent("builder_download", { label: "svg-both-phases", value: dwellTime() });
    const blob = new Blob([output.svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `${fileBase}-phases.svg`);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const exportBothPhasesAsPng = () => {
    const output = buildPhasesSvgString(state, b);
    if (!output) {
      exportFail("png-both");
      return;
    }
    trackEvent("builder_download", { label: "png-both-phases", value: dwellTime() });

    const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(output.svgString)}`;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = output.width;
      canvas.height = output.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        exportFail("png-both");
        return;
      }
      ctx.fillStyle = "#0A0E17";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) {
          exportFail("png-both");
          return;
        }
        const url = URL.createObjectURL(blob);
        triggerDownload(url, `${fileBase}-phases.png`);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, "image/png");
    };
    img.onerror = () => exportFail("png-both");
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
      {/* Hidden render targets for the both-phases export (styled DOM → SVG clone) */}
      <div aria-hidden className="fixed left-[-9999px] top-0 w-[300px] pointer-events-none opacity-0">
        <StaticPhasePitch
          svgId="tactic-phase-in-svg"
          players={resolvePhasePlayers(state, "in-possession")}
          phase="in-possession"
          phaseMap={state.phases?.["in-possession"]}
        />
        <StaticPhasePitch
          svgId="tactic-phase-out-svg"
          players={resolvePhasePlayers(state, "out-of-possession")}
          phase="out-of-possession"
          phaseMap={state.phases?.["out-of-possession"]}
        />
      </div>
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

          <button
            onClick={exportBothPhasesAsSvg}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-surface border border-surface-border hover:border-primary/30 transition-all group"
          >
            <Columns2 className="w-4 h-4 text-text-secondary group-hover:text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium text-text-primary">{b("downloadBothSvg")}</p>
              <p className="text-[10px] text-text-muted">{b("downloadBothSvgDesc")}</p>
            </div>
          </button>

          <button
            onClick={exportBothPhasesAsPng}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-surface border border-surface-border hover:border-primary/30 transition-all group"
          >
            <Columns2 className="w-4 h-4 text-text-secondary group-hover:text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium text-text-primary">{b("downloadBothPng")}</p>
              <p className="text-[10px] text-text-muted">{b("downloadBothPngDesc")}</p>
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
