import type { Metadata } from "next";
import { generateSEO } from "@/lib/metadata";

export const metadata: Metadata = generateSEO({
  title: "FM26 Player Roles Encyclopedia — Complete Role Guide",
  description: "Every Football Manager 2026 player role explained. Key attributes, duty options, best formations, and which roles work together.",
  path: "/roles",
});

export default function RolesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
