import Link from "next/link";
import { ArrowRight, ChevronDown, Flame } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background-primary">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1B5E2020,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,#448AFF10,transparent_50%)]" />

        {/* Animated pitch lines (desktop only — skip DOM on mobile) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03] hidden sm:block"
          viewBox="0 0 1200 800"
        >
          <line x1="200" y1="0" x2="200" y2="800" stroke="#00E676" strokeWidth="1" />
          <line x1="1000" y1="0" x2="1000" y2="800" stroke="#00E676" strokeWidth="1" />
          <line x1="0" y1="400" x2="1200" y2="400" stroke="#00E676" strokeWidth="1" />
          <circle
            cx="600"
            cy="400"
            r="150"
            stroke="#00E676"
            strokeWidth="1"
            fill="none"
          />
          <rect
            x="200"
            y="200"
            width="200"
            height="400"
            stroke="#00E676"
            strokeWidth="1"
            fill="none"
          />
          <rect
            x="800"
            y="200"
            width="200"
            height="400"
            stroke="#00E676"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>

      {/* Content — fully server-rendered, zero JS for FCP */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Football Manager 2026
          </span>

          {/* H1 */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
            Master{" "}
            <span className="gradient-text">FM26</span>
            <br />
            Tactics Like{" "}
            <span className="gradient-text">Never Before</span>
          </h1>

          <p className="text-lg sm:text-xl text-text-secondary max-w-xl mb-8 leading-relaxed">
            The most comprehensive Football Manager 2026 tactics hub.
            Explore formations, analyze player roles, and use our
            interactive tactic builder to craft the perfect strategy.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Link
              href="/builder"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-background-primary font-semibold hover:shadow-[0_0_30px_rgba(0,230,118,0.3)] transition-all duration-300 group"
            >
              Try Tactic Builder
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/tactics"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#1C2436] text-text-primary font-medium hover:bg-surface-hover hover:border-primary/20 transition-all duration-300"
            >
              Browse Tactics
            </Link>
          </div>

          {/* Trending Tactic Quick Link */}
          <Link
            href="/tactics/3-5-2-catenaccio"
            className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/15 hover:border-amber-500/40 transition-all duration-300 group"
          >
            <span className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Trending</span>
            </span>
            <span className="text-sm text-text-primary font-medium group-hover:text-amber-200 transition-colors">
              3-5-2 Catenaccio — The Art of Defensive Solidity
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Citation */}
          <p className="text-xs text-text-muted mt-8 leading-relaxed">
            <cite>
              Curated from 44+ community-tested tactics and 2,700+ simulated
              matches across{" "}
              <a
                href="https://fm-arena.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                FM-Arena
              </a>
              ,{" "}
              <a
                href="https://fmscout.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                FM Scout
              </a>
              ,{" "}
              <a
                href="https://sortitoutsi.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Sortitoutsi
              </a>
              , and{" "}
              <a
                href="https://passion4fm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Passion4FM
              </a>
              .
            </cite>
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <ChevronDown className="w-5 h-5 text-text-muted" />
      </div>
    </section>
  );
}
