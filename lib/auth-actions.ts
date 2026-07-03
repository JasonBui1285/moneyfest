"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import {
  createUserSession,
  destroyUserSession,
  hashPassword,
  requireUser,
  safeCallbackPath,
  verifyPassword,
} from "@/lib/auth";
import { forgotPasswordSchema, loginSchema, profileUpdateSchema, registerSchema } from "@/lib/auth-validation";
import { rateLimit, rateLimitMessage, requestIdentity } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";

type AuthActionState = {
  ok: boolean;
  message: string;
};

function formToObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

const invalidState: AuthActionState = {
  ok: false,
  message: "Thông tin chưa hợp lệ. Vui lòng kiểm tra lại.",
};

export async function loginAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse(formToObject(formData));
  if (!parsed.success) return invalidState;
  const callbackUrl = safeCallbackPath(formData.get("callbackUrl"));
  const identity = await requestIdentity(parsed.data.email);
  const limited = rateLimit({ key: `login:${identity}:${parsed.data.email}`, limit: 5, windowMs: 15 * 60 * 1000 });
  if (!limited.ok) return { ok: false, message: rateLimitMessage(limited) };
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !user.passwordHash || !verifyPassword(parsed.data.password, user.passwordHash)) {
    await writeAuditLog({ actorEmail: parsed.data.email, action: "auth.login_failed", entity: "User" });
    return { ok: false, message: "Email hoặc mật khẩu chưa đúng." };
  }
  await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
  await createUserSession(user.id);
  await writeAuditLog({ actorId: user.id, actorEmail: user.email, action: "auth.login_success", entity: "User", entityId: user.id });
  redirect(callbackUrl);
}

export async function registerAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse(formToObject(formData));
  if (!parsed.success) return invalidState;
  const callbackUrl = safeCallbackPath(formData.get("callbackUrl"));
  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { ok: false, message: "Email này đã có tài khoản. Vui lòng đăng nhập." };
  }
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: hashPassword(parsed.data.password),
    },
  });
  await createUserSession(user.id);
  await writeAuditLog({ actorId: user.id, actorEmail: user.email, action: "auth.register", entity: "User", entityId: user.id });
  redirect(callbackUrl);
}

export async function forgotPasswordAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = forgotPasswordSchema.safeParse(formToObject(formData));
  if (!parsed.success) return invalidState;
  return {
    ok: true,
    message: "Nếu email tồn tại, MONEYFEST sẽ gửi hướng dẫn đặt lại mật khẩu khi email workflow được kích hoạt.",
  };
}

export async function logoutAction() {
  await destroyUserSession();
  redirect("/auth/login");
}

export async function updateProfileAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const user = await requireUser();
  const parsed = profileUpdateSchema.safeParse(formToObject(formData));
  if (!parsed.success) return invalidState;
  await prisma.user.update({
    where: { id: user.id },
    data: { name: parsed.data.name },
  });
  await writeAuditLog({ actorId: user.id, actorEmail: user.email, action: "account.profile_update", entity: "User", entityId: user.id });
  revalidatePath("/account");
  revalidatePath("/account/profile");
  return { ok: true, message: "Đã cập nhật hồ sơ." };
}
