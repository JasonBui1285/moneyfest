"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { runLeadAutomation } from "@/lib/brevo";
import { rateLimit, rateLimitMessage, requestIdentity } from "@/lib/rate-limit";
import {
  cashflowSchema,
  consultationSchema,
  ebookDownloadSchema,
  financialQuizSchema,
} from "@/lib/validation";

type ActionState = {
  ok: boolean;
  message: string;
  downloadUrl?: string | null;
};

async function findOrCreateLead(input: {
  name: string;
  email: string;
  phone?: string;
  source: string;
  consentGiven?: boolean;
}) {
  const consentAt = input.consentGiven ? new Date() : undefined;
  const existing = await prisma.lead.findFirst({
    where: { email: input.email.toLowerCase() },
  });

  if (existing) {
    return prisma.lead.update({
      where: { id: existing.id },
      data: {
        name: input.name,
        phone: input.phone || existing.phone,
        source: input.source,
        consentGiven: input.consentGiven ? true : existing.consentGiven,
        consentAt: consentAt ?? existing.consentAt,
      },
    });
  }

  return prisma.lead.create({
    data: {
      name: input.name,
      email: input.email.toLowerCase(),
      phone: input.phone,
      source: input.source,
      consentGiven: input.consentGiven ?? false,
      consentAt,
    },
  });
}

function hasHoneypotValue(data: unknown) {
  if (!data || typeof data !== "object") return false;
  const value = (data as { company?: unknown }).company;
  return typeof value === "string" && value.trim().length > 0;
}

const fakeSuccess: ActionState = {
  ok: true,
  message: "Cảm ơn bạn. MONEYFEST đã ghi nhận thông tin.",
};

function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Direct script tests do not have Next's static generation store.
  }
}

export async function submitEbookDownload(data: unknown): Promise<ActionState> {
  if (hasHoneypotValue(data)) return fakeSuccess;

  const parsed = ebookDownloadSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, message: "Thông tin chưa hợp lệ. Vui lòng kiểm tra lại." };
  }
  const ebookIdentity = await requestIdentity(parsed.data.email);
  const ebookLimit = rateLimit({
    key: `ebook-download:${ebookIdentity}:${parsed.data.email}:${parsed.data.ebookSlug}`,
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });
  if (!ebookLimit.ok) return { ok: false, message: rateLimitMessage(ebookLimit) };

  const ebook = await prisma.ebook.findUnique({
    where: { slug: parsed.data.ebookSlug },
  });

  if (!ebook) {
    return { ok: false, message: "Không tìm thấy ebook này." };
  }

  const lead = await findOrCreateLead({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    source: "ebook_download",
    consentGiven: parsed.data.consentGiven,
  });

  await prisma.$transaction([
    prisma.ebookDownload.create({
      data: {
        leadId: lead.id,
        ebookId: ebook.id,
      },
    }),
    prisma.formSubmission.create({
      data: {
        formType: "ebook_download",
        leadId: lead.id,
        payload: JSON.stringify(parsed.data),
      },
    }),
  ]);
  await writeAuditLog({
    actorEmail: parsed.data.email,
    action: "ebook.download_requested",
    entity: "Ebook",
    entityId: ebook.id,
    metadata: { slug: ebook.slug },
  });

  safeRevalidate("/admin");
  await runLeadAutomation({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    source: "ebook_download",
    ebookTitle: ebook.title,
    downloadUrl: ebook.fileUrl,
  });

  if (ebook.fileUrl) {
    return {
      ok: true,
      message: "Cảm ơn bạn. Bạn có thể tải tài nguyên trực tiếp bằng nút bên dưới.",
      downloadUrl: ebook.fileUrl,
    };
  }

  return {
    ok: true,
    message:
      "Cảm ơn bạn. MONEYFEST đã ghi nhận thông tin và sẽ gửi tài nguyên qua email khi hệ thống email được kích hoạt.",
  };
}

export async function submitConsultation(data: unknown): Promise<ActionState> {
  if (hasHoneypotValue(data)) return fakeSuccess;

  const parsed = consultationSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, message: "Thông tin chưa hợp lệ. Vui lòng kiểm tra lại." };
  }
  const consultationIdentity = await requestIdentity(parsed.data.email);
  const consultationLimit = rateLimit({
    key: `consultation:${consultationIdentity}:${parsed.data.email}`,
    limit: 3,
    windowMs: 30 * 60 * 1000,
  });
  if (!consultationLimit.ok) return { ok: false, message: rateLimitMessage(consultationLimit) };

  const lead = await findOrCreateLead({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    source: "consultation",
    consentGiven: parsed.data.consentGiven,
  });

  const {
    consentGiven,
    company,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    landing_page,
    referrer,
    ...consultationData
  } = parsed.data;
  void company;
  void utm_source;
  void utm_medium;
  void utm_campaign;
  void utm_content;
  void utm_term;
  void landing_page;
  void referrer;
  const consentAt = consentGiven ? new Date() : null;

  await prisma.$transaction([
    prisma.consultationRequest.create({
      data: {
        ...consultationData,
        consentGiven,
        consentAt,
      },
    }),
    prisma.formSubmission.create({
      data: {
        formType: "consultation",
        leadId: lead.id,
        payload: JSON.stringify(parsed.data),
      },
    }),
  ]);
  await writeAuditLog({
    actorEmail: parsed.data.email,
    action: "consultation.requested",
    entity: "ConsultationRequest",
    metadata: { financialGoal: parsed.data.financialGoal },
  });

  safeRevalidate("/admin");
  await runLeadAutomation({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    source: "consultation",
    financialGoal: parsed.data.financialGoal,
    message: parsed.data.message,
  });
  return {
    ok: true,
    message: "Đã nhận thông tin. MONEYFEST sẽ liên hệ để hẹn buổi tư vấn phù hợp.",
  };
}

export async function submitCashflow(data: unknown): Promise<ActionState & { result?: string }> {
  if (hasHoneypotValue(data)) return { ...fakeSuccess, result: undefined };

  const parsed = cashflowSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, message: "Vui lòng nhập số liệu hợp lệ." };
  }

  const { income, fixedExpense, flexibleExpense, debtPayment, saving, email } = parsed.data;
  const net = income - fixedExpense - flexibleExpense - debtPayment;
  const savingRate = income > 0 ? Math.round((saving / income) * 100) : 0;
  const result =
    net >= 0
      ? `Dòng tiền dương ${net.toLocaleString("vi-VN")} VND/tháng. Tỷ lệ tiết kiệm hiện tại ${savingRate}%.`
      : `Dòng tiền âm ${Math.abs(net).toLocaleString("vi-VN")} VND/tháng. Nên cắt giảm chi phí linh hoạt hoặc tái cấu trúc nợ.`;

  let leadId: string | undefined;
  if (email) {
    const lead = await findOrCreateLead({
      name: "Tool user",
      email,
      source: "cashflow_tool",
      consentGiven: parsed.data.consentGiven,
    });
    leadId = lead.id;
  }

  if (email) {
    await prisma.toolResult.create({
      data: {
        toolType: "cashflow",
        email: email.toLowerCase(),
        leadId,
        score: savingRate,
        result,
        payload: JSON.stringify(parsed.data),
      },
    });
    safeRevalidate("/admin");
  }

  return { ok: true, message: "Đã tính xong dòng tiền cá nhân.", result };
}

export async function submitFinancialQuiz(
  data: unknown,
): Promise<ActionState & { result?: string; score?: number }> {
  if (hasHoneypotValue(data)) return { ...fakeSuccess, result: undefined, score: undefined };

  const parsed = financialQuizSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, message: "Vui lòng trả lời đầy đủ các câu hỏi." };
  }

  const { emergencyFund, tracking, debt, investing, goal, email } = parsed.data;
  const score = emergencyFund + tracking + debt + investing + goal;
  const result =
    score >= 12
      ? "Sức khỏe tài chính tốt. Bạn nên tối ưu đầu tư và mục tiêu dài hạn."
      : score >= 8
        ? "Nên có kế hoạch 90 ngày để tăng quỹ dự phòng và kiểm soát chi tiêu."
        : "Cần ưu tiên ngân sách cơ bản, quỹ khẩn cấp và xử lý nợ trước.";

  let leadId: string | undefined;
  if (email) {
    const lead = await findOrCreateLead({
      name: "Quiz user",
      email,
      source: "financial_quiz",
      consentGiven: parsed.data.consentGiven,
    });
    leadId = lead.id;
  }

  if (email) {
    await prisma.toolResult.create({
      data: {
        toolType: "financial_quiz",
        email: email.toLowerCase(),
        leadId,
        score,
        result,
        payload: JSON.stringify(parsed.data),
      },
    });
    safeRevalidate("/admin");
  }

  return { ok: true, message: "Đã chấm điểm sức khỏe tài chính.", result, score };
}
