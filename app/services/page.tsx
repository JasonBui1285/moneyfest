import type { Metadata } from "next";
import { CheckCircle2, Clock } from "lucide-react";
import { PageShell } from "@/components/site-shell";
import { CTAButton, SectionHeader } from "@/components/ui";
import { services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Dịch vụ",
  alternates: { canonical: "/services" },
  description: "Ebook trả phí, tư vấn 1:1, membership sắp ra mắt và dashboard tài chính sắp ra mắt của MONEYFEST.",
};

export default function ServicesPage() {
  return (
    <PageShell>
      <section className="mf-container mf-section-compact">
        <SectionHeader
          as="h1"
          eyebrow="Dịch vụ"
          title="Sản phẩm và dịch vụ MONEYFEST"
          description="Phase 1 tập trung xác thực nhu cầu: ebook, tư vấn 1:1 và các gói sắp ra mắt. Chưa tích hợp thanh toán thật."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {services.map((service) => (
            <div key={service.title} className="mf-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mf-badge">{service.status}</p>
                  <h2 className="mf-display mt-4 text-2xl font-bold text-[var(--mf-midnight)]">{service.title}</h2>
                </div>
                {service.status.includes("Sắp") ? <Clock className="text-[var(--mf-slate)]" /> : <CheckCircle2 className="text-[var(--mf-gold)]" />}
              </div>
              <p className="mf-muted mt-4 leading-7">{service.description}</p>
              <p className="mt-5 text-lg font-bold text-[var(--mf-obsidian)]">{service.price}</p>
            </div>
          ))}
        </div>
        <div className="mf-card-dark mt-10 p-8">
          <h2 className="mf-display text-3xl font-bold">Muốn biết gói nào phù hợp?</h2>
          <p className="mt-3 max-w-2xl text-[rgba(244,240,232,0.76)]">Gửi mục tiêu tài chính của bạn, MONEYFEST sẽ phân loại nhu cầu và gợi ý bước tiếp theo.</p>
          <div className="mt-6"><CTAButton href="/contact" variant="gold">Đăng ký tư vấn 1:1</CTAButton></div>
        </div>
      </section>
    </PageShell>
  );
}
