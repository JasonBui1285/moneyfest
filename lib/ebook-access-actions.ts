"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { getEbookAccessState, type EbookDownloadActionState } from "@/lib/ebook-access";
import { requireUser, safeCallbackPath, type CurrentUser } from "@/lib/auth";
import { rateLimit, rateLimitMessage, requestIdentity } from "@/lib/rate-limit";

async function findOrCreateUserLead(user: CurrentUser) {
  const existing = await prisma.lead.findFirst({ where: { email: user.email } });
  if (existing) {
    return prisma.lead.update({
      where: { id: existing.id },
      data: { name: user.name, source: "user_account" },
    });
  }
  return prisma.lead.create({
    data: {
      name: user.name,
      email: user.email,
      source: "user_account",
      consentGiven: true,
      consentAt: new Date(),
    },
  });
}

export async function downloadEbookForCurrentUser(
  _state: EbookDownloadActionState,
  formData: FormData,
): Promise<EbookDownloadActionState> {
  const slug = formData.get("ebookSlug");
  if (typeof slug !== "string" || !slug) {
    return { ok: false, message: "Không tìm thấy ebook cần tải." };
  }

  const callbackUrl = safeCallbackPath(`/ebooks/${slug}`);
  const user = await requireUser(callbackUrl);
  const identity = await requestIdentity(user.email);
  const limited = rateLimit({
    key: `account-ebook-download:${identity}:${user.id}:${slug}`,
    limit: 10,
    windowMs: 10 * 60 * 1000,
  });
  if (!limited.ok) return { ok: false, message: rateLimitMessage(limited) };
  const ebook = await prisma.ebook.findUnique({ where: { slug } });
  if (!ebook) return { ok: false, message: "Không tìm thấy ebook này." };

  const access = await getEbookAccessState(ebook);
  if (!access.canAccess) {
    return { ok: false, message: "Tài khoản của bạn chưa có quyền tải ebook này." };
  }

  const lead = await findOrCreateUserLead(user);
  await prisma.ebookDownload.create({
    data: {
      leadId: lead.id,
      ebookId: ebook.id,
    },
  });
  await writeAuditLog({
    actorId: user.id,
    actorEmail: user.email,
    action: "ebook.download_granted",
    entity: "Ebook",
    entityId: ebook.id,
    metadata: { slug: ebook.slug, accessLevel: ebook.accessLevel },
  });
  revalidatePath("/admin");
  revalidatePath("/account");
  revalidatePath("/account/ebooks");

  if (!ebook.fileUrl) {
    return {
      ok: true,
      message: "Đã ghi nhận lượt tải. File sẽ được gửi khi tài nguyên được gắn URL.",
      downloadUrl: null,
    };
  }

  return {
    ok: true,
    message: "Bạn có quyền truy cập. Bấm nút bên dưới để mở file ebook.",
    downloadUrl: ebook.fileUrl,
  };
}
