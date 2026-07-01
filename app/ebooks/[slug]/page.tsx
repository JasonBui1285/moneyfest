import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EbookDownloadForm } from "@/components/ebook-download-form";
import { PageShell } from "@/components/site-shell";
import { EbookCover } from "@/components/ui";
import { getEbookBySlug } from "@/lib/data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ebook = await getEbookBySlug(slug);
  if (!ebook) return { title: "Ebook" };
  return {
    title: ebook.title,
    description: ebook.subtitle,
    alternates: { canonical: `/ebooks/${ebook.slug}` },
    openGraph: {
      type: "website",
      url: `/ebooks/${ebook.slug}`,
      title: ebook.title,
      description: ebook.subtitle,
    },
  };
}

export default async function EbookDetailPage({ params }: Props) {
  const { slug } = await params;
  const ebook = await getEbookBySlug(slug);
  if (!ebook) notFound();

  return (
    <PageShell>
      <section className="mf-container grid gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <EbookCover title={ebook.title} subtitle={ebook.subtitle} />
        </div>
        <div>
          <p className="mf-eyebrow">Ebook miễn phí</p>
          <h1 className="mf-display mt-3 text-[clamp(2.4rem,6vw,4.5rem)] font-bold leading-tight text-[var(--mf-midnight)]">{ebook.title}</h1>
          <p className="mf-muted mt-4 text-lg leading-8">{ebook.description}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="mf-card p-4">
              <p className="mf-eyebrow">Cấp độ</p>
              <p className="mt-2 font-bold">{ebook.level}</p>
            </div>
            <div className="mf-card p-4">
              <p className="mf-eyebrow">Số trang</p>
              <p className="mt-2 font-bold">{ebook.pages}</p>
            </div>
            <div className="mf-card p-4">
              <p className="mf-eyebrow">Lượt tải</p>
              <p className="mt-2 font-bold">{ebook._count.downloads}</p>
            </div>
          </div>
          <div className="mt-8">
            <EbookDownloadForm ebookSlug={ebook.slug} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
