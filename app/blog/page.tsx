import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/site-shell";
import { EmptyState, SectionHeader } from "@/components/ui";
import { getPosts } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  alternates: { canonical: "/blog" },
  description: "Bài viết MONEYFEST về dòng tiền, bảo vệ tài chính, đầu tư và tư duy ra quyết định.",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <PageShell>
      <section className="mf-container mf-section-compact">
        <SectionHeader as="h1" eyebrow="Blog" title="Tri thức tài chính cá nhân" description="Các bài viết ngắn, có framework và tập trung vào bước hành động tiếp theo." />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {posts.length ? posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="mf-card p-6 transition hover:-translate-y-1">
              <div className="mf-eyebrow flex flex-wrap items-center gap-2">
                <span>{post.category.name}</span>
                <span>/</span>
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <h2 className="mf-display mt-3 text-2xl font-bold text-[var(--mf-midnight)]">{post.title}</h2>
              <p className="mf-muted mt-3 text-sm leading-6">{post.excerpt}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag.id} className="mf-tag">{tag.name}</span>
                ))}
              </div>
            </Link>
          )) : <div className="md:col-span-2"><EmptyState title="Chưa có bài viết" description="Chạy npm run db:setup để nạp 8 bài blog mẫu." /></div>}
        </div>
      </section>
    </PageShell>
  );
}
