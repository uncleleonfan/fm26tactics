import type { Metadata } from "next";
import { generateSEO } from "@/lib/metadata";
import Link from "next/link";

export const metadata: Metadata = generateSEO({
  title: "About FM26 Tactics — Your Ultimate FM26 Resource",
  description: "FM26 Tactics is the leading resource for Football Manager 2026 players. In-depth tactic guides, role analysis, and an interactive tactic builder.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background-primary pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-4">
          About <span className="gradient-text">FM26 Tactics</span>
        </h1>
        <p className="text-text-secondary leading-relaxed mb-8">
          FM26 Tactics is the ultimate resource for Football Manager 2026 players
          looking to master the art of tactical setup. We provide in-depth guides,
          role analysis, and an interactive tactic builder — all designed to help
          you dominate the virtual dugout.
        </p>

        <div className="glass-panel p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">Our Mission</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Football Manager is complex, and tactics can make or break your season.
            Our mission is to demystify FM26&apos;s tactical system and give every player
            the tools to build successful, coherent game plans.
          </p>
        </div>

        <Link href="/" className="text-primary text-sm hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
