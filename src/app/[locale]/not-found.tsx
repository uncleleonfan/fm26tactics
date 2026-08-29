"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function NotFound() {
  const t = useTranslations("error");

  return (
    <main className="min-h-screen bg-background-primary flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-accent mb-4">404</h1>
        <h2 className="text-xl text-text-secondary mb-6">
          {t("notFound")}
        </h2>
        <p className="text-text-muted text-sm mb-8 max-w-md mx-auto">
          {t("notFoundDesc")}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            {t("goHome")}
          </Link>
          <Link
            href="/tactics"
            className="inline-flex items-center px-6 py-3 border border-[#1C2436] text-text-secondary hover:text-text-primary rounded-lg transition-colors"
          >
            {t("browseTactics")}
          </Link>
        </div>
      </div>
    </main>
  );
}
