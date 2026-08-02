"use client";

import Link from "next/link";
import { Shield, Zap, Swords, Crosshair, ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { playerRoles } from "@/lib/tactics-data";
import { formatDate } from "@/lib/utils";
import type { PlayerRoleCategory } from "@/types/tactic";

const categoryConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  goalkeeper: { label: "Goalkeepers", icon: <Shield className="w-5 h-5" />, color: "text-amber-400" },
  defender: { label: "Defenders", icon: <Swords className="w-5 h-5" />, color: "text-accent-blue" },
  midfielder: { label: "Midfielders", icon: <Zap className="w-5 h-5" />, color: "text-primary" },
  forward: { label: "Forwards", icon: <Crosshair className="w-5 h-5" />, color: "text-red-400" },
};

const dutyColors: Record<string, { bg: string; text: string; border: string }> = {
  defend: { bg: "bg-accent-blue/10", text: "text-accent-blue", border: "border-accent-blue/30" },
  support: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  attack: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" },
};

const categories: PlayerRoleCategory[] = ["goalkeeper", "defender", "midfielder", "forward"];

export default function RolesPage() {
  return (
    <div className="min-h-screen bg-background-primary pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Player Roles" }]}
          className="mb-6"
        />

        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">
            Player <span className="gradient-text">Roles</span> Encyclopedia
          </h1>
          <p className="text-text-secondary max-w-2xl">
            Complete breakdown of every FM26 player role. Learn key attributes,
            duty options, and which formations each role thrives in.
          </p>
        </div>

        {categories.map((category) => {
          const catRoles = playerRoles.filter((r) => r.category === category);
          const config = categoryConfig[category];

          return (
            <section key={category} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className={`${config.color}`}>{config.icon}</div>
                <h2 className="text-xl font-bold text-text-primary">{config.label}</h2>
                <span className="text-xs text-text-muted">{catRoles.length} roles</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catRoles.map((role) => (
                  <Link
                    key={role.id}
                    href={`/roles/${role.id}`}
                    className="glass-card p-5 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                          {role.name}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-text-secondary line-clamp-2 mb-4 leading-relaxed">
                      {role.description}
                    </p>

                    {/* Duties */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {role.availableDuties.map((duty) => {
                        const d = dutyColors[duty];
                        return (
                          <span
                            key={duty}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${d.bg} ${d.text} ${d.border}`}
                          >
                            {duty.charAt(0).toUpperCase() + duty.slice(1)}
                          </span>
                        );
                      })}
                    </div>

                    {/* Key Attributes Preview */}
                    <div className="flex flex-wrap gap-1">
                      {role.keyAttributes.slice(0, 4).map((attr) => (
                        <span
                          key={attr}
                          className="text-[10px] px-2 py-0.5 rounded bg-surface border border-surface-border text-text-muted"
                        >
                          {attr}
                        </span>
                      ))}
                      {role.keyAttributes.length > 4 && (
                        <span className="text-[10px] px-2 py-0.5 rounded text-text-muted">
                          +{role.keyAttributes.length - 4}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#1C2436]/50 flex items-center justify-between">
                      <span className="text-[10px] text-text-muted">
                        {role.bestFormations.slice(0, 3).join(" · ")}
                      </span>
                      <ArrowRight className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
