"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Download,
  Check,
  Copy,
  FileText,
  FileJson,
  Upload,
  Columns2,
  X,
  Layers,
  BookmarkPlus,
} from "lucide-react";
import { resolvePhasePlayers } from "@/hooks/use-tactic-builder";
import { trackEvent } from "@/lib/analytics";
import { playerRoles } from "@/lib/tactics-data";
import { computePhaseMetrics } from "@/tactics/phases/phase-analysis";
import { MOVEMENT_LABELS } from "./movement-arrow";
import { StaticPhasePitch } from "./static-phase-pitch";
import { ShareActions } from "./share-actions";
import type { TacticBoardState } from "@/types/tactic";

interface TacticExportProps {
  state: TacticBoardState;
  /** Human formation label, e.g. "4-2-3-1 Gegenpress" — used as the share text. */
  formationLabel: string;
  onClose: () => void;
  onImport: (value: unknown) => boolean;
  /** Opens the "save a named copy" dialog from the post-download step. */
  onSave: () => void;
}

interface SvgOutput {
  svgString: string;
  width: number;
  height: number;
}

type ExportFormat = "txt" | "json" | "svg" | "png" | "svg-both-phases" | "bundle";

/**
 * The one format that matches what users actually do with the output.
 * GA4 (2026-10-07→13) shows .txt was 35 of 78 downloads — the step-by-step
 * card, not an image. It is promoted to the single primary action.
 */
const DEFAULT_FORMAT: ExportFormat = "txt";

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

/**
 * Export panel, grouped by what the user is about to DO rather than by file
 * type. The 2026-10 analytics showed every download the panel offered was
 * being sampled (1.86 formats per downloading user) and that .txt carried 45%
 * of the demand — so the step-by-step card is the single primary action, the
 * images are grouped as "share it", and a one-click bundle absorbs the
 * hedging clicks.
 *
 * The first successful download swaps the panel to a post-download step
 * (share / save). With no accounts and localStorage-only persistence, that
 * moment is the last chance to bring the user back, so it must not be a dead
 * end.
 */
export function TacticExport({
  state,
  formationLabel,
  onClose,
  onImport,
  onSave,
}: TacticExportProps) {
  const b = useTranslations("builder");
  const [copied, setCopied] = useState(false);
  const [importMsg, setImportMsg] = useState<"ok" | "fail" | null>(null);
  const [exportError, setExportError] = useState(false);
  // null while browsing formats; set to the first format that actually
  // downloaded, which switches the panel to the post-download step.
  const [doneFormat, setDoneFormat] = useState<ExportFormat | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const openTimeRef = useRef(Date.now());
  // Everything below exists to answer "did the 84% who never downloaded even
  // look?" — GA4 could not separate "opened and bounced" from "read the list
  // and left" without it.
  const downloadIndexRef = useRef(0);
  const downloadedRef = useRef(false);
  const selectedRef = useRef<Set<string>>(new Set());

  const fileBase = `fm26-tactic-${state.formation.replace(/-/g, "")}`;

  // ms the export dialog stayed open — distinguishes "opened & closed instantly"
  // from "read the options but didn't download". Sent with every exit/download.
  const dwellTime = () => Date.now() - openTimeRef.current;

  const closeWithDwell = () => {
    trackEvent("builder_export_close", {
      value: dwellTime(),
      had_selection: selectedRef.current.size > 0 ? "true" : "false",
      downloaded: downloadedRef.current ? "true" : "false",
      formats_selected: Array.from(selectedRef.current).join(",") || "none",
    });
    onClose();
  };

  // Surface previously-silent failures (missing SVG node, canvas/blob/clipboard errors)
  // and count them separately from successful downloads.
  const exportFail = (label: string) => {
    trackEvent("builder_download_fail", { label, value: dwellTime() });
    setExportError(true);
    setTimeout(() => setExportError(false), 2500);
  };

  const trackSelect = (format: ExportFormat) => {
    selectedRef.current.add(format);
    trackEvent("builder_export_format_select", {
      format,
      is_default: format === DEFAULT_FORMAT ? "true" : "false",
    });
  };

  /**
   * Fire only once a download actually happened, so `format_select` minus
   * `download` isolates the failures that used to pollute the download data
   * (N4). The first success also reveals the post-download step.
   */
  const onDownloaded = (format: ExportFormat) => {
    downloadIndexRef.current += 1;
    trackEvent("builder_download", {
      label: format,
      format,
      is_default: format === DEFAULT_FORMAT ? "true" : "false",
      download_index: downloadIndexRef.current,
      value: dwellTime(),
    });
    if (!downloadedRef.current) {
      downloadedRef.current = true;
      trackEvent("builder_export_success_shown", { format });
      setDoneFormat(format);
    }
  };

  const saveFile = (content: string, mime: string, filename: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, filename);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const renderPng = (
    output: SvgOutput,
    filename: string,
    format: ExportFormat,
    scale: number
  ) => {
    const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(output.svgString)}`;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = output.width * scale;
      canvas.height = output.height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return exportFail(format);
      // Solid background so dark text is always visible
      ctx.fillStyle = "#0A0E17";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) return exportFail(format);
        const url = URL.createObjectURL(blob);
        triggerDownload(url, filename);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        onDownloaded(format);
      }, "image/png");
    };
    img.onerror = () => exportFail(format);
    img.src = svgUrl;
  };

  const writeTxt = (): boolean => {
    try {
      saveFile(buildTacticText(state, b), "text/plain;charset=utf-8", `${fileBase}.txt`);
    } catch {
      exportFail("txt");
      return false;
    }
    onDownloaded("txt");
    return true;
  };

  const writeJson = (): boolean => {
    try {
      saveFile(JSON.stringify(state, null, 2), "application/json", `${fileBase}.json`);
    } catch {
      exportFail("json");
      return false;
    }
    onDownloaded("json");
    return true;
  };

  const writeBothPhasesSvg = (): boolean => {
    const output = buildPhasesSvgString(state, b);
    if (!output) {
      exportFail("svg-both-phases");
      return false;
    }
    saveFile(output.svgString, "image/svg+xml", `${fileBase}-phases.svg`);
    onDownloaded("svg-both-phases");
    return true;
  };

  const handleTxt = () => {
    trackSelect("txt");
    writeTxt();
  };

  const handleJson = () => {
    trackSelect("json");
    writeJson();
  };

  const handleSvg = () => {
    trackSelect("svg");
    const output = buildSvgString(state);
    if (!output) return exportFail("svg");
    saveFile(output.svgString, "image/svg+xml", `${fileBase}.svg`);
    onDownloaded("svg");
  };

  const handlePng = () => {
    trackSelect("png");
    const output = buildSvgString(state);
    if (!output) return exportFail("png");
    renderPng(output, `${fileBase}.png`, "png", 2);
  };

  const handleSvgBothPhases = () => {
    trackSelect("svg-both-phases");
    writeBothPhasesSvg();
  };

  /**
   * One click for the three things the panel is actually for: the in-game
   * recipe, the backup, and the shareable two-phase image. All three fire
   * synchronously inside the same user gesture — staggering them with setTimeout
   * would break the gesture and let Safari block the later files.
   */
  const handleBundle = () => {
    trackSelect("bundle");
    let count = 0;
    if (writeTxt()) count += 1;
    if (writeJson()) count += 1;
    if (writeBothPhasesSvg()) count += 1;
    trackEvent("builder_export_bundle_download", { count, value: dwellTime() });
    if (count === 0) exportFail("bundle");
  };

  const handleSaveCopy = () => {
    trackEvent("builder_post_download_action", { action: "save" });
    onSave();
  };

  const handleDownloadMore = () => {
    trackEvent("builder_post_download_action", { action: "more" });
    setDoneFormat(null);
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

  const formatButtonClass =
    "w-full flex items-center gap-3 p-3 rounded-lg bg-surface border border-surface-border hover:border-primary/30 transition-all group";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={b("exportTitle")}
    >
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
      <div className="relative glass-panel p-6 w-[92vw] max-w-[360px] max-h-[85vh] overflow-y-auto animate-fade-in">
        <button
          onClick={closeWithDwell}
          aria-label={b("close")}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {doneFormat ? (
          <>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-primary" />
              </span>
              <h3 className="text-sm font-semibold text-text-primary">{b("exportSuccessTitle")}</h3>
            </div>
            <p className="mb-4 text-[11px] leading-relaxed text-text-muted">
              {b("exportSuccessDesc")}
            </p>

            <ShareActions state={state} formationLabel={formationLabel} source="export-success" />

            <button onClick={handleSaveCopy} className={`${formatButtonClass} mt-3`}>
              <BookmarkPlus className="w-4 h-4 text-text-secondary group-hover:text-primary shrink-0" />
              <span className="text-left">
                <span className="block text-sm font-medium text-text-primary">
                  {b("exportSaveForLater")}
                </span>
                <span className="block text-[10px] text-text-muted">
                  {b("exportSaveForLaterDesc")}
                </span>
              </span>
            </button>

            <button
              onClick={handleDownloadMore}
              className="mt-3 w-full py-2 text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              {b("exportDownloadMore")}
            </button>
          </>
        ) : (
          <>
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
                {b("exportGroupSetup")}
              </p>

              <button
                onClick={handleTxt}
                className="relative w-full flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/40 hover:border-primary/70 hover:bg-primary/15 transition-all group"
              >
                <FileText className="w-4 h-4 text-primary shrink-0" />
                <span className="text-left">
                  <span className="block text-sm font-semibold text-text-primary">
                    {b("downloadTxt")}
                  </span>
                  <span className="block text-[10px] text-text-muted">{b("downloadTxtDesc")}</span>
                </span>
                <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full bg-primary text-background-primary text-[9px] font-bold uppercase tracking-wide">
                  {b("exportRecommended")}
                </span>
              </button>

              <button onClick={handleBundle} className={formatButtonClass}>
                <Layers className="w-4 h-4 text-text-secondary group-hover:text-primary shrink-0" />
                <span className="text-left">
                  <span className="block text-sm font-medium text-text-primary">
                    {b("exportBundle")}
                  </span>
                  <span className="block text-[10px] text-text-muted">{b("exportBundleDesc")}</span>
                </span>
              </button>

              <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold pt-2">
                {b("exportGroupShare")}
              </p>

              <button onClick={handlePng} className={formatButtonClass}>
                <Download className="w-4 h-4 text-text-secondary group-hover:text-primary shrink-0" />
                <span className="text-left">
                  <span className="block text-sm font-medium text-text-primary">
                    {b("downloadPng")}
                  </span>
                  <span className="block text-[10px] text-text-muted">{b("downloadPngDesc")}</span>
                </span>
              </button>

              <button onClick={handleSvg} className={formatButtonClass}>
                <Download className="w-4 h-4 text-text-secondary group-hover:text-primary shrink-0" />
                <span className="text-left">
                  <span className="block text-sm font-medium text-text-primary">
                    {b("downloadSvg")}
                  </span>
                  <span className="block text-[10px] text-text-muted">{b("downloadSvgDesc")}</span>
                </span>
              </button>

              <button onClick={handleSvgBothPhases} className={formatButtonClass}>
                <Columns2 className="w-4 h-4 text-text-secondary group-hover:text-primary shrink-0" />
                <span className="text-left">
                  <span className="block text-sm font-medium text-text-primary">
                    {b("downloadBothSvg")}
                  </span>
                  <span className="block text-[10px] text-text-muted">
                    {b("downloadBothSvgDesc")}
                  </span>
                </span>
              </button>

              <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold pt-2">
                {b("exportGroupReuse")}
              </p>

              <button onClick={handleJson} className={formatButtonClass}>
                <FileJson className="w-4 h-4 text-text-secondary group-hover:text-primary shrink-0" />
                <span className="text-left">
                  <span className="block text-sm font-medium text-text-primary">
                    {b("downloadJson")}
                  </span>
                  <span className="block text-[10px] text-text-muted">{b("downloadJsonDesc")}</span>
                </span>
              </button>

              <button onClick={copyToClipboard} className={formatButtonClass}>
                {copied ? (
                  <Check className="w-4 h-4 text-primary shrink-0" />
                ) : (
                  <Copy className="w-4 h-4 text-text-secondary group-hover:text-primary shrink-0" />
                )}
                <span className="text-left">
                  <span className="block text-sm font-medium text-text-primary">
                    {copied ? b("copied") : b("copyAsText")}
                  </span>
                  <span className="block text-[10px] text-text-muted">{b("copyTextDesc")}</span>
                </span>
              </button>

              <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold pt-2">
                {b("exportGroupRestore")}
              </p>

              <button
                onClick={() => fileInputRef.current?.click()}
                className={formatButtonClass}
              >
                <Upload className="w-4 h-4 text-text-secondary group-hover:text-primary shrink-0" />
                <span className="text-left">
                  <span className="block text-sm font-medium text-text-primary">
                    {importMsg === "ok"
                      ? b("importLoaded")
                      : importMsg === "fail"
                        ? b("importInvalid")
                        : b("importJson")}
                  </span>
                  <span className="block text-[10px] text-text-muted">{b("importJsonDesc")}</span>
                </span>
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
            </div>

            <button
              onClick={closeWithDwell}
              className="w-full mt-4 py-2 text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              {b("cancel")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
