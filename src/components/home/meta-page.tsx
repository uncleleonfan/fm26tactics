"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Zap, AlertTriangle, CheckCircle, Download, ExternalLink, Users, Award, BarChart3, Target, Lightbulb } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import {
  topTestedTactics,
  formationInsights,
  metaRoles,
  bestRoleCombos,
  communityConsensus,
  dualFormationTips,
  commonMistakes,
} from "@/lib/community-data";

const tierColors: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  S: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/30", badge: "bg-primary text-background-primary" },
  A: { bg: "bg-accent-blue/10", text: "text-accent-blue", border: "border-accent-blue/30", badge: "bg-accent-blue text-background-primary" },
  B: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30", badge: "bg-amber-500 text-background-primary" },
};

const opLevelColors: Record<string, string> = {
  "S+": "bg-red-500 text-background-primary",
  "S": "bg-amber-500 text-background-primary",
  "A": "bg-accent-blue text-background-primary",
};

export function MetaPage() {
  const t = useTranslations("meta");
  const cm = useTranslations("common");

  const insights = formationInsights;
  const roles = metaRoles;
  const combos = bestRoleCombos;
  const consensus = communityConsensus;
  const dualTips = dualFormationTips;
  const mistakes = commonMistakes;

  return (
    <div className="min-h-screen bg-background-primary pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {cm("backToHome")}
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30 uppercase tracking-wider">
              {t("updatedBadge")}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {t("h1Pre")} <span className="gradient-text">{t("h1Highlight")}</span> {t("h1Post")}
          </h1>
          <p className="text-text-secondary max-w-2xl text-sm leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* ===== SECTION 1: FM-Arena Tested Rankings ===== */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">{t("rankingsTitle")}</h2>
          </div>
          <p className="text-text-muted text-xs mb-5">
            {t("rankingsMeta")}{" "}
            <a href="https://fm-arena.com/table/fm26-the-best-plug-and-play-tactics/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {t("source")} <ExternalLink className="w-3 h-3 inline" />
            </a>
          </p>

          <div className="glass-panel overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1C2436]">
                  <th className="text-left p-3 text-text-muted font-medium text-xs w-10">#</th>
                  <th className="text-left p-3 text-text-primary font-semibold">{t("thTactic")}</th>
                  <th className="text-left p-3 text-text-primary font-semibold">{t("thFormation")}</th>
                  <th className="text-center p-3 text-text-primary font-semibold">PTS</th>
                  <th className="text-center p-3 text-text-primary font-semibold">GD</th>
                  <th className="text-center p-3 text-text-primary font-semibold">GF</th>
                  <th className="text-center p-3 text-text-primary font-semibold">GA</th>
                  <th className="text-center p-3 text-text-primary font-semibold hidden sm:table-cell">{t("thEff")}</th>
                </tr>
              </thead>
              <tbody>
                {topTestedTactics.map((t2) => (
                  <tr key={t2.rank} className="border-b border-[#1C2436]/30 hover:bg-surface/50 transition-colors">
                    <td className="p-3">
                      {t2.rank <= 3 ? (
                        <span className={`text-xs font-bold w-6 h-6 rounded flex items-center justify-center ${
                          t2.rank === 1 ? "bg-amber-500 text-background-primary" :
                          t2.rank === 2 ? "bg-slate-400 text-background-primary" :
                          "bg-amber-700 text-background-primary"
                        }`}>{t2.rank}</span>
                      ) : (
                        <span className="text-xs text-text-muted pl-1">{t2.rank}</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-text-primary text-xs">{t2.name}</div>
                      <div className="text-[10px] text-text-muted">{t2.author}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <a
                          href={t2.arenaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={t("downloadTitle")}
                          onClick={() => trackEvent("meta_download", { label: t2.name })}
                          className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-primary text-background-primary hover:opacity-90 transition-opacity"
                        >
                          <Download className="w-3 h-3" />
                          {t("download")}
                        </a>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-mono">
                        {t2.formation}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-sm font-bold text-text-primary">{t2.pts.toFixed(1)}</span>
                      <span className="text-[10px] text-text-muted">/114</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-xs font-medium ${t2.gd > 0 ? "text-green-400" : "text-red-400"}`}>
                        {t2.gd > 0 ? "+" : ""}{t2.gd}
                      </span>
                    </td>
                    <td className="p-3 text-center text-xs text-text-secondary">{t2.gf}</td>
                    <td className="p-3 text-center text-xs text-text-secondary">{t2.ga}</td>
                    <td className="p-3 text-center hidden sm:table-cell">
                      <span className="text-xs text-text-muted">{t2.efficiency}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Formation Insights */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-text-primary mb-3">{t("formationVerdictsTitle")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {insights.map((f) => {
                const tc = tierColors[f.tier];
                return (
                  <div key={f.formation} className={`glass-panel p-4 border-l-2 ${tc.border}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-text-primary">{f.formation}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${tc.badge}`}>{f.tier}</span>
                    </div>
                    <p className="text-[11px] text-text-muted mb-2">
                      {t("formationAvg", { pts: f.avgPts.toFixed(1), gd: f.avgGD, count: f.appearances })}
                    </p>
                    <p className="text-xs text-text-secondary leading-relaxed">{f.verdict}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== SECTION 2: Meta Player Roles ===== */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">{t("opRolesTitle")}</h2>
          </div>
          <p className="text-text-muted text-xs mb-5">
            {t("opRolesSource")}{" "}
            <a href="https://www.passion4fm.com/football-manager-26-overpowered-player-roles/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Passion4FM <ExternalLink className="w-3 h-3 inline" />
            </a>
          </p>

          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role.name} className="glass-panel p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-text-primary">{role.name}</h3>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${opLevelColors[role.opLevel]}`}>
                        {role.opLevel}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-surface-border text-text-muted">
                        {role.category === "in-possession" ? t("inPossession") : t("outOfPossession")}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{role.overview}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="text-[11px] font-semibold text-green-400 uppercase tracking-wider mb-2">{t("whyOpTitle")}</h4>
                    <ul className="space-y-1.5">
                      {role.whyOp.map((reason, i) => (
                        <li key={i} className="flex gap-2 text-xs text-text-secondary">
                          <span className="text-green-400 shrink-0 mt-0.5">+</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider mb-2">{t("weaknessTitle")}</h4>
                    <p className="text-xs text-text-secondary mb-3">{role.weakness}</p>
                    <h4 className="text-[11px] font-semibold text-text-primary uppercase tracking-wider mb-1.5">{t("keyInstructionsTitle")}</h4>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {role.keyInstructions.map((inst, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                          {inst}
                        </span>
                      ))}
                    </div>
                    <h4 className="text-[11px] font-semibold text-text-primary uppercase tracking-wider mb-1.5">{t("bestPartnersTitle")}</h4>
                    <div className="flex flex-wrap gap-1">
                      {role.bestPartners.map((p, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-surface border border-surface-border text-text-muted">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== SECTION 3: Dual Formation System ===== */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">{t("dualFormationTitle")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dualTips.map((tip, i) => (
              <div key={i} className="glass-panel p-5">
                <h3 className="text-sm font-bold text-text-primary mb-3">{tip.style}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30">IN</span>
                  <span className="text-xs font-mono text-text-primary">{tip.inPossession}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">OUT</span>
                  <span className="text-xs font-mono text-text-primary">{tip.outOfPossession}</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{tip.tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== SECTION 4: Role Synergy ===== */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">{t("combosTitle")}</h2>
          </div>
          <p className="text-text-muted text-xs mb-5">
            {t("combosSource")}{" "}
            <a href="https://www.footballmanagerblog.org/2026/03/fm26-role-synergy-best-player-role-combinations.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              FM Blog <ExternalLink className="w-3 h-3 inline" />
            </a>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {combos.map((combo, i) => (
              <div key={i} className="glass-panel p-4 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-mono font-bold text-primary">{i + 1}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-text-primary font-mono">{combo.combo}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      combo.phase === "possession" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}>
                      {combo.phase === "possession" ? "IN" : "OUT"}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">{combo.description}</p>
                  <p className="text-[11px] text-text-muted mt-1 leading-relaxed">{combo.effect}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== SECTION 5: What Engine Rewards/Punishes ===== */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            {t("engineTitle")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-5">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <h3 className="text-sm font-semibold text-text-primary">{t("rewardedTitle")}</h3>
              </div>
              <ul className="space-y-3 text-sm text-text-secondary">
                {consensus.engineRewards.map((item, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="text-green-400 shrink-0 mt-0.5">+</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-text-primary">{t("punishedTitle")}</h3>
              </div>
              <ul className="space-y-3 text-sm text-text-secondary">
                {consensus.enginePunishes.map((item, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="text-amber-400 shrink-0 mt-0.5">−</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ===== SECTION 6: Common Mistakes ===== */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">{t("mistakesTitle")}</h2>
          </div>

          <div className="space-y-3">
            {mistakes.map((item, i) => (
              <div key={i} className="glass-panel p-4 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary mb-0.5">{item.mistake}</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== SECTION 7: Top Creators & Sources ===== */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">{t("creatorsTitle")}</h2>
          </div>

          <div className="glass-panel p-5">
            <div className="flex flex-wrap gap-2 mb-4">
              {consensus.topCreators.map((creator) => (
                <span key={creator} className="text-sm font-medium px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                  {creator}
                </span>
              ))}
            </div>
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{t("keySourcesTitle")}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {consensus.keySources.map((src, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                  <div className="w-1 h-1 rounded-full bg-primary shrink-0" />
                  {src}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-[#1C2436]/50">
          <p className="text-text-muted text-xs mb-3">
            {t("footerNote")}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/tactics" className="text-primary text-sm hover:underline">
              {t("browseTacticsCta")}
            </Link>
            <Link href="/guides" className="text-primary text-sm hover:underline">
              {t("browseGuidesCta")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
