"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";
import Link from "next/link";
import { submitConsultation } from "@/lib/actions";
import { consultationSchema } from "@/lib/validation";
import { trackEvent } from "@/lib/analytics";
import type { z } from "zod";

type FormValues = z.infer<typeof consultationSchema>;

export function ConsultationForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<FormValues>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      financialGoal: "",
      message: "",
      consentGiven: false,
      company: "",
    },
  });

  function onSubmit(values: FormValues) {
    setMessage(null);
    startTransition(async () => {
      const result = await submitConsultation(values);
      setMessage(result.message);
      if (result.ok) {
        trackEvent("generate_lead", {
          form_name: "consultation",
          lead_source: "consultation",
        });
        form.reset();
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mf-card grid gap-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Họ tên" error={form.formState.errors.name?.message}>
          <input className="mf-field" {...form.register("name")} />
        </Field>
        <Field label="Email" error={form.formState.errors.email?.message}>
          <input className="mf-field" type="email" {...form.register("email")} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Số điện thoại" error={form.formState.errors.phone?.message}>
          <input className="mf-field" {...form.register("phone")} />
        </Field>
        <Field label="Mục tiêu tài chính" error={form.formState.errors.financialGoal?.message}>
          <select className="mf-field" {...form.register("financialGoal")}>
            <option value="">Chọn mục tiêu</option>
            <option value="Kiểm soát chi tiêu">Kiểm soát chi tiêu</option>
            <option value="Trả nợ">Trả nợ</option>
            <option value="Tiết kiệm mua nhà">Tiết kiệm mua nhà</option>
            <option value="Đầu tư dài hạn">Đầu tư dài hạn</option>
          </select>
        </Field>
      </div>
      <Field label="Bạn muốn MONEYFEST hỗ trợ điều gì?" error={form.formState.errors.message?.message}>
        <textarea className="mf-field min-h-32" {...form.register("message")} />
      </Field>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="consultation-company">Công ty</label>
        <input id="consultation-company" tabIndex={-1} autoComplete="off" {...form.register("company")} />
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
      <button disabled={isPending} className="mf-btn mf-btn-primary">
        <Send size={16} />
        {isPending ? "Đang gửi..." : "Đăng ký tư vấn 1:1"}
      </button>
      {message ? <p className="mf-success-alert text-sm">{message}</p> : null}
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="mf-label">
      {label}
      <span className="mt-1 block">{children}</span>
      {error ? <span className="mf-error-text mt-1 block">{error}</span> : null}
    </label>
  );
}
