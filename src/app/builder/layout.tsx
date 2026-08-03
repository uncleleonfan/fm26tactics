import type { Metadata } from "next";
import { generateSEO } from "@/lib/metadata";

export const metadata: Metadata = generateSEO({
  title: "Interactive FM26 Tactic Builder — Design Your Formation",
  description: "Create and visualize Football Manager 2026 tactics with our interactive builder. Drag players, assign roles, and test formations in real-time.",
  path: "/builder",
});

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
