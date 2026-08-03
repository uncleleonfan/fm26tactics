"use client";

import { usePathname } from "next/navigation";

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBuilder = pathname === "/builder";

  return (
    <main className={isBuilder ? "" : "pt-16 min-h-screen"}>{children}</main>
  );
}
