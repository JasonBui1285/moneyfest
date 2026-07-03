# MONEYFEST Incident Response

## Severity Levels

- Critical: active data exposure, credential leak, admin bypass, production database compromise.
- High: exploitable auth weakness, persistent XSS, broken access control, serious dependency vulnerability.
- Medium: limited data integrity issue, non-public admin defect, rate-limit bypass with low impact.
- Low: documentation issue, low-risk misconfiguration, informational finding.

## First 30 Minutes

1. Preserve evidence: screenshots, timestamps, affected URLs, request IDs, deployment SHA.
2. Stop the leak: disable affected route, rotate exposed credential, or roll back the deployment.
3. Restrict access: rotate `ADMIN_PASSWORD`, OAuth secrets, API keys, and database credentials if affected.
4. Notify owner and technical lead.
5. Open a private incident tracking issue or document.

## Containment

- For leaked env vars: rotate in Vercel/Netlify/GitHub, redeploy, invalidate old tokens.
- For admin bypass: disable admin route at proxy or hosting layer until patched.
- For database compromise: rotate Neon credentials, review audit logs, restore if needed.
- For dependency exploit: upgrade package, rebuild, redeploy, and record the advisory.

## Investigation

Collect:

- Commit SHA and deployment URL.
- Relevant application logs.
- AuditLog records for affected user/entity.
- Hosting access logs if available.
- Database query timeline if available in Neon.

Do not paste secrets into tickets, chats, docs, or reports.

## Recovery

1. Patch root cause on a branch.
2. Run:

```bash
npm run lint
npm run build
npm run security:audit
```

3. Deploy.
4. Verify affected routes and forms.
5. Rotate impacted credentials.
6. Update this document if the playbook missed a step.

## Post-Incident Review

Within 48 hours, document:

- What happened.
- Customer/data impact.
- Root cause.
- Timeline.
- What worked.
- What failed.
- Follow-up tasks with owners and dates.
