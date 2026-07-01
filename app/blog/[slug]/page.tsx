import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SafeBlogContent } from "@/components/safe-blog-content";
import { PageShell } from "@/components/site-shell";
import { getPostBySlug } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { absoluteUrl } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Blog" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    author: { "@type": "Organization", name: "MONEYFEST" },
    publisher: {
      "@type": "Organization",
      name: "MONEYFEST",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/brand/logo/moneyfest-logo-horizontal.png"),
      },
    },
  };

  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <p className="mf-eyebrow">
          {post.category.name} / {formatDate(post.publishedAt)} / {post.readTime} phút đọc
        </p>
        <h1 className="mf-display mt-3 text-[clamp(2.3rem,6vw,4rem)] font-bold leading-tight text-[var(--mf-midnight)]">{post.title}</h1>
        <p className="mf-muted mt-4 text-lg leading-8">{post.excerpt}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag.id} className="mf-tag">{tag.name}</span>
          ))}
        </div>
        <SafeBlogContent content={post.content} />
      </article>
    </PageShell>
  );
}
