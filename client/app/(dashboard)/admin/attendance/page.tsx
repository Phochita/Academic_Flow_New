'use client';

import { useMemo, useState } from 'react';
import AdminBarChart from '@/components/admin/AdminBarChart';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import AdminMetricCard from '@/components/admin/AdminMetricCard';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPanel from '@/components/admin/AdminPanel';
import AdminStatusBadge from '@/components/admin/AdminStatusBadge';
import { adminAttendanceRows, type AdminAttendanceRow } from '@/components/admin/adminData';

export default function AdminAttendancePage() {
  const [rows, setRows] = useState<AdminAttendanceRow[]>(adminAttendanceRows);
  const [statusFilter, setStatusFilter] = useState<'all' | AdminAttendanceRow['status']>('all');
  const [selectedRow, setSelectedRow] = useState<AdminAttendanceRow | null>(null);

  const filteredRows = useMemo(
    () => rows.filter((row) => statusFilter === 'all' || row.status === statusFilter),
    [rows, statusFilter]
  );

  const averageAttendance = Math.round(rows.reduce((sum, row) => sum + row.attendanceRate, 0) / rows.length);
  const auditCount = rows.filter((row) => row.status === 'Needs Audit' || row.status === 'Critical').length;
  const missingLogs = rows.reduce((sum, row) => sum + row.missingLogs, 0);

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
              status: row.status === 'Healthy' ? 'Needs Audit' : 'Healthy',
              missingLogs: row.status === 'Healthy' ? row.missingLogs + 1 : Math.max(row.missingLogs - 1, 0),
            }
      )
    );
    setSelectedRow(null);
  }

  return (
    <div className="mx-auto max-w-[1180px] space-y-6">
      <AdminPageHeader
        eyebrow="Attendance Monitoring"
        title="Attendance Integrity and Risk Tracking"
        description="Watch absence trends, course-level attendance rates, and missing attendance logs from the platform control layer."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard label="Avg. Attendance" value={`${averageAttendance}%`} change="+2% this week" detail="Platform-wide attendance health." tone="green" />
        <AdminMetricCard label="Audit Queue" value={String(auditCount)} change="Action required" detail="Courses needing an attendance audit." tone="amber" />
        <AdminMetricCard label="Missing Logs" value={String(missingLogs)} change="-1 since yesterday" detail="Unposted or incomplete attendance entries." tone="rose" />
        <AdminMetricCard label="Healthy Courses" value={String(rows.filter((row) => row.status === 'Healthy').length)} change="Stable coverage" detail="Courses operating inside attendance thresholds." tone="purple" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <AdminPanel title="Attendance by Course" description="Quick comparison for admin intervention.">
          <AdminBarChart data={rows.map((row) => ({ label: row.course, value: row.attendanceRate }))} suffix="%" />
        </AdminPanel>

        <AdminPanel title="Attendance Audit Table" description="Use this queue to open or close attendance audits.">
          <div className="flex justify-end">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'all' | AdminAttendanceRow['status'])}
              className="h-11 rounded-[16px] border border-[#e4d8fb] bg-[#fcfaff] px-4 text-sm font-semibold text-[#2a1842] outline-none"
            >
              <option value="all">All status</option>
              <option value="Healthy">Healthy</option>
              <option value="Needs Audit">Needs Audit</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="mt-5 overflow-hidden rounded-[22px] border border-[#f0e7fb]">
            <div className="grid grid-cols-[1.2fr_0.8fr_0.7fr_0.7fr_0.7fr] gap-4 bg-[#faf7ff] px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">
              <span>Course</span>
              <span>Status</span>
              <span>Attendance</span>
              <span>Missing Logs</span>
              <span>Action</span>
            </div>
            {filteredRows.map((row) => (
              <div key={row.id} className="grid grid-cols-[1.2fr_0.8fr_0.7fr_0.7fr_0.7fr] items-center gap-4 border-t border-[#f2ebfb] px-5 py-4 text-sm text-[#2a1842]">
                <div>
                  <p className="font-semibold">{row.course}</p>
                  <p className="mt-1 text-[#6b5a88]">{row.trend}</p>
                </div>
                <AdminStatusBadge status={row.status} />
                <span>{row.attendanceRate}%</span>
                <span>{row.missingLogs}</span>
                <button
                  type="button"
                  onClick={() => setSelectedRow(row)}
                  className="rounded-full border border-[#dbc8fa] px-4 py-2 text-sm font-semibold text-[#5a2ddf] transition hover:border-[#cdb5f7]"
                >
                  {row.status === 'Healthy' ? 'Open Audit' : 'Close Audit'}
                </button>
              </div>
            ))}
          </div>
        </AdminPanel>
      </section>

      <AdminConfirmDialog
        open={Boolean(selectedRow)}
        title={selectedRow ? `${selectedRow.status === 'Healthy' ? 'Open' : 'Close'} attendance audit for ${selectedRow.course}?` : ''}
        description="Attendance audits help the admin team verify that lecturer-side attendance posting remains accurate and timely."
        confirmLabel={selectedRow?.status === 'Healthy' ? 'Open Audit' : 'Close Audit'}
        onClose={() => setSelectedRow(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
