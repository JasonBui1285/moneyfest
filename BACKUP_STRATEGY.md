# MONEYFEST Backup Strategy

## Systems In Scope

- Neon PostgreSQL production database.
- GitHub repository.
- Hosting provider environment variables.
- Uploaded ebook files or future object storage.

## Database Backups

Use Neon automated backups/point-in-time restore for production.

Minimum baseline:

- Daily automated backups.
- Point-in-time recovery enabled where the plan supports it.
- Backup retention reviewed monthly.
- Restore test once per quarter.

## Restore Drill

Quarterly:

1. Create a temporary restore database from a recent backup.
2. Set `DATABASE_URL` locally or in a preview environment.
3. Run:

```bash
npx prisma generate
npm run build
```

4. Smoke test:
   - `/`
   - `/ebooks`
   - `/blog`
   - `/admin`
5. Record date, operator, source backup time, and result.

## Repository Backup

- GitHub is the system of record.
- Protect `main` with pull requests before production launch.
- Keep production sync repo documented separately.

## Environment Variables

Do not store real secrets in the repository.

Maintain a private owner-controlled inventory of required variables:

- `DATABASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `FACEBOOK_CLIENT_ID`
- `FACEBOOK_CLIENT_SECRET`
- integration keys such as Brevo and Sentry

## Recovery Objectives

Initial MVP targets:

- RPO: 24 hours.
- RTO: 4 hours.

These targets should be tightened after paid products or membership go live.
