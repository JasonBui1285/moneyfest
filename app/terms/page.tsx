import type { Metadata } from "next";
import { PageShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng",
  alternates: { canonical: "/terms" },
  description: "Điều khoản sử dụng website và nội dung MONEYFEST.",
};

export default function TermsPage() {
  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="mf-eyebrow">Legal</p>
        <h1 className="mf-display mt-3 text-[clamp(2.3rem,6vw,4rem)] font-bold leading-tight text-[var(--mf-midnight)]">
          Điều khoản sử dụng
        </h1>
        <div className="prose-moneyfest mt-8">
          <p>Khi sử dụng website MONEYFEST, bạn đồng ý rằng nội dung trên website chỉ nhằm mục đích giáo dục và tham khảo.</p>
          <h2>Trách nhiệm người dùng</h2>
          <p>Bạn tự chịu trách nhiệm khi áp dụng bất kỳ nội dung, công cụ hoặc gợi ý nào vào hoàn cảnh tài chính cá nhân.</p>
          <h2>Không đảm bảo lợi nhuận</h2>
          <p>MONEYFEST không cam kết lợi nhuận đầu tư, không đảm bảo kết quả tài chính và không khuyến nghị mua bán sản phẩm cụ thể trong nội dung công khai.</p>
          <h2>Thay đổi nội dung</h2>
          <p>MONEYFEST có thể cập nhật nội dung, công cụ và điều khoản để phù hợp với giai đoạn phát triển sản phẩm.</p>
        </div>
      </article>
    </PageShell>
  );
}
