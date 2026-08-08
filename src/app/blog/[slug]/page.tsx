import type { Metadata } from "next";
import { allBlogs } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { BlogDetail } from "@/components/blog/blog-detail";

export async function generateStaticParams() {
  return allBlogs.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = allBlogs.find((p) => p.slug === params.slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `https://fm26tactics.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://fm26tactics.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
    },
    keywords: post.tags?.join(", "),
  };
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = allBlogs.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-background-primary">
      <BlogDetail post={post} />
    </main>
  );
}
