"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Download } from "lucide-react";
import Link from "next/link";
import { submitEbookDownload } from "@/lib/actions";
import { ebookDownloadSchema } from "@/lib/validation";
import { trackEvent } from "@/lib/analytics";
import type { z } from "zod";

type FormValues = z.infer<typeof ebookDownloadSchema>;

export function EbookDownloadForm({ ebookSlug }: { ebookSlug: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<FormValues>({
    resolver: zodResolver(ebookDownloadSchema),
    defaultValues: { ebookSlug, name: "", email: "", phone: "", consentGiven: false, company: "" },
  });

  function onSubmit(values: FormValues) {
    setMessage(null);
    setDownloadUrl(null);
    startTransition(async () => {
      const result = await submitEbookDownload(values);
      setMessage(result.message);
      if (result.downloadUrl) setDownloadUrl(result.downloadUrl);
      if (result.ok) {
        trackEvent("generate_lead", {
          form_name: "ebook_download",
          lead_source: "ebook_download",
          ebook_slug: ebookSlug,
        });
        form.reset({ ebookSlug, name: "", email: "", phone: "", consentGiven: false, company: "" });
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mf-card grid gap-4 p-5">
      <div>
        <label className="mf-label" htmlFor="ebook-name">Họ tên</label>
        <input id="ebook-name" className="mf-field mt-1" {...form.register("name")} />
        <p className="mf-error-text mt-1">{form.formState.errors.name?.message}</p>
      </div>
      <div>
        <label className="mf-label" htmlFor="ebook-email">Email</label>
        <input id="ebook-email" className="mf-field mt-1" type="email" {...form.register("email")} />
        <p className="mf-error-text mt-1">{form.formState.errors.email?.message}</p>
      </div>
      <div>
        <label className="mf-label" htmlFor="ebook-phone">Số điện thoại (không bắt buộc)</label>
        <input id="ebook-phone" className="mf-field mt-1" {...form.register("phone")} />
        <p className="mf-error-text mt-1">{form.formState.errors.phone?.message}</p>
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="ebook-company">Công ty</label>
        <input id="ebook-company" tabIndex={-1} autoComplete="off" {...form.register("company")} />
      </div>
      <label className="flex items-start gap-3 text-sm leading-6 text-[var(--mf-slate)]">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-[var(--mf-border)] accent-[var(--mf-gold)]"
          {...form.register("consentGiven")}
        />
        <span>
          Tôi đồng ý để MONEYFEST lưu thông tin và liên hệ với tôi theo{" "}
          <Link href="/privacy" className="font-bold text-[var(--mf-midnight)] underline">
            Chính sách bảo mật
          </Link>
          .
          {form.formState.errors.consentGiven?.message ? (
            <span className="mf-error-text mt-1 block">{form.formState.errors.consentGiven.message}</span>
          ) : null}
        </span>
      </label>
      <button disabled={isPending} className="mf-btn mf-btn-gold">
        <Download size={16} />
        {isPending ? "Đang gửi..." : "Tải ebook miễn phí"}
      </button>
      {message ? <p className="mf-success-alert text-sm">{message}</p> : null}
      {downloadUrl ? (
        <Link href={downloadUrl} className="mf-btn mf-btn-secondary" target="_blank" rel="noreferrer">
          Tải tài nguyên
        </Link>
      ) : null}
    </form>
  );
}
