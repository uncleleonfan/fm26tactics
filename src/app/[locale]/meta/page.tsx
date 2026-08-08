import type { Metadata } from "next";
import { generateSEO } from "@/lib/metadata";
import { MetaPage } from "@/components/home/meta-page";

export const metadata: Metadata = generateSEO({
  title: "FM26 Meta Tactics — What's Actually Good in FM26",
  description: "Analysis of the current FM26 tactical meta. Which formations and play styles dominate, what the match engine rewards, and how to adapt your tactics for success.",
  path: "/meta",
});

export default function MetaPageRoute() {
  return <MetaPage />;
}
