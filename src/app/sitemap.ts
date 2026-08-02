import { allTactics } from "contentlayer/generated";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://fm26tactics.com";

  const staticRoutes = [
    { url: base, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${base}/tactics`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/roles`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/guides`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${base}/builder`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
  ];

  const tacticRoutes = allTactics.map((tactic) => ({
    url: `${base}/tactics/${tactic.slug}`,
    lastModified: new Date(tactic.updatedAt || tactic.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...tacticRoutes];
}
