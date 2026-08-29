"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { usePathname } from "@/i18n/routing";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

const SearchDialog = dynamic(
  () => import("@/components/shared/search-dialog").then((m) => ({ default: m.SearchDialog })),
  { ssr: false }
);

export function Header() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/tactics", label: t("tactics") },
    { href: "/best", label: t("bestTactics") },
    { href: "/blog", label: t("blog") },
    { href: "/roles", label: t("playerRoles") },
    { href: "/guides", label: t("guides") },
    { href: "/meta", label: t("meta") },
    { href: "/builder", label: t("tacticBuilder"), highlight: true },
  ];

  const isBuilder = pathname.endsWith("/builder");

  if (isBuilder) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-panel border-b border-[#1C2436]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            data-track="nav_logo"
            className="flex items-center gap-2 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              fill="none"
              className="w-8 h-8"
            >
              <rect width="32" height="32" rx="6" className="fill-background-primary" />
              <circle cx="16" cy="16" r="12" className="stroke-primary" strokeWidth="2" fill="none" />
              <path
                d="M11 10L7.5 14L11 21M21 10L24.5 14L21 21M16 7V15M11 16H21M16 19V25"
                className="stroke-primary"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-text-primary">FM26</span>
              <span className="gradient-text">Tactics</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-track="nav_link"
                data-track-label={link.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  link.highlight
                    ? "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(0,230,118,0.15)]"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => {
                setSearchOpen(true);
                trackEvent("nav_search_open");
              }}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all"
              aria-label={t("search")}
            >
              <Search className="w-4 h-4" />
            </button>

            <div className="hidden md:flex items-center gap-1 ml-2 text-xs text-text-muted px-2 py-1 rounded-md bg-surface border border-surface-border">
              <kbd className="px-1 rounded bg-background-primary">⌘</kbd>
              <span>K</span>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => {
                setMobileOpen(!mobileOpen);
                trackEvent("nav_mobile_menu");
              }}
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary"
              aria-label={t("toggleMenu")}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden glass-panel border-t border-[#1C2436]/50 animate-fade-in">
            <nav className="p-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  data-track="nav_link_mobile"
                  data-track-label={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    link.highlight
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
