import type { Metadata } from "next";
import { generateSEO } from "@/lib/metadata";
import { playerRoles } from "@/lib/tactics-data";

interface LayoutProps {
  children: React.ReactNode;
  params: { slug: string };
}

export function generateMetadata({ params }: LayoutProps): Metadata {
  const role = playerRoles.find((r) => r.id === params.slug);
  if (!role) {
    return {
      title: "Role Not Found",
      description: "The requested player role could not be found.",
    };
  }
  return generateSEO({
    title: `${role.name} — FM26 Player Role Guide`,
    description: `Complete guide to the ${role.name} role in Football Manager 2026. Learn when to use it, key attributes, best partner roles, and player instructions.`,
    path: `/roles/${role.id}`,
    type: "article",
    keywords: [`fm 26 ${role.name.toLowerCase()}`, `fm26 ${role.name.toLowerCase()}`, `football manager 2026 ${role.name.toLowerCase()}`, "fm26 roles", "fm26 player roles"],
  });
}

export default function RoleLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
