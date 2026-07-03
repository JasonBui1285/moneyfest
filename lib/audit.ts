import "server-only";

import { prisma } from "@/lib/prisma";

type AuditInput = {
  actorId?: string | null;
  actorEmail?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: Record<string, string | number | boolean | null>;
};

export async function writeAuditLog(input: AuditInput) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId,
        actorEmail: input.actorEmail,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
      },
    });
  } catch {
    // Audit logging should never break customer-facing flows.
  }
}
