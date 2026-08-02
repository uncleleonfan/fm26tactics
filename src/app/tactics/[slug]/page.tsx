import { notFound } from "next/navigation";
import { allTactics } from "contentlayer/generated";
import { TacticDetailPage } from "@/components/tactics/tactic-detail-page";
import { generateSEO } from "@/lib/metadata";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return allTactics.map((tactic) => ({
    slug: tactic.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tactic = allTactics.find((t) => t.slug === params.slug);
  if (!tactic) return {};

  return generateSEO({
    title: tactic.title,
    description: tactic.description,
    path: `/tactics/${tactic.slug}`,
    type: "article",
    publishedTime: tactic.publishedAt,
    tags: tactic.tags,
  });
}

export default function TacticPage({ params }: Props) {
  const tactic = allTactics.find((t) => t.slug === params.slug);

  if (!tactic) {
    notFound();
  }

  return <TacticDetailPage tactic={tactic} />;
}
