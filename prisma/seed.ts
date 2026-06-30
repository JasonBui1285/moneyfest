import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

const categories = [
  ["budgeting", "Ngân sách", "Lập ngân sách cá nhân để dùng tiền chủ động hơn."],
  ["cashflow", "Dòng tiền", "Theo dõi thu chi và dòng tiền hằng tháng."],
  ["debt", "Trả nợ", "Chiến lược xử lý nợ và giảm áp lực tài chính."],
  ["investing", "Đầu tư", "Nền tảng đầu tư dài hạn cho người mới."],
  ["mindset", "Tư duy tiền bạc", "Ra quyết định tài chính bình tĩnh và có hệ thống."],
] as const;

const tags = [
  ["beginner", "Người mới"],
  ["worksheet", "Workbook"],
  ["90-days", "90 ngày"],
  ["saving", "Tiết kiệm"],
  ["planning", "Lập kế hoạch"],
  ["debt-free", "Giảm nợ"],
] as const;

const ebooks = [
  {
    slug: "ban-do-dong-tien-30-ngay",
    title: "Bản đồ dòng tiền 30 ngày",
    subtitle: "Workbook giúp bạn biết tiền vào đâu, ra đâu và điểm rò rỉ mỗi tháng.",
    description: "Ebook này hướng dẫn bạn ghi nhận thu nhập, chi phí cố định, chi phí linh hoạt và mức tiết kiệm trong 30 ngày đầu tiên.",
    coverColor: "obsidian",
    level: "Người mới",
    pages: 32,
    isFeatured: true,
  },
  {
    slug: "quy-du-phong-tu-so-0",
    title: "Quỹ dự phòng từ số 0",
    subtitle: "Cách xây quỹ khẩn cấp khi thu nhập chưa cao.",
    description: "Tài liệu giải thích quỹ dự phòng bao nhiêu là đủ, để tiền ở đâu và lập kế hoạch tích lũy theo tuần.",
    coverColor: "midnight",
    level: "Người mới",
    pages: 24,
    isFeatured: true,
  },
  {
    slug: "ke-hoach-tra-no-90-ngay",
    title: "Kế hoạch trả nợ 90 ngày",
    subtitle: "Bảng ưu tiên nợ, dòng tiền và hành động nhỏ mỗi tuần.",
    description: "Phù hợp cho người có nhiều khoản nợ và cần một cách sắp xếp để không bị quá tải.",
    coverColor: "obsidian",
    level: "Trung cấp",
    pages: 40,
    isFeatured: true,
  },
  {
    slug: "ngan-sach-gia-dinh-moi",
    title: "Ngân sách cho gia đình mới",
    subtitle: "Chia quỹ, thống nhất mục tiêu và giảm căng thẳng khi nói về tiền.",
    description: "Workbook dành cho cặp đôi hoặc gia đình trẻ muốn nói chuyện tiền bạc dễ hơn.",
    coverColor: "ivory",
    level: "Người mới",
    pages: 28,
    isFeatured: false,
  },
  {
    slug: "dau-tu-dai-han-can-ban",
    title: "Đầu tư dài hạn căn bản",
    subtitle: "Những khái niệm nên biết trước khi mua sản phẩm đầu tư.",
    description: "Giải thích mục tiêu, khẩu vị rủi ro, phân bổ tài sản và kỷ luật đầu tư bằng ngôn ngữ dễ hiểu.",
    coverColor: "midnight",
    level: "Người mới",
    pages: 36,
    isFeatured: false,
  },
];

const posts = [
  ["vi-sao-luong-tang-van-het-tien", "Vì sao lương tăng vẫn hết tiền?", "cashflow", ["beginner", "planning"]],
  ["quy-du-phong-bao-nhieu-la-du", "Quỹ dự phòng bao nhiêu là đủ?", "budgeting", ["saving", "beginner"]],
  ["snowball-hay-avalanche-tra-no", "Trả nợ Snowball hay Avalanche?", "debt", ["debt-free", "90-days"]],
  ["ngan-sach-50-30-20-co-hop-voi-ban", "Ngân sách 50/30/20 có hợp với bạn?", "budgeting", ["worksheet", "beginner"]],
  ["bat-dau-dau-tu-khi-chua-giau", "Bắt đầu đầu tư khi chưa giàu", "investing", ["beginner", "planning"]],
  ["5-dau-hieu-tai-chinh-dang-canh-bao", "5 dấu hiệu tài chính đang cảnh báo", "mindset", ["90-days", "planning"]],
  ["lap-ke-hoach-tien-bac-cho-cap-doi", "Lập kế hoạch tiền bạc cho cặp đôi", "budgeting", ["worksheet", "saving"]],
  ["kiem-tra-dong-tien-moi-chu-nhat", "Kiểm tra dòng tiền mỗi Chủ nhật", "cashflow", ["90-days", "worksheet"]],
] as const;

function postContent(title: string) {
  return `
    <p>${title} không cần bắt đầu bằng một bảng tính quá phức tạp. Điều quan trọng là bạn biết mình đang ở đâu và bước tiếp theo là gì.</p>
    <h2>1. Nhìn vào thực tế</h2>
    <p>Hãy ghi lại thu nhập, chi phí cố định, chi phí linh hoạt, nợ và tiết kiệm trong một tháng gần nhất. Nếu số liệu chưa đẹp, nó vẫn là điểm khởi đầu tốt.</p>
    <h2>2. Chọn một ưu tiên</h2>
    <p>Trong 30 ngày đầu, chỉ chọn một việc: tạo quỹ dự phòng nhỏ, giảm một nhóm chi phí hoặc trả thêm một khoản nợ. Một ưu tiên rõ sẽ dễ hành động hơn năm mục tiêu cùng lúc.</p>
    <h2>3. Lập lịch kiểm tra</h2>
    <p>Mỗi tuần, dành 20 phút để xem tiền đã đi đâu. MONEYFEST khuyến nghị dùng lịch cố định để biến việc quản lý tiền thành thói quen nhẹ.</p>
  `;
}

async function main() {
  const categoryRecords = new Map<string, string>();
  for (const [slug, name, description] of categories) {
    const category = await prisma.category.upsert({
      where: { slug },
      update: { name, description },
      create: { slug, name, description },
    });
    categoryRecords.set(slug, category.id);
  }

  for (const [slug, name] of tags) {
    await prisma.tag.upsert({
      where: { slug },
      update: { name },
      create: { slug, name },
    });
  }

  for (const ebook of ebooks) {
    await prisma.ebook.upsert({
      where: { slug: ebook.slug },
      update: ebook,
      create: ebook,
    });
  }

  for (const [index, post] of posts.entries()) {
    const [slug, title, categorySlug, tagSlugs] = post;
    const categoryId = categoryRecords.get(categorySlug);
    if (!categoryId) continue;

    await prisma.post.upsert({
      where: { slug },
      update: {
        title,
        excerpt: `Hướng dẫn thực tế về ${title.toLowerCase()} cho người mới bắt đầu.`,
        content: postContent(title),
        categoryId,
        tags: {
          set: [],
          connect: tagSlugs.map((tagSlug) => ({ slug: tagSlug })),
        },
        isFeatured: index < 3,
        readTime: 5 + (index % 3),
        coverColor: index % 2 === 0 ? "obsidian" : "midnight",
      },
      create: {
        slug,
        title,
        excerpt: `Hướng dẫn thực tế về ${title.toLowerCase()} cho người mới bắt đầu.`,
        content: postContent(title),
        categoryId,
        tags: {
          connect: tagSlugs.map((tagSlug) => ({ slug: tagSlug })),
        },
        isFeatured: index < 3,
        readTime: 5 + (index % 3),
        coverColor: index % 2 === 0 ? "obsidian" : "midnight",
      },
    });
  }

  await prisma.setting.upsert({
    where: { key: "site_phase" },
    update: { value: "phase_1_mvp" },
    create: { key: "site_phase", value: "phase_1_mvp", group: "product" },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
