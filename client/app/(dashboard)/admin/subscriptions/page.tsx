'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import AdminBarChart from '@/components/admin/AdminBarChart';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import AdminMetricCard from '@/components/admin/AdminMetricCard';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPanel from '@/components/admin/AdminPanel';
import AdminStatusBadge from '@/components/admin/AdminStatusBadge';
import { adminRevenueMix } from '@/components/admin/adminData';
import { buildAuthHeaders, getApiBaseUrl, getAuthRequestErrorMessage, readAuthSession } from '@/lib/auth';

type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'trial' | 'past_due' | 'pending' | string;

type ApiAdminSubscription = {
  customer?: {
    email?: string | null;
    fullName?: string | null;
    id?: string | null;
  } | null;
  endDate?: string | null;
  id: number;
  mrrUsd?: number | string | null;
  plan?: string | null;
  status?: SubscriptionStatus | null;
};

type AdminSubscriptionRow = {
  customer: string;
  id: string;
  mrr: string;
  plan: string;
  renewal: string;
  status: string;
};

const formatPlan = (plan?: string | null) => {
  if (plan === 'monthly') return 'Monthly Pro';
  if (plan === 'semester') return 'Semester Pro';
  if (plan === 'annual') return 'Annual Pro';
  return plan?.trim() || 'Student Pro';
};

const formatStatus = (status?: SubscriptionStatus | null) => {
  if (status === 'active') return 'Active';
  if (status === 'past_due') return 'Past Due';
  if (status === 'cancelled') return 'Cancelled';
  if (status === 'expired') return 'Expired';
  if (status === 'trial') return 'Trial';
  if (status === 'pending') return 'Pending Approval';
  return status?.trim() || 'Unknown';
};

const formatMoney = (value?: number | string | null) => {
  const numericValue = typeof value === 'number' ? value : Number(value ?? 0);

  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(Number.isFinite(numericValue) ? numericValue : 0);
};

const formatRenewal = (value?: string | null) => {
  if (!value) {
    return 'Not set';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not set';
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const mapSubscriptionRow = (subscription: ApiAdminSubscription): AdminSubscriptionRow => ({
  customer: subscription.customer?.fullName?.trim() || subscription.customer?.email?.trim() || 'Unknown user',
  id: String(subscription.id),
  mrr: formatMoney(subscription.mrrUsd),
  plan: formatPlan(subscription.plan),
  renewal: formatRenewal(subscription.endDate),
  status: formatStatus(subscription.status),
});

export default function AdminSubscriptionsPage() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [rows, setRows] = useState<AdminSubscriptionRow[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRow, setSelectedRow] = useState<AdminSubscriptionRow | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadSubscriptions = useCallback(async () => {
    const session = readAuthSession();

    if (!session) {
      setErrorMessage('Sign in again as an admin to review subscriptions.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/subscriptions/admin`, {
        headers: buildAuthHeaders(session.accessToken),
      });
      const payload = (await response.json().catch(() => null)) as { subscriptions?: ApiAdminSubscription[]; error?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error?.trim() || 'Unable to load subscription requests right now.');
      }

      setRows((payload?.subscriptions ?? []).map(mapSubscriptionRow));
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(getAuthRequestErrorMessage(error, 'Unable to load subscription requests right now.', apiBaseUrl));
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    void loadSubscriptions();
  }, [loadSubscriptions]);

  const filteredRows = useMemo(
    () => rows.filter((row) => statusFilter === 'all' || row.status === statusFilter),
    [rows, statusFilter],
  );

  const activeCount = rows.filter((row) => row.status === 'Active').length;
  const pendingCount = rows.filter((row) => row.status === 'Pending Approval').length;
  const pastDueCount = rows.filter((row) => row.status === 'Past Due').length;
  const mrr = rows
    .filter((row) => row.status === 'Active')
    .reduce((sum, row) => sum + Number.parseInt(row.mrr.replace(/[^0-9]/g, '') || '0', 10), 0);
  const statusOptions = Array.from(new Set(rows.map((row) => row.status)));

  async function handleConfirm() {
    if (!selectedRow) {
      return;
    }

    const session = readAuthSession();

    if (!session) {
      setErrorMessage('Sign in again as an admin to approve subscriptions.');
      return;
    }

    setIsApproving(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/subscriptions/admin/${selectedRow.id}/approve`, {
        method: 'PATCH',
        headers: buildAuthHeaders(session.accessToken),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error?.trim() || 'Unable to approve this subscription right now.');
      }

      setSelectedRow(null);
      await loadSubscriptions();
    } catch (error) {
      setErrorMessage(getAuthRequestErrorMessage(error, 'Unable to approve this subscription right now.', apiBaseUrl));
    } finally {
      setIsApproving(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1180px] space-y-6">
      <AdminPageHeader
        eyebrow="Subscription Management"
        title="Revenue Health and Plan Oversight"
        description="Review paid subscription requests, approve pending ABA Pay sandbox payments, and monitor active access."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard label="MRR" value={`$${mrr}`} change="Approved plans" detail="Estimated active recurring revenue after admin approval." tone="green" />
        <AdminMetricCard label="Active Plans" value={String(activeCount)} change="Approved access" detail="Subscriptions currently in good standing." tone="purple" />
        <AdminMetricCard label="Pending Approval" value={String(pendingCount)} change="Needs admin review" detail="Paid requests waiting before Pro access is enabled." tone="blue" />
        <AdminMetricCard label="Past Due" value={String(pastDueCount)} change="Needs recovery" detail="Billing issues requiring intervention." tone="amber" />
      </section>

      {errorMessage ? (
        <p className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{errorMessage}</p>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <AdminPanel title="Revenue Mix" description="Plan mix across the current billing portfolio.">
          <AdminBarChart data={adminRevenueMix} suffix="%" />
        </AdminPanel>

        <AdminPanel title="Subscription Table" description="Pending payments must be approved before Student Pro is activated.">
          <div className="flex justify-end">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-11 rounded-[16px] border border-[#e4d8fb] bg-[#fcfaff] px-4 text-sm font-semibold text-[#2a1842] outline-none"
            >
              <option value="all">All status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="mt-5 overflow-hidden rounded-[22px] border border-[#f0e7fb]">
            <div className="grid grid-cols-[1.1fr_0.9fr_0.7fr_0.7fr_0.7fr] gap-4 bg-[#faf7ff] px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">
              <span>Customer</span>
              <span>Plan</span>
              <span>Status</span>
              <span>Renewal</span>
              <span>Action</span>
            </div>
            {isLoading ? (
              <div className="px-5 py-5 text-sm font-semibold text-[#6d38de]">Loading subscription requests...</div>
            ) : null}
            {!isLoading && filteredRows.length === 0 ? (
              <div className="px-5 py-5 text-sm font-semibold text-[#6b5a88]">No subscriptions match this filter.</div>
            ) : null}
            {filteredRows.map((row) => (
              <div key={row.id} className="grid grid-cols-[1.1fr_0.9fr_0.7fr_0.7fr_0.7fr] items-center gap-4 border-t border-[#f2ebfb] px-5 py-4 text-sm text-[#2a1842]">
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
                  disabled={row.status !== 'Pending Approval'}
                  className="rounded-full border border-[#dbc8fa] px-4 py-2 text-sm font-semibold text-[#5a2ddf] transition hover:border-[#cdb5f7] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {row.status === 'Pending Approval' ? 'Approve' : 'Reviewed'}
                </button>
              </div>
            ))}
          </div>
        </AdminPanel>
      </section>

      <AdminConfirmDialog
        open={Boolean(selectedRow)}
        title={selectedRow ? `Approve ${selectedRow.plan} for ${selectedRow.customer}?` : ''}
        description="Approving this payment activates Student Pro for the user. Until approval, the user remains on free access."
        confirmLabel={isApproving ? 'Approving...' : 'Approve Subscription'}
        onClose={() => setSelectedRow(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
