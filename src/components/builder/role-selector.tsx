"use client";

import { playerRoles } from "@/lib/tactics-data";
import { trackEvent } from "@/lib/analytics";
import type { PlayerDuty, PlayerRoleCategory } from "@/types/tactic";

interface RoleSelectorProps {
  selectedRoleId: string;
  selectedDuty: PlayerDuty;
  onChangeRole: (roleId: string) => void;
  onChangeDuty: (duty: PlayerDuty) => void;
}

const categories: { key: PlayerRoleCategory; label: string }[] = [
  { key: "goalkeeper", label: "Goalkeeper" },
  { key: "defender", label: "Defenders" },
  { key: "midfielder", label: "Midfielders" },
  { key: "forward", label: "Forwards" },
];

export function RoleSelector({
  selectedRoleId,
  selectedDuty,
  onChangeRole,
  onChangeDuty,
}: RoleSelectorProps) {
  const selectedRole = playerRoles.find((r) => r.id === selectedRoleId);

  return (
    <div>
      <h3 className="text-sm font-semibold text-text-primary mb-3">Player Role</h3>

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
          <optgroup key={cat.key} label={cat.label}>
            {playerRoles
              .filter((r) => r.category === cat.key)
              .map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
          </optgroup>
        ))}
      </select>

      {/* Duty Select */}
      {selectedRole && (
        <div>
          <label className="text-xs text-text-muted mb-1.5 block">Duty</label>
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
                  {duty.charAt(0).toUpperCase() + duty.slice(1)}
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
            {selectedRole.description}
          </p>
          <div>
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
              Key Attributes
            </p>
            <div className="flex flex-wrap gap-1">
              {selectedRole.keyAttributes.slice(0, 6).map((attr) => (
                <span
                  key={attr}
                  className="text-[10px] px-2 py-0.5 rounded bg-primary/5 border border-primary/10 text-primary"
                >
                  {attr}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
