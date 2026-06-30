# MONEYFEST

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

## Admin

Route `/admin` được bảo vệ bằng Basic Auth qua biến môi trường:

```env
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="use-a-long-random-password"
```

Nếu thiếu hai biến này, `/admin` sẽ không mở public và sẽ hiển thị hướng dẫn cấu hình. Không commit mật khẩu thật vào repository.

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
