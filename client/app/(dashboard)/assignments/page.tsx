'use client';

import type { ReactNode } from 'react';
import { startTransition, useState } from 'react';

type AssignmentFilter = 'all' | 'pending' | 'completed';
type AssignmentStatus = 'pending' | 'submitted' | 'graded';

type AssignmentItem = {
  id: string;
  title: string;
  subtitle: string;
  course: string;
  dueLabel: string;
  dueTime?: string;
  status: AssignmentStatus;
  icon: ReactNode;
  iconTone: string;
  courseTone: string;
};

type DailyTask = {
  id: string;
  label: string;
  done: boolean;
};

const assignmentItems: AssignmentItem[] = [
  {
    id: 'neural-networks',
    title: 'Neural Networks Research',
    subtitle: 'Module 4: Deep Learning',
    course: 'Computer Science',
    dueLabel: 'Tomorrow',
    dueTime: '11:59 PM',
    status: 'pending',
    iconTone: 'bg-[#ede3ff] text-[#6d38de]',
    courseTone: 'bg-[#ead8ff] text-[#7a5a9c]',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <path d="M7.5 3.5h6l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5h.5Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.5 3.5V8h4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.5 12h7M8.5 15.5h7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'economic-theory',
    title: 'Economic Theory Essay',
    subtitle: 'Macroeconomics 101',
    course: 'Economics',
    dueLabel: 'Oct 12, 2023',
    status: 'graded',
    iconTone: 'bg-[#f8e8ee] text-[#b33763]',
    courseTone: 'bg-[#ead8ff] text-[#7a5a9c]',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <path d="m4 4 16 16M15.5 4H20v4.5M8.5 20H4v-4.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 9h5l-5 5h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'chemistry-lab',
    title: 'Lab Report: Chemistry',
    subtitle: 'Organic Lab B',
    course: 'Organic Chemistry',
    dueLabel: 'Oct 14, 2023',
    status: 'submitted',
    iconTone: 'bg-[#eae8ff] text-[#4f46e5]',
    courseTone: 'bg-[#ead8ff] text-[#7a5a9c]',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <path d="M10 3v6.5L5.5 18A2.5 2.5 0 0 0 7.7 21h8.6a2.5 2.5 0 0 0 2.2-3L14 9.5V3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.5 14h7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'ux-audit',
    title: 'UX Accessibility Audit',
    subtitle: 'Human Computer Interaction',
    course: 'Design Systems',
    dueLabel: 'Friday',
    dueTime: '6:00 PM',
    status: 'pending',
    iconTone: 'bg-[#e8efff] text-[#3f5de0]',
    courseTone: 'bg-[#dce9ff] text-[#5673a7]',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <circle cx="12" cy="12" r="3.5" />
        <path d="M19.4 15a8 8 0 0 0 0-6M4.6 9a8 8 0 0 0 0 6M16.8 18.5a8 8 0 0 0 2.6-2.3M4.6 15a8 8 0 0 0 2.6 2.3M7.2 5.5A8 8 0 0 0 4.6 8M19.4 8a8 8 0 0 0-2.6-2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'ethics-reflection',
    title: 'AI Ethics Reflection',
    subtitle: 'Responsible AI Seminar',
    course: 'Philosophy',
    dueLabel: 'Oct 18, 2023',
    status: 'graded',
    iconTone: 'bg-[#f3ebff] text-[#8848e8]',
    courseTone: 'bg-[#f1e5ff] text-[#8d6ea8]',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <path d="M7 4h10a2 2 0 0 1 2 2v13l-4-2-4 2-4-2-4 2V6a2 2 0 0 1 2-2h2Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 8h6M9 12h6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'data-viz',
    title: 'Data Visualization Storyboard',
    subtitle: 'Applied Analytics',
    course: 'Data Science',
    dueLabel: 'Next Monday',
    dueTime: '9:00 AM',
    status: 'pending',
    iconTone: 'bg-[#e6f7ff] text-[#1784c7]',
    courseTone: 'bg-[#d8efff] text-[#497ea2]',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <path d="M5 19V9m7 10V5m7 14v-7" strokeLinecap="round" />
        <path d="M3 19h18" strokeLinecap="round" />
      </svg>
    ),
  },
];

const filterTabs: { label: string; value: AssignmentFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
];

const initialDailyTasks: DailyTask[] = [
  { id: 'review-lab', label: 'Review Lab Safety', done: true },
  { id: 'draft-neural', label: 'Start Neural Net Draft', done: false },
  { id: 'read-macro', label: 'Read Macro Ch. 5', done: false },
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
  const [dailyTasks, setDailyTasks] = useState(initialDailyTasks);

  const visibleAssignments = assignmentItems.filter((assignment) => {
    if (activeFilter === 'all') {
      return true;
    }

    if (activeFilter === 'pending') {
      return assignment.status === 'pending';
    }

    return assignment.status === 'submitted' || assignment.status === 'graded';
  });

  const pendingCount = assignmentItems.filter((assignment) => assignment.status === 'pending').length;
  const remainingTasks = dailyTasks.filter((task) => !task.done).length;

  return (
    <div className="mx-auto max-w-[1120px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-[-0.05em] text-[#2a1842] md:text-[2.75rem]">Assignments</h1>
          <p className="max-w-2xl text-base leading-7 text-[#5f4a79]">
            Keep track of your academic progress and deadlines.
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
              <h2 className="text-3xl font-bold tracking-[-0.05em] text-[#2d1847] md:text-[2.55rem]">{pendingCount} Pending</h2>
              <p className="mt-3 text-base leading-7 text-[#5f4a79]">
                Approaching deadlines require focus. Your priority is &quot;Neural Networks&quot;.
              </p>
            </div>
          </div>

          <div className="absolute bottom-2 right-4">
            <ClipboardGlowIcon />
          </div>
        </section>

        <section className="rounded-[28px] border border-[#eadcf7] bg-white px-6 py-6 shadow-[0_24px_40px_-34px_rgba(95,41,210,0.65)]">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-[#6d5b87]">Average Score</p>
          <p className="mt-4 text-[2.5rem] font-bold tracking-[-0.06em] text-[#4f46e5]">92%</p>
          <div className="mt-5 h-2.5 rounded-full bg-[#ece4fb]">
            <div className="h-2.5 w-[84%] rounded-full bg-[linear-gradient(90deg,#6f3de4_0%,#4d56e7_100%)] shadow-[0_8px_16px_-12px_rgba(79,70,229,0.9)]" />
          </div>
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#9c8eb2]">Top 5% of Class</p>
        </section>

        <section className="rounded-[28px] border border-[#eadcf7] bg-white px-6 py-6 shadow-[0_24px_40px_-34px_rgba(95,41,210,0.65)]">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-[#6d5b87]">Completion</p>
          <p className="mt-4 text-[2.35rem] font-bold tracking-[-0.06em] text-[#a52f58]">18/20</p>
          <p className="mt-4 inline-flex items-center gap-2 text-lg font-semibold text-[#b3345f]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m6 15 4-4 3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 9h-4V5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            +2 from last month
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
              {dailyTasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() =>
                    setDailyTasks((currentTasks) =>
                      currentTasks.map((currentTask) =>
                        currentTask.id === task.id ? { ...currentTask, done: !currentTask.done } : currentTask
                      )
                    )
                  }
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
                  <span className={`text-[1.05rem] ${task.done ? 'text-[#a495be] line-through' : 'text-[#4f3c6c]'}`}>
                    {task.label}
                  </span>
                </button>
              ))}
            </div>

            <button className="mt-8 w-full rounded-[18px] border-2 border-dashed border-[#e6d7f8] px-5 py-4 text-lg font-semibold text-[#9b8cb3] transition hover:border-[#d0baf3] hover:text-[#6d38de]">
              + Add Task
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
              &quot;Neural Networks&quot; research is due tomorrow. I recommend a 2-hour deep work session starting at 7:00 PM tonight to stay ahead.
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
