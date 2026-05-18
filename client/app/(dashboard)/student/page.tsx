'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useStoredAuthUser } from '@/lib/auth';

const courses = [
  {
    name: 'Introduction to Human-Computer Interaction',
    code: 'CS 2204',
    progress: 68,
    lessons: '11/16 lessons',
    next: 'Next: Assignment Brief · Tue 9:00 AM',
    instructor: 'Dr. Sarah Mitchell',
  },
  {
    name: 'Data Structures & Algorithms',
    code: 'CS 2108',
    progress: 82,
    lessons: '14/17 lessons',
    next: 'Next: Live Coding Session · Wed 1:30 PM',
    instructor: 'Prof. James Chen',
  },
  {
    name: 'Database Systems',
    code: 'CS 2302',
    progress: 51,
    lessons: '8/16 lessons',
    next: 'Next: SQL Lab Submission · Thu 10:00 AM',
    instructor: 'Dr. Emily Rodriguez',
  },
  {
    name: 'Software Engineering Studio',
    code: 'SE 2401',
    progress: 74,
    lessons: '13/18 lessons',
    next: 'Next: Sprint Review · Fri 3:00 PM',
    instructor: 'Prof. Michael Park',
  },
];

const focusItems = [
  { title: 'HCI Research Reflection', due: 'Due in 4h', date: 'Today, 2:30 PM', action: 'Start Now' },
  { title: 'UI Prototype Feedback', due: 'Due tomorrow', date: 'Tomorrow, 10:00 AM', action: 'Continue' },
];

const velocityStats = [
  { label: 'This Week', value: '12.5h', change: '+2.3h', positive: true },
  { label: 'Avg. Daily', value: '1.8h', change: '+0.2h', positive: true },
];

function CourseCardPattern({ variant }: { variant: number }) {
  const patterns = [
    // Dot pattern
    <div key="dots" className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1.5px, transparent 1.5px)', backgroundSize: '12px 12px' }} />,
    // Diagonal stripes
    <div key="stripes" className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #ec4899 0, #ec4899 2px, transparent 2px, transparent 12px)' }} />,
    // Circles
    <div key="circles" className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #8b5cf6 3px, transparent 3px)', backgroundSize: '20px 20px', backgroundPosition: '0 0' }} />,
    // Horizontal lines
    <div key="lines" className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #14b8a6 0, #14b8a6 1px, transparent 1px, transparent 8px)' }} />,
  ];
  return patterns[variant] || patterns[0];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LegacyStudentDashboard() {
  return (
    <div className="mx-auto max-w-[1300px] space-y-6 rounded-[30px] bg-[#f4eefb] p-4 md:p-6">
      <header className="rounded-[24px] border border-[#e8def9] bg-[#fbf8ff] px-4 py-4 shadow-[0_10px_30px_-24px_rgba(84,41,175,0.35)] md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label
            htmlFor="student-dashboard-search"
            className="flex w-full max-w-xl items-center gap-2 rounded-2xl border border-[#e5d9fb] bg-white px-4 py-3 text-sm text-[#8a7ba8]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              id="student-dashboard-search"
              type="search"
              placeholder="Search courses, activities, assignments..."
              className="w-full bg-transparent text-[#352747] outline-none placeholder:text-[#9d8eb9]"
            />
          </label>

          <div className="flex items-center gap-2 self-end lg:self-auto">
            <button
              aria-label="Notifications"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-[#dfd2f4] bg-white text-[#75658f] transition hover:text-[#3d2e57]"
            >
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#8B5CF6]" />
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M12 2a6 6 0 0 0-6 6v3.35c0 .75-.21 1.48-.62 2.1L4 15.5h16l-1.38-2.05a3.86 3.86 0 0 1-.62-2.1V8a6 6 0 0 0-6-6Zm0 20a3 3 0 0 0 2.82-2H9.18A3 3 0 0 0 12 22Z" />
              </svg>
            </button>
            <button
              aria-label="Messages"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#dfd2f4] bg-white text-[#75658f] transition hover:text-[#3d2e57]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16h-8L5 20v-4A2.5 2.5 0 0 1 4 13.5v-7Z" />
              </svg>
            </button>
            <div className="flex items-center gap-2 rounded-full border border-[#dfd2f4] bg-white p-1 pr-3">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[#ede3ff] text-[11px] font-semibold text-[#5d32c8]">AJ</div>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-[#302140]">Alex Johnson</p>
                <p className="text-[10px] text-[#8d7da9]">Student</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-6">
          <div className="rounded-[24px] border border-[#e9defa] bg-[#fbf8ff] p-5 md:p-6">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-3xl font-bold text-[#2f2143]">My Courses</h1>
                <p className="mt-1 text-sm text-[#8f80a9]">You are enrolled in 4 courses this semester</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {courses.map((course, index) => (
                <article
                  key={course.code}
                  className="group relative overflow-hidden rounded-2xl border border-[#eadff9] bg-white shadow-[0_12px_30px_-26px_rgba(74,29,146,0.4)]"
                >
                  {/* Colored header with pattern */}
                  <div className={`relative h-24 p-4 ${index === 0 ? 'bg-gradient-to-br from-indigo-500 to-indigo-600' : index === 1 ? 'bg-gradient-to-br from-pink-500 to-pink-600' : index === 2 ? 'bg-gradient-to-br from-violet-500 to-violet-600' : 'bg-gradient-to-br from-teal-500 to-teal-600'}`}>
                    <CourseCardPattern variant={index} />
                    <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                      In Progress
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/80">{course.code}</p>
                  </div>

                  {/* White lower area */}
                  <div className="p-4">
                    <h2 className="mb-2 text-base font-semibold leading-snug text-[#312045]">{course.name}</h2>
                    <div className="mb-3 flex items-center gap-2 text-xs text-[#8f80a9]">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      {course.instructor}
                    </div>

                    <div className="h-1.5 rounded-full bg-[#eee6fb]">
                      <div
                        className="h-1.5 rounded-full bg-[#8B5CF6]"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs">
                      <p className="font-medium text-[#6a5b83]">{course.lessons}</p>
                      <p className="font-semibold text-[#8B5CF6]">{course.progress}%</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[24px] border border-[#e8dcfa] bg-white p-5 shadow-[0_14px_30px_-28px_rgba(66,25,138,0.55)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#2f2143]">Priority Focus</h3>
            </div>

            <div className="space-y-3">
              {focusItems.map((item) => (
                <article key={item.title} className="rounded-2xl border border-[#eee5fb] bg-[#fbf9ff] p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-[#332348]">{item.title}</p>
                      <p className="mt-1 text-xs text-[#8f80a9]">{item.date}</p>
                    </div>
                    <span className="rounded-full bg-[#fff4e6] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#d97706]">
                      Due Soon
                    </span>
                  </div>
                  <button className="mt-3 w-full rounded-xl bg-[#8B5CF6] py-2 text-xs font-semibold text-white">
                    {item.action}
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e8dcfa] bg-white p-5 shadow-[0_14px_30px_-28px_rgba(66,25,138,0.55)]">
            <h3 className="mb-4 text-lg font-semibold text-[#2f2143]">Learning Velocity</h3>
            <div className="space-y-4">
              {velocityStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between rounded-xl bg-[#f8f6fc] p-3">
                  <span className="text-sm text-[#6a5b83]">{stat.label}</span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-[#2f2143]">{stat.value}</span>
                    <span className={`ml-2 text-xs font-semibold ${stat.positive ? 'text-[#059669]' : 'text-[#dc2626]'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <button
        aria-label="Create"
        className="fixed bottom-8 right-8 grid h-14 w-14 place-items-center rounded-full bg-[#8B5CF6] text-white shadow-[0_18px_30px_-16px_rgba(108,43,217,0.95)] transition hover:scale-105"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

type DashboardCourse = {
  title: string;
  instructor: string;
  progress: number;
  progressTone: string;
  headerTone: string;
  watermark: React.ReactNode;
  pattern: React.ReactNode;
};

const dashboardCourses: DashboardCourse[] = [
  {
    title: 'Machine Learning',
    instructor: 'Dr. Sarah Chen',
    progress: 64,
    progressTone: 'bg-[#6d38de]',
    headerTone: 'bg-[linear-gradient(135deg,#6e2fdf_0%,#5c24d4_100%)]',
    watermark: (
      <svg viewBox="0 0 64 64" className="h-16 w-16 text-white/28" fill="currentColor" aria-hidden="true">
        <path d="M32 7c-8.28 0-15 6.72-15 15 0 5.42 2.88 10.17 7.2 12.8L22 55h20l-2.19-14.2C44.12 38.17 47 33.42 47 28c0-8.28-6.72-15-15-15Zm-7 11a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm14 0a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm-7 8.5a7.5 7.5 0 0 1 7.47 6.84H24.53A7.5 7.5 0 0 1 32 26.5Z" />
        <path d="M28 55h8v4h-8z" />
      </svg>
    ),
    pattern: (
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.55) 1.7px, transparent 1.7px)',
          backgroundSize: '50px 50px',
          backgroundPosition: '0 0, 25px 25px',
        }}
      />
    ),
  },
  {
    title: 'Python Programming',
    instructor: 'Prof. Alex Rivera',
    progress: 82,
    progressTone: 'bg-[#4e53e4]',
    headerTone: 'bg-[linear-gradient(135deg,#5b4cff_0%,#4d43df_100%)]',
    watermark: (
      <svg viewBox="0 0 64 64" className="h-16 w-16 text-white/28" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
        <path d="M14 20 32 6l18 14-18 14-18-14Z" />
        <path d="m14 44 18-14 18 14-18 14-18-14Z" />
      </svg>
    ),
    pattern: (
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.22) 0, rgba(255,255,255,0.22) 9px, transparent 9px, transparent 20px)',
        }}
      />
    ),
  },
  {
    title: 'Japanese I',
    instructor: 'Yuki Tanaka Sensei',
    progress: 25,
    progressTone: 'bg-[#b62d5a]',
    headerTone: 'bg-[linear-gradient(135deg,#b12555_0%,#94204a_100%)]',
    watermark: (
      <svg viewBox="0 0 64 64" className="h-16 w-16 text-white/28" fill="currentColor" aria-hidden="true">
        <path d="M28 11h6v7h15v5H37.6a31.2 31.2 0 0 1-6.95 18.23A42.3 42.3 0 0 1 41 50.8L36.85 55a47.87 47.87 0 0 0-9.9-9.04A44.4 44.4 0 0 1 15 55l-3-5.08a37.5 37.5 0 0 0 11.04-7.76A31.78 31.78 0 0 1 17.3 30H23a25.6 25.6 0 0 0 3.9 8.23A24.94 24.94 0 0 0 31.68 23H13v-5h15V11Zm11 19h12v5H39z" />
      </svg>
    ),
    pattern: (
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.26) 0, rgba(255,255,255,0.26) 22px, transparent 22px)',
          backgroundSize: '74px 74px',
          backgroundPosition: '10px 10px',
        }}
      />
    ),
  },
  {
    title: 'Cryptography',
    instructor: 'Dr. Alan Turing Jr.',
    progress: 45,
    progressTone: 'bg-[#6d38de]',
    headerTone: 'bg-[linear-gradient(135deg,#9b6cff_0%,#6e2fdf_100%)]',
    watermark: (
      <svg viewBox="0 0 64 64" className="h-16 w-16 text-white/30" fill="currentColor" aria-hidden="true">
        <path d="M20 29v-6c0-6.63 5.37-12 12-12s12 5.37 12 12v6h2c3.31 0 6 2.69 6 6v16c0 3.31-2.69 6-6 6H18c-3.31 0-6-2.69-6-6V35c0-3.31 2.69-6 6-6h2Zm6 0h12v-6a6 6 0 1 0-12 0v6Zm6 10a5 5 0 0 0-2 9.58V53h4v-4.42A5 5 0 0 0 32 39Z" />
      </svg>
    ),
    pattern: (
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.28) 0, rgba(255,255,255,0.28) 1px, transparent 1px, transparent 20px)',
        }}
      />
    ),
  },
  {
    title: 'Professional Development',
    instructor: 'Prof. SokLeng',
    progress: 82,
    progressTone: 'bg-[#4e53e4]',
    headerTone: 'bg-[linear-gradient(135deg,#514bff_0%,#453dde_100%)]',
    watermark: (
      <svg viewBox="0 0 64 64" className="h-16 w-16 text-white/28" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
        <rect x="12" y="20" width="40" height="26" rx="5" />
        <path d="M24 20v-6h16v6M12 31h40" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    pattern: (
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.18) 0, rgba(255,255,255,0.18) 10px, transparent 10px, transparent 24px)',
        }}
      />
    ),
  },
  {
    title: 'Smart Phone Application Development',
    instructor: 'Dr. Rapi',
    progress: 45,
    progressTone: 'bg-[#944de6]',
    headerTone: 'bg-[linear-gradient(135deg,#d65df0_0%,#8e48e6_100%)]',
    watermark: (
      <svg viewBox="0 0 64 64" className="h-16 w-16 text-white/28" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
        <rect x="18" y="10" width="28" height="44" rx="6" />
        <path d="M26 17h12M29 46h6" strokeLinecap="round" />
      </svg>
    ),
    pattern: (
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: 'radial-gradient(circle at 18% 22%, rgba(255,255,255,0.28) 0, rgba(255,255,255,0.28) 3px, transparent 3px)',
          backgroundSize: '24px 24px',
        }}
      />
    ),
  },
  {
    title: 'Project Management',
    instructor: 'Dr. Rapi',
    progress: 58,
    progressTone: 'bg-[#5896ec]',
    headerTone: 'bg-[linear-gradient(135deg,#69a3f2_0%,#5577ea_100%)]',
    watermark: (
      <svg viewBox="0 0 64 64" className="h-16 w-16 text-white/28" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
        <path d="M14 48h36M18 44V24m10 20V16m10 28V28m10 16V20" strokeLinecap="round" />
        <circle cx="18" cy="20" r="4" />
        <circle cx="28" cy="12" r="4" />
        <circle cx="38" cy="24" r="4" />
        <circle cx="48" cy="16" r="4" />
      </svg>
    ),
    pattern: (
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.22) 0, rgba(255,255,255,0.22) 1px, transparent 1px, transparent 16px)',
        }}
      />
    ),
  },
  {
    title: 'Software Engineering',
    instructor: 'Dr. Rapi',
    progress: 71,
    progressTone: 'bg-[#cf49b5]',
    headerTone: 'bg-[linear-gradient(135deg,#f06bad_0%,#9247e7_100%)]',
    watermark: (
      <svg viewBox="0 0 64 64" className="h-16 w-16 text-white/28" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
        <path d="m24 20-10 12 10 12M40 20l10 12-10 12M36 14 28 50" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    pattern: (
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.18) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.18) 75%, transparent 75%, transparent)',
          backgroundSize: '34px 34px',
        }}
      />
    ),
  },
  {
    title: 'Mathematic I',
    instructor: 'Prof. SokLeng',
    progress: 83,
    progressTone: 'bg-[#5c4fe5]',
    headerTone: 'bg-[linear-gradient(135deg,#4b53ea_0%,#6140e1_100%)]',
    watermark: (
      <svg viewBox="0 0 64 64" className="h-16 w-16 text-white/28" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
        <path d="M20 16h24M20 48h24M20 16c0 10 24 10 24 20s-24 10-24 20" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    pattern: (
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.2) 0, rgba(255,255,255,0.2) 9px, transparent 9px, transparent 22px)',
        }}
      />
    ),
  },
  {
    title: 'Mathematic II',
    instructor: 'Dr. Rapi',
    progress: 45,
    progressTone: 'bg-[#7a46e3]',
    headerTone: 'bg-[linear-gradient(135deg,#7d5dea_0%,#6334dd_100%)]',
    watermark: (
      <svg viewBox="0 0 64 64" className="h-16 w-16 text-white/28" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
        <path d="M20 16h24M20 48h24M20 16c0 10 24 10 24 20s-24 10-24 20" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    pattern: (
      <div
        className="absolute inset-0 opacity-24"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.24) 0, rgba(255,255,255,0.24) 2px, transparent 2px)',
          backgroundSize: '28px 28px',
        }}
      />
    ),
  },
  {
    title: 'History of Ideas',
    instructor: 'Dr. Rapi',
    progress: 45,
    progressTone: 'bg-[#54617f]',
    headerTone: 'bg-[linear-gradient(135deg,#65748f_0%,#3f4c66_100%)]',
    watermark: (
      <svg viewBox="0 0 64 64" className="h-16 w-16 text-white/28" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
        <path d="M18 16h22a8 8 0 0 1 8 8v24H26a8 8 0 0 0-8 8V16Zm0 0h22a8 8 0 0 1 8 8M26 48h22" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    pattern: (
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.18) 0, rgba(255,255,255,0.02) 100%)',
        }}
      />
    ),
  },
];

const dashboardFocusCards = [
  {
    badge: 'High Priority',
    deadline: 'Due in 2 days',
    title: 'Deep Learning Research Project',
    description: 'Submission: final draft and codebase review package.',
    action: 'Start Study Session',
    accent: 'border-l-[#6d38de]',
    footer: 'Codebase and report',
  },
  {
    badge: 'April 14, 2026',
    deadline: 'Campus',
    title: 'Mathematics',
    description: 'Location: Kit Campus. Review calculus practice set before class.',
    action: 'Start Study Session',
    accent: 'border-l-[#4e53e4]',
    footer: 'Preparation block',
  },
  {
    badge: 'April 17, 2026',
    deadline: 'Campus',
    title: 'Machine Learning',
    description: 'Location: Kit Campus. Revisit the classification notes and project tasks.',
    action: 'Start Study Session',
    accent: 'border-l-[#b62d5a]',
    footer: 'Lab recap',
  },
];

const dashboardFooterLinks = ['Privacy Policy', 'Terms of Service', 'Institutional Access', 'Contact Support'] as const;

const overviewMetrics = [
  {
    label: 'Current GPA',
    value: '3.82',
    note: '+0.04 from last term',
    noteTone: 'text-[#0f9d69]',
    iconTone: 'bg-[#efe4ff] text-[#5c2ddd]',
  },
  {
    label: 'Class Rank',
    value: 'Top 5%',
    note: 'Ranked #12 of 248 students',
    noteTone: 'text-[#5f4a79]',
    iconTone: 'bg-[#f8e7ff] text-[#8643e6]',
  },
] as const;

function DashboardUserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#6d38de]" fill="currentColor" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.42 0-8 2.01-8 4.5V20h16v-1.5c0-2.49-3.58-4.5-8-4.5Z" />
    </svg>
  );
}

function DashboardGpaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M7 4h10a2 2 0 0 1 2 2v13l-4-2-4 2-4-2-4 2V6a2 2 0 0 1 2-2h2Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 8h4M9 11h6" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.25" />
    </svg>
  );
}

function DashboardRankIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="m12 2.5 2.42 4.91 5.42.79-3.92 3.82.93 5.4L12 14.84l-4.85 2.58.93-5.4L4.16 8.2l5.42-.79L12 2.5Zm-4.5 16.25A2.25 2.25 0 0 0 5.25 21h13.5a2.25 2.25 0 0 0-2.25-2.25h-9Z" />
    </svg>
  );
}

function DashboardIdeaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M9.5 17.5h5M10 21h4" strokeLinecap="round" />
      <path d="M8.2 14.3A6.5 6.5 0 1 1 15.8 14.3c-.9.86-1.55 1.88-1.9 2.95h-3.8c-.35-1.07-1-2.09-1.9-2.95Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashboardArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashboardArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M19 12H5m7-7-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StudentCourseCard({
  course,
  compact = false,
}: {
  course: DashboardCourse;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/material?course=${encodeURIComponent(course.title)}`}
      className="group block overflow-hidden rounded-[22px] border border-[#eadcf7] bg-white shadow-[0_20px_34px_-30px_rgba(82,36,163,0.65)] transition hover:-translate-y-0.5 hover:border-[#d8c3fb] hover:shadow-[0_24px_38px_-30px_rgba(82,36,163,0.82)]"
      aria-label={`Open materials for ${course.title}`}
    >
      <article>
        <div
          className={`relative flex flex-col justify-between overflow-hidden px-7 py-7 text-white ${
            compact ? 'min-h-[126px]' : 'min-h-[118px]'
          } ${course.headerTone}`}
        >
          {course.pattern}
          <div className="relative z-10">
            <span className="inline-flex rounded-full bg-white/18 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
              In Progress
            </span>
          </div>

          <div className="relative z-10 flex items-end justify-between gap-4">
            <h2 className={`max-w-[180px] font-bold leading-tight tracking-[-0.04em] ${compact ? 'text-[1.18rem]' : 'text-[1.28rem]'}`}>
              {course.title}
            </h2>
            <div className="shrink-0 scale-[0.72] transition duration-200 group-hover:scale-[0.78]">{course.watermark}</div>
          </div>
        </div>

        <div className={`space-y-3.5 ${compact ? 'px-4 py-3.5' : 'px-4 py-4'}`}>
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-[#f3e9ff]">
              <DashboardUserIcon />
            </div>
            <p className="text-[0.82rem] text-[#523b72]">{course.instructor}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[0.64rem] font-semibold uppercase tracking-[0.12em]">
              <span className="text-[#4d2dde]">Course Progress</span>
              <span className="text-[#2f1e47]">{course.progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#f0defd]">
              <div
                className={`h-1.5 rounded-full shadow-[0_6px_10px_-8px_rgba(60,20,130,0.75)] ${course.progressTone}`}
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

function OverviewDashboardView() {
  const authUser = useStoredAuthUser();
  const displayName = authUser?.fullName?.trim() || 'AcaFlow Student';

  return (
    <div className="space-y-4 pt-2">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_248px]">
        <section className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-start">
          <div className="space-y-3">
            <h1 className="text-[2.4rem] font-bold tracking-[-0.05em] text-[#28163f] md:text-[2.55rem]">Welcome Back</h1>
            <p className="text-[2.15rem] font-bold tracking-[-0.05em] text-[#6d38de] md:text-[2.25rem]">{displayName}</p>
            <p className="max-w-[520px] text-[0.94rem] leading-6 text-[#5f4a79]">
              Your intellectual journey is progressing smoothly. You&apos;ve completed 72% of this semester&apos;s milestones.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {overviewMetrics.map((metric, index) => (
              <article
                key={metric.label}
                className="rounded-[20px] border border-[#efe3fb] bg-white px-3.5 py-3.5 shadow-[0_18px_28px_-28px_rgba(84,39,174,0.85)]"
              >
                <div className={`grid h-9 w-9 place-items-center rounded-[12px] ${metric.iconTone}`}>
                  {index === 0 ? <DashboardGpaIcon /> : <DashboardRankIcon />}
                </div>
                <p className="mt-3 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#7b6d98]">{metric.label}</p>
                <p className="mt-1.5 text-[1.55rem] font-bold tracking-[-0.05em] text-[#24163a]">{metric.value}</p>
                <p className={`mt-2 text-[0.74rem] font-semibold ${metric.noteTone}`}>{metric.note}</p>
              </article>
            ))}
          </div>
        </div>

        <section className="space-y-3">
          <div className="space-y-2">
            <h2 className="text-[1.45rem] font-bold tracking-[-0.04em] text-[#26173d]">My Courses</h2>
            <p className="text-[0.88rem] text-[#5f4a79]">Continue where you left off in your academic journey.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {dashboardCourses.slice(0, 4).map((course) => (
              <StudentCourseCard key={course.title} course={course} />
            ))}
          </div>

          <div className="flex justify-center pt-1">
            <Link
              href="/student?view=courses"
              className="inline-flex min-w-[176px] items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#7f47ef_0%,#5e24d1_100%)] px-4 py-2.5 text-[0.82rem] font-semibold text-white shadow-[0_20px_34px_-22px_rgba(94,36,209,0.95)] transition hover:scale-[1.01]"
            >
              See Detail
              <DashboardArrowRightIcon />
            </Link>
          </div>
        </section>
      </section>

      <aside className="rounded-[24px] border border-[#ecdff8] bg-[#f4e8ff] px-4 py-4 shadow-[0_24px_40px_-36px_rgba(93,39,189,0.88)]">
        <div className="space-y-1">
          <h3 className="text-[1.45rem] font-bold tracking-[-0.04em] text-[#582ee0]">Priority Focus</h3>
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[#7e71de]">
            Academic Milestones
          </p>
        </div>

        <div className="mt-4 space-y-3">
          {dashboardFocusCards.map((item) => (
            <article
              key={item.title}
              className={`rounded-[18px] border border-white/70 border-l-[3px] ${item.accent} bg-white px-4 py-3.5 shadow-[0_14px_24px_-22px_rgba(89,38,179,0.9)]`}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-lg bg-[#d7c3ff] px-2.5 py-1 text-[0.54rem] font-bold uppercase tracking-[0.06em] text-[#40207f]">
                  {item.badge}
                </span>
                <span className="text-[0.56rem] font-semibold uppercase tracking-[0.1em] text-[#5e4a79]">
                  {item.deadline}
                </span>
              </div>

              <h4 className="mt-2.5 text-[0.9rem] font-semibold leading-5 text-[#2f1e47]">{item.title}</h4>
              <p className="mt-2 text-[0.76rem] leading-5 text-[#5f4b7c]">{item.description}</p>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-[0.68rem] text-[#4e3a68]">{item.footer}</span>
                <button className="inline-flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.08em] text-[#4d2dde]">
                  {item.action}
                  <DashboardArrowRightIcon />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 rounded-[18px] border border-white/80 bg-white/90 p-3.5 shadow-[0_16px_26px_-24px_rgba(89,38,179,0.88)]">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#efe0ff] text-[#5a2ddf]">
              <DashboardIdeaIcon />
            </div>
            <div>
              <p className="text-[0.84rem] font-semibold text-[#2f1e47]">Study Insight</p>
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[#88779f]">
                Smart Suggestion
              </p>
            </div>
          </div>

          <p className="mt-2.5 text-[0.76rem] leading-5 text-[#5e4a79]">
            Students with your study profile often review Graph Theory around 7 PM for stronger retention. Try a short session tonight.
          </p>
        </div>
      </aside>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-[#ece3fb] pt-3 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[#9b90b4]">
        {dashboardFooterLinks.map((link) => (
          <span key={link}>{link}</span>
        ))}
      </div>
    </div>
  );
}

function CourseDetailsView() {
  return (
    <div className="space-y-6 pt-4">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-[-0.04em] text-[#2f1e47] md:text-[2.75rem]">My Course</h1>
          <p className="text-3xl font-bold tracking-[-0.04em] text-[#6d38de] md:text-[2.55rem]">Course</p>
          <p className="max-w-2xl text-base text-[#5f4a79]">
            Browse your active subjects, upcoming modules, and current progress in one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-[#eadcf7] bg-white px-4 py-2 text-sm font-semibold text-[#5f4a79] shadow-[0_12px_24px_-24px_rgba(90,45,223,1)]">
            {dashboardCourses.length} courses
          </div>
          <Link
            href="/student"
            className="inline-flex items-center gap-2 rounded-full border border-[#dbc8fa] bg-white px-5 py-2.5 text-sm font-semibold text-[#5a2ddf] shadow-[0_16px_28px_-24px_rgba(90,45,223,0.95)] transition hover:border-[#cdb5f7]"
          >
            <DashboardArrowLeftIcon />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {dashboardCourses.map((course) => (
          <StudentCourseCard key={course.title} course={course} compact />
        ))}
      </div>
    </div>
  );
}

function StudentDashboardContent() {
  const searchParams = useSearchParams();
  const isCourseView = searchParams.get('view') === 'courses';

  return (
    <div className="mx-auto max-w-[980px]">
      {isCourseView ? <CourseDetailsView /> : <OverviewDashboardView />}
    </div>
  );
}

export default function StudentDashboard() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[980px] px-5 py-8 text-sm font-semibold text-[#6d38de]">Loading dashboard...</div>}>
      <StudentDashboardContent />
    </Suspense>
  );
}
