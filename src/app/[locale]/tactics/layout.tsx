import type { Metadata } from "next";
import { generateSEO } from "@/lib/metadata";

export const metadata: Metadata = generateSEO({
  title: "FM26 Tactics – Best Football Manager 2026 Tactics",
  description: "Browse our complete collection of Football Manager 2026 tactics. Gegenpress, Tiki-Taka, Counter-Attack, Wing Play and more — with detailed setup guides.",
  path: "/tactics",
});

export default function TacticsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
