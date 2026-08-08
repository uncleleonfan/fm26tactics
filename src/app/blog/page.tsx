import type { Metadata } from "next";
import { allBlogs } from "contentlayer/generated";
import { BlogList } from "@/components/blog/blog-list";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "FM26 Tactics Blog — In-Depth Guides, Meta Analysis & Tips",
  description:
    "Expert FM26 tactics blog covering gegenpress setups, player roles, set piece routines, meta analysis, and beginner guides. Updated weekly with community-tested strategies.",
  alternates: {
    canonical: "https://fm26tactics.com/blog",
  },
  openGraph: {
    title: "FM26 Tactics Blog — In-Depth Guides & Meta Analysis",
    description:
      "Expert FM26 tactics blog covering gegenpress setups, player roles, set piece routines, meta analysis, and beginner guides.",
    url: "https://fm26tactics.com/blog",
    type: "website",
  },
};

export default function BlogPage() {
  const posts = allBlogs;

  return (
    <main className="min-h-screen bg-background-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
            FM26 <span className="gradient-text">Tactics</span> Blog
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            In-depth Football Manager 2026 guides, meta analysis, and tactical
            breakdowns. Written by the FM26 Tactics team using data from 2,700+
            simulated matches.
          </p>
        </div>

        {/* Post Grid */}
        <BlogList posts={posts} />

        {/* Newsletter CTA */}
        <div className="mt-16 text-center glass-card p-8 rounded-2xl border-primary/10">
          <h2 className="text-xl font-bold text-text-primary mb-2">
            Stay Updated
          </h2>
          <p className="text-text-secondary mb-4 max-w-md mx-auto">
            New guides, meta updates, and patch analysis every week. Bookmark
            this page or follow us for the latest.
          </p>
          <Link
            href="/tactics"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-background-primary font-semibold hover:shadow-[0_0_30px_rgba(0,230,118,0.3)] transition-all duration-300 group"
          >
            Browse All Tactics
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </main>
  );
}
