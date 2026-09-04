import { allTactics, allGuides, allBlogs } from "contentlayer/generated";
import { playerRoles } from "@/lib/tactics-data";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.fm26tactics.com";
  const now = new Date();
  // Fixed timestamps for low-frequency pages to avoid full-sitemap churn on every build
  const fixedDate = new Date("2026-08-15");

  // English-only sitemap: /tr /fr /de were removed and now permanently
  // redirect to these URLs (LOCALE_REMOVAL_AUDIT.md). Redirect targets must
  // not carry hreflang alternates to pages that no longer exist.
  const coreRoutes = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily" as const, priority: 1 },
    { url: `${base}/tactics`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/best`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/formations`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/meta`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
  ];

  const staticRoutes = [
    ...coreRoutes,
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/roles`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/guides`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/builder`, lastModified: fixedDate, changeFrequency: "monthly" as const, priority: 0.9 },
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
    ...guideRoutes,
    ...blogRoutes,
    ...roleRoutes,
  ];
}
