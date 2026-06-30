import Link from "next/link";
import { Emblem } from "@/components/ui";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[var(--mf-surface)]">
      <div className="border-b border-[var(--mf-border)] bg-[var(--mf-obsidian)] text-[var(--mf-ivory)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <Emblem className="h-10 w-10" />
            <div>
              <p className="mf-eyebrow">MONEYFEST nội bộ</p>
              <p className="text-sm text-[rgba(244,240,232,0.72)]">Khu vực vận hành nội bộ</p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-3 text-sm font-bold" aria-label="Điều hướng quản trị">
            <Link href="/admin" className="text-[var(--mf-champagne)] hover:text-[var(--mf-gold)]">Dashboard</Link>
            <Link href="/" className="text-[rgba(244,240,232,0.72)] hover:text-[var(--mf-champagne)]">Xem website</Link>
          </nav>
        </div>
      </div>
      {children}
    </main>
  );
}
