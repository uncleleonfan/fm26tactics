"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";


// ── Footer link groups type ──────────────────────────────────────────────
interface FooterLinkGroup {
  key: string;
  links: { label: string; href: string }[];
}

export function Footer() {
  const t = useTranslations("common");
  const ft = useTranslations("footer");

  const footerGroups: FooterLinkGroup[] = [
    {
      key: ft("tactics"),
      links: [
        { label: ft("allTactics"), href: "/tactics" },
        { label: "4-2-3-1", href: "/tactics?formation=4-2-3-1" },
        { label: "4-3-3", href: "/tactics?formation=4-3-3" },
        { label: "3-5-2", href: "/tactics?formation=3-5-2" },
      ],
    },
    {
      key: ft("resources"),
      links: [
        { label: ft("playerRoles"), href: "/roles" },
        { label: ft("trainingGuides"), href: "/guides?category=training" },
        { label: ft("setPieces"), href: "/guides?category=set-pieces" },
        { label: ft("tacticBuilder"), href: "/builder" },
      ],
    },
    {
      key: ft("company"),
      links: [
        { label: ft("aboutUs"), href: "/about" },
        { label: ft("contact"), href: "/contact" },
        { label: ft("privacyPolicy"), href: "/privacy" },
        { label: ft("termsOfService"), href: "/terms" },
      ],
    },
  ];

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
              {ft("brandDescription")}
            </p>
          </div>

          {/* Link Groups */}
          {footerGroups.map((group) => (
            <div key={group.key}>
              <h4 className="text-sm font-semibold text-text-primary mb-3">{group.key}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
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
            &copy; {new Date().getFullYear()} FM26 Tactics. {t("allRightsReserved")}
          </p>
          <p className="text-xs text-text-muted">fm26tactics.com</p>
        </div>
      </div>
    </footer>
  );
}
