import { allTactics, allGuides } from "contentlayer/generated";
import { playerRoles } from "@/lib/tactics-data";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://fm26tactics.com";
  const now = new Date();

  const staticRoutes = [
    { url: base, lastModified: now, changeFrequency: "daily" as const, priority: 1 },
    { url: `${base}/tactics`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/roles`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/guides`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/builder`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${base}/meta`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const tacticRoutes = allTactics.map((tactic) => ({
    url: `${base}/tactics/${tactic.slug}`,
    lastModified: new Date(tactic.updatedAt || tactic.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const guideRoutes = allGuides.map((guide) => ({
    url: `${base}/guides/${guide.slug}`,
    lastModified: new Date(guide.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const roleRoutes = playerRoles.map((role) => ({
    url: `${base}/roles/${role.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...tacticRoutes, ...guideRoutes, ...roleRoutes];
}
