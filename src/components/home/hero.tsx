"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background-primary">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1B5E2020,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,#448AFF10,transparent_50%)]" />

        {/* Animated pitch lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 1200 800">
          <line x1="200" y1="0" x2="200" y2="800" stroke="#00E676" strokeWidth="1" />
          <line x1="1000" y1="0" x2="1000" y2="800" stroke="#00E676" strokeWidth="1" />
          <line x1="0" y1="400" x2="1200" y2="400" stroke="#00E676" strokeWidth="1" />
          <circle cx="600" cy="400" r="150" stroke="#00E676" strokeWidth="1" fill="none" />
          <rect x="200" y="200" width="200" height="400" stroke="#00E676" strokeWidth="1" fill="none" />
          <rect x="800" y="200" width="200" height="400" stroke="#00E676" strokeWidth="1" fill="none" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="max-w-3xl">
          {mounted && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Football Manager 2026
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6"
              >
                Master{" "}
                <span className="gradient-text">FM26</span>
                <br />
                Tactics Like{" "}
                <span className="gradient-text">Never Before</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg sm:text-xl text-text-secondary max-w-xl mb-8 leading-relaxed"
              >
                The most comprehensive Football Manager 2026 tactics hub.
                Explore formations, analyze player roles, and use our
                interactive tactic builder to craft the perfect strategy.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-col sm:flex-row gap-3"
              >
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
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <ChevronDown className="w-5 h-5 text-text-muted" />
      </div>
    </section>
  );
}
