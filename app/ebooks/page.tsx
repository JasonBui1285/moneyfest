import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/site-shell";
import { EbookCover, EmptyState, SectionHeader } from "@/components/ui";
import { getEbooks } from "@/lib/data";

export const metadata: Metadata = {
  title: "Ebook miễn phí",
  alternates: { canonical: "/ebooks" },
  description: "Thư viện ebook miễn phí của MONEYFEST về dòng tiền, bảo vệ tài chính và quyết định đầu tư.",
};

export default async function EbooksPage() {
  const ebooks = await getEbooks();

  return (
    <PageShell>
      <section className="mf-container mf-section-compact">
        <SectionHeader
          as="h1"
          eyebrow="Thư viện"
          title="Ebook MONEYFEST"
          description="Tải workbook ngắn gọn, dễ làm theo và phù hợp cho người muốn hiểu rõ hơn trước khi ra quyết định tài chính."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ebooks.length ? ebooks.map((ebook) => (
            <Link key={ebook.id} href={`/ebooks/${ebook.slug}`} className="mf-card p-4 transition hover:-translate-y-1">
              <EbookCover title={ebook.title} subtitle={ebook.subtitle} />
              <div className="mt-4 flex items-center justify-between gap-3">
                <h2 className="font-bold text-[var(--mf-midnight)]">{ebook.title}</h2>
                <span className="mf-badge">
                  {ebook.isFree ? "Miễn phí" : "Trả phí"}
                </span>
              </div>
              <p className="mf-muted mt-2 text-sm leading-6">{ebook.subtitle}</p>
              <p className="mf-muted mt-4 text-xs">{ebook.pages} trang - {ebook.level}</p>
            </Link>
          )) : <div className="sm:col-span-2 lg:col-span-3"><EmptyState title="Chưa có ebook" description="Chạy npm run db:setup để nạp 5 ebook mẫu." /></div>}
        </div>
      </section>
    </PageShell>
  );
}
