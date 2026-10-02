"use client";

import { useEffect, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { AdsterraNativeBanner } from "./adsterra-native-banner";

/**
 * Inserts the native ad into the MIDDLE of an MDX article — before the Nth
 * `<h2>` of the article body — via post-mount DOM insertion.
 *
 * Why not an mdx `components.h2` override: a render-time counter double-counts
 * under React StrictMode (dev double render) and yields a hydration mismatch
 * against the server HTML. Inserting a host div after mount is invisible to
 * hydration and cleans up after itself on unmount.
 *
 * Fallback: articles with fewer than `insertBefore` h2 sections get the old
 * end-of-article slot instead, so every article keeps exactly one native unit.
 *
 * IMPORTANT: give this component a `key` that changes between articles
 * (e.g. the post id) — the insertion effect only re-runs on remount, and on
 * client-side navigation the new article's DOM replaces the old one.
 */
export function ArticleMidAd({
  selector = "article.prose-custom",
  insertBefore = 2,
  className = "my-8",
}: {
  /** Selector for the article container whose h2 children mark sections. */
  selector?: string;
  /** Insert before the Nth h2 (1-based). Default: before the 2nd. */
  insertBefore?: number;
  /** Classes for the inserted host div. */
  className?: string;
}) {
  // Starts false: after mount we either insert mid-article (stays false) or
  // discover there is no insertion point and flip to the fallback slot.
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    let host: HTMLDivElement | null = null;
    let root: Root | null = null;

    const container = document.querySelector(selector);
    const headings = container
      ? Array.from(container.querySelectorAll(":scope > h2"))
      : [];
    const anchor = headings[insertBefore - 1] ?? null;

    if (anchor && anchor.parentNode) {
      host = document.createElement("div");
      host.className = className;
      anchor.parentNode.insertBefore(host, anchor);
      root = createRoot(host);
      root.render(<AdsterraNativeBanner placement="article-mid" className="" />);
    } else {
      setShowFallback(true);
    }

    return () => {
      if (root) root.unmount();
      host?.remove();
    };
  }, [selector, insertBefore, className]);

  if (!showFallback) return null;
  return <AdsterraNativeBanner placement="article-end" />;
}
