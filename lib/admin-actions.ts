"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import {
  categorySaveSchema,
  consultationUpdateSchema,
  ebookAccessGrantSchema,
  ebookSaveSchema,
  idOnlySchema,
  leadUpdateSchema,
  postSaveSchema,
  settingSaveSchema,
  tagSaveSchema,
  userAccountTypeUpdateSchema,
} from "@/lib/admin-validation";

type AdminActionResult = {
  ok: boolean;
  message: string;
};

function formToRecord(formData: FormData) {
  const record: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};
  for (const key of formData.keys()) {
    const values = formData.getAll(key);
    record[key] = values.length > 1 ? values : values[0];
  }
  return record;
}

function adminError(): AdminActionResult {
  return { ok: false, message: "Dữ liệu chưa hợp lệ hoặc thao tác không thể hoàn tất." };
}

function refresh(paths: string[]) {
  for (const path of paths) revalidatePath(path);
}

export async function updateLeadAction(_state: AdminActionResult, formData: FormData): Promise<AdminActionResult> {
  const parsed = leadUpdateSchema.safeParse(formToRecord(formData));
  if (!parsed.success) return adminError();
  await prisma.lead.update({
    where: { id: parsed.data.id },
    data: { status: parsed.data.status, note: parsed.data.note ?? "" },
  });
  refresh(["/admin", "/admin/leads"]);
  return { ok: true, message: "Đã cập nhật lead." };
}

export async function saveEbookAction(_state: AdminActionResult, formData: FormData): Promise<AdminActionResult> {
  const parsed = ebookSaveSchema.safeParse(formToRecord(formData));
  if (!parsed.success) return adminError();
  const { id, ...data } = parsed.data;
  if (id) {
    await prisma.ebook.update({ where: { id }, data });
  } else {
    await prisma.ebook.create({ data });
  }
  refresh(["/admin", "/admin/ebooks", "/ebooks"]);
  return { ok: true, message: "Đã lưu ebook." };
}

export async function deleteEbookAction(_state: AdminActionResult, formData: FormData): Promise<AdminActionResult> {
  const parsed = idOnlySchema.safeParse(formToRecord(formData));
  if (!parsed.success) return adminError();
  try {
    await prisma.ebook.update({
      where: { id: parsed.data.id },
      data: { deletedAt: new Date(), status: "archived", isFeatured: false },
    });
  } catch {
    await prisma.ebook.update({ where: { id: parsed.data.id }, data: { isFeatured: false, isFree: false } });
  }
  await writeAuditLog({ action: "admin.ebook_soft_delete", entity: "Ebook", entityId: parsed.data.id });
  refresh(["/admin", "/admin/ebooks", "/ebooks"]);
  return { ok: true, message: "Đã xóa hoặc archive ebook." };
}

export async function savePostAction(_state: AdminActionResult, formData: FormData): Promise<AdminActionResult> {
  const parsed = postSaveSchema.safeParse(formToRecord(formData));
  if (!parsed.success) return adminError();
  const { id, tagIds, ...data } = parsed.data;
  const tags = tagIds.map((tagId) => ({ id: tagId }));
  if (id) {
    await prisma.post.update({ where: { id }, data: { ...data, tags: { set: tags } } });
  } else {
    await prisma.post.create({ data: { ...data, tags: { connect: tags } } });
  }
  refresh(["/admin", "/admin/posts", "/blog", "/sitemap.xml"]);
  return { ok: true, message: "Đã lưu bài viết." };
}

export async function deletePostAction(_state: AdminActionResult, formData: FormData): Promise<AdminActionResult> {
  const parsed = idOnlySchema.safeParse(formToRecord(formData));
  if (!parsed.success) return adminError();
  await prisma.post.update({ where: { id: parsed.data.id }, data: { deletedAt: new Date(), status: "archived", isFeatured: false } });
  await writeAuditLog({ action: "admin.post_soft_delete", entity: "Post", entityId: parsed.data.id });
  refresh(["/admin", "/admin/posts", "/blog", "/sitemap.xml"]);
  return { ok: true, message: "Đã xóa bài viết." };
}

export async function saveCategoryAction(_state: AdminActionResult, formData: FormData): Promise<AdminActionResult> {
  const parsed = categorySaveSchema.safeParse(formToRecord(formData));
  if (!parsed.success) return adminError();
  const { id, ...data } = parsed.data;
  if (id) {
    await prisma.category.update({ where: { id }, data });
  } else {
    await prisma.category.create({ data });
  }
  refresh(["/admin/categories", "/admin/posts", "/blog"]);
  return { ok: true, message: "Đã lưu category." };
}

export async function deleteCategoryAction(_state: AdminActionResult, formData: FormData): Promise<AdminActionResult> {
  const parsed = idOnlySchema.safeParse(formToRecord(formData));
  if (!parsed.success) return adminError();
  await prisma.category.delete({ where: { id: parsed.data.id } });
  refresh(["/admin/categories", "/admin/posts", "/blog"]);
  return { ok: true, message: "Đã xóa category." };
}

export async function saveTagAction(_state: AdminActionResult, formData: FormData): Promise<AdminActionResult> {
  const parsed = tagSaveSchema.safeParse(formToRecord(formData));
  if (!parsed.success) return adminError();
  const { id, ...data } = parsed.data;
  if (id) {
    await prisma.tag.update({ where: { id }, data });
  } else {
    await prisma.tag.create({ data });
  }
  refresh(["/admin/tags", "/admin/posts", "/blog"]);
  return { ok: true, message: "Đã lưu tag." };
}

export async function deleteTagAction(_state: AdminActionResult, formData: FormData): Promise<AdminActionResult> {
  const parsed = idOnlySchema.safeParse(formToRecord(formData));
  if (!parsed.success) return adminError();
  await prisma.tag.delete({ where: { id: parsed.data.id } });
  refresh(["/admin/tags", "/admin/posts", "/blog"]);
  return { ok: true, message: "Đã xóa tag." };
}

export async function updateConsultationAction(
  _state: AdminActionResult,
  formData: FormData,
): Promise<AdminActionResult> {
  const parsed = consultationUpdateSchema.safeParse(formToRecord(formData));
  if (!parsed.success) return adminError();
  await prisma.consultationRequest.update({
    where: { id: parsed.data.id },
    data: { status: parsed.data.status },
  });
  refresh(["/admin", "/admin/consultations"]);
  return { ok: true, message: "Đã cập nhật yêu cầu tư vấn." };
}

export async function saveSettingAction(_state: AdminActionResult, formData: FormData): Promise<AdminActionResult> {
  const parsed = settingSaveSchema.safeParse(formToRecord(formData));
  if (!parsed.success) return adminError();
  const { id, ...data } = parsed.data;
  if (data.key.toUpperCase().includes("SECRET") || data.key.toUpperCase().includes("PASSWORD")) {
    return { ok: false, message: "Không quản lý secret env từ UI." };
  }
  if (id) {
    await prisma.setting.update({ where: { id }, data });
  } else {
    await prisma.setting.create({ data });
  }
  refresh(["/admin/settings"]);
  return { ok: true, message: "Đã lưu setting." };
}

export async function deleteSettingAction(_state: AdminActionResult, formData: FormData): Promise<AdminActionResult> {
  const parsed = idOnlySchema.safeParse(formToRecord(formData));
  if (!parsed.success) return adminError();
  await prisma.setting.delete({ where: { id: parsed.data.id } });
  refresh(["/admin/settings"]);
  return { ok: true, message: "Đã xóa setting." };
}

export async function updateUserAccountTypeAction(
  _state: AdminActionResult,
  formData: FormData,
): Promise<AdminActionResult> {
  const parsed = userAccountTypeUpdateSchema.safeParse(formToRecord(formData));
  if (!parsed.success) return adminError();
  await prisma.user.update({
    where: { id: parsed.data.id },
    data: {
      accountType: parsed.data.accountType,
      role: parsed.data.role,
    },
  });
  await writeAuditLog({
    action: "admin.user_account_type_update",
    entity: "User",
    entityId: parsed.data.id,
    metadata: { accountType: parsed.data.accountType, role: parsed.data.role },
  });
  refresh(["/admin", "/admin/users"]);
  return { ok: true, message: "Đã cập nhật loại tài khoản." };
}

export async function grantEbookAccessAction(
  _state: AdminActionResult,
  formData: FormData,
): Promise<AdminActionResult> {
  const parsed = ebookAccessGrantSchema.safeParse(formToRecord(formData));
  if (!parsed.success) return adminError();
  await prisma.ebookAccess.upsert({
    where: { userId_ebookId: { userId: parsed.data.userId, ebookId: parsed.data.ebookId } },
    update: { accessType: parsed.data.accessType, grantedAt: new Date(), expiresAt: null },
    create: {
      userId: parsed.data.userId,
      ebookId: parsed.data.ebookId,
      accessType: parsed.data.accessType,
    },
  });
  await writeAuditLog({
    action: "admin.ebook_access_grant",
    entity: "EbookAccess",
    entityId: parsed.data.ebookId,
    metadata: { userId: parsed.data.userId, accessType: parsed.data.accessType },
  });
  refresh(["/admin/users"]);
  return { ok: true, message: "Đã cấp quyền ebook." };
}
