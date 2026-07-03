# MONEYFEST Security Policy

## Scope

This policy covers the MONEYFEST web application, admin area, Prisma schema, server actions, deployment configuration, and operational documentation in this repository.

## Supported Branches

- `main`: production-ready code.
- `feature/*`: active development and review branches.

## Reporting a Vulnerability

Do not open a public GitHub issue for secrets, authentication bypass, data exposure, or production incidents.

Report privately to the repository owner with:

- Affected route or component.
- Reproduction steps.
- Impact assessment.
- Screenshots or logs with secrets redacted.

## Security Baseline

- Admin routes are protected by server-side Basic Auth in `proxy.ts`.
- Account routes use httpOnly database-backed sessions.
- Server Actions validate input with Zod.
- Public high-risk forms have in-process rate limiting.
- Security headers and CSP are configured in `next.config.ts`.
- Prisma uses parameterized queries; raw SQL is not used in application code.
- Secrets must come from environment variables only.

## Secrets Handling

Never commit:

- `.env`
- database URLs
- OAuth client secrets
- admin passwords
- Sentry auth tokens
- provider API keys

Use `.env.example` only for variable names and placeholders.

## Dependency Security

Run before release:

```bash
npm run lint
npm run build
npm run security:audit
```

High or critical npm audit findings must be fixed or documented with an owner-approved risk decision before release.
