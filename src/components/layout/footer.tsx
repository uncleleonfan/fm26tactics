"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const footerLinks = {
  Tactics: [
    { label: "All Tactics", href: "/tactics" },
    { label: "4-2-3-1", href: "/tactics?formation=4-2-3-1" },
    { label: "4-3-3", href: "/tactics?formation=4-3-3" },
    { label: "3-5-2", href: "/tactics?formation=3-5-2" },
  ],
  Resources: [
    { label: "Player Roles", href: "/roles" },
    { label: "Training Guides", href: "/guides?category=training" },
    { label: "Set Pieces", href: "/guides?category=set-pieces" },
    { label: "Tactic Builder", href: "/builder" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
} as const;

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/builder") return null;

  return (
    <footer className="glass-panel border-t border-[#1C2436]/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-[#00C853] flex items-center justify-center">
                <span className="text-background-primary font-bold text-xs">F</span>
              </div>
              <span className="text-base font-bold">
                <span className="text-text-primary">FM26</span>
                <span className="gradient-text">Tactics</span>
              </span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed">
              Your ultimate resource for mastering Football Manager 2026 tactics.
              Explore formations, player roles, and build winning strategies.
            </p>
          </div>

          {/* Link Groups */}
          {(Object.keys(footerLinks) as Array<keyof typeof footerLinks>).map((group) => (
            <div key={group}>
              <h4 className="text-sm font-semibold text-text-primary mb-3">{group}</h4>
              <ul className="space-y-2">
                {footerLinks[group].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#1C2436]/50 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} FM26 Tactics. All rights reserved.
            Football Manager is a trademark of Sports Interactive.
          </p>
          <p className="text-xs text-text-muted">
            fm26tactics.com
          </p>
        </div>
      </div>
    </footer>
  );
}
