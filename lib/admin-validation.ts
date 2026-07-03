import { z } from "zod";
import { consultationStatuses, leadStatuses } from "@/lib/admin-constants";
import { slugify } from "@/lib/admin-utils";
import { accountTypes, userRoles } from "@/lib/rbac";

const idSchema = z.string().min(1);
const optionalText = z.string().trim().optional();
const checkboxSchema = z.union([z.literal("on"), z.literal("true"), z.boolean()]).optional();

export const leadUpdateSchema = z.object({
  id: idSchema,
  status: z.enum(leadStatuses),
  note: z.string().trim().max(2000).optional(),
});

export const ebookSaveSchema = z.object({
  id: optionalText,
  title: z.string().trim().min(2),
  slug: z.string().trim().optional(),
  subtitle: z.string().trim().min(2),
  description: z.string().trim().min(5),
  previewContent: z.string().trim().optional(),
  fileUrl: z.string().trim().optional(),
  level: z.string().trim().min(2),
  pages: z.coerce.number().int().min(1).max(2000),
  coverColor: z.string().trim().min(2),
  accessLevel: z.enum(["FREE", "PAID", "MEMBERSHIP"]),
  status: z.string().trim().min(2),
  price: z.coerce.number().int().min(0).optional(),
  isFree: checkboxSchema,
  isFeatured: checkboxSchema,
}).transform((value) => ({
  ...value,
  slug: value.slug ? slugify(value.slug) : slugify(value.title),
  isFree: Boolean(value.isFree),
  isFeatured: Boolean(value.isFeatured),
}));

export const idOnlySchema = z.object({
  id: idSchema,
});

export const postSaveSchema = z.object({
  id: optionalText,
  title: z.string().trim().min(2),
  slug: z.string().trim().optional(),
  excerpt: z.string().trim().min(5),
  content: z.string().trim().min(10),
  categoryId: idSchema,
  tagIds: z.union([z.string(), z.array(z.string())]).optional(),
  readTime: z.coerce.number().int().min(1).max(120),
  coverColor: z.string().trim().min(2),
  status: z.string().trim().min(2),
  seoTitle: optionalText,
  seoDescription: optionalText,
  isFeatured: checkboxSchema,
}).transform((value) => ({
  ...value,
  slug: value.slug ? slugify(value.slug) : slugify(value.title),
  isFeatured: Boolean(value.isFeatured),
  tagIds: Array.isArray(value.tagIds) ? value.tagIds : value.tagIds ? [value.tagIds] : [],
}));

export const categorySaveSchema = z.object({
  id: optionalText,
  name: z.string().trim().min(2),
  slug: z.string().trim().optional(),
  description: optionalText,
}).transform((value) => ({
  ...value,
  slug: value.slug ? slugify(value.slug) : slugify(value.name),
}));

export const tagSaveSchema = z.object({
  id: optionalText,
  name: z.string().trim().min(2),
  slug: z.string().trim().optional(),
}).transform((value) => ({
  ...value,
  slug: value.slug ? slugify(value.slug) : slugify(value.name),
}));

export const consultationUpdateSchema = z.object({
  id: idSchema,
  status: z.enum(consultationStatuses),
});

export const settingSaveSchema = z.object({
  id: optionalText,
  key: z.string().trim().min(2).regex(/^[a-zA-Z0-9_.-]+$/),
  value: z.string().trim().max(5000),
  group: z.string().trim().min(2),
});

export const userAccountTypeUpdateSchema = z.object({
  id: idSchema,
  accountType: z.enum(accountTypes),
  role: z.enum(userRoles),
});

export const ebookAccessGrantSchema = z.object({
  userId: idSchema,
  ebookId: idSchema,
  accessType: z.enum(["FREE", "PURCHASED", "GRANTED", "MEMBERSHIP"]),
});
