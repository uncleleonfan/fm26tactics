"use client";

import Link from "next/link";
import { TrendingUp, Award, BarChart3, ExternalLink } from "lucide-react";
import { topTestedTactics, metaRoles } from "@/lib/community-data";

const tierColorMap: Record<string, string> = {
  "S+": "bg-red-500/20 text-red-400 border-red-500/30",
  "S": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "A": "bg-accent-blue/20 text-accent-blue border-accent-blue/30",
};

const formationColorMap: Record<string, string> = {
  "4-2-4": "bg-red-500/15 text-red-400 border-red-500/25",
  "4-5-1": "bg-blue-500/15 text-blue-400 border-blue-500/25",
  "5-1-2-2": "bg-purple-500/15 text-purple-400 border-purple-500/25",
  "3-3-3-1": "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  "3-4-3": "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  "4-2-3-1": "bg-amber-500/15 text-amber-400 border-amber-500/25",
};

export function CommunityInsights() {
  return (
    <section className="py-16 sm:py-24 bg-background-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Community Data</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            What the <span className="gradient-text">Meta</span> Says
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto text-sm leading-relaxed">
            Aggregated from FM-Arena community testing, Passion4FM analysis, and Reddit/Sortitoutsi consensus.
            Patch 26.3 • Aug 2026.
          </p>
        </div>

        {/* Top 3 Tested Tactics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {topTestedTactics.slice(0, 3).map((tactic, i) => (
            <div key={tactic.rank} className="glass-panel p-5 relative overflow-hidden group hover:border-primary/30 transition-all">
              {i === 0 && (
                <div className="absolute top-0 right-0 bg-amber-500 text-background-primary text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                  #1 RANKED
                </div>
              )}
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  tactic.formation === "4-2-4" ? "bg-red-500/15 text-red-400 border-red-500/25" :
                  tactic.formation === "4-5-1" ? "bg-blue-500/15 text-blue-400 border-blue-500/25" :
                  tactic.formation === "5-1-2-2" ? "bg-purple-500/15 text-purple-400 border-purple-500/25" :
                  "bg-primary/15 text-primary border-primary/25"
                }`}>
                  {tactic.formation}
                </span>
                <span className="text-[10px] text-text-muted">{tactic.author}</span>
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-2 leading-tight">{tactic.name}</h3>
              <div className="flex items-center gap-4 mb-2">
                <div>
                  <span className="text-lg font-bold text-primary">{tactic.pts.toFixed(1)}</span>
                  <span className="text-[10px] text-text-muted"> PTS</span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-green-400">+{tactic.gd}</span>
                  <span className="text-[10px] text-text-muted"> GD</span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-text-secondary">{tactic.gf}</span>
                  <span className="text-[10px] text-text-muted"> GF</span>
                </div>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{tactic.notes}</p>
            </div>
          ))}
        </div>

        {/* Quick Meta Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Best Formation", value: "4-2-4", sub: "80.0 PTS · 93 GF", icon: BarChart3 },
            { label: "Best Defense", value: "3-3-3-1", sub: "41 GA · Bielsa Style", icon: BarChart3 },
            { label: "OP Role", value: "Advanced WB", sub: "S+ Tier · Elite Width", icon: Award },
            { label: "Tested Tactics", value: "44+", sub: "2,700 matches", icon: TrendingUp },
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-4 text-center">
              <stat.icon className="w-4 h-4 text-text-muted mx-auto mb-2" />
              <p className="text-[10px] text-text-muted uppercase tracking-wider">{stat.label}</p>
              <p className="text-sm font-bold text-text-primary">{stat.value}</p>
              <p className="text-[10px] text-text-muted">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Meta Roles Preview */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            Community-Verified OP Roles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {metaRoles.map((role) => (
              <div key={role.name} className="glass-panel p-4">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-bold text-text-primary">{role.name}</h4>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    tierColorMap[role.opLevel] || "bg-surface/50 text-text-muted"
                  }`}>
                    {role.opLevel}
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed mb-2">{role.overview}</p>
                <div className="flex flex-wrap gap-1">
                  {role.whyOp.slice(0, 2).map((reason, j) => (
                    <span key={j} className="text-[10px] px-2 py-0.5 rounded bg-surface border border-surface-border text-text-muted">
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/meta"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all text-sm font-semibold"
          >
            View Full Meta Analysis
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <p className="text-text-muted text-xs mt-3">
            Data from FM-Arena, Passion4FM, FM Scout, and community. Updated for Patch 26.3.0.
          </p>
        </div>
      </div>
    </section>
  );
}
