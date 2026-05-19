'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { startTransition, useEffect, useMemo, useState } from 'react';
import { buildAuthHeaders, getApiBaseUrl, getAuthRequestErrorMessage, readAuthSession } from '@/lib/auth';

type AssignmentFilter = 'all' | 'pending' | 'completed';
type AssignmentStatus = 'pending' | 'submitted' | 'graded';

type AssignmentItem = {
  id: string;
  title: string;
  subtitle: string;
  course: string;
  dueLabel: string;
  dueTime?: string;
  grade: number | null;
  maxScore: number | null;
  status: AssignmentStatus;
  icon: ReactNode;
  iconTone: string;
  courseTone: string;
};

type ApiAssignment = {
  course?: {
    code?: string | null;
    lecturer?: {
      fullName?: string | null;
    } | null;
    name?: string | null;
  } | null;
  description?: string | null;
  dueDate?: string | null;
  id: number;
  maxScore?: number | string | null;
  submission?: {
    grade?: number | string | null;
    gradedAt?: string | null;
    id?: number | null;
    status?: string | null;
    submittedAt?: string | null;
  } | null;
  title: string;
};

const assignmentVisualTones = [
  { iconTone: 'bg-[#ede3ff] text-[#6d38de]', courseTone: 'bg-[#ead8ff] text-[#7a5a9c]' },
  { iconTone: 'bg-[#eae8ff] text-[#4f46e5]', courseTone: 'bg-[#dce9ff] text-[#5673a7]' },
  { iconTone: 'bg-[#e6f7ff] text-[#1784c7]', courseTone: 'bg-[#d8efff] text-[#497ea2]' },
  { iconTone: 'bg-[#f8e8ee] text-[#b33763]', courseTone: 'bg-[#f1e5ff] text-[#8d6ea8]' },
];

const filterTabs: { label: string; value: AssignmentFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
];

function ClipboardGlowIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-28 w-28 text-white/15" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
      <rect x="18" y="16" width="28" height="36" rx="6" />
      <path d="M25 16.5h14v7H25zM25 31h14M25 39h9" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="45" cy="20" r="3" fill="currentColor" stroke="none" className="text-white/20" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5 14.35 8l5.65 2.35-5.65 2.35L12 18.5l-2.35-5.8L4 10.35 9.65 8 12 2.5Zm7.25 12.25 1.03 2.22 2.22 1.03-2.22 1.03-1.03 2.22-1.03-2.22L16 18l2.22-1.03 1.03-2.22Z" />
    </svg>
  );
}

function AssignmentDocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M7.5 3.5h6l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5h.5Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 3.5V8h4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 12h7M8.5 15.5h7" strokeLinecap="round" />
    </svg>
  );
}

const formatDueParts = (dueDate?: string | null) => {
  if (!dueDate) {
    return { dueLabel: 'No due date' };
  }

  const due = new Date(dueDate);

  if (Number.isNaN(due.getTime())) {
    return { dueLabel: 'No due date' };
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const dayDiff = Math.round((dueDay.getTime() - today.getTime()) / 86400000);
  const dueTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(due);

  if (dayDiff === 0) {
    return { dueLabel: 'Today', dueTime };
  }

  if (dayDiff === 1) {
    return { dueLabel: 'Tomorrow', dueTime };
  }

  return {
    dueLabel: new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: due.getFullYear() === now.getFullYear() ? undefined : 'numeric',
    }).format(due),
    dueTime,
  };
};

const normalizeNumber = (value?: number | string | null) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const mapAssignment = (assignment: ApiAssignment, index: number): AssignmentItem => {
  const tones = assignmentVisualTones[index % assignmentVisualTones.length];
  const lecturerName = assignment.course?.lecturer?.fullName?.trim();
  const grade = normalizeNumber(assignment.submission?.grade);
  const maxScore = normalizeNumber(assignment.maxScore);
  const hasSubmission = Boolean(assignment.submission?.submittedAt || assignment.submission?.id);

  return {
    id: String(assignment.id),
    title: assignment.title,
    subtitle: lecturerName ? `Assigned by ${lecturerName}` : 'Assigned by teacher',
    course: assignment.course?.name?.trim() || assignment.course?.code?.trim() || 'Assigned class',
    ...formatDueParts(assignment.dueDate),
    grade,
    maxScore,
    status: grade !== null ? 'graded' : hasSubmission ? 'submitted' : 'pending',
    iconTone: tones.iconTone,
    courseTone: tones.courseTone,
    icon: <AssignmentDocumentIcon />,
  };
};

function AssignmentStatusBadge({ status }: { status: AssignmentStatus }) {
  const styles = {
    pending: 'bg-[#f3efff] text-[#5d34df] ring-1 ring-[#cfc1ff]',
    submitted: 'bg-[#f5f1ff] text-[#7a46e3] ring-1 ring-[#d8c4ff]',
    graded: 'bg-[#ebfff2] text-[#129b58] ring-1 ring-[#b8eccd]',
  };

  const labels = {
    pending: 'Pending',
    submitted: 'Submitted',
    graded: 'Graded',
  };

  return (
    <span className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function AssignmentsDashboard() {
  const [activeFilter, setActiveFilter] = useState<AssignmentFilter>('all');
  const [assignmentItems, setAssignmentItems] = useState<AssignmentItem[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const session = readAuthSession();

    const loadAssignments = async () => {
      if (!session) {
        if (!ignore) {
          setErrorMessage('Sign in again to load assignments from your assigned classes.');
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(`${getApiBaseUrl()}/api/assignments`, {
          headers: buildAuthHeaders(session.accessToken),
        });
        const payload = (await response.json().catch(() => null)) as { assignments?: ApiAssignment[]; message?: string } | null;

        if (!response.ok) {
          throw new Error(payload?.message || 'Unable to load assignments right now.');
        }

        if (!ignore) {
          setAssignmentItems((payload?.assignments ?? []).map(mapAssignment));
          setErrorMessage('');
          setIsLoading(false);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(getAuthRequestErrorMessage(error, 'Unable to load assignments right now.'));
          setIsLoading(false);
        }
      }
    };

    void loadAssignments();

    return () => {
      ignore = true;
    };
  }, []);

  const visibleAssignments = useMemo(() => assignmentItems.filter((assignment) => {
    if (activeFilter === 'all') {
      return true;
    }

    if (activeFilter === 'pending') {
      return assignment.status === 'pending';
    }

    return assignment.status === 'submitted' || assignment.status === 'graded';
  }), [activeFilter, assignmentItems]);

  const pendingCount = assignmentItems.filter((assignment) => assignment.status === 'pending').length;
  const gradedAssignments = assignmentItems.filter((assignment) => assignment.grade !== null && assignment.maxScore && assignment.maxScore > 0);
  const averageScore = gradedAssignments.length > 0
    ? Math.round(
        gradedAssignments.reduce((total, assignment) => total + ((assignment.grade ?? 0) / (assignment.maxScore ?? 1)) * 100, 0) /
          gradedAssignments.length,
      )
    : null;
  const averageScoreWidth = `${Math.min(Math.max(averageScore ?? 0, 0), 100)}%`;
  const dailyTasks = assignmentItems
    .filter((assignment) => assignment.status === 'pending')
    .slice(0, 5)
    .map((assignment) => ({
      id: assignment.id,
      label: assignment.title,
      done: false,
      meta: `${assignment.course} - ${assignment.dueLabel}${assignment.dueTime ? `, ${assignment.dueTime}` : ''}`,
    }));
  const remainingTasks = dailyTasks.filter((task) => !task.done).length;
  const priorityAssignment = assignmentItems.find((assignment) => assignment.status === 'pending') ?? assignmentItems[0] ?? null;

  return (
    <div className="mx-auto max-w-[1120px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-[-0.05em] text-[#2a1842] md:text-[2.75rem]">Assignments</h1>
          <p className="max-w-2xl text-base leading-7 text-[#5f4a79]">
            Keep track of teacher-assigned coursework from your backend classes.
          </p>
        </div>

        <div className="flex items-center rounded-[22px] border border-[#eadcf7] bg-[#f4e8ff] p-1.5 shadow-[0_12px_24px_-28px_rgba(91,46,199,0.95)]">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => startTransition(() => setActiveFilter(tab.value))}
                className={`rounded-[18px] px-6 py-2.5 text-base font-medium transition ${
                  isActive ? 'bg-white text-[#5d34df] shadow-[0_12px_24px_-20px_rgba(93,52,223,0.75)]' : 'text-[#64547e]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_250px_250px]">
        <section className="relative overflow-hidden rounded-[28px] border border-[#e4d4fb] bg-[radial-gradient(circle_at_top_left,#efe2ff_0%,#f7f2ff_48%,#fff9ff_100%)] p-6 shadow-[0_28px_46px_-36px_rgba(95,41,210,0.9)]">
          <div className="relative z-10 flex h-full flex-col justify-between gap-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-[20px] bg-[#e2d0ff] text-[#6d38de] shadow-[0_12px_24px_-18px_rgba(109,56,222,1)]">
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                  <path d="M9 4.5h6M12 3v3M7.5 6.5h9A2.5 2.5 0 0 1 19 9v10a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 19V9a2.5 2.5 0 0 1 2.5-2.5Z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 12h6M9 16h3" strokeLinecap="round" />
                </svg>
              </div>

              <div className="text-right">
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.28em] text-[#8b74b7]">Schedule Outlook</p>
                <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#7b47ed_0%,#5d34df_100%)] px-5 py-2 text-sm font-semibold text-white shadow-[0_18px_26px_-20px_rgba(93,52,223,1)]">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-white/20">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                      <path d="M12 8v4l3 2M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9Z" />
                    </svg>
                  </span>
                  Next 7 Days
                </span>
              </div>
            </div>

            <div className="max-w-md">
              <h2 className="text-3xl font-bold tracking-[-0.05em] text-[#2d1847] md:text-[2.55rem]">
                {isLoading ? '...' : pendingCount} Pending
              </h2>
              <p className="mt-3 text-base leading-7 text-[#5f4a79]">
                {priorityAssignment
                  ? `Approaching deadlines require focus. Your priority is "${priorityAssignment.title}".`
                  : 'Assignments will appear here when teachers publish work for your classes.'}
              </p>
            </div>
          </div>

          <div className="absolute bottom-2 right-4">
            <ClipboardGlowIcon />
          </div>
        </section>

        <section className="rounded-[28px] border border-[#eadcf7] bg-white px-6 py-6 shadow-[0_24px_40px_-34px_rgba(95,41,210,0.65)]">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-[#6d5b87]">Average Score</p>
          <p className="mt-4 text-[2.5rem] font-bold tracking-[-0.06em] text-[#4f46e5]">
            {averageScore === null ? '--' : `${averageScore}%`}
          </p>
          <div className="mt-5 h-2.5 rounded-full bg-[#ece4fb]">
            <div
              className="h-2.5 rounded-full bg-[linear-gradient(90deg,#6f3de4_0%,#4d56e7_100%)] shadow-[0_8px_16px_-12px_rgba(79,70,229,0.9)]"
              style={{ width: averageScoreWidth }}
            />
          </div>
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#9c8eb2]">
            {gradedAssignments.length > 0 ? `${gradedAssignments.length} graded submission${gradedAssignments.length === 1 ? '' : 's'}` : 'No grades yet'}
          </p>
        </section>

        <section className="rounded-[28px] border border-[#eadcf7] bg-white px-6 py-6 shadow-[0_24px_40px_-34px_rgba(95,41,210,0.65)]">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-[#6d5b87]">Completion</p>
          <p className="mt-4 text-[2.35rem] font-bold tracking-[-0.06em] text-[#a52f58]">
            {assignmentItems.length - pendingCount}/{assignmentItems.length}
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-lg font-semibold text-[#b3345f]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m6 15 4-4 3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 9h-4V5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Backend synced
          </p>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="overflow-hidden rounded-[32px] border border-[#eadcf7] bg-white shadow-[0_28px_46px_-38px_rgba(95,41,210,0.75)]">
          <div className="hidden grid-cols-[minmax(0,2.2fr)_1fr_1fr_auto] gap-5 border-b border-[#f1e8fb] bg-[#fdfaff] px-10 py-6 md:grid">
            <span className="text-[0.78rem] font-semibold uppercase tracking-[0.28em] text-[#8f80aa]">Assignment Title</span>
            <span className="text-[0.78rem] font-semibold uppercase tracking-[0.28em] text-[#8f80aa]">Course</span>
            <span className="text-[0.78rem] font-semibold uppercase tracking-[0.28em] text-[#8f80aa]">Due Date</span>
            <span className="text-[0.78rem] font-semibold uppercase tracking-[0.28em] text-[#8f80aa]">Status</span>
          </div>

          <div className="divide-y divide-[#f2eafc]">
            {isLoading ? (
              <div className="px-6 py-8 text-sm font-semibold text-[#6d38de] md:px-10">
                Loading assignments from your assigned classes...
              </div>
            ) : null}

            {!isLoading && errorMessage ? (
              <div className="px-6 py-8 md:px-10">
                <p className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {errorMessage}
                </p>
              </div>
            ) : null}

            {!isLoading && !errorMessage && visibleAssignments.length === 0 ? (
              <div className="px-6 py-8 text-sm font-semibold text-[#5f4a79] md:px-10">
                No assignments found for this filter. Teacher-assigned classwork will show here after it is created.
              </div>
            ) : null}

            {visibleAssignments.map((assignment) => (
              <article key={assignment.id} className="px-6 py-6 md:px-10 md:py-9">
                <div className="grid gap-6 md:grid-cols-[minmax(0,2.2fr)_1fr_1fr_auto] md:items-center">
                  <div className="flex items-start gap-5">
                    <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-[18px] ${assignment.iconTone}`}>
                      {assignment.icon}
                    </div>
                    <div>
                      <h3 className="text-[1.1rem] font-semibold leading-9 text-[#28163f] md:text-[1.2rem]">{assignment.title}</h3>
                      <p className="text-[1rem] text-[#6b5a88]">{assignment.subtitle}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#9a8cad] md:hidden">Course</p>
                    <span className={`inline-flex rounded-xl px-3 py-2 text-sm font-medium ${assignment.courseTone}`}>
                      {assignment.course}
                    </span>
                  </div>

                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#9a8cad] md:hidden">Due Date</p>
                    <p className={`text-[1.05rem] font-semibold ${assignment.status === 'pending' ? 'text-[#c92a49]' : 'text-[#5e4a79]'}`}>
                      {assignment.dueLabel}
                    </p>
                    {assignment.dueTime ? <p className="mt-1 text-sm text-[#c92a49]">{assignment.dueTime}</p> : null}
                  </div>

                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#9a8cad] md:hidden">Status</p>
                    <AssignmentStatusBadge status={assignment.status} />
                    <Link
                      href={`/assignment?id=${encodeURIComponent(assignment.id)}`}
                      className="mt-3 inline-flex rounded-full bg-[#6d38de] px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_28px_-24px_rgba(93,52,223,1)] transition hover:bg-[#5d2fd0]"
                    >
                      {assignment.status === 'pending' ? 'Check / Submit' : 'View submission'}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-[30px] border border-[#eadcf7] bg-white p-7 shadow-[0_26px_42px_-36px_rgba(95,41,210,0.65)]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-[1.7rem] font-bold tracking-[0.02em] text-[#28163f]">Daily Tasks</h2>
              <span className="rounded-full bg-[#efe3ff] px-3 py-1.5 text-sm font-semibold text-[#6d38de]">
                {remainingTasks} left
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {dailyTasks.length > 0 ? dailyTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex w-full items-center gap-4 text-left"
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition ${
                      task.done
                        ? 'border-[#6d38de] bg-[#6d38de] text-white'
                        : 'border-[#cdbbe8] bg-white text-transparent'
                    }`}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                      <path d="m6.5 12 3.2 3.2L17.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[1.05rem] text-[#4f3c6c]">{task.label}</span>
                    <span className="mt-1 block truncate text-xs font-medium text-[#9b8cb3]">{task.meta}</span>
                  </span>
                </div>
              )) : (
                <p className="rounded-[16px] bg-[#faf7ff] px-4 py-3 text-sm font-medium text-[#6b5a88]">
                  No pending backend tasks right now.
                </p>
              )}
            </div>

            <button className="mt-8 w-full rounded-[18px] border-2 border-dashed border-[#e6d7f8] px-5 py-4 text-lg font-semibold text-[#9b8cb3]" disabled>
              Synced From Backend
            </button>
          </section>

          <section className="rounded-[30px] bg-[linear-gradient(135deg,#6f3ce5_0%,#4f46e5_100%)] p-7 text-white shadow-[0_28px_46px_-30px_rgba(79,70,229,0.9)]">
            <div className="flex items-start gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-[18px] bg-white/14">
                <SparkIcon />
              </div>
              <div>
                <h2 className="text-[1.9rem] font-bold tracking-[-0.03em]">AI Planner</h2>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.22em] text-white/70">Analysis Ready</p>
              </div>
            </div>

            <p className="mt-7 text-[1.02rem] leading-8 text-white/90">
              {priorityAssignment
                ? `"${priorityAssignment.title}" is due ${priorityAssignment.dueLabel.toLowerCase()}. I recommend a focused study block to stay ahead.`
                : 'Once a teacher assigns classwork, I can turn the nearest deadline into a focused study plan.'}
            </p>

            <button className="mt-8 w-full rounded-[18px] bg-white px-5 py-4 text-base font-semibold uppercase tracking-[0.18em] text-[#5d34df] transition hover:bg-[#f7f2ff]">
              View Study Plan
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
