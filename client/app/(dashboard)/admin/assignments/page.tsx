'use client';

import { useMemo, useState } from 'react';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import AdminMetricCard from '@/components/admin/AdminMetricCard';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPanel from '@/components/admin/AdminPanel';
import AdminStatusBadge from '@/components/admin/AdminStatusBadge';
import { adminAssignments, type AdminAssignmentRow } from '@/components/admin/adminData';

export default function AdminAssignmentsPage() {
  const [rows, setRows] = useState<AdminAssignmentRow[]>(adminAssignments);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AdminAssignmentRow['status']>('all');
  const [selectedAssignment, setSelectedAssignment] = useState<AdminAssignmentRow | null>(null);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesQuery =
        !normalizedQuery ||
        row.title.toLowerCase().includes(normalizedQuery) ||
        row.course.toLowerCase().includes(normalizedQuery);
      const matchesStatus = statusFilter === 'all' || row.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [query, rows, statusFilter]);

  const onTrackCount = rows.filter((row) => row.status === 'On Track').length;
  const reviewCount = rows.filter((row) => row.status === 'Needs Review').length;
  const overdueCount = rows.filter((row) => row.status === 'Overdue').length;
  const averageSubmission = Math.round(rows.reduce((sum, row) => sum + row.submissionRate, 0) / rows.length);

  function handleConfirm() {
    if (!selectedAssignment) {
      return;
    }

    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id !== selectedAssignment.id
          ? row
          : {
              ...row,
              status: row.status === 'On Track' ? 'Needs Review' : 'On Track',
              flags: row.status === 'On Track' ? row.flags + 1 : Math.max(row.flags - 1, 0),
            }
      )
    );
    setSelectedAssignment(null);
  }

  return (
    <div className="mx-auto max-w-[1180px] space-y-6">
      <AdminPageHeader
        eyebrow="Assignment Monitoring"
        title="Submission Risk and Coursework Oversight"
        description="Review deadlines, low submission rates, and flagged coursework from the admin perspective without grading or submitting as a user."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard label="On Track" value={String(onTrackCount)} change="Healthy flow" detail="Assignments with strong submission momentum." tone="green" />
        <AdminMetricCard label="Needs Review" value={String(reviewCount)} change="Escalate if needed" detail="Assignments showing early risk signals." tone="amber" />
        <AdminMetricCard label="Overdue" value={String(overdueCount)} change="Priority queue" detail="Assignments already beyond target due date windows." tone="rose" />
        <AdminMetricCard label="Avg. Submission" value={`${averageSubmission}%`} change="+4% week over week" detail="Platform-wide submission rate snapshot." tone="purple" />
      </section>

      <AdminPanel title="Assignment Queue" description="Track engagement and intervene when coursework health starts to slip.">
        <div className="flex flex-wrap gap-3">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search assignment or course..."
            className="h-11 min-w-[260px] flex-1 rounded-[16px] border border-[#e4d8fb] bg-[#fcfaff] px-4 text-sm text-[#2a1842] outline-none focus:border-[#cdb5f7]"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | AdminAssignmentRow['status'])}
            className="h-11 rounded-[16px] border border-[#e4d8fb] bg-[#fcfaff] px-4 text-sm font-semibold text-[#2a1842] outline-none"
          >
            <option value="all">All status</option>
            <option value="On Track">On Track</option>
            <option value="Needs Review">Needs Review</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div className="mt-5 overflow-hidden rounded-[22px] border border-[#f0e7fb]">
          <div className="grid grid-cols-[1.2fr_0.9fr_0.8fr_0.8fr_0.6fr_0.7fr] gap-4 bg-[#faf7ff] px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">
            <span>Assignment</span>
            <span>Course</span>
            <span>Status</span>
            <span>Submission Rate</span>
            <span>Flags</span>
            <span>Action</span>
          </div>
          {filteredRows.map((row) => (
            <div key={row.id} className="grid grid-cols-[1.2fr_0.9fr_0.8fr_0.8fr_0.6fr_0.7fr] items-center gap-4 border-t border-[#f2ebfb] px-5 py-4 text-sm text-[#2a1842]">
              <div>
                <p className="font-semibold">{row.title}</p>
                <p className="mt-1 text-[#6b5a88]">{row.dueDate}</p>
              </div>
              <span>{row.course}</span>
              <AdminStatusBadge status={row.status} />
              <div>
                <div className="h-2 rounded-full bg-[#f1e9fb]">
                  <div className="h-2 rounded-full bg-[#6d38de]" style={{ width: `${row.submissionRate}%` }} />
                </div>
                <p className="mt-2 text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-[#8f80aa]">{row.submissionRate}%</p>
              </div>
              <span>{row.flags}</span>
              <button
                type="button"
                onClick={() => setSelectedAssignment(row)}
                className="rounded-full border border-[#dbc8fa] px-4 py-2 text-sm font-semibold text-[#5a2ddf] transition hover:border-[#cdb5f7]"
              >
                {row.status === 'On Track' ? 'Escalate' : 'Resolve'}
              </button>
            </div>
          ))}
        </div>
      </AdminPanel>

      <AdminConfirmDialog
        open={Boolean(selectedAssignment)}
        title={selectedAssignment ? `${selectedAssignment.status === 'On Track' ? 'Escalate' : 'Resolve'} ${selectedAssignment.title}?` : ''}
        description="This updates the admin monitoring state for the assignment and should be reflected in the activity log."
        confirmLabel={selectedAssignment?.status === 'On Track' ? 'Escalate Review' : 'Resolve Flag'}
        onClose={() => setSelectedAssignment(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
