"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "@/i18n/routing";
import { Search, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

interface SearchResult {
  title: string;
  url: string;
  category: string;
  excerpt: string;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const handleSearch = useCallback((q: string) => {
    // Simulated search results - will be replaced with real FlexSearch
    if (!q.trim()) {
      setResults([]);
      return;
    }

    const dummyResults: SearchResult[] = [
      {
        title: "4-2-3-1 Gegenpress Masterclass",
        url: "/tactics/4-2-3-1-gegenpress",
        category: "Tactics",
        excerpt: "Master the high-intensity pressing system that dominates modern FM26...",
      },
      {
        title: "The Complete Tiki-Taka Guide",
        url: "/tactics/tiki-taka-complete-guide",
        category: "Tactics",
        excerpt: "Control possession and dictate tempo with the classic Spanish philosophy...",
      },
      {
        title: "Deep-Lying Playmaker Role Analysis",
        url: "/roles/deep-lying-playmaker",
        category: "Player Roles",
        excerpt: "Everything about the midfield orchestrator who pulls the strings from deep...",
      },
      {
        title: "Counter-Attack 3-5-2 Setup",
        url: "/tactics/3-5-2-counter-attack",
        category: "Tactics",
        excerpt: "A devastating counter-attacking system using the 3-5-2 formation...",
      },
      {
        title: "Training Schedules for Youth Development",
        url: "/guides/youth-training-schedules",
        category: "Guides",
        excerpt: "Optimize your young talents' growth with these proven training schedules...",
      },
    ];

    const filtered = dummyResults.filter(
      (r) =>
        r.title.toLowerCase().includes(q.toLowerCase()) ||
        r.excerpt.toLowerCase().includes(q.toLowerCase())
    );
    setResults(filtered);
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    handleSearch(query);
  }, [query, handleSearch]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (!open) return;

      if (e.key === "Escape") onOpenChange(false);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        router.push(results[selectedIndex].url);
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, results, selectedIndex, router, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg px-4">
        <div className="glass-panel border border-[#1C2436] animate-fade-in overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-[#1C2436]/50">
            <Search className="w-4 h-4 text-text-muted shrink-0" />
            <input
              type="text"
              placeholder="Search tactics, roles, guides..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-text-primary text-sm placeholder:text-text-muted outline-none"
              autoFocus
            />
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 rounded hover:bg-surface-hover transition-colors"
            >
              <X className="w-4 h-4 text-text-muted" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {results.length === 0 && query ? (
              <div className="p-8 text-center">
                <p className="text-text-secondary text-sm">No results found for &ldquo;{query}&rdquo;</p>
              </div>
            ) : (
              results.map((result, i) => (
                <button
                  key={result.url}
                  onClick={() => {
                    trackEvent("search_result_click", { label: result.url });
                    router.push(result.url);
                    onOpenChange(false);
                  }}
                  className={cn(
                    "w-full text-left p-4 hover:bg-surface-hover transition-colors border-b border-[#1C2436]/30 last:border-0 flex items-start gap-3",
                    i === selectedIndex && "bg-surface-hover"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-text-muted bg-surface border border-surface-border px-1.5 py-0.5 rounded">
                        {result.category}
                      </span>
                      <span className="text-sm font-medium text-text-primary truncate">
                        {result.title}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary line-clamp-2">{result.excerpt}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-[#1C2436]/50 flex items-center gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <kbd className="px-1 rounded bg-surface border border-surface-border">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 rounded bg-surface border border-surface-border">↵</kbd> Open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 rounded bg-surface border border-surface-border">esc</kbd> Close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
