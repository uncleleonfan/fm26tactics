import type { Metadata } from "next";
import { allBlogs } from "contentlayer/generated";
import { notFound } from "next/navigation";
import Script from "next/script";
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

  const url = `https://www.fm26tactics.com/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      siteName: "FM26 Tactics",
      locale: "en_US",
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      images: [
        {
          url: "/images/og/default.jpg",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`https://www.fm26tactics.com/images/og/default.jpg`],
    },
    keywords: post.tags?.join(", "),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = allBlogs.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: post.author
      ? { "@type": "Person", name: post.author }
      : undefined,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.fm26tactics.com/blog/${post.slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: "FM26 Tactics",
      url: "https://www.fm26tactics.com",
    },
    image: "https://www.fm26tactics.com/images/og/default.jpg",
    articleSection: post.category,
    keywords: post.tags?.join(", "),
  };

  const faqItems = (post.faq ?? []) as Array<{
    question: string;
    answer: string;
  }>;

  const faqJsonLd = faqItems.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  return (
    <main className="min-h-screen bg-background-primary">
      <Script
        id="blog-article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <Script
          id="blog-faq-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <BlogDetail post={post} />
    </main>
  );
}
