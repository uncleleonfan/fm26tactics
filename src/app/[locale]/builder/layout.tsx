import type { Metadata } from "next";
import { generateSEO } from "@/lib/metadata";

export const metadata: Metadata = generateSEO({
  title: "FM26 Tactic Builder — Create Custom Formations & Export",
  description:
    "Design your perfect FM26 tactic with our free interactive builder. Drag players, assign roles and duties, set team instructions, and export your custom formation for Football Manager 2026.",
  path: "/builder",
});

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return <div className="-mt-16 h-dvh overflow-hidden">{children}</div>;
}
