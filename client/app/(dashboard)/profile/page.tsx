'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { DemoUser, readDemoUser } from '@/lib/demo-user';

const fallbackUser: DemoUser = {
  createdAt: new Date('2026-04-03T00:00:00.000Z').toISOString(),
  email: 'student@acaflow.edu',
  fullName: 'AcaFlow Student',
  role: 'student',
};

const profileHighlights = [
  { label: 'Courses', value: '12' },
  { label: 'Attendance', value: '94%' },
  { label: 'Assignments', value: '8 Open' },
];

const quickLinks = [
  { href: '/student?view=courses', label: 'My Courses' },
  { href: '/assignments', label: 'Assignments' },
  { href: '/attendance', label: 'Attendance' },
  { href: '/subscription', label: 'Subscription' },
];

const formatRole = (role: DemoUser['role']) => role.charAt(0).toUpperCase() + role.slice(1);

export default function ProfilePage() {
  const user = typeof window === 'undefined' ? fallbackUser : readDemoUser() ?? fallbackUser;

  const joinedDate = useMemo(
    () =>
      new Date(user.createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    [user.createdAt],
  );

  const dashboardPath = user.role === 'student' ? '/student' : '/lecturer';

  return (
    <div className="mx-auto max-w-[1180px] space-y-6 pt-2">
      <section className="overflow-hidden rounded-[34px] border border-[#eadcf7] bg-white shadow-[0_30px_48px_-40px_rgba(95,41,210,0.72)]">
        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1.35fr)_260px] lg:px-8">
          <div className="space-y-6">
            <div className="flex flex-wrap items-start gap-6">
              <div className="grid h-36 w-36 place-items-center rounded-[28px] border border-[#f0e6ff] bg-[linear-gradient(145deg,#f7efff_0%,#ffffff_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <div className="grid h-20 w-20 place-items-center rounded-[24px] bg-[#efe3ff] text-[#6d38de]">
                  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <rect x="3.75" y="4.75" width="16.5" height="14.5" rx="2.25" />
                    <circle cx="9" cy="10" r="1.7" />
                    <path d="m6.3 16 3.3-3.3 2.45 2.45 2.85-3.15L18 16" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <div className="min-w-[240px] flex-1 space-y-4">
                <div>
                  <p className="text-[0.78rem] font-semibold uppercase tracking-[0.28em] text-[#8e7cab]">My Profile</p>
                  <h1 className="mt-2 text-[2.8rem] font-bold tracking-[-0.06em] text-[#5c2ddd]">{user.fullName}</h1>
                  <p className="mt-3 text-[1rem] text-[#6d5c89]">{formatRole(user.role)} Dashboard Access</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {profileHighlights.map((highlight) => (
                    <div key={highlight.label} className="rounded-[20px] border border-[#f0e6ff] bg-[#fcf9ff] px-4 py-4">
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#9b8bb4]">{highlight.label}</p>
                      <p className="mt-2 text-[1.5rem] font-bold tracking-[-0.04em] text-[#2b1943]">{highlight.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
              <section className="rounded-[28px] border border-[#f0e6ff] bg-[#fffefe] p-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#a08fb8]">Name</p>
                    <p className="text-[1.08rem] font-semibold text-[#2d1b46]">{user.fullName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#a08fb8]">Email</p>
                    <p className="text-[1.08rem] font-semibold text-[#2d1b46]">{user.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#a08fb8]">Joined Date</p>
                    <p className="text-[1.08rem] font-semibold text-[#2d1b46]">{joinedDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#a08fb8]">Status</p>
                    <p className="text-[1.08rem] font-semibold text-[#2d1b46]">{formatRole(user.role)}</p>
                  </div>
                </div>
              </section>

              <aside className="rounded-[28px] bg-[linear-gradient(160deg,#6f32e4_0%,#933ff0_100%)] p-6 text-white shadow-[0_30px_48px_-34px_rgba(111,50,228,0.95)]">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-[18px] bg-white/14">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                      <path d="M12 3 9.8 8.1 5 10.3l4.8 2.2L12 17.7l2.2-5.2 4.8-2.2-4.8-2.2L12 3Z" strokeLinejoin="round" />
                      <path d="M19 16.5 18 19l-2.5 1 2.5 1L19 23l1-2 2.5-1-2.5-1-1-2.5Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-[1.45rem] font-bold tracking-[-0.04em]">AI Study Planner</h2>
                    <p className="text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-white/70">Semester Progress</p>
                  </div>
                </div>

                <p className="mt-5 text-[0.95rem] leading-7 text-white/88">
                  You&apos;ve been most productive during evening sessions. Your academic momentum is strong and your
                  planner is ready for the next milestone.
                </p>

                <div className="mt-6 h-2 rounded-full bg-white/20">
                  <div className="h-2 w-[75%] rounded-full bg-white" />
                </div>
                <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-white/70">Semester Progress - 75%</p>
              </aside>
            </div>
          </div>

          <aside className="rounded-[30px] border border-[#ece1fb] bg-[#faf5ff] p-6">
            <p className="text-[0.76rem] font-semibold uppercase tracking-[0.22em] text-[#8a78ab]">Quick Access</p>
            <div className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between rounded-[18px] bg-white px-4 py-3.5 text-[0.95rem] font-semibold text-[#2d1b46] shadow-[0_16px_28px_-26px_rgba(95,41,210,0.8)] transition hover:text-[#5c2ddd]"
                >
                  <span>{link.label}</span>
                  <span aria-hidden="true">&gt;</span>
                </Link>
              ))}
            </div>

            <Link
              href={dashboardPath}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[18px] bg-[linear-gradient(135deg,#7641e8_0%,#9a73ef_100%)] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_24px_34px_-24px_rgba(118,65,232,1)] transition hover:scale-[1.01]"
            >
              Back to Dashboard
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
}
