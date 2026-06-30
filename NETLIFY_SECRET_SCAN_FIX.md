# NETLIFY SECRET SCAN FIX

## Nguyên nhân

Netlify Secret Scanning phát hiện giá trị của credential quản trị trong output deploy. Nguyên nhân có thể đến từ hai nguồn:

- Trang quản trị và response Basic Auth có render text kỹ thuật liên quan đến khu vực quản trị.
- README/report cũ có chứa ví dụ credential dễ trùng với giá trị production.

Nếu username production đang dùng một từ phổ biến trùng route hoặc text trong app, secret scan có thể tiếp tục báo lỗi. Production nên dùng username riêng, không dùng từ phổ biến hoặc trùng URL public.

## File đã sửa

- `proxy.ts`
- `app/admin/page.tsx`
- `app/admin/layout.tsx`
- `.env.example`
- `README.md`
- `NETLIFY_DEPLOY_GUIDE.md`
- `NETLIFY_POSTGRES_FIX_REPORT.md`
- `PHASE_1_PUBLISH_FIX_REPORT.md`
- `LOCAL_RUN_FIX_REPORT.md`

## Thay đổi chính

- Basic Auth chỉ đọc credential trong `proxy.ts`, phía server.
- Không import credential env vào Client Components.
- Không render tên biến credential ra HTML.
- Không ghi credential example thật trong README/report.
- Đổi text giao diện từ nhãn kỹ thuật sang “Quản trị”/“Khu vực nội bộ”.
- Đổi Basic Auth realm sang tên không chứa credential value phổ biến.
- Xóa `.next` và `.netlify` trước khi build lại.

## Kiểm tra cần chạy

```bash
npm run build
```

Kết quả đã kiểm tra:

- `npm run build`: thành công.
- `.next` không còn chứa tên biến credential quản trị.
- `.next` không còn chứa credential local.
- Tên biến credential chỉ còn trong `.env` và `.env.example`; `.env` đã nằm trong `.gitignore`, `.env.example` chỉ chứa placeholder.

## Lưu ý cho Netlify

Trên Netlify, đặt username quản trị thành một chuỗi riêng, không dùng từ phổ biến hoặc trùng route. Password phải là chuỗi dài, ngẫu nhiên.
