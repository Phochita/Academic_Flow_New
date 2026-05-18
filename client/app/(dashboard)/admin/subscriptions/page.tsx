'use client';

import { useMemo, useState } from 'react';
import AdminBarChart from '@/components/admin/AdminBarChart';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import AdminMetricCard from '@/components/admin/AdminMetricCard';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPanel from '@/components/admin/AdminPanel';
import AdminStatusBadge from '@/components/admin/AdminStatusBadge';
import { adminRevenueMix, adminSubscriptions, type AdminSubscriptionRow } from '@/components/admin/adminData';

export default function AdminSubscriptionsPage() {
  const [rows, setRows] = useState<AdminSubscriptionRow[]>(adminSubscriptions);
  const [statusFilter, setStatusFilter] = useState<'all' | AdminSubscriptionRow['status']>('all');
  const [selectedRow, setSelectedRow] = useState<AdminSubscriptionRow | null>(null);

  const filteredRows = useMemo(
    () => rows.filter((row) => statusFilter === 'all' || row.status === statusFilter),
    [rows, statusFilter]
  );

  const activeCount = rows.filter((row) => row.status === 'Active').length;
  const pastDueCount = rows.filter((row) => row.status === 'Past Due').length;
  const trialCount = rows.filter((row) => row.status === 'Trial').length;
  const mrr = rows.reduce((sum, row) => sum + Number.parseInt(row.mrr.replace(/[^0-9]/g, '') || '0', 10), 0);

  function handleConfirm() {
    if (!selectedRow) {
      return;
    }

    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id !== selectedRow.id
          ? row
          : {
              ...row,
              status: row.status === 'Cancelled' ? 'Active' : 'Cancelled',
              renewal: row.status === 'Cancelled' ? '2026-06-14' : 'Ended',
              mrr: row.status === 'Cancelled' ? '$20' : '$0',
            }
      )
    );
    setSelectedRow(null);
  }

  return (
    <div className="mx-auto max-w-[1180px] space-y-6">
      <AdminPageHeader
        eyebrow="Subscription Management"
        title="Revenue Health and Plan Oversight"
        description="Track active plans, trials, churn risk, renewals, and billing operations from the admin layer of AcaFlow."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard label="MRR" value={`$${mrr}`} change="+9.1%" detail="Estimated monthly recurring revenue under admin oversight." tone="green" />
        <AdminMetricCard label="Active Plans" value={String(activeCount)} change="Stable renewals" detail="Subscriptions currently in good standing." tone="purple" />
        <AdminMetricCard label="Trials" value={String(trialCount)} change="Conversion watch" detail="Accounts inside onboarding or trial experience." tone="blue" />
        <AdminMetricCard label="Past Due" value={String(pastDueCount)} change="Needs recovery" detail="Billing issues requiring intervention." tone="amber" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <AdminPanel title="Revenue Mix" description="Plan mix across the current billing portfolio.">
          <AdminBarChart data={adminRevenueMix} suffix="%" />
        </AdminPanel>

        <AdminPanel title="Subscription Table" description="Review lifecycle state, renewals, and recovery actions.">
          <div className="flex justify-end">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'all' | AdminSubscriptionRow['status'])}
              className="h-11 rounded-[16px] border border-[#e4d8fb] bg-[#fcfaff] px-4 text-sm font-semibold text-[#2a1842] outline-none"
            >
              <option value="all">All status</option>
              <option value="Active">Active</option>
              <option value="Trial">Trial</option>
              <option value="Past Due">Past Due</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="mt-5 overflow-hidden rounded-[22px] border border-[#f0e7fb]">
            <div className="grid grid-cols-[1.1fr_0.9fr_0.7fr_0.7fr_0.6fr] gap-4 bg-[#faf7ff] px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">
              <span>Customer</span>
              <span>Plan</span>
              <span>Status</span>
              <span>Renewal</span>
              <span>Action</span>
            </div>
            {filteredRows.map((row) => (
              <div key={row.id} className="grid grid-cols-[1.1fr_0.9fr_0.7fr_0.7fr_0.6fr] items-center gap-4 border-t border-[#f2ebfb] px-5 py-4 text-sm text-[#2a1842]">
                <div>
                  <p className="font-semibold">{row.customer}</p>
                  <p className="mt-1 text-[#6b5a88]">{row.mrr}</p>
                </div>
                <span>{row.plan}</span>
                <AdminStatusBadge status={row.status} />
                <span>{row.renewal}</span>
                <button
                  type="button"
                  onClick={() => setSelectedRow(row)}
                  className="rounded-full border border-[#dbc8fa] px-4 py-2 text-sm font-semibold text-[#5a2ddf] transition hover:border-[#cdb5f7]"
                >
                  {row.status === 'Cancelled' ? 'Restore' : 'Cancel'}
                </button>
              </div>
            ))}
          </div>
        </AdminPanel>
      </section>

      <AdminConfirmDialog
        open={Boolean(selectedRow)}
        title={selectedRow ? `${selectedRow.status === 'Cancelled' ? 'Restore' : 'Cancel'} ${selectedRow.plan} for ${selectedRow.customer}?` : ''}
        description="This changes billing lifecycle state and should be protected by admin-only RBAC on the backend."
        confirmLabel={selectedRow?.status === 'Cancelled' ? 'Restore Subscription' : 'Cancel Renewal'}
        onClose={() => setSelectedRow(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
