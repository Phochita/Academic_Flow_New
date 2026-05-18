'use client';

import { useMemo, useState } from 'react';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import AdminMetricCard from '@/components/admin/AdminMetricCard';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPanel from '@/components/admin/AdminPanel';
import AdminStatusBadge from '@/components/admin/AdminStatusBadge';
import { adminUsers, type AdminUserRow } from '@/components/admin/adminData';

export default function AdminUsersPage() {
  const [rows, setRows] = useState<AdminUserRow[]>(adminUsers);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | AdminUserRow['role']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | AdminUserRow['status']>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUserRow | null>(null);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesQuery =
        !normalizedQuery ||
        row.name.toLowerCase().includes(normalizedQuery) ||
        row.email.toLowerCase().includes(normalizedQuery) ||
        row.plan.toLowerCase().includes(normalizedQuery);
      const matchesRole = roleFilter === 'all' || row.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || row.status === statusFilter;

      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [query, roleFilter, rows, statusFilter]);

  const activeCount = rows.filter((row) => row.status === 'Active').length;
  const pendingCount = rows.filter((row) => row.status === 'Pending Review').length;
  const adminCount = rows.filter((row) => row.role === 'admin').length;
  const paidCount = rows.filter((row) => row.plan !== 'Free').length;

  const confirmLabel =
    selectedUser?.status === 'Suspended'
      ? 'Restore Access'
      : selectedUser?.status === 'Pending Review'
        ? 'Approve Account'
        : 'Suspend User';

  function handleConfirm() {
    if (!selectedUser) {
      return;
    }

    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id !== selectedUser.id
          ? row
          : {
              ...row,
              status:
                row.status === 'Suspended'
                  ? 'Active'
                  : row.status === 'Pending Review'
                    ? 'Active'
                    : 'Suspended',
            }
      )
    );
    setSelectedUser(null);
  }

  return (
    <div className="mx-auto max-w-[1180px] space-y-6">
      <AdminPageHeader
        eyebrow="User Management"
        title="Accounts, Roles, and Access"
        description="Manage identity health across students, lecturers, and administrators without entering their daily workflows."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard label="All Users" value={String(rows.length)} change="+218 this month" detail="Every account indexed for admin lookup." tone="purple" />
        <AdminMetricCard label="Active Users" value={String(activeCount)} change="93% healthy" detail="Accounts currently in good standing." tone="green" />
        <AdminMetricCard label="Pending Review" value={String(pendingCount)} change="Needs action" detail="Accounts waiting for admin verification." tone="amber" />
        <AdminMetricCard label="Paid Accounts" value={String(paidCount)} change={`${adminCount} admins`} detail="Pro and campus access under management." tone="blue" />
      </section>

      <AdminPanel title="User Directory" description="Search and filter every account with role-aware admin actions.">
        <div className="flex flex-wrap gap-3">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email, or plan..."
            className="h-11 min-w-[260px] flex-1 rounded-[16px] border border-[#e4d8fb] bg-[#fcfaff] px-4 text-sm text-[#2a1842] outline-none focus:border-[#cdb5f7]"
          />
          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value as 'all' | AdminUserRow['role'])}
            className="h-11 rounded-[16px] border border-[#e4d8fb] bg-[#fcfaff] px-4 text-sm font-semibold text-[#2a1842] outline-none"
          >
            <option value="all">All roles</option>
            <option value="student">Students</option>
            <option value="lecturer">Lecturers</option>
            <option value="admin">Admins</option>
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | AdminUserRow['status'])}
            className="h-11 rounded-[16px] border border-[#e4d8fb] bg-[#fcfaff] px-4 text-sm font-semibold text-[#2a1842] outline-none"
          >
            <option value="all">All status</option>
            <option value="Active">Active</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        <div className="mt-5 overflow-hidden rounded-[22px] border border-[#f0e7fb]">
          <div className="grid grid-cols-[1.2fr_1.1fr_0.7fr_0.7fr_0.8fr_0.7fr] gap-4 bg-[#faf7ff] px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">
            <span>User</span>
            <span>Role & Plan</span>
            <span>Status</span>
            <span>Courses</span>
            <span>Last Seen</span>
            <span>Action</span>
          </div>
          {filteredRows.map((row) => (
            <div key={row.id} className="grid grid-cols-[1.2fr_1.1fr_0.7fr_0.7fr_0.8fr_0.7fr] items-center gap-4 border-t border-[#f2ebfb] px-5 py-4 text-sm text-[#2a1842]">
              <div>
                <p className="font-semibold">{row.name}</p>
                <p className="mt-1 text-[#6b5a88]">{row.email}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#efe3ff] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#6d38de]">
                  {row.role}
                </span>
                <span className="rounded-full bg-[#edf5ff] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#4669d8]">
                  {row.plan}
                </span>
              </div>
              <AdminStatusBadge status={row.status} />
              <span>{row.courses}</span>
              <span>{row.lastSeen}</span>
              <button
                type="button"
                onClick={() => setSelectedUser(row)}
                className="rounded-full border border-[#dbc8fa] px-4 py-2 text-sm font-semibold text-[#5a2ddf] transition hover:border-[#cdb5f7]"
              >
                {row.status === 'Suspended' ? 'Restore' : row.status === 'Pending Review' ? 'Approve' : 'Suspend'}
              </button>
            </div>
          ))}
        </div>
      </AdminPanel>

      <AdminConfirmDialog
        open={Boolean(selectedUser)}
        title={selectedUser ? `${confirmLabel} for ${selectedUser.name}?` : ''}
        description={
          selectedUser
            ? 'This admin action changes platform access and should be recorded in the activity log.'
            : ''
        }
        confirmLabel={confirmLabel}
        onClose={() => setSelectedUser(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
