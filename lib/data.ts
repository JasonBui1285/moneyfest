import type { ConsultationRequest, Ebook, Lead, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type PostWithRelations = Prisma.PostGetPayload<{
  include: { category: true; tags: true };
}>;

export type EbookWithDownloadCount = Prisma.EbookGetPayload<{
  include: { _count: { select: { downloads: true } } };
}>;

export type AdminDownload = Prisma.EbookDownloadGetPayload<{
  include: { lead: true; ebook: true };
}>;

export type AdminDashboardData = {
  leadCount: number;
  ebookDownloadCount: number;
  postCount: number;
  consultationCount: number;
  leads: Lead[];
  downloads: AdminDownload[];
  consultations: ConsultationRequest[];
};

export const services = [
  {
    title: "Ebook trả phí",
    price: "Từ 99.000 VND",
    description: "Bộ workbook thực hành ngân sách, xử lý nợ và lập kế hoạch đầu tư cá nhân.",
    status: "Sẵn sàng thử nghiệm",
  },
  {
    title: "Tư vấn 1:1",
    price: "Theo nhu cầu",
    description: "Buổi làm việc riêng để soi dòng tiền, mục tiêu và lập kế hoạch 90 ngày.",
    status: "Mở form đăng ký",
  },
  {
    title: "Membership MONEYFEST",
    price: "Sắp ra mắt",
    description: "Cộng đồng học tài chính cá nhân, template hằng tháng và Q&A định kỳ.",
    status: "Sắp ra mắt",
  },
  {
    title: "Dashboard tài chính",
    price: "Sắp ra mắt",
    description: "Theo dõi tài sản, nợ, dòng tiền và mục tiêu trong một nơi.",
    status: "Sắp ra mắt",
  },
];

async function safeQuery<T>(query: Promise<T>, fallback: T) {
  try {
    return await query;
  } catch {
    return fallback;
  }
}

export async function getHomeData(): Promise<{
  ebooks: Ebook[];
  posts: PostWithRelations[];
}> {
  const [ebooks, posts] = await Promise.all([
    safeQuery<Ebook[]>(
      prisma.ebook.findMany({
        where: { isFeatured: true, deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      [],
    ),
    safeQuery<PostWithRelations[]>(
      prisma.post.findMany({
        where: { isFeatured: true, deletedAt: null },
        include: { category: true, tags: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
      [],
    ),
  ]);

  return { ebooks, posts };
}

export async function getEbooks(): Promise<Ebook[]> {
  return safeQuery<Ebook[]>(
    prisma.ebook.findMany({
      where: { deletedAt: null },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    }),
    [],
  );
}

export async function getEbookBySlug(slug: string): Promise<EbookWithDownloadCount | null> {
  return safeQuery<EbookWithDownloadCount | null>(
    prisma.ebook.findFirst({
      where: { slug, deletedAt: null },
      include: { _count: { select: { downloads: true } } },
    }),
    null,
  );
}

export async function getPosts(): Promise<PostWithRelations[]> {
  return safeQuery<PostWithRelations[]>(
    prisma.post.findMany({
      where: { deletedAt: null },
      include: { category: true, tags: true },
      orderBy: { publishedAt: "desc" },
    }),
    [],
  );
}

export async function getPostBySlug(slug: string): Promise<PostWithRelations | null> {
  return safeQuery<PostWithRelations | null>(
    prisma.post.findFirst({
      where: { slug, deletedAt: null },
      include: { category: true, tags: true },
    }),
    null,
  );
}

export async function getAdminData(): Promise<AdminDashboardData> {
  const fallback: AdminDashboardData = {
    leadCount: 0,
    ebookDownloadCount: 0,
    postCount: 0,
    consultationCount: 0,
    leads: [],
    downloads: [],
    consultations: [],
  };

  try {
    const [
      leadCount,
      ebookDownloadCount,
      postCount,
      consultationCount,
      leads,
      downloads,
      consultations,
    ] = await Promise.all([
      prisma.lead.count({ where: { deletedAt: null } }),
      prisma.ebookDownload.count(),
      prisma.post.count({ where: { deletedAt: null } }),
      prisma.consultationRequest.count({ where: { deletedAt: null } }),
      prisma.lead.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" }, take: 8 }),
      prisma.ebookDownload.findMany({
        include: { lead: true, ebook: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.consultationRequest.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]);

    return {
      leadCount,
      ebookDownloadCount,
      postCount,
      consultationCount,
      leads,
      downloads,
      consultations,
    };
  } catch {
    return fallback;
  }
}
