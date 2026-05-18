'use client';

import { useMemo, useState } from 'react';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import AdminMetricCard from '@/components/admin/AdminMetricCard';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPanel from '@/components/admin/AdminPanel';
import AdminStatusBadge from '@/components/admin/AdminStatusBadge';
import { adminActivities, type AdminActivityRow } from '@/components/admin/adminData';

export default function AdminActivityPage() {
  const [selectedEntry, setSelectedEntry] = useState<AdminActivityRow | null>(null);
  const [severityFilter, setSeverityFilter] = useState<'all' | AdminActivityRow['severity']>('all');
  const [acknowledgedIds, setAcknowledgedIds] = useState<string[]>([]);

  const filteredRows = useMemo(
    () => adminActivities.filter((entry) => severityFilter === 'all' || entry.severity === severityFilter),
    [severityFilter]
  );

  return (
    <div className="mx-auto max-w-[1180px] space-y-6">
      <AdminPageHeader
        eyebrow="Activity Logs"
        title="Audit Trail and Event Monitoring"
        description="A read-only feed of admin actions, billing events, integrity escalations, and platform system signals."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard label="Events Today" value="128" change="+17 overnight" detail="All audit events captured for review." tone="purple" />
        <AdminMetricCard label="Warnings" value="14" change="Needs triage" detail="Operational events that may require intervention." tone="amber" />
        <AdminMetricCard label="Critical" value="3" change="Escalated" detail="High-severity items demanding immediate attention." tone="rose" />
        <AdminMetricCard label="Acknowledged" value={String(acknowledgedIds.length)} change="Tracked live" detail="Entries already reviewed by an admin." tone="green" />
      </section>

      <AdminPanel title="Activity Stream" description="Filter by severity and acknowledge events after review.">
        <div className="flex justify-end">
          <select
            value={severityFilter}
            onChange={(event) => setSeverityFilter(event.target.value as 'all' | AdminActivityRow['severity'])}
            className="h-11 rounded-[16px] border border-[#e4d8fb] bg-[#fcfaff] px-4 text-sm font-semibold text-[#2a1842] outline-none"
          >
            <option value="all">All severity</option>
            <option value="Info">Info</option>
            <option value="Warning">Warning</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div className="mt-5 overflow-hidden rounded-[22px] border border-[#f0e7fb]">
          <div className="grid grid-cols-[0.9fr_1fr_1fr_0.7fr_0.7fr] gap-4 bg-[#faf7ff] px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">
            <span>Actor</span>
            <span>Action</span>
            <span>Target</span>
            <span>Severity</span>
            <span>Review</span>
          </div>
          {filteredRows.map((entry) => (
            <div key={entry.id} className="grid grid-cols-[0.9fr_1fr_1fr_0.7fr_0.7fr] items-center gap-4 border-t border-[#f2ebfb] px-5 py-4 text-sm text-[#2a1842]">
              <div>
                <p className="font-semibold">{entry.actor}</p>
                <p className="mt-1 text-[#6b5a88]">{entry.time}</p>
              </div>
              <span>{entry.action}</span>
              <span>{entry.target}</span>
              <AdminStatusBadge status={entry.severity} />
              <button
                type="button"
                onClick={() => setSelectedEntry(entry)}
                className="rounded-full border border-[#dbc8fa] px-4 py-2 text-sm font-semibold text-[#5a2ddf] transition hover:border-[#cdb5f7]"
              >
                {acknowledgedIds.includes(entry.id) ? 'Reviewed' : 'Acknowledge'}
              </button>
            </div>
          ))}
        </div>
      </AdminPanel>

      <AdminConfirmDialog
        open={Boolean(selectedEntry)}
        title={selectedEntry ? `Acknowledge ${selectedEntry.action}?` : ''}
        description="Acknowledged events remain in the audit trail, but they are marked as reviewed by the admin team."
        confirmLabel="Mark Reviewed"
        onClose={() => setSelectedEntry(null)}
        onConfirm={() => {
          if (selectedEntry && !acknowledgedIds.includes(selectedEntry.id)) {
            setAcknowledgedIds((currentIds) => [...currentIds, selectedEntry.id]);
          }
          setSelectedEntry(null);
        }}
      />
    </div>
  );
}
