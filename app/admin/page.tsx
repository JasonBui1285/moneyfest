import type { Metadata } from "next";
import { EmptyState, SectionHeader, StatCard } from "@/components/ui";
import { ensureAdminAccess } from "@/lib/admin-auth";
import { getAdminData } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Quản trị",
  description: "Khu vực quản trị nội bộ của MONEYFEST Phase 1.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await ensureAdminAccess();
  const data = await getAdminData();

  return (
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeader
          as="h1"
          eyebrow="Quản trị Phase 1"
          title="Dashboard tổng quan"
          description="Khu vực này được bảo vệ bằng Basic Auth phía server."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Tổng lead" value={data.leadCount} />
          <StatCard label="Tổng lượt tải ebook" value={data.ebookDownloadCount} />
          <StatCard label="Tổng bài viết" value={data.postCount} />
          <StatCard label="Yêu cầu tư vấn" value={data.consultationCount} />
        </div>
        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <InternalTable title="Lead mới nhất" empty="Chưa có lead">
            {data.leads.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.source}</td>
                <td>{formatDate(lead.createdAt)}</td>
              </tr>
            ))}
          </InternalTable>
          <InternalTable title="Lượt tải ebook mới nhất" empty="Chưa có lượt tải">
            {data.downloads.map((download) => (
              <tr key={download.id}>
                <td>{download.lead.name}</td>
                <td>{download.ebook.title}</td>
                <td>{download.lead.email}</td>
                <td>{formatDate(download.createdAt)}</td>
              </tr>
            ))}
          </InternalTable>
          <InternalTable title="Yêu cầu tư vấn mới nhất" empty="Chưa có yêu cầu">
            {data.consultations.map((request) => (
              <tr key={request.id}>
                <td>{request.name}</td>
                <td>{request.financialGoal}</td>
                <td>{request.phone}</td>
                <td>{formatDate(request.createdAt)}</td>
              </tr>
            ))}
          </InternalTable>
        </div>
      </section>
  );
}

function InternalTable({
  title,
  empty,
  children,
}: {
  title: string;
  empty: string;
  children: React.ReactNode;
}) {
  const hasRows = Array.isArray(children) ? children.length > 0 : Boolean(children);

  return (
    <div className="mf-card overflow-hidden">
      <div className="border-b border-[var(--mf-border)] p-4">
        <h2 className="font-bold text-[var(--mf-midnight)]">{title}</h2>
      </div>
      {hasRows ? (
        <div className="overflow-x-auto">
          <table className="mf-table">
            <thead>
              <tr>
                <th>Thông tin 1</th>
                <th>Thông tin 2</th>
                <th>Thông tin 3</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {children}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4"><EmptyState title={empty} description="Submit form trên website hoặc chạy seed để có dữ liệu mẫu." /></div>
      )}
    </div>
  );
}
