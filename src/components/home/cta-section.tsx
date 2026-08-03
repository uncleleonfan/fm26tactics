"use client";

import Link from "next/link";
import { ArrowRight, Grip, Users, Settings, Share2 } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: <Grip className="w-5 h-5" />,
    title: "Drag & Drop Players",
    description:
      "Position your 11 players anywhere on the pitch with smooth drag-and-drop controls.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Assign Roles & Duties",
    description:
      "Choose from all FM26 player roles and duties — defend, support, or attack.",
  },
  {
    icon: <Settings className="w-5 h-5" />,
    title: "Configure Team Instructions",
    description:
      "Set mentality, in-possession, transition, and out-of-possession instructions.",
  },
  {
    icon: <Share2 className="w-5 h-5" />,
    title: "Export & Share",
    description:
      "Save your tactic as an image or share a link with the community.",
  },
];

export function TacticBuilderCTA() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent-blue/5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="glass-panel border border-primary/10 p-8 sm:p-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left Content */}
            <div>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-4">
                  Interactive Tool
                </span>
              </motion.div>

              {/* H2 — always in DOM, server-rendered */}
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Build Your Own{" "}
                <span className="gradient-text">Tactic</span>
              </h2>

              <p className="text-text-secondary mb-8 leading-relaxed">
                Stop imagining and start creating. Our interactive Tactic
                Builder lets you visualize every aspect of your FM26 formation
                in real-time.
              </p>

              {/* Steps — now use <h3> for sequential heading hierarchy */}
              <div className="space-y-3 mb-8">
                {steps.map((step, i) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-start gap-3 glass-card p-4"
                  >
                    <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary">
                        {step.title}
                      </h3>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-background-primary font-semibold hover:shadow-[0_0_30px_rgba(0,230,118,0.3)] transition-all duration-300 group"
              >
                Open Tactic Builder
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right Preview */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Preview Pitch */}
                <svg
                  viewBox="0 0 400 600"
                  className="w-full max-w-sm mx-auto"
                >
                  {/* Pitch */}
                  <rect
                    x="20"
                    y="20"
                    width="360"
                    height="560"
                    rx="8"
                    fill="#0A0E17"
                    stroke="#1C2436"
                    strokeWidth="2"
                  />
                  <line
                    x1="20"
                    y1="300"
                    x2="380"
                    y2="300"
                    stroke="#1C2436"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="200"
                    cy="300"
                    r="70"
                    stroke="#1C2436"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <rect
                    x="130"
                    y="20"
                    width="140"
                    height="80"
                    stroke="#1C2436"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <rect
                    x="130"
                    y="500"
                    width="140"
                    height="80"
                    stroke="#1C2436"
                    strokeWidth="1.5"
                    fill="none"
                  />

                  {/* Player Nodes */}
                  {[
                    { x: 200, y: 540, r: 8 },
                    { x: 130, y: 440, r: 8 },
                    { x: 270, y: 440, r: 8 },
                    { x: 200, y: 340, r: 8 },
                    { x: 90, y: 260, r: 8 },
                    { x: 170, y: 300, r: 8 },
                    { x: 230, y: 300, r: 8 },
                    { x: 310, y: 260, r: 8 },
                    { x: 150, y: 160, r: 8 },
                    { x: 250, y: 160, r: 8 },
                    { x: 200, y: 80, r: 8, highlight: true },
                  ].map((dot, i) => (
                    <g key={i}>
                      <circle
                        cx={dot.x}
                        cy={dot.y}
                        r={dot.r}
                        fill={dot.highlight ? "#00E676" : "#1C2436"}
                        stroke={dot.highlight ? "#00E676" : "#7483A0"}
                        strokeWidth="2"
                      />
                      {dot.highlight && (
                        <circle
                          cx={dot.x}
                          cy={dot.y}
                          r={14}
                          fill="none"
                          stroke="#00E676"
                          strokeWidth="1"
                          opacity="0.3"
                        >
                          <animate
                            attributeName="r"
                            from="14"
                            to="18"
                            dur="1.5s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            from="0.3"
                            to="0"
                            dur="1.5s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </g>
                  ))}
                </svg>

                {/* Floating labels */}
                <div className="absolute top-4 -right-4 glass-card px-3 py-1.5 text-xs font-mono text-primary">
                  4-2-3-1
                </div>
                <div className="absolute bottom-20 -left-4 glass-card px-3 py-1.5 text-xs text-text-secondary">
                  Gegenpress
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
