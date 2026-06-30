# NETLIFY POSTGRES FIX REPORT

## Nguyên nhân lỗi

Netlify deploy fail vì Prisma datasource đang dùng SQLite trong khi production `DATABASE_URL` trên Netlify trỏ tới Neon PostgreSQL. Runtime cũng đang dùng SQLite driver adapter `@prisma/adapter-better-sqlite3`, nên chỉ đổi biến môi trường là chưa đủ.

## File đã sửa

- `prisma/schema.prisma`
- `lib/prisma.ts`
- `prisma/seed.ts`
- `.env.example`
- `.env` local
- `package.json`
- `package-lock.json`
- `README.md`
- `NETLIFY_DEPLOY_GUIDE.md`
- `NETLIFY_POSTGRES_FIX_REPORT.md`
- Xóa `prisma/setup-dev-db.ts`
- Xóa `types/node-sqlite.d.ts`

## Prisma provider trước/sau

Trước:

```prisma
provider = "sqlite"
```

Sau:

```prisma
provider = "postgresql"
```

## Lệnh đã chạy

```bash
npm install
npx prisma generate
npm run build
```

## Kết quả npm run build

Thành công.

```text
> moneyfest@0.1.0 build
> prisma generate && next build

✔ Generated Prisma Client (v7.8.0)
✓ Compiled successfully
✓ Finished TypeScript
✓ Generating static pages (16/16)
```

Ghi chú: build có cảnh báo từ `pg` về `sslmode=require`. Đây không phải lỗi build. Neon vẫn thường cung cấp connection string có `sslmode=require`; có thể dùng nguyên chuỗi Neon cung cấp trên Netlify.

## Việc owner cần làm tiếp trên Netlify

1. Tạo database Neon PostgreSQL.
2. Copy connection string có `sslmode=require`.
3. Thêm Netlify env:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SITE_URL`
   - Hai biến credential Basic Auth phía server
4. Deploy lại Netlify.
5. Nếu database mới chưa có bảng, chạy:

```bash
npx prisma db push
```

6. Nếu cần dữ liệu mẫu, chạy:

```bash
npx prisma db seed
```

## Trạng thái sau fix

- Prisma provider đã là `postgresql`.
- Runtime Prisma dùng `@prisma/adapter-pg` và `pg`.
- Đã gỡ dependency trực tiếp `@prisma/adapter-better-sqlite3` và `better-sqlite3`.
- `npm run build` thành công.
- `prisma/dev.db` vẫn nằm trong `.gitignore`, không commit database local.
