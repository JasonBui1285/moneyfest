# MONEYFEST Environment Guide

This guide classifies environment variables for local development, Netlify, and secret scanning.

## Public variables

Variables prefixed with `NEXT_PUBLIC_` are intentionally exposed to the browser by Next.js.

Current public variables:

```env
NEXT_PUBLIC_SITE_URL="https://your-production-domain.netlify.app"
NEXT_PUBLIC_GA_MEASUREMENT_ID=""
NEXT_PUBLIC_CLARITY_PROJECT_ID=""
NEXT_PUBLIC_SENTRY_DSN=""
```

`NEXT_PUBLIC_SITE_URL` is not a secret. It can appear in generated metadata, sitemap URLs, Open Graph URLs, canonical URLs, and client-visible code.

## Server secrets

These variables must be stored as protected environment variables and must never be rendered into HTML, metadata, robots, reports, or client bundles:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require"
ADMIN_PASSWORD="replace-with-a-long-random-password"
```

`DATABASE_URL` contains database credentials. `ADMIN_PASSWORD` protects the internal Basic Auth gate.

## Server config

Server config is required by the backend, but it is not in the same risk class as a password or database URL.

```env
ADMIN_USERNAME="mf-owner-login"
BREVO_API_KEY=""
BREVO_SENDER_EMAIL=""
BREVO_SENDER_NAME="MONEYFEST"
BREVO_OWNER_EMAIL=""
BREVO_LIST_ID=""
SENTRY_DSN=""
SENTRY_ORG=""
SENTRY_PROJECT=""
SENTRY_AUTH_TOKEN=""
```

Use a non-obvious username that does not duplicate public route names or public copy. Do not use a common value such as the route segment for the internal area.

## Netlify guidance

In Netlify, configure:

- Public variable: `NEXT_PUBLIC_SITE_URL`
- Server secrets: `DATABASE_URL`, `ADMIN_PASSWORD`
- Server config: `ADMIN_USERNAME`

Do not add `NEXT_PUBLIC_SITE_URL` to secret scanning as a protected secret value. It is expected to be public.

## Local setup

Create `.env` from `.env.example` and replace placeholders with environment-specific values.

```bash
cp .env.example .env
```

Never commit `.env`.
