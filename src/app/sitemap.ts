import { allTactics, allTacticTrs, allGuides, allBlogs } from "contentlayer/generated";
import { playerRoles } from "@/lib/tactics-data";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.fm26tactics.com";
  const now = new Date();
  // Fixed timestamps for low-frequency pages to avoid full-sitemap churn on every build
  const fixedDate = new Date("2026-08-15");
  // Turkish pilot: hreflang pairs only for FULLY translated tactics (§2b)
  const trSlugs = new Set(allTacticTrs.map((t) => t.slug));

  const staticRoutes = [
    { url: base, lastModified: now, changeFrequency: "daily" as const, priority: 1 },
    { url: `${base}/tactics`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/best`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/roles`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/guides`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/builder`, lastModified: fixedDate, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${base}/meta`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/about`, lastModified: fixedDate, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${base}/contact`, lastModified: fixedDate, changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${base}/privacy`, lastModified: fixedDate, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${base}/terms`, lastModified: fixedDate, changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const tacticRoutes: MetadataRoute.Sitemap = allTactics.map((tactic) => ({
    url: `${base}/tactics/${tactic.slug}`,
    lastModified: new Date(tactic.updatedAt || tactic.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    ...(trSlugs.has(tactic.slug) && {
      alternates: {
        languages: {
          en: `${base}/tactics/${tactic.slug}`,
          tr: `${base}/tr/tactics/${tactic.slug}`,
        },
      },
    }),
  }));

  // Turkish tactic pages — only the translated subset
  const trTacticRoutes: MetadataRoute.Sitemap = allTacticTrs.map((tactic) => ({
    url: `${base}/tr/tactics/${tactic.slug}`,
    lastModified: new Date(tactic.updatedAt || tactic.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: {
      languages: {
        en: `${base}/tactics/${tactic.slug}`,
        tr: `${base}/tr/tactics/${tactic.slug}`,
      },
    },
  }));

  const guideRoutes = allGuides.map((guide) => ({
    url: `${base}/guides/${guide.slug}`,
    lastModified: new Date(guide.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogRoutes = allBlogs.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const roleRoutes = playerRoles.map((role) => ({
    url: `${base}/roles/${role.id}`,
    lastModified: fixedDate,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...tacticRoutes,
    ...trTacticRoutes,
    ...guideRoutes,
    ...blogRoutes,
    ...roleRoutes,
  ];
}
