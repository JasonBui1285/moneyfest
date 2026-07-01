# MONEYFEST

Website chính thức dùng Next.js App Router, TypeScript, Tailwind CSS và Prisma/PostgreSQL.

## Làm việc nhóm

- Mỗi thay đổi dùng một nhánh riêng.
- Mở Pull Request vào `main`.
- Kiểm tra Deploy Preview của Netlify trước khi gộp.
- Không commit file `.env` hoặc thông tin đăng nhập.

Xem quy trình đầy đủ tại [`docs/TEAM_WORKFLOW.md`](docs/TEAM_WORKFLOW.md).

MONEYFEST là website Phase 1 MVP xây bằng Next.js App Router, TypeScript, Tailwind CSS và Prisma.

## Chạy local

```bash
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

Mở:

```text
http://localhost:3000
```

## Database

MONEYFEST hiện dùng PostgreSQL-compatible database qua Prisma. Production khuyến nghị dùng Neon PostgreSQL trên Netlify.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require"
```

Khi chạy local, tạo database PostgreSQL/Neon hoặc dùng một PostgreSQL local, sau đó đặt `DATABASE_URL` trong `.env`. Không hard-code database URL trong source code.

Xem [ENVIRONMENT_GUIDE.md](./ENVIRONMENT_GUIDE.md) để phân loại biến public, server config và server secret. `NEXT_PUBLIC_SITE_URL` là biến public của Next.js, không phải secret.

## Quản Trị

Route `/admin` được bảo vệ bằng Basic Auth phía server. Cấu hình credential theo `.env.example` và không commit giá trị thật vào repository.

## Form và consent

Các form thu lead có:

- Validation server-side bằng Zod.
- Honeypot chống bot cơ bản.
- Consent checkbox bắt buộc khi lưu thông tin cá nhân.
- Lead trùng email sẽ được cập nhật thay vì tạo mới bừa bãi.

## Lệnh kiểm tra

```bash
npm run lint
npm run build
```

Nếu đổi Prisma schema:

```bash
npx prisma generate
npx prisma db push
```

Nếu đổi seed:

```bash
npx prisma db seed
```

## Phase 2: đo lường và tự động hóa lead

Các tích hợp đều an toàn khi chưa có khóa: website vẫn build và form vẫn lưu dữ liệu vào PostgreSQL.

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Google Analytics 4.
- `NEXT_PUBLIC_CLARITY_PROJECT_ID`: Microsoft Clarity.
- `BREVO_API_KEY`: đồng bộ contact và gửi email giao dịch.
- `BREVO_SENDER_EMAIL`: địa chỉ người gửi đã xác minh trong Brevo.
- `BREVO_OWNER_EMAIL`: nhận thông báo khi có lead tư vấn mới.
- `BREVO_LIST_ID`: danh sách contact MONEYFEST trong Brevo.
- `NEXT_PUBLIC_SENTRY_DSN` và `SENTRY_DSN`: theo dõi lỗi trình duyệt và server.
- `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`: tải source map lên Sentry khi build.

Form ebook và tư vấn ghi nhận nguồn UTM, đồng bộ contact vào Brevo, gửi email xác nhận và phát sự kiện GA4 `generate_lead`.
