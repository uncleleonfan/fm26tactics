import Link from "next/link";
import { BookOpen, ClipboardCheck, Crosshair, Flame, Target, Users } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";

const guideCategories = [
  {
    key: "training",
    title: "Training Guides",
    description: "Optimize player development with proven training schedules and techniques.",
    icon: <ClipboardCheck className="w-5 h-5" />,
    color: "text-accent-blue",
    bg: "bg-accent-blue/5 border-accent-blue/10",
  },
  {
    key: "set-pieces",
    title: "Set Pieces",
    description: "Master corner kicks, free kicks, throw-ins, and penalty strategies.",
    icon: <Target className="w-5 h-5" />,
    color: "text-primary",
    bg: "bg-primary/5 border-primary/10",
  },
  {
    key: "scouting",
    title: "Scouting & Recruitment",
    description: "Build a world-class scouting network to find the next wonderkids.",
    icon: <Crosshair className="w-5 h-5" />,
    color: "text-amber-400",
    bg: "bg-amber-500/5 border-amber-500/10",
  },
  {
    key: "team-management",
    title: "Team Management",
    description: "Handle player morale, dynamics, contracts, and squad harmony.",
    icon: <Users className="w-5 h-5" />,
    color: "text-purple-400",
    bg: "bg-purple-500/5 border-purple-500/10",
  },
  {
    key: "match-day",
    title: "Match Day Strategy",
    description: "Pre-match preparation, opposition analysis, and in-game adjustments.",
    icon: <BookOpen className="w-5 h-5" />,
    color: "text-red-400",
    bg: "bg-red-500/5 border-red-500/10",
  },
  {
    key: "youth-development",
    title: "Youth Development",
    description: "Nurture academy prospects into first-team superstars.",
    icon: <Flame className="w-5 h-5" />,
    color: "text-orange-400",
    bg: "bg-orange-500/5 border-orange-500/10",
  },
];

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-background-primary pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Guides" }]}
          className="mb-6"
        />

        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">
            FM26 <span className="gradient-text">Guides</span>
          </h1>
          <p className="text-text-secondary max-w-2xl">
            Comprehensive guides covering every aspect of Football Manager 2026.
            From training schedules to scouting networks, we&apos;ve got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {guideCategories.map((guide) => (
            <div
              key={guide.key}
              className={`glass-panel p-6 ${guide.bg} hover:border-primary/20 transition-all cursor-pointer group`}
            >
              <div className={`w-10 h-10 rounded-xl bg-surface border border-surface-border flex items-center justify-center ${guide.color} mb-4 group-hover:scale-110 transition-transform`}>
                {guide.icon}
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-2">{guide.title}</h3>
              <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                {guide.description}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">Coming Soon</span>
                <span className="w-1 h-1 rounded-full bg-text-muted" />
                <span className="text-xs text-text-muted">Multiple guides</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
