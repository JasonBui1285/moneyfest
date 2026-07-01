import type { Metadata } from "next";
import { PageShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Disclaimer",
  alternates: { canonical: "/disclaimer" },
  description: "Tuyên bố miễn trừ trách nhiệm cho nội dung tài chính trên MONEYFEST.",
};

export default function DisclaimerPage() {
  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="mf-eyebrow">Legal</p>
        <h1 className="mf-display mt-3 text-[clamp(2.3rem,6vw,4rem)] font-bold leading-tight text-[var(--mf-midnight)]">
          Tuyên bố miễn trừ trách nhiệm
        </h1>
        <div className="prose-moneyfest mt-8">
          <p>Nội dung trên MONEYFEST chỉ nhằm mục đích giáo dục và tham khảo, không phải lời khuyên tài chính, đầu tư hoặc pháp lý cá nhân.</p>
          <p>Mỗi quyết định tài chính phụ thuộc vào thu nhập, tài sản, nợ, mục tiêu, thời gian, khẩu vị rủi ro và hoàn cảnh riêng của từng người.</p>
          <p>Trước khi ra quyết định quan trọng, bạn nên tham khảo chuyên gia phù hợp và tự đánh giá rủi ro của mình.</p>
        </div>
      </article>
    </PageShell>
  );
}
