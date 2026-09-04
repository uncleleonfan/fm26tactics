import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found — FM26 Tactics",
  description:
    "The page you're looking for doesn't exist. Browse our FM26 tactics library, guides, and blog.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background-primary pt-24 pb-20 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="mb-6">
          <span className="text-8xl font-black gradient-text opacity-20">404</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-text-secondary mb-8 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Try browsing our tactics library or returning home.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-primary text-background-primary font-medium text-sm hover:shadow-[0_0_20px_rgba(0,230,118,0.3)] transition-all"
          >
            Go Home
          </Link>
          <Link
            href="/tactics"
            className="px-5 py-2.5 rounded-xl border border-[#1C2436] text-text-secondary hover:text-text-primary font-medium text-sm transition-colors"
          >
            Browse Tactics
          </Link>
        </div>
      </div>
    </div>
  );
}
