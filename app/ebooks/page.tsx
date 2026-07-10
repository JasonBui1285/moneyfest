import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "@/components/site-shell";
import { CTASection, EbookCard, GoldButton, HeroSection, SectionTitle, icons } from "@/components/marketing";
import { freeEbooks, paidEbooks } from "@/data/ebooks";

export const metadata: Metadata = {
  title: "Ebook",
  alternates: { canonical: "/ebooks" },
  description: "Thư viện ebook Moneyfest giúp bạn hiểu luật chơi trước khi ra quyết định.",
};

export default function EbooksPage() {
  return (
    <PageShell>
      <HeroSection
        eyebrow="Thư viện ebook"
        title={<>Thư viện ebook giúp bạn hiểu luật chơi <span className="text-[var(--mf-gold)]">trước khi ra quyết định.</span></>}
        description="Kho ebook được biên soạn bởi đội ngũ Moneyfest, giúp bạn xây nền tảng tài chính vững chắc: tư duy, quản lý tiền, phân bổ tài sản và lựa chọn sản phẩm phù hợp."
        image="/images/moneyfest/ebook/ebook-moneyfest.jpg"
        badges={["Thực tế & dễ hiểu", "Dựa trên nguyên tắc", "Cập nhật liên tục"]}
      />

      <section className="mf-cream-section py-0">
        <div className="mf-container -mt-8 relative z-10 grid overflow-hidden rounded-[var(--mf-radius-lg)] border border-[var(--border-gold)] md:grid-cols-2">
          <div className="bg-[var(--mf-midnight)] p-8 text-[var(--mf-ivory)]"><icons.book /><h2 className="mf-display mt-3 text-3xl font-bold">Ebook miễn phí</h2><p>Bắt đầu hành trình tài chính thông minh</p></div>
          <div className="bg-white p-8"><icons.lock /><h2 className="mf-display mt-3 text-3xl font-bold">Ebook trả phí</h2><p className="mf-muted">Đi sâu hơn với framework & công cụ</p></div>
        </div>
      </section>

      <section className="mf-dark-section py-14">
        <div className="mf-container grid items-center gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="relative min-h-[430px] overflow-hidden rounded-[var(--mf-radius-lg)] border border-[var(--border-gold)]">
            <Image src="/images/moneyfest/ebook/ebook-moneyfest.jpg" alt="" fill className="object-cover" />
          </div>
          <div>
            <p className="mf-eyebrow">Ebook nổi bật</p>
            <h2 className="mf-display mt-3 text-[clamp(2.3rem,4vw,4rem)] font-bold leading-tight">Bản đồ phân bổ tiền nhàn rỗi – 7 bước trước khi đầu tư</h2>
            <p className="mt-4 text-[rgba(244,240,232,0.76)]">Ebook miễn phí giúp bạn nhìn rõ toàn cảnh tài chính cá nhân và biết nên bắt đầu từ đâu trước khi đưa tiền vào bất kỳ kênh đầu tư nào.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Hiểu rõ bức tranh tài chính hiện tại", "7 bước phân bổ tiền nhàn rỗi hiệu quả", "Xác định mục tiêu và mức độ ưu tiên", "Tránh 5 sai lầm phổ biến của nhà đầu tư mới"].map((item) => (
                <span key={item} className="flex gap-2 text-sm"><icons.check className="text-[var(--mf-gold)]" size={16} />{item}</span>
              ))}
            </div>
            <div className="mt-8"><GoldButton href="/ebooks">Nhận ebook miễn phí</GoldButton></div>
          </div>
        </div>
      </section>

      <section className="mf-cream-section py-14">
        <div className="mf-container">
          <SectionTitle title="Ebook miễn phí nổi bật" />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {freeEbooks.map((ebook) => <EbookCard key={ebook.title} ebook={ebook} />)}
          </div>
        </div>
      </section>

      <section className="mf-cream-section py-14">
        <div className="mf-container">
          <SectionTitle title="Ebook trả phí nổi bật" />
          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {paidEbooks.map((ebook) => <EbookCard key={ebook.title} ebook={ebook} paid />)}
          </div>
        </div>
      </section>

      <section className="mf-cream-section py-10">
        <div className="mf-container grid overflow-hidden rounded-[var(--mf-radius-lg)] border border-[var(--mf-border)] bg-white md:grid-cols-[1fr_auto_1fr]">
          <div className="p-8"><h3 className="mf-display text-3xl font-bold">Ebook miễn phí</h3><p className="mf-muted mt-3">Kiến thức nền tảng, dễ hiểu và thực tế. Giúp bạn bắt đầu đúng.</p></div>
          <div className="flex items-center justify-center border-y border-[var(--mf-border)] p-6 text-2xl font-bold text-[var(--mf-gold)] md:border-x md:border-y-0">VS</div>
          <div className="p-8"><h3 className="mf-display text-3xl font-bold">Ebook trả phí</h3><p className="mf-muted mt-3">Nội dung chuyên sâu, có framework, công cụ và workbook ứng dụng.</p></div>
        </div>
      </section>

      <CTASection title="Bắt đầu hành trình hiểu – làm chủ – tự do tài chính của bạn." description="Tải ebook miễn phí để bắt đầu hoặc đặt lịch tư vấn 1:1 với chuyên gia Moneyfest." />
    </PageShell>
  );
}

