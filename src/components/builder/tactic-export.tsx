"use client";

import { useRef, useState } from "react";
import { Download, Share2, Check, Copy, FileText, FileJson, Upload } from "lucide-react";
import { encodeTacticState } from "@/hooks/use-tactic-builder";
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

/** Full human-readable tactic card — formation, every player's role & duty, and all team instructions. */
function buildTacticText(state: TacticBoardState): string {
  const { formation, players, teamInstructions } = state;
  const lines: string[] = [];

  lines.push(`FM26 TACTIC — ${formation}`);
  lines.push("Generated with FM26 Tactics Builder — www.fm26tactics.com");
  lines.push("");

  lines.push("FORMATION");
  lines.push(formation);
  lines.push("");

  lines.push("LINEUP & ROLES");
  players.forEach((p, i) => {
    const role = playerRoles.find((r) => r.id === p.roleId);
    const category = CATEGORY_SHORT[role?.category ?? ""] ?? "P";
    const roleName = role?.name ?? p.roleId;
    lines.push(`${i + 1}. ${category} — ${roleName} (${cap(p.duty)})`);
  });
  lines.push("");

  lines.push("TEAM INSTRUCTIONS");
  lines.push(`Mentality: ${cap(teamInstructions.mentality)}`);
  lines.push(
    `In Possession: ${teamInstructions.inPossession.join(", ") || "None"}`
  );
  lines.push(
    `In Transition: ${teamInstructions.inTransition.join(", ") || "None"}`
  );
  lines.push(
    `Out of Possession: ${teamInstructions.outOfPossession.join(", ") || "None"}`
  );
  lines.push("");

  lines.push("HOW TO REPLICATE IN FM26");
  lines.push(`1. Open FM26 → Tactics → New Tactic and pick the ${formation} formation.`);
  lines.push("2. Assign each player the role & duty listed above (order matches the pitch from the back).");
  lines.push("3. Set team mentality and tick the team instructions above.");
  lines.push("4. Share your in-game result back at www.fm26tactics.com");

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
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [importMsg, setImportMsg] = useState<"ok" | "fail" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileBase = `fm26-tactic-${state.formation.replace(/-/g, "")}`;

  const exportAsSvg = () => {
    const output = buildSvgString(state);
    if (!output) return;
    const blob = new Blob([output.svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `${fileBase}.svg`);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const exportAsPng = () => {
    const output = buildSvgString(state);
    if (!output) return;

    const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(output.svgString)}`;
    const img = new Image();
    img.onload = () => {
      const scale = 2; // 2x for crisp output
      const canvas = document.createElement("canvas");
      canvas.width = output.width * scale;
      canvas.height = output.height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      // Solid background so dark text is always visible
      ctx.fillStyle = "#0A0E17";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        triggerDownload(url, `${fileBase}.png`);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, "image/png");
    };
    img.src = svgUrl;
  };

  const exportAsTxt = () => {
    const blob = new Blob([buildTacticText(state)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `${fileBase}.txt`);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const exportAsJson = () => {
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
        setImportMsg(ok ? "ok" : "fail");
        if (ok) {
          setTimeout(onClose, 900);
        }
      } catch {
        setImportMsg("fail");
      }
      setTimeout(() => setImportMsg(null), 2500);
    };
    reader.readAsText(file);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(buildTacticText(state));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyShareLink = async () => {
    const encoded = encodeTacticState(state);
    const url = `${window.location.origin}${window.location.pathname}?tactic=${encodeURIComponent(encoded)}`;
    await navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative glass-panel p-6 w-[340px] max-h-[85vh] overflow-y-auto animate-fade-in">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Export Tactic</h3>

        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">
            Images
          </p>

          <button
            onClick={exportAsSvg}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-surface border border-surface-border hover:border-primary/30 transition-all group"
          >
            <Download className="w-4 h-4 text-text-secondary group-hover:text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium text-text-primary">Download as SVG</p>
              <p className="text-[10px] text-text-muted">Save tactic formation as vector image</p>
            </div>
          </button>

          <button
            onClick={exportAsPng}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-surface border border-surface-border hover:border-primary/30 transition-all group"
          >
            <Download className="w-4 h-4 text-text-secondary group-hover:text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium text-text-primary">Download as PNG</p>
              <p className="text-[10px] text-text-muted">Shareable image, ready for Discord & forums</p>
            </div>
          </button>

          <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold pt-2">
            Files
          </p>

          <button
            onClick={exportAsTxt}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-surface border border-surface-border hover:border-primary/30 transition-all group"
          >
            <FileText className="w-4 h-4 text-text-secondary group-hover:text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium text-text-primary">Download .txt</p>
              <p className="text-[10px] text-text-muted">Full tactic card — follow it in-game</p>
            </div>
          </button>

          <button
            onClick={exportAsJson}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-surface border border-surface-border hover:border-primary/30 transition-all group"
          >
            <FileJson className="w-4 h-4 text-text-secondary group-hover:text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium text-text-primary">Download .json</p>
              <p className="text-[10px] text-text-muted">Backup / share & re-import the exact tactic</p>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-surface border border-surface-border hover:border-primary/30 transition-all group"
          >
            <Upload className="w-4 h-4 text-text-secondary group-hover:text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium text-text-primary">
                {importMsg === "ok" ? "Loaded!" : importMsg === "fail" ? "Invalid file" : "Import .json"}
              </p>
              <p className="text-[10px] text-text-muted">Restore a tactic from a saved .json file</p>
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
            Share
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
                {shareCopied ? "Link Copied!" : "Copy Share Link"}
              </p>
              <p className="text-[10px] text-text-muted">Anyone with the link opens this exact tactic</p>
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
                {copied ? "Copied!" : "Copy as Text"}
              </p>
              <p className="text-[10px] text-text-muted">Copy the full tactic card to clipboard</p>
            </div>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
