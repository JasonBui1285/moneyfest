import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Compass,
  Download,
  Globe2,
  Handshake,
  Landmark,
  Lightbulb,
  Lock,
  Mail,
  Map,
  MessageCircle,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const icons = {
  arrow: ArrowRight,
  book: BookOpen,
  briefcase: BriefcaseBusiness,
  calendar: CalendarDays,
  check: CheckCircle2,
  compass: Compass,
  dollar: CircleDollarSign,
  download: Download,
  globe: Globe2,
  handshake: Handshake,
  landmark: Landmark,
  lightbulb: Lightbulb,
  lock: Lock,
  mail: Mail,
  map: Map,
  message: MessageCircle,
  scale: Scale,
  shield: ShieldCheck,
  sparkles: Sparkles,
  target: Target,
  trend: TrendingUp,
  users: Users,
};

export function GoldButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="mf-btn mf-btn-gold">
      {children}
      <ArrowRight size={16} />
    </Link>
  );
}

export function OutlineButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="mf-btn mf-btn-outline">
      {children}
      <ArrowRight size={16} />
    </Link>
  );
}

export function SectionTitle({ eyebrow, title, light = false }: { eyebrow?: string; title: string; light?: boolean }) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      {eyebrow ? <p className="mf-eyebrow">{eyebrow}</p> : null}
      <h2 className={cn("mf-display mt-2 text-[clamp(2rem,4vw,3rem)] font-bold leading-tight", light ? "text-[var(--mf-ivory)]" : "text-[var(--mf-midnight)]")}>
        <span className="text-[var(--mf-gold)]">✦</span> {title} <span className="text-[var(--mf-gold)]">✦</span>
      </h2>
    </div>
  );
}

export function HeroSection({
  eyebrow,
  title,
  description,
  image,
  primary,
  secondary,
  badges = [],
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  image: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
  badges?: string[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-[rgba(212,168,63,0.45)] bg-[var(--mf-obsidian)] text-[var(--mf-ivory)]">
      <Image src={image} alt="" fill priority className="object-cover opacity-60" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(7,7,7,0.96)] via-[rgba(7,21,33,0.78)] to-[rgba(7,7,7,0.2)]" />
      <div className="mf-container relative grid min-h-[470px] items-center py-14 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="mf-eyebrow">{eyebrow}</p>
          <h1 className="mf-display mt-3 max-w-3xl text-[clamp(3rem,6.8vw,5.6rem)] font-bold leading-[0.98]">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[rgba(244,240,232,0.82)]">{description}</p>
          {(primary || secondary) ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {primary ? <GoldButton href={primary.href}>{primary.label}</GoldButton> : null}
              {secondary ? <OutlineButton href={secondary.href}>{secondary.label}</OutlineButton> : null}
            </div>
          ) : null}
          {badges.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {badges.map((badge) => (
                <span key={badge} className="mf-dark-chip"><CheckCircle2 size={16} />{badge}</span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function IconBox({ icon, title, children, dark = false }: { icon: ReactNode; title: string; children: ReactNode; dark?: boolean }) {
  return (
    <div className={cn("mf-card p-6 text-center", dark && "mf-card-dark text-[var(--mf-ivory)]")}>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[var(--border-gold)] text-[var(--mf-gold)]">{icon}</div>
      <h3 className={cn("mf-display mt-4 text-2xl font-bold", dark ? "text-[var(--mf-ivory)]" : "text-[var(--mf-midnight)]")}>{title}</h3>
      <p className={cn("mt-2 text-sm leading-6", dark ? "text-[rgba(244,240,232,0.72)]" : "mf-muted")}>{children}</p>
    </div>
  );
}

export function EditorialCard({ image, eyebrow, title, description, href = "#" }: { image?: string; eyebrow?: string; title: string; description: string; href?: string }) {
  return (
    <Link href={href} className="mf-editorial-card group block overflow-hidden">
      {image ? <div className="relative h-56"><Image src={image} alt="" fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" /></div> : null}
      <div className="p-5">
        {eyebrow ? <p className="mf-tag-dark">{eyebrow}</p> : null}
        <h3 className="mf-display mt-3 text-2xl font-bold leading-tight text-[var(--mf-ivory)]">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-[rgba(244,240,232,0.76)]">{description}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--mf-gold)]">Xem chi tiết <ArrowRight size={15} /></span>
      </div>
    </Link>
  );
}

export function ArticleCard({ article, image }: { article: { title: string; description: string; category: string; date: string; readTime: string }; image: string }) {
  return (
    <EditorialCard image={image} eyebrow={article.category} title={article.title} description={`${article.description} · ${article.readTime} · ${article.date}`} href="/blog" />
  );
}

export function EbookCard({ ebook, paid = false }: { ebook: { title: string; description: string; category: string; price: string }; paid?: boolean }) {
  return (
    <div className="mf-editorial-card overflow-hidden">
      <div className="relative h-52 bg-[var(--mf-obsidian)]">
        <Image src="/images/moneyfest/ebook/ebook-moneyfest.jpg" alt="" fill className="object-cover opacity-70" sizes="(max-width: 768px) 100vw, 25vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--mf-obsidian)] to-transparent" />
        <span className="absolute left-4 top-4 mf-tag-dark">{ebook.category}</span>
      </div>
      <div className="p-5">
        <h3 className="mf-display text-2xl font-bold leading-tight text-[var(--mf-ivory)]">{ebook.title}</h3>
        <p className="mt-3 text-sm leading-6 text-[rgba(244,240,232,0.74)]">{ebook.description}</p>
        <p className="mt-4 text-2xl font-bold text-[var(--mf-gold)]">{ebook.price}</p>
        <GoldButton href="/ebooks">{paid ? "Xem chi tiết" : "Tải miễn phí"}</GoldButton>
      </div>
    </div>
  );
}

export function CommunityCard({ title, description, cta }: { title: string; description: string; cta: string }) {
  return (
    <div className="mf-card-dark p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[var(--border-gold)] text-[var(--mf-gold)]">
          <Users size={30} />
        </div>
        <div>
          <h3 className="mf-display text-2xl font-bold text-[var(--mf-gold)]">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-[rgba(244,240,232,0.75)]">{description}</p>
        </div>
      </div>
      <div className="mt-5"><GoldButton href="/community">{cta}</GoldButton></div>
    </div>
  );
}

export function Timeline({ items }: { items: string[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {items.map((item, index) => (
        <div key={item} className="mf-card relative p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--mf-gold)] font-bold text-[var(--mf-obsidian)]">{index + 1}</span>
          <h3 className="mt-4 font-bold text-[var(--mf-midnight)]">{item}</h3>
          {index < items.length - 1 ? <ArrowRight className="absolute -right-5 top-1/2 hidden text-[var(--mf-gold)] md:block" /> : null}
        </div>
      ))}
    </div>
  );
}

export function CTASection({ title, description, primary = "Đặt lịch tư vấn 1:1", secondary = "Nhận ebook miễn phí" }: { title: string; description: string; primary?: string; secondary?: string }) {
  return (
    <section className="bg-[var(--mf-obsidian)] py-10 text-[var(--mf-ivory)]">
      <div className="mf-container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="mf-display text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight">{title}</h2>
          <p className="mt-3 max-w-2xl text-[rgba(244,240,232,0.72)]">{description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <GoldButton href="/contact">{primary}</GoldButton>
          <OutlineButton href="/ebooks">{secondary}</OutlineButton>
        </div>
      </div>
    </section>
  );
}
