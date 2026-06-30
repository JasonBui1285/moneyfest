# MONEYFEST - Netlify + Neon Deploy Guide

## Production database

Production uses Neon PostgreSQL through Prisma. The Prisma datasource is configured as:

```prisma
datasource db {
  provider = "postgresql"
}
```

`DATABASE_URL` must come from the environment. Do not hard-code it in source code.

## Netlify environment variables

Set database, public site URL, and the two Basic Auth credential variables in Netlify. Use `.env.example` as the variable-name reference, but never copy local or real secret values into docs or reports.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require"
NEXT_PUBLIC_SITE_URL="https://your-production-domain.netlify.app"
```

Use the real Neon connection string for `DATABASE_URL`. Keep `sslmode=require`.

## Build command

Use:

```bash
npm run build
```

The project build script runs:

```bash
prisma generate && next build
```

## First deploy database setup

If the Neon database does not have tables yet, run one of these after setting `DATABASE_URL`:

```bash
npx prisma db push
```

Then seed demo content if needed:

```bash
npx prisma db seed
```

For a stricter production workflow later, replace `db push` with Prisma migrations.

## Local development

Create `.env` from `.env.example`, then set a real PostgreSQL connection string:

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

Open:

```text
http://localhost:3000
```
