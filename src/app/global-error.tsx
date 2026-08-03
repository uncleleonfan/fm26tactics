"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error — Vercel will capture this
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="bg-[#0A0E17] text-[#F1F5F9] font-sans antialiased">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-4xl mb-4">&#x26A0;</p>
            <h1 className="text-xl font-bold text-[#F1F5F9] mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-[#94A3B8] mb-6 max-w-sm">
              The application encountered an unexpected error. Please try
              reloading the page.
            </p>
            <button
              onClick={reset}
              className="px-6 py-2.5 rounded-lg bg-[#00E676] text-black font-semibold text-sm
                         hover:bg-[#00C853] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
