import type { Metadata } from "next";
import { AdminActionForm } from "@/components/admin-action-form";
import { AdminCard, AdminPageHeader, AdminTableShell, Pagination, SearchFilterBar } from "@/components/admin-ui";
import { grantEbookAccessAction, updateUserAccountTypeAction } from "@/lib/admin-actions";
import { getAdminUsers } from "@/lib/admin-data";
import { parsePage, parsePageSize, parseSearch } from "@/lib/admin-utils";
import { roleLabels, userRoles } from "@/lib/rbac";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Quản lý users",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminUsersPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = parseSearch(params.q);
  const page = parsePage(params.page);
  const pageSize = parsePageSize(params.pageSize);
  const data = await getAdminUsers({ q, page, pageSize });
  const query = new URLSearchParams();
  if (q) query.set("q", q);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <AdminPageHeader title="Users đăng ký" description="Danh sách user đăng ký tài khoản MONEYFEST." />
      <SearchFilterBar q={q} placeholder="Tên, email, role hoặc account type" />
      <AdminCard title="Danh sách users" description={`${data.meta.total} user`}>
        <AdminTableShell hasRows={data.items.length > 0} emptyTitle="Chưa có user" emptyDescription="User sẽ xuất hiện khi đăng ký tài khoản.">
          <table className="mf-table">
            <thead><tr><th>User</th><th>Account</th><th>Access</th><th>Cấp quyền ebook</th><th>Last login</th></tr></thead>
            <tbody>
              {data.items.map((user) => (
                <tr key={user.id}>
                  <td>
                    <p className="font-bold">{user.name}</p>
                    <p className="mf-muted text-xs">{user.email}</p>
                    <p className="mf-muted text-xs">Tạo: {formatDate(user.createdAt)}</p>
                  </td>
                  <td className="min-w-[180px]">
                    <AdminActionForm action={updateUserAccountTypeAction} submitLabel="Lưu" submitVariant="secondary">
                      <input type="hidden" name="id" value={user.id} />
                      <select
                        name="accountType"
                        defaultValue={user.accountType}
                        className="w-full rounded-[var(--mf-radius-sm)] border border-[var(--mf-border)] bg-white px-3 py-2 text-sm"
                      >
                        <option value="FREE">FREE</option>
                        <option value="PAID">PAID</option>
                        <option value="MEMBER">MEMBER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      <select
                        name="role"
                        defaultValue={user.role.toUpperCase()}
                        className="w-full rounded-[var(--mf-radius-sm)] border border-[var(--mf-border)] bg-white px-3 py-2 text-sm"
                      >
                        {userRoles.map((role) => (
                          <option key={role} value={role}>
                            {roleLabels[role]}
                          </option>
                        ))}
                      </select>
                    </AdminActionForm>
                    <p className="mf-muted mt-2 text-xs">Role: {user.role.toUpperCase()}</p>
                    <p className="mf-muted text-xs">Session: {user._count.sessions}</p>
                  </td>
                  <td className="min-w-[220px]">
                    {user.ebookAccess.length ? (
                      <div className="grid gap-2">
                        {user.ebookAccess.map((access) => (
                          <div key={access.id} className="rounded-[var(--mf-radius-sm)] border border-[var(--mf-border)] p-2">
                            <p className="text-xs font-bold">{access.ebook.title}</p>
                            <p className="mf-muted text-xs">{access.accessType}</p>
                          </div>
                        ))}
                        {user._count.ebookAccess > user.ebookAccess.length ? (
                          <p className="mf-muted text-xs">+{user._count.ebookAccess - user.ebookAccess.length} quyền khác</p>
                        ) : null}
                      </div>
                    ) : (
                      <p className="mf-muted text-sm">Chưa có quyền ebook riêng.</p>
                    )}
                  </td>
                  <td className="min-w-[260px]">
                    <AdminActionForm action={grantEbookAccessAction} submitLabel="Cấp quyền" submitVariant="secondary">
                      <input type="hidden" name="userId" value={user.id} />
                      <select
                        name="ebookId"
                        className="w-full rounded-[var(--mf-radius-sm)] border border-[var(--mf-border)] bg-white px-3 py-2 text-sm"
                        required
                      >
                        <option value="">Chọn ebook</option>
                        {data.ebooks.map((ebook) => (
                          <option key={ebook.id} value={ebook.id}>
                            {ebook.title} ({ebook.accessLevel})
                          </option>
                        ))}
                      </select>
                      <select
                        name="accessType"
                        defaultValue="GRANTED"
                        className="w-full rounded-[var(--mf-radius-sm)] border border-[var(--mf-border)] bg-white px-3 py-2 text-sm"
                      >
                        <option value="FREE">FREE</option>
                        <option value="PURCHASED">PURCHASED</option>
                        <option value="GRANTED">GRANTED</option>
                        <option value="MEMBERSHIP">MEMBERSHIP</option>
                      </select>
                    </AdminActionForm>
                  </td>
                  <td>{user.lastLogin ? formatDate(user.lastLogin) : "Chưa login"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminTableShell>
      </AdminCard>
      <Pagination page={data.meta.page} pageCount={data.meta.pageCount} basePath="/admin/users" query={query} />
    </section>
  );
}
