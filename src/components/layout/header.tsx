"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchDialog } from "@/components/shared/search-dialog";

const navLinks = [
  { href: "/tactics", label: "Tactics" },
  { href: "/roles", label: "Player Roles" },
  { href: "/guides", label: "Guides" },
  { href: "/meta", label: "Meta" },
  { href: "/builder", label: "Tactic Builder", highlight: true },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const isBuilder = pathname === "/builder";

  if (isBuilder) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-panel border-b border-[#1C2436]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[#00C853] flex items-center justify-center">
              <span className="text-background-primary font-bold text-sm">F</span>
            </div>
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
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <div className="hidden md:flex items-center gap-1 ml-2 text-xs text-text-muted px-2 py-1 rounded-md bg-surface border border-surface-border">
              <kbd className="px-1 rounded bg-background-primary">⌘</kbd>
              <span>K</span>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary"
              aria-label="Toggle menu"
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
