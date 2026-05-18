'use client';

import { useMemo, useState } from 'react';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import AdminMetricCard from '@/components/admin/AdminMetricCard';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPanel from '@/components/admin/AdminPanel';
import AdminStatusBadge from '@/components/admin/AdminStatusBadge';
import { adminReports, type AdminReportRow } from '@/components/admin/adminData';

export default function AdminReportsPage() {
  const [rows, setRows] = useState<AdminReportRow[]>(adminReports);
  const [statusFilter, setStatusFilter] = useState<'all' | AdminReportRow['status']>('all');
  const [selectedReport, setSelectedReport] = useState<AdminReportRow | null>(null);

  const filteredRows = useMemo(
    () => rows.filter((row) => statusFilter === 'all' || row.status === statusFilter),
    [rows, statusFilter]
  );

  function handleConfirm() {
    if (!selectedReport) {
      return;
    }

    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id !== selectedReport.id
          ? row
          : {
              ...row,
              status: row.status === 'Resolved' ? 'Open' : 'Resolved',
              updatedAt: 'Just now',
            }
      )
    );
    setSelectedReport(null);
  }

  return (
    <div className="mx-auto max-w-[1180px] space-y-6">
      <AdminPageHeader
        eyebrow="Reports & Moderation"
        title="Escalations, Report Packs, and Resolution Queue"
        description="An optional but important admin workspace for moderation, billing escalations, academic integrity issues, and leadership reporting."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard label="Open Reports" value={String(rows.filter((row) => row.status === 'Open').length)} change="Requires triage" detail="Items waiting for admin review." tone="amber" />
        <AdminMetricCard label="In Review" value={String(rows.filter((row) => row.status === 'In Review').length)} change="Live workflow" detail="Cases currently under active investigation." tone="blue" />
        <AdminMetricCard label="Resolved" value={String(rows.filter((row) => row.status === 'Resolved').length)} change="Audit ready" detail="Closed reports retained for governance history." tone="green" />
        <AdminMetricCard label="Integrity Cases" value={String(rows.filter((row) => row.category === 'Academic Integrity').length)} change="High sensitivity" detail="Escalations related to academic misconduct signals." tone="rose" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <AdminPanel title="Report Packs" description="Prepared admin exports for leadership and operations.">
          <div className="space-y-3">
            {[
              'Weekly platform KPI summary',
              'Subscription recovery tracker',
              'Attendance anomaly digest',
              'Academic integrity escalation log',
            ].map((item) => (
              <div key={item} className="rounded-[20px] border border-[#f0e7fb] bg-[#faf7ff] px-4 py-4 text-sm font-semibold text-[#28163f]">
                {item}
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Moderation Queue" description="Resolve or reopen reports with a clear admin action trail.">
          <div className="flex justify-end">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'all' | AdminReportRow['status'])}
              className="h-11 rounded-[16px] border border-[#e4d8fb] bg-[#fcfaff] px-4 text-sm font-semibold text-[#2a1842] outline-none"
            >
              <option value="all">All status</option>
              <option value="Open">Open</option>
              <option value="In Review">In Review</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="mt-5 overflow-hidden rounded-[22px] border border-[#f0e7fb]">
            <div className="grid grid-cols-[1.1fr_0.9fr_0.7fr_0.7fr_0.6fr] gap-4 bg-[#faf7ff] px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">
              <span>Report</span>
              <span>Owner</span>
              <span>Category</span>
              <span>Status</span>
              <span>Action</span>
            </div>
            {filteredRows.map((row) => (
              <div key={row.id} className="grid grid-cols-[1.1fr_0.9fr_0.7fr_0.7fr_0.6fr] items-center gap-4 border-t border-[#f2ebfb] px-5 py-4 text-sm text-[#2a1842]">
                <div>
                  <p className="font-semibold">{row.title}</p>
                  <p className="mt-1 text-[#6b5a88]">{row.updatedAt}</p>
                </div>
                <span>{row.owner}</span>
                <span>{row.category}</span>
                <AdminStatusBadge status={row.status} />
                <button
                  type="button"
                  onClick={() => setSelectedReport(row)}
                  className="rounded-full border border-[#dbc8fa] px-4 py-2 text-sm font-semibold text-[#5a2ddf] transition hover:border-[#cdb5f7]"
                >
                  {row.status === 'Resolved' ? 'Reopen' : 'Resolve'}
                </button>
              </div>
            ))}
          </div>
        </AdminPanel>
      </section>

      <AdminConfirmDialog
        open={Boolean(selectedReport)}
        title={selectedReport ? `${selectedReport.status === 'Resolved' ? 'Reopen' : 'Resolve'} ${selectedReport.title}?` : ''}
        description="Moderation and report decisions should be auditable and restricted to the admin role."
        confirmLabel={selectedReport?.status === 'Resolved' ? 'Reopen Report' : 'Resolve Report'}
        onClose={() => setSelectedReport(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
