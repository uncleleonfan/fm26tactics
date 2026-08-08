import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { allBlogs } from "contentlayer/generated";
import { BlogList } from "@/components/blog/blog-list";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "FM26 Tactics Blog — In-Depth Guides, Meta Analysis & Tips",
  description:
    "Expert FM26 tactics blog covering gegenpress setups, player roles, set piece routines, meta analysis, and beginner guides. Updated weekly with community-tested strategies.",
  keywords: [
    "fm26 blog", "football manager 2026 guides", "fm26 tactics blog",
    "fm26 meta", "gegenpress guide", "player roles explained",
  ],
  alternates: { canonical: "https://fm26tactics.com/blog" },
  openGraph: {
    title: "FM26 Tactics Blog — In-Depth Guides & Meta Analysis",
    description: "Expert FM26 tactics blog covering gegenpress setups, player roles, set piece routines, meta analysis, and beginner guides.",
    url: "https://fm26tactics.com/blog",
    type: "website",
    siteName: "FM26 Tactics",
    locale: "en_US",
    images: [{ url: "/images/og/default.jpg", width: 1200, height: 630, alt: "FM26 Tactics Blog — Expert Guides & Meta Analysis" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FM26 Tactics Blog — In-Depth Guides & Meta Analysis",
    description: "Expert FM26 tactics blog covering gegenpress setups, player roles, set piece routines, meta analysis, and beginner guides.",
    images: ["https://fm26tactics.com/images/og/default.jpg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};

export default async function BlogPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = allBlogs;

  return (
    <main className="min-h-screen bg-background-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
            FM26 <span className="gradient-text">Tactics</span> Blog
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>

        <BlogList posts={posts} />

        <div className="mt-16 text-center glass-card p-8 rounded-2xl border-primary/10">
          <h2 className="text-xl font-bold text-text-primary mb-2">
            {t("subtitle")}
          </h2>
          <p className="text-text-secondary mb-4 max-w-md mx-auto">
            {t("ctaText")}
          </p>
          <Link
            href="/tactics"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-background-primary font-semibold hover:shadow-[0_0_30px_rgba(0,230,118,0.3)] transition-all duration-300 group"
          >
            {t("browseAll")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </main>
  );
}
