import type { Metadata } from "next";
import { PageShell } from "@/components/site-shell";
import { CashflowTool, FinancialQuiz } from "@/components/tool-forms";
import { SectionHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Công cụ miễn phí",
  alternates: { canonical: "/tools" },
  description: "Tính dòng tiền cá nhân và làm quiz sức khỏe tài chính cùng MONEYFEST.",
};

export default function ToolsPage() {
  return (
    <PageShell>
      <section className="mf-container mf-section-compact">
        <SectionHeader
          as="h1"
          eyebrow="Công cụ"
          title="Công cụ tài chính miễn phí"
          description="Dùng ngay trên trình duyệt. Nếu để lại email, kết quả sẽ được lưu để MONEYFEST có thể gợi ý bước tiếp theo."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <CashflowTool />
          <FinancialQuiz />
        </div>
      </section>
    </PageShell>
  );
}
