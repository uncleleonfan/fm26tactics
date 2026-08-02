import Link from "next/link";
import { ArrowRight, BookOpen, Users, Target, ClipboardCheck, Crosshair, Flame } from "lucide-react";

interface GuideItem {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  icon: React.ReactNode;
}

const latestGuides: GuideItem[] = [
  {
    title: "Complete Training Schedule Guide for FM26",
    slug: "complete-training-schedule",
    category: "training",
    excerpt: "Maximize player development with optimized weekly training schedules tailored to your tactical philosophy.",
    icon: <ClipboardCheck className="w-5 h-5" />,
  },
  {
    title: "Set Piece Masterclass: Corner Kick Routines",
    slug: "set-pieces-corner-routines",
    category: "set-pieces",
    excerpt: "Dominate set plays with proven near-post, far-post, and short corner routines that win matches.",
    icon: <Target className="w-5 h-5" />,
  },
  {
    title: "Scouting Network Setup for Any Budget",
    slug: "scouting-network-setup",
    category: "scouting",
    excerpt: "Build an efficient global scouting network to uncover hidden gems and future world-class talents.",
    icon: <Crosshair className="w-5 h-5" />,
  },
  {
    title: "Youth Development: From Academy to First Team",
    slug: "youth-development-academy",
    category: "youth-development",
    excerpt: "A step-by-step system for nurturing wonderkids through your academy into first-team regulars.",
    icon: <Flame className="w-5 h-5" />,
  },
  {
    title: "Match Day Preparation & In-Game Adjustments",
    slug: "match-day-preparation",
    category: "match-day",
    excerpt: "Everything you need to know about pre-match briefings, opposition instructions, and mid-game tactical tweaks.",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    title: "Team Morale & Dynamics Management",
    slug: "team-morale-dynamics",
    category: "team-management",
    excerpt: "Keep your squad harmony high and manage personalities effectively for consistent performances.",
    icon: <Users className="w-5 h-5" />,
  },
];

export function LatestGuides() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t border-[#1C2436]/50">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Latest <span className="gradient-text">Guides</span>
          </h2>
          <p className="text-text-secondary text-sm">
            In-depth tutorials to level up your FM26 management
          </p>
        </div>
        <Link
          href="/guides"
          className="hidden sm:inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          All Guides <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {latestGuides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="glass-card p-5 group flex gap-4"
          >
            <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
              {guide.icon}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors line-clamp-1">
                {guide.title}
              </h3>
              <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                {guide.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
