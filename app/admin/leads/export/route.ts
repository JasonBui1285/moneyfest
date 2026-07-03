import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { csvEscape } from "@/lib/admin-utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim();
  const status = url.searchParams.get("status")?.trim();
  const leads = await prisma.lead.findMany({
    where: {
      deletedAt: null,
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { phone: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });
  const rows = [
    ["name", "email", "phone", "source", "status", "note", "createdAt"],
    ...leads.map((lead) => [
      lead.name,
      lead.email,
      lead.phone ?? "",
      lead.source,
      lead.status,
      lead.note ?? "",
      lead.createdAt.toISOString(),
    ]),
  ];
  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="moneyfest-leads.csv"',
    },
  });
}
