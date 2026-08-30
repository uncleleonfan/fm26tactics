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

  // Turkish pilot L1: home + core list pages get en↔tr hreflang pairs (§2b)
  const localeAwarePaths = [
    { path: "", changeFrequency: "daily" as const, priority: 1 },
    { path: "/tactics", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/best", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/meta", changeFrequency: "weekly" as const, priority: 0.8 },
  ];

  const localeAwareRoutes = localeAwarePaths.flatMap((r) => {
    const languages = { en: `${base}${r.path}`, tr: `${base}/tr${r.path}` };
    return (["en", "tr"] as const).map((lang) => ({
      url: languages[lang],
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
      alternates: { languages },
    }));
  });

  const staticRoutes = [
    ...localeAwareRoutes,
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/roles`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/formations`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
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
