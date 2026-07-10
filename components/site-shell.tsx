import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { navigationItems } from "@/data/navigation";
import { BrandMark, Emblem } from "@/components/ui";
import { MobileMenu } from "@/components/mobile-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(212,168,63,0.55)] bg-[rgba(7,7,7,0.96)] text-[var(--mf-ivory)] backdrop-blur">
      <div className="mf-container flex min-h-20 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Moneyfest trang chủ">
          <BrandMark priority className="hidden w-48 sm:block" />
          <Emblem className="sm:hidden" />
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href} className="relative py-7 transition hover:text-[var(--mf-gold)]">
              {item.label}
              <span className="absolute inset-x-0 bottom-5 h-px origin-left scale-x-0 bg-[var(--mf-gold)] transition group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/auth/login" className="mf-btn mf-btn-outline min-h-10 px-4">Đăng nhập</Link>
          <Link href="/contact" className="mf-btn mf-btn-gold min-h-10 px-4">Đặt lịch tư vấn 1:1</Link>
        </div>
        <MobileMenu items={navigationItems} />
      </div>
    </header>
  );
}

const footerGroups = [
  { title: "Về Moneyfest", links: ["Về chúng tôi", "Giá trị cốt lõi", "Hệ sinh thái", "Liên hệ"] },
  { title: "Khám phá", links: ["Blog", "Ebook", "Sản phẩm"] },
  { title: "Cộng đồng", links: ["Cộng đồng", "Sự kiện", "Chương trình"] },
  { title: "Công cụ", links: ["Money Map", "Tài nguyên", "Công cụ tính toán"] },
];

export function Footer() {
  return (
    <footer className="border-t border-[rgba(212,168,63,0.35)] bg-[var(--mf-obsidian)] text-[var(--mf-ivory)]">
      <div className="mf-container grid gap-10 py-12 lg:grid-cols-[1.4fr_2fr_1.2fr]">
        <div>
          <BrandMark className="w-52" />
          <p className="mt-5 text-sm leading-7 text-[rgba(244,240,232,0.7)]">
            Hệ sinh thái tri thức, tư vấn và kết nối giải pháp tài chính giúp bạn hiểu luật chơi và làm chủ tương lai dài hạn.
          </p>
          <div className="mt-5 flex gap-3 text-[var(--mf-gold)]">
            {["f", "▶", "in", "◎"].map((item) => (
              <span key={item} className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-gold)] text-xs font-bold">{item}</span>
            ))}
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-4">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="font-bold text-[var(--mf-champagne)]">{group.title}</p>
              <div className="mt-4 grid gap-2 text-sm text-[rgba(244,240,232,0.68)]">
                {group.links.map((link) => <span key={link}>{link}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div>
          <p className="font-bold text-[var(--mf-champagne)]">Kết nối với chúng tôi</p>
          <div className="mt-4 grid gap-3 text-sm text-[rgba(244,240,232,0.72)]">
            <span className="flex items-center gap-2"><Phone size={16} />1900 633 398</span>
            <span className="flex items-center gap-2"><Mail size={16} />hello@moneyfest.vn</span>
            <span>www.moneyfest.vn</span>
          </div>
        </div>
      </div>
      <div className="border-t border-[rgba(212,168,63,0.18)] py-5 text-xs text-[rgba(244,240,232,0.58)]">
        <div className="mf-container flex flex-col justify-between gap-3 md:flex-row">
          <span>© 2024 Moneyfest. All rights reserved.</span>
          <span>Chính sách bảo mật · Điều khoản sử dụng</span>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
