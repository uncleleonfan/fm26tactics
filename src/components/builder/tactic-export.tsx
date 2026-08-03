"use client";

import { useState } from "react";
import { Download, Share2, Check, Copy } from "lucide-react";
import type { TacticBoardState } from "@/types/tactic";

interface TacticExportProps {
  state: TacticBoardState;
  onClose: () => void;
}

export function TacticExport({ state, onClose }: TacticExportProps) {
  const [copied, setCopied] = useState(false);

  const exportAsImage = () => {
    const svgEl = document.getElementById("tactic-pitch-svg") as SVGSVGElement | null;
    if (!svgEl) return;

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
    const svgString = serializer.serializeToString(clone);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `fm26-tactic-${state.formation.replace(/-/g, "")}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    const text = `FM26 Tactic: ${state.formation}
    
Team Instructions:
- Mentality: ${state.teamInstructions.mentality.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
- In Possession: ${state.teamInstructions.inPossession.join(", ") || "None"}
- In Transition: ${state.teamInstructions.inTransition.join(", ") || "None"}
- Out of Possession: ${state.teamInstructions.outOfPossession.join(", ") || "None"}

Players: ${state.players.length}
Generated with FM26 Tactics Builder — fm26tactics.com`;

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative glass-panel p-6 w-[280px] animate-fade-in">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Export Tactic</h3>

        <div className="space-y-3">
          <button
            onClick={exportAsImage}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-surface border border-surface-border hover:border-primary/30 transition-all group"
          >
            <Download className="w-4 h-4 text-text-secondary group-hover:text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium text-text-primary">Download as SVG</p>
              <p className="text-[10px] text-text-muted">Save tactic formation as image</p>
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
