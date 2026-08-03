import { notFound } from "next/navigation";
import { allGuides } from "contentlayer/generated";
import { GuideDetail } from "@/components/guides/guide-detail";
import { generateSEO } from "@/lib/metadata";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return allGuides.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = allGuides.find((g) => g.slug === params.slug);
  if (!guide) return {};

  return generateSEO({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    type: "article",
    publishedTime: guide.publishedAt,
    tags: guide.tags,
  });
}

export default function GuidePage({ params }: Props) {
  const guide = allGuides.find((g) => g.slug === params.slug);

  if (!guide) {
    notFound();
  }

  return <GuideDetail guide={guide} />;
}
