"use client";

import { useState } from "react";
import { Download, Share2, Check, Copy } from "lucide-react";
import { encodeTacticState } from "@/hooks/use-tactic-builder";
import type { TacticBoardState } from "@/types/tactic";

interface TacticExportProps {
  state: TacticBoardState;
  onClose: () => void;
}

interface SvgOutput {
  svgString: string;
  width: number;
  height: number;
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

export function TacticExport({ state, onClose }: TacticExportProps) {
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const exportAsSvg = () => {
    const output = buildSvgString(state);
    if (!output) return;
    const blob = new Blob([output.svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `fm26-tactic-${state.formation.replace(/-/g, "")}.svg`);
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
        triggerDownload(url, `fm26-tactic-${state.formation.replace(/-/g, "")}.png`);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, "image/png");
    };
    img.src = svgUrl;
  };

  const copyToClipboard = async () => {
    const text = `FM26 Tactic: ${state.formation}
    
Team Instructions:
- Mentality: ${state.teamInstructions.mentality.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
- In Possession: ${state.teamInstructions.inPossession.join(", ") || "None"}
- In Transition: ${state.teamInstructions.inTransition.join(", ") || "None"}
- Out of Possession: ${state.teamInstructions.outOfPossession.join(", ") || "None"}

Players: ${state.players.length}
Generated with FM26 Tactics Builder — www.fm26tactics.com`;

    await navigator.clipboard.writeText(text);
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
      <div className="relative glass-panel p-6 w-[320px] animate-fade-in">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Export Tactic</h3>

        <div className="space-y-3">
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
              <p className="text-[10px] text-text-muted">Copy tactic instructions</p>
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
