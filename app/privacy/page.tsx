import type { Metadata } from "next";
import { PageShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  alternates: { canonical: "/privacy" },
  description: "Cách MONEYFEST thu thập, sử dụng và bảo vệ thông tin cá nhân trong Phase 1.",
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="mf-eyebrow">Legal</p>
        <h1 className="mf-display mt-3 text-[clamp(2.3rem,6vw,4rem)] font-bold leading-tight text-[var(--mf-midnight)]">
          Chính sách bảo mật
        </h1>
        <div className="prose-moneyfest mt-8">
          <p>MONEYFEST thu thập thông tin khi bạn gửi form tải ebook, làm công cụ có để lại email hoặc đăng ký tư vấn.</p>
          <h2>Thông tin có thể thu thập</h2>
          <p>Họ tên, email, số điện thoại, mục tiêu tài chính, nội dung bạn chủ động gửi và kết quả công cụ nếu bạn chọn lưu.</p>
          <h2>Mục đích sử dụng</h2>
          <p>Gửi tài nguyên, liên hệ tư vấn, phân loại nhu cầu và cải thiện nội dung MONEYFEST.</p>
          <h2>Cam kết dữ liệu</h2>
          <p>MONEYFEST không bán dữ liệu cá nhân của bạn. Dữ liệu chỉ được dùng cho mục đích vận hành và chăm sóc người dùng đã đồng ý.</p>
          <h2>Yêu cầu xóa dữ liệu</h2>
          <p>Bạn có thể yêu cầu cập nhật hoặc xóa dữ liệu cá nhân bằng cách liên hệ MONEYFEST qua form tư vấn trên website.</p>
        </div>
      </article>
    </PageShell>
  );
}
