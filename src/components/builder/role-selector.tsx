"use client";

import { useTranslations } from "next-intl";
import { playerRoles } from "@/lib/tactics-data";
import { trackEvent } from "@/lib/analytics";
import type { PlayerDuty, PlayerRoleCategory } from "@/types/tactic";

interface RoleSelectorProps {
  selectedRoleId: string;
  selectedDuty: PlayerDuty;
  onChangeRole: (roleId: string) => void;
  onChangeDuty: (duty: PlayerDuty) => void;
}

const categories: PlayerRoleCategory[] = ["goalkeeper", "defender", "midfielder", "forward"];

// "Aerial Reach" -> "aerialReach" (i18n attr dictionary key)
const attrKey = (a: string) =>
  a.replace(/ (.)/g, (_m: string, c: string) => c.toUpperCase()).replace(/^./, (c: string) => c.toLowerCase());
const dutyKey = (d: string) => `duty${d.charAt(0).toUpperCase()}${d.slice(1)}`;

export function RoleSelector({
  selectedRoleId,
  selectedDuty,
  onChangeRole,
  onChangeDuty,
}: RoleSelectorProps) {
  const b = useTranslations("builder");
  const r = useTranslations("roles");
  const selectedRole = playerRoles.find((role) => role.id === selectedRoleId);

  return (
    <div>
      <h3 className="text-sm font-semibold text-text-primary mb-3">{b("playerRole")}</h3>

      {/* Role Select */}
      <select
        value={selectedRoleId}
        onChange={(e) => {
          onChangeRole(e.target.value);
          trackEvent("builder_select_role", { label: e.target.value });
        }}
        className="w-full bg-surface border border-surface-border text-text-primary text-sm rounded-lg px-3 py-2.5 mb-3 outline-none focus:border-primary/50 transition-colors"
      >
        {categories.map((cat) => (
          <optgroup key={cat} label={r(cat === "goalkeeper" ? "goalkeepers" : `${cat}s`)}>
            {playerRoles
              .filter((role) => role.category === cat)
              .map((role) => (
                <option key={role.id} value={role.id}>
                  {r.has(`roleName.${role.id}`) ? r(`roleName.${role.id}`) : role.name}
                </option>
              ))}
          </optgroup>
        ))}
      </select>

      {/* Duty Select */}
      {selectedRole && (
        <div>
          <label className="text-xs text-text-muted mb-1.5 block">{r("duty")}</label>
          <div className="flex gap-2">
            {(["defend", "support", "attack"] as PlayerDuty[]).map((duty) => {
              const available = selectedRole.availableDuties.includes(duty);
              return (
                <button
                  key={duty}
                  disabled={!available}
                  onClick={() => {
                    onChangeDuty(duty);
                    trackEvent("builder_select_duty", { label: duty });
                  }}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    selectedDuty === duty && available
                      ? duty === "defend"
                        ? "bg-accent-blue/20 text-accent-blue border-accent-blue/50"
                        : duty === "support"
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/50"
                        : "bg-red-500/20 text-red-400 border-red-500/50"
                      : available
                      ? "bg-surface border-surface-border text-text-muted hover:text-text-secondary"
                      : "bg-surface/50 border-surface-border text-text-muted/50 cursor-not-allowed"
                  }`}
                >
                  {r(dutyKey(duty))}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Role Info */}
      {selectedRole && (
        <div className="mt-4 glass-card p-4">
          <p className="text-xs text-text-secondary leading-relaxed mb-3">
            {r.has(`roleDesc.${selectedRole.id}`) ? r(`roleDesc.${selectedRole.id}`) : selectedRole.description}
          </p>
          <div>
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
              {r("attributes")}
            </p>
            <div className="flex flex-wrap gap-1">
              {selectedRole.keyAttributes.slice(0, 6).map((attr) => {
                const k = `attr.${attrKey(attr)}`;
                return (
                  <span
                    key={attr}
                    className="text-[10px] px-2 py-0.5 rounded bg-primary/5 border border-primary/10 text-primary"
                  >
                    {r.has(k) ? r(k) : attr}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
