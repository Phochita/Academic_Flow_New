'use client';

import { useMemo, useState } from 'react';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import AdminMetricCard from '@/components/admin/AdminMetricCard';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPanel from '@/components/admin/AdminPanel';
import AdminStatusBadge from '@/components/admin/AdminStatusBadge';
import { adminCourses, type AdminCourseRow } from '@/components/admin/adminData';

export default function AdminCoursesPage() {
  const [rows, setRows] = useState<AdminCourseRow[]>(adminCourses);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AdminCourseRow['status']>('all');
  const [selectedCourse, setSelectedCourse] = useState<AdminCourseRow | null>(null);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesQuery =
        !normalizedQuery ||
        row.name.toLowerCase().includes(normalizedQuery) ||
        row.lecturer.toLowerCase().includes(normalizedQuery);
      const matchesStatus = statusFilter === 'all' || row.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [query, rows, statusFilter]);

  const healthyCount = rows.filter((row) => row.status === 'Healthy').length;
  const watchlistCount = rows.filter((row) => row.status === 'Watchlist').length;
  const archivedCount = rows.filter((row) => row.status === 'Archived').length;
  const totalEnrollment = rows.reduce((sum, row) => sum + row.enrolled, 0);

  function handleConfirm() {
    if (!selectedCourse) {
      return;
    }

    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id !== selectedCourse.id
          ? row
          : {
              ...row,
              status: row.status === 'Archived' ? 'Healthy' : 'Archived',
            }
      )
    );
    setSelectedCourse(null);
  }

  return (
    <div className="mx-auto max-w-[1180px] space-y-6">
      <AdminPageHeader
        eyebrow="Course Monitoring"
        title="Course Quality and Delivery Health"
        description="Track course lifecycle, completion trends, and lecturer delivery risk without switching into course authoring flows."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard label="Enrolled Seats" value={String(totalEnrollment)} change="+94 this week" detail="Total students currently attached to tracked courses." tone="purple" />
        <AdminMetricCard label="Healthy Courses" value={String(healthyCount)} change="Stable" detail="Courses performing within expected thresholds." tone="green" />
        <AdminMetricCard label="Watchlist" value={String(watchlistCount)} change="Needs review" detail="Courses trending toward low completion or engagement." tone="amber" />
        <AdminMetricCard label="Archived" value={String(archivedCount)} change="Lifecycle complete" detail="Retired courses kept for audit and reporting." tone="blue" />
      </section>

      <AdminPanel title="Course Registry" description="Platform-level visibility into course status, enrollment, and completion.">
        <div className="flex flex-wrap gap-3">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search course or lecturer..."
            className="h-11 min-w-[260px] flex-1 rounded-[16px] border border-[#e4d8fb] bg-[#fcfaff] px-4 text-sm text-[#2a1842] outline-none focus:border-[#cdb5f7]"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | AdminCourseRow['status'])}
            className="h-11 rounded-[16px] border border-[#e4d8fb] bg-[#fcfaff] px-4 text-sm font-semibold text-[#2a1842] outline-none"
          >
            <option value="all">All status</option>
            <option value="Healthy">Healthy</option>
            <option value="Watchlist">Watchlist</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        <div className="mt-5 overflow-hidden rounded-[22px] border border-[#f0e7fb]">
          <div className="grid grid-cols-[1.2fr_0.9fr_0.7fr_0.8fr_0.8fr_0.7fr] gap-4 bg-[#faf7ff] px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">
            <span>Course</span>
            <span>Lecturer</span>
            <span>Status</span>
            <span>Enrollment</span>
            <span>Completion</span>
            <span>Action</span>
          </div>
          {filteredRows.map((row) => (
            <div key={row.id} className="grid grid-cols-[1.2fr_0.9fr_0.7fr_0.8fr_0.8fr_0.7fr] items-center gap-4 border-t border-[#f2ebfb] px-5 py-4 text-sm text-[#2a1842]">
              <div>
                <p className="font-semibold">{row.name}</p>
                <p className="mt-1 text-[#6b5a88]">{row.submissions}</p>
              </div>
              <span>{row.lecturer}</span>
              <AdminStatusBadge status={row.status} />
              <span>{row.enrolled}</span>
              <div>
                <div className="h-2 rounded-full bg-[#f1e9fb]">
                  <div className="h-2 rounded-full bg-[#6d38de]" style={{ width: `${row.completion}%` }} />
                </div>
                <p className="mt-2 text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-[#8f80aa]">{row.completion}%</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCourse(row)}
                className="rounded-full border border-[#dbc8fa] px-4 py-2 text-sm font-semibold text-[#5a2ddf] transition hover:border-[#cdb5f7]"
              >
                {row.status === 'Archived' ? 'Reopen' : 'Archive'}
              </button>
            </div>
          ))}
        </div>
      </AdminPanel>

      <AdminConfirmDialog
        open={Boolean(selectedCourse)}
        title={selectedCourse ? `${selectedCourse.status === 'Archived' ? 'Reopen' : 'Archive'} ${selectedCourse.name}?` : ''}
        description="This changes the course lifecycle state for platform monitoring and admin reporting."
        confirmLabel={selectedCourse?.status === 'Archived' ? 'Reopen Course' : 'Archive Course'}
        onClose={() => setSelectedCourse(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
