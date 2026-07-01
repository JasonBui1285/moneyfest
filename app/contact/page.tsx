import type { Metadata } from "next";
import { ConsultationForm } from "@/components/consultation-form";
import { PageShell } from "@/components/site-shell";
import { SectionHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Đăng ký tư vấn",
  alternates: { canonical: "/contact" },
  description: "Đăng ký tư vấn 1:1 với MONEYFEST về dòng tiền, bảo vệ tài chính và mục tiêu dài hạn.",
};

export default function ContactPage() {
  return (
    <PageShell>
      <section className="mf-container grid gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeader
            as="h1"
            eyebrow="Tư vấn"
            title="Đăng ký tư vấn 1:1"
            description="Hãy cho MONEYFEST biết bạn đang muốn làm rõ điều gì. Phase 1 chỉ thu lead và request, chưa thanh toán online."
          />
          <div className="mt-8 grid gap-3 text-sm">
            <p className="mf-info-alert">Phù hợp nếu bạn muốn soi dòng tiền, xử lý nợ, tạo quỹ dự phòng hoặc lập kế hoạch 90 ngày.</p>
            <p className="mf-info-alert">Sau khi gửi form, đội ngũ MONEYFEST sẽ ghi nhận và follow-up thủ công.</p>
          </div>
        </div>
        <ConsultationForm />
      </section>
    </PageShell>
  );
}
