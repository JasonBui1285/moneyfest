# MONEYFEST Local Run Fix Report

## 1. Nguyên nhân gây lỗi localhost refused to connect

Nguyên nhân trực tiếp: dev server không chạy, port `3000` không có process listen, nên browser báo `localhost refused to connect` / `ERR_CONNECTION_REFUSED`.

Sau khi kiểm tra:

- `lsof -nP -iTCP:3000 -sTCP:LISTEN` ban đầu không trả process nào.
- `npm run dev` chưa chạy ở thời điểm browser đang mở `http://localhost:3000/blog`.
- Không phát hiện lỗi Prisma hoặc proxy làm crash toàn app.

## 2. File đã sửa

- `.env`
  - Bổ sung env local để admin Basic Auth hoạt động khi chạy dev.
- `.env.example`
  - Bổ sung `NEXT_PUBLIC_SITE_URL` để hướng dẫn setup local đầy đủ.
- `LOCAL_RUN_FIX_REPORT.md`
  - Báo cáo debug local run.

## 3. Lệnh cần chạy để mở website

Từ thư mục project:

```bash
cd /Users/jason/Documents/Codex/2026-06-30/npx-create-next-app-latest-moneyfest/moneyfest
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Nếu port `3000` bị chiếm:

```bash
npm run dev -- -p 3001
```

## 4. URL truy cập đúng

Dev server hiện chạy tại:

```text
http://localhost:3000
```

Các URL đã kiểm tra:

```text
http://localhost:3000
http://localhost:3000/ebooks
http://localhost:3000/blog
http://localhost:3000/tools
http://localhost:3000/services
http://localhost:3000/contact
http://localhost:3000/admin
```

## 5. Env cần có

Local `.env` hiện cần:

```env
DATABASE_URL="file:./prisma/dev.db"
Credential quản trị local được đặt trong `.env` và không ghi lại trong report.
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Ghi chú:

- Không dùng credential local cho production.
- Production cần đặt secret thật trong hosting provider.

## 6. Checklist xác nhận các page đã chạy

- `npm install`: pass.
- `npx prisma generate`: pass.
- `npx prisma db push`: pass.
- `npm run build`: pass.
- `npm run dev`: pass.
- Process Node đang listen ở port `3000`.
- Public route smoke test:
  - `/`: `200`
  - `/ebooks`: `200`
  - `/blog`: `200`
  - `/tools`: `200`
  - `/services`: `200`
  - `/contact`: `200`
- `/admin` không auth: `401`, có Basic Auth challenge.
- `/admin` có auth local `local credentials`: `200`.
- In-app browser tab mới truy cập `http://localhost:3000/blog`: pass.
- Browser không còn `ERR_CONNECTION_REFUSED`.
- Browser console error: `0`.

## 7. Lỗi còn lại nếu có

- `npm install` báo 5 moderate vulnerabilities từ dependency tree. Chưa chạy `npm audit fix --force` vì có thể gây breaking change package version.
- In-app browser tab cũ vẫn giữ trang lỗi dạng `data:` từ lần dev server chưa chạy; mở tab mới hoặc reload lại `http://localhost:3000/blog` sau khi server chạy là hết lỗi.
