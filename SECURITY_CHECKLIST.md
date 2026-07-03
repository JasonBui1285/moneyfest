# MONEYFEST Security Checklist

## Request And Browser Security

- [x] Content Security Policy configured.
- [x] Strict-Transport-Security configured.
- [x] Referrer-Policy configured.
- [x] Permissions-Policy configured.
- [x] X-Content-Type-Options configured.
- [x] X-Frame-Options configured.
- [x] Request guard blocks unsupported methods and suspicious paths.

## Authentication And Authorization

- [x] `/admin` is protected server-side.
- [x] Account session cookie is httpOnly.
- [x] Passwords are hashed with `crypto.scrypt`.
- [x] OAuth secrets are read only on the server.
- [x] User roles are separated as `OWNER`, `ADMIN`, `MARKETING`, `SALES`, `SUPPORT`, and `USER`.
- [ ] Replace Basic Auth with full role-based admin session auth in a later phase.

## Forms And Server Actions

- [x] Login uses Zod validation and rate limiting.
- [x] Ebook download uses Zod validation and rate limiting.
- [x] Consultation/contact uses Zod validation and rate limiting.
- [x] Admin actions use Zod validation.
- [x] Sensitive user/admin actions write audit logs.

## Database

- [x] PostgreSQL datasource is used.
- [x] Prisma Client parameterized queries are used.
- [x] `AuditLog` model added.
- [x] Soft delete fields added for appropriate operational records.
- [ ] Convert `db push` workflow to Prisma migrations before enterprise production.
- [ ] Add restore drill evidence after the first production backup test.

## DevSecOps

- [x] GitHub Actions security CI added.
- [x] `npm audit --audit-level=high` added.
- [x] Dependabot added.
- [x] SECURITY.md added.
- [x] Incident response document added.
- [x] Backup strategy document added.

## Release Gate

Before release, confirm:

- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] `npm run security:audit` has no unassessed High/Critical findings.
- [ ] `.env` is not committed.
- [ ] Production env is configured in the hosting provider.
- [ ] Admin credentials are rotated after handoff.
