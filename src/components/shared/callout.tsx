import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type CalloutType = "info" | "warning" | "tip" | "danger";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
  className?: string;
}

const styles: Record<CalloutType, string> = {
  info: "border-accent-blue/30 bg-accent-blue/5 text-accent-blue",
  warning: "border-accent-amber/30 bg-accent-amber/5 text-accent-amber",
  tip: "border-primary/30 bg-primary/5 text-primary",
  danger: "border-accent-red/30 bg-accent-red/5 text-accent-red",
};

const labels: Record<CalloutType, string> = {
  info: "Information",
  warning: "Warning",
  tip: "Pro Tip",
  danger: "Important",
};

export function Callout({ type = "info", title, children, className }: CalloutProps) {
  return (
    <div
      className={cn(
        "border rounded-xl p-4 my-6",
        styles[type],
        className
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-70">
        {title || labels[type]}
      </p>
      <div className="text-sm text-text-primary leading-relaxed">{children}</div>
    </div>
  );
}
