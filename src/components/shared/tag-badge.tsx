import { cn } from "@/lib/utils";

interface TagBadgeProps {
  label: string;
  variant?: "default" | "primary" | "outline";
  className?: string;
}

const variants = {
  default: "bg-surface border-surface-border text-text-secondary",
  primary: "bg-primary/10 border-primary/20 text-primary",
  outline: "border-[#1C2436] text-text-secondary hover:border-primary/30",
};

export function TagBadge({ label, variant = "default", className }: TagBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border transition-colors",
        variants[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
