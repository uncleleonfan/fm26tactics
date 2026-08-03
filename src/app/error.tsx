"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-4xl mb-4">&#x26A0;</p>
        <h1 className="text-xl font-bold text-[#F1F5F9] mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-[#94A3B8] mb-6 max-w-sm">
          The page encountered an error while loading. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2.5 rounded-lg bg-[#00E676] text-black font-semibold text-sm
                       hover:bg-[#00C853] transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-lg bg-[#1C2436] text-[#F1F5F9] font-semibold text-sm
                       hover:bg-[#2a3348] transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
