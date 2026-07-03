# MONEYFEST Security Baseline Report

## Tài liệu đã đọc

- `PROJECT_CONTEXT.md`
- `PHASE_1_REPORT.md`
- `docs/archive/netlify/NETLIFY_DEPLOY_GUIDE.md`
- `../outputs/moneyfest-complete-handoff/README_FIRST.md`

## Tài liệu không tìm thấy trong project hiện tại

- `README_FIRST.md` không có ở root project, chỉ có trong gói handoff `../outputs/moneyfest-complete-handoff/README_FIRST.md`.
- `MONEYFEST_ENTERPRISE_BLUEPRINT.md` không tồn tại trong workspace hiện tại.
- `NETLIFY_DEPLOY_GUIDE.md` không có ở root project, bản hiện có nằm tại `docs/archive/netlify/NETLIFY_DEPLOY_GUIDE.md`.

## Foundation đã triển khai

- Thêm HTTP Security Headers trong `next.config.ts`.
- Thêm Content Security Policy phù hợp với Next.js, Sentry, analytics, Google/Facebook OAuth.
- Bật Strict-Transport-Security.
- Thêm Referrer-Policy.
- Thêm Permissions-Policy.
- Thêm X-Content-Type-Options.
- Thêm X-Frame-Options.
- Mở rộng `proxy.ts` thành request guard:
  - Chặn method không hỗ trợ.
  - Chặn path traversal/null-byte/malformed encoding.
  - Giữ Basic Auth server-side cho `/admin`.
- Thêm rate limiting server-side cho:
  - Login.
  - Ebook download lead form.
  - Ebook download account flow.
  - Contact/consultation form.

## Authentication/RBAC

- Giữ `/admin` protected bằng Basic Auth server-side.
- Thêm role vận hành:
  - `OWNER`
  - `ADMIN`
  - `MARKETING`
  - `SALES`
  - `SUPPORT`
  - `USER`
- Admin `/admin/users` có thể cập nhật role và account type.
- OAuth secrets chỉ đọc server-side.
- Không import secret env vào Client Components.

## Database

- Prisma datasource vẫn là PostgreSQL.
- Thêm `AuditLog`.
- Thêm `deletedAt` cho dữ liệu vận hành phù hợp:
  - `Lead`
  - `Ebook`
  - `Post`
  - `ConsultationRequest`
  - `ToolResult`
  - `FormSubmission`
- Chuyển xóa ebook/post trong admin sang soft delete.
- Query public/admin chính đã lọc `deletedAt: null`.
- Không phát hiện raw SQL trong app code; Prisma Client đang dùng query parameterized.

## DevSecOps

- Thêm `.github/workflows/security-ci.yml`.
- Thêm `.github/dependabot.yml`.
- Thêm script `security:audit`.
- Thêm `SECURITY.md`.
- Thêm `SECURITY_CHECKLIST.md`.
- Thêm `INCIDENT_RESPONSE.md`.
- Thêm `BACKUP_STRATEGY.md`.

## Kết quả kiểm tra

- `npx prisma generate`: pass.
- `npm run lint`: pass.
- `npm run build`: pass.
- `npm run security:audit`: pass ở mức `--audit-level=high`.

Audit hiện còn advisory mức Moderate trong dependency chain của `prisma` và `next`. Không có High/Critical chưa được đánh giá. `npm audit fix --force` đề xuất downgrade/breaking changes nên không áp dụng trong baseline này.

## Hạn chế còn lại

- Admin vẫn dùng Basic Auth; enterprise phase nên thay bằng session auth + RBAC thật.
- Rate limiting hiện là in-process memory; production scale-out nên chuyển sang Redis/Upstash hoặc provider edge rate limiting.
- Chưa có Prisma migration files; hiện workflow vẫn dùng `db push`.
- Audit log mới ghi các hành động nhạy cảm chính, chưa bao phủ 100% CRUD.
- Soft delete chưa áp dụng cho mọi model cấu hình như Category/Tag/Setting.
- Chưa có backup restore drill thực tế vì cần quyền Neon/hosting production.
