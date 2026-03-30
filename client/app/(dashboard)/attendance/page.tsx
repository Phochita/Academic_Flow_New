'use client';

import { startTransition, useState } from 'react';

type SemesterKey = 'semester1' | 'semester2';

type CourseBreakdown = {
  name: string;
  attendance: number;
  barTone: string;
  valueTone: string;
};

type CalendarDay = {
  label: string;
  state?: 'present' | 'absent' | 'today';
  outsideMonth?: boolean;
};

type ActivityItem = {
  title: string;
  time: string;
  kind: 'attended' | 'missed' | 'late';
  note?: string;
};

type SemesterDashboard = {
  overall: number;
  missedSessions: number;
  monthLabel: string;
  courseBreakdown: CourseBreakdown[];
  calendarDays: CalendarDay[];
  activities: ActivityItem[];
};

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const semesterDashboardData: Record<SemesterKey, SemesterDashboard> = {
  semester1: {
    overall: 93,
    missedSessions: 4,
    monthLabel: 'October 2023',
    courseBreakdown: [
      { name: 'Advanced Mathematics', attendance: 98, barTone: 'bg-[#6d38de]', valueTone: 'text-[#5d34df]' },
      { name: 'Quantum Physics II', attendance: 85, barTone: 'bg-[#4f46e5]', valueTone: 'text-[#4f46e5]' },
      { name: 'Cognitive Psychology', attendance: 92, barTone: 'bg-[#b83267]', valueTone: 'text-[#b83267]' },
      { name: 'Academic Writing', attendance: 100, barTone: 'bg-[#8b5cf6]', valueTone: 'text-[#8b5cf6]' },
    ],
    calendarDays: [
      { label: '25', outsideMonth: true },
      { label: '26', outsideMonth: true },
      { label: '27', outsideMonth: true },
      { label: '28', outsideMonth: true },
      { label: '29', outsideMonth: true },
      { label: '30', outsideMonth: true },
      { label: '01', state: 'present' },
      { label: '02', state: 'present' },
      { label: '03', state: 'absent' },
      { label: '04', state: 'present' },
      { label: '05', state: 'present' },
      { label: '06' },
      { label: '07' },
      { label: '08', state: 'present' },
      { label: '09', state: 'present' },
      { label: '10', state: 'present' },
      { label: '11', state: 'present' },
      { label: '12', state: 'present' },
      { label: '13' },
      { label: '14' },
      { label: '15', state: 'today' },
      { label: '16' },
      { label: '17' },
      { label: '18' },
      { label: '19' },
      { label: '20' },
      { label: '21' },
      { label: '22' },
    ],
    activities: [
      { title: 'Math Lab attended', time: 'Today, 09:30 AM', kind: 'attended' },
      { title: 'Physics Lecture missed', time: 'Yesterday, 02:00 PM', kind: 'missed', note: 'Excused: Medical' },
      { title: 'Sociology Seminar', time: 'Oct 12, 11:00 AM', kind: 'attended' },
      { title: 'Late Arrival: Math', time: 'Oct 11, 09:45 AM', kind: 'late', note: 'Marked as 0.5 presence' },
    ],
  },
  semester2: {
    overall: 89,
    missedSessions: 7,
    monthLabel: 'March 2024',
    courseBreakdown: [
      { name: 'Machine Learning', attendance: 91, barTone: 'bg-[#6d38de]', valueTone: 'text-[#5d34df]' },
      { name: 'Distributed Systems', attendance: 84, barTone: 'bg-[#4f46e5]', valueTone: 'text-[#4f46e5]' },
      { name: 'Behavioral Economics', attendance: 88, barTone: 'bg-[#c43d72]', valueTone: 'text-[#c43d72]' },
      { name: 'Research Writing', attendance: 94, barTone: 'bg-[#8b5cf6]', valueTone: 'text-[#8b5cf6]' },
    ],
    calendarDays: [
      { label: '26', outsideMonth: true },
      { label: '27', outsideMonth: true },
      { label: '28', outsideMonth: true },
      { label: '29', outsideMonth: true },
      { label: '01', state: 'present' },
      { label: '02' },
      { label: '03', state: 'present' },
      { label: '04', state: 'present' },
      { label: '05', state: 'present' },
      { label: '06', state: 'absent' },
      { label: '07', state: 'present' },
      { label: '08' },
      { label: '09' },
      { label: '10', state: 'present' },
      { label: '11', state: 'present' },
      { label: '12', state: 'present' },
      { label: '13', state: 'present' },
      { label: '14' },
      { label: '15' },
      { label: '16', state: 'today' },
      { label: '17' },
      { label: '18' },
      { label: '19' },
      { label: '20' },
      { label: '21', state: 'present' },
      { label: '22' },
      { label: '23' },
      { label: '24' },
    ],
    activities: [
      { title: 'Machine Learning attended', time: 'Today, 10:00 AM', kind: 'attended' },
      { title: 'Behavioral Economics missed', time: 'Yesterday, 01:00 PM', kind: 'missed', note: 'Excused: Family Event' },
      { title: 'Research Writing', time: 'Mar 15, 08:30 AM', kind: 'attended' },
      { title: 'Late Arrival: Systems', time: 'Mar 14, 09:10 AM', kind: 'late', note: 'Marked as 0.5 presence' },
    ],
  },
};

const semesterTabs: { key: SemesterKey; label: string }[] = [
  { key: 'semester1', label: 'Semester 1' },
  { key: 'semester2', label: 'Semester 2' },
];

function ActivityIcon({ kind }: { kind: ActivityItem['kind'] }) {
  if (kind === 'missed') {
    return (
      <div className="grid h-12 w-12 place-items-center rounded-full bg-[#fce9ef] text-[#c33462]">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          <circle cx="12" cy="12" r="8" />
          <path d="m9 9 6 6M15 9l-6 6" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (kind === 'late') {
    return (
      <div className="grid h-12 w-12 place-items-center rounded-full bg-[#ece9ff] text-[#4f46e5]">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 4.5v4h4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className="grid h-12 w-12 place-items-center rounded-full bg-[#eee7ff] text-[#6d38de]">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="m8.5 12 2.2 2.3 4.8-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function AttendanceDashboard() {
  const [activeSemester, setActiveSemester] = useState<SemesterKey>('semester1');
  const currentSemester = semesterDashboardData[activeSemester];

  return (
    <div className="mx-auto max-w-[1120px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="space-y-2">
          <p className="text-[0.82rem] font-semibold uppercase tracking-[0.32em] text-[#6d38de]">Student Performance</p>
          <h1 className="text-3xl font-bold tracking-[-0.05em] text-[#2a1842] md:text-[2.75rem]">Attendance Tracking</h1>
        </div>

        <div className="flex items-center rounded-[22px] border border-[#eadcf7] bg-[#f4e8ff] p-1.5 shadow-[0_12px_24px_-28px_rgba(91,46,199,0.95)]">
          {semesterTabs.map((tab) => {
            const isActive = activeSemester === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => startTransition(() => setActiveSemester(tab.key))}
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

      <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
        <section className="relative overflow-hidden rounded-[28px] border border-[#eadcf7] bg-white p-6 shadow-[0_28px_46px_-38px_rgba(95,41,210,0.75)]">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-[60px] bg-[#f2ecff]" />

          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
            <div
              className="grid h-[198px] w-[198px] place-items-center rounded-full"
              style={{
                background: `conic-gradient(#6d38de ${currentSemester.overall * 3.6}deg, #efe5fb ${currentSemester.overall * 3.6}deg 360deg)`,
              }}
            >
              <div className="grid h-[156px] w-[156px] place-items-center rounded-full bg-white">
                <div>
                  <p className="text-[3rem] font-bold tracking-[-0.08em] text-[#2d1847]">{currentSemester.overall}%</p>
                  <p className="text-[0.82rem] font-semibold uppercase tracking-[0.18em] text-[#5e4a79]">Overall</p>
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-[240px] text-base leading-7 text-[#5f4a79]">
              You&apos;ve missed only {currentSemester.missedSessions} sessions this semester. Keep it up!
            </p>
          </div>
        </section>

        <section className="rounded-[28px] border border-[#eadcf7] bg-white p-6 shadow-[0_28px_46px_-38px_rgba(95,41,210,0.75)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[1.7rem] font-bold tracking-[-0.04em] text-[#2a1842]">Course Breakdown</h2>
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-[#5d34df] transition hover:gap-3">
              Details
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="mt-6 space-y-6">
            {currentSemester.courseBreakdown.map((course) => (
              <article key={course.name}>
                <div className="flex items-center justify-between gap-4 text-[0.96rem] font-semibold">
                  <h3 className="text-[#28163f]">{course.name}</h3>
                  <span className={course.valueTone}>{course.attendance}%</span>
                </div>
                <div className="mt-3 h-2.5 rounded-full bg-[#f1e6fc]">
                  <div className={`h-2.5 rounded-full shadow-[0_12px_18px_-16px_rgba(93,52,223,1)] ${course.barTone}`} style={{ width: `${course.attendance}%` }} />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-[30px] border border-[#eadcf7] bg-white p-6 shadow-[0_28px_46px_-38px_rgba(95,41,210,0.75)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-[1.7rem] font-bold tracking-[-0.04em] text-[#2a1842]">Attendance Calendar</h2>
              <p className="mt-2 text-[0.96rem] text-[#6b5a88]">{currentSemester.monthLabel}</p>
            </div>

            <div className="flex items-center gap-2">
              <button className="grid h-11 w-11 place-items-center rounded-full text-[#5d34df] transition hover:bg-[#f3e8ff]">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="grid h-11 w-11 place-items-center rounded-full text-[#5d34df] transition hover:bg-[#f3e8ff]">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-7 gap-x-4 gap-y-5 text-center">
            {weekdayLabels.map((day) => (
              <div key={day} className="text-[0.82rem] font-semibold uppercase tracking-[0.24em] text-[#7d6d96]">
                {day}
              </div>
            ))}

            {currentSemester.calendarDays.map((day) => {
              const stateStyles =
                day.state === 'present'
                  ? 'bg-[#ede7ff] text-[#2d1847]'
                  : day.state === 'absent'
                    ? 'bg-[#fce9ef] text-[#c33462]'
                    : day.state === 'today'
                      ? 'bg-[#6d38de] text-white shadow-[0_22px_30px_-18px_rgba(109,56,222,1)]'
                      : day.outsideMonth
                        ? 'text-[#ddd1ea]'
                        : 'text-[#3f2d61]';

              return (
                <div key={`${activeSemester}-${day.label}-${day.state ?? 'default'}`} className="flex justify-center">
                  <div
                    className={`grid h-14 w-14 place-items-center rounded-[18px] text-[1.05rem] font-semibold ${
                      day.state || !day.outsideMonth ? stateStyles : 'text-[#ddd1ea]'
                    }`}
                  >
                    {day.label}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-8 text-sm font-semibold uppercase tracking-[0.14em] text-[#6d5b87]">
            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded bg-[#ede7ff]" />
              Present
            </div>
            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded bg-[#fce9ef]" />
              Absent
            </div>
            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded bg-[#6d38de]" />
              Today
            </div>
          </div>
        </section>

        <section className="relative rounded-[32px] border border-[#eadcf7] bg-white p-8 shadow-[0_28px_46px_-38px_rgba(95,41,210,0.75)]">
          <h2 className="text-[1.7rem] font-bold tracking-[-0.04em] text-[#2a1842]">Recent Activity</h2>

          <div className="mt-8 space-y-7">
            {currentSemester.activities.map((activity) => (
              <article key={`${activity.title}-${activity.time}`} className="flex items-start gap-4">
                <ActivityIcon kind={activity.kind} />
                <div>
                  <h3 className="text-[1.15rem] font-semibold text-[#28163f]">{activity.title}</h3>
                  <p className="mt-1 text-[1rem] text-[#6b5a88]">{activity.time}</p>
                  {activity.note ? (
                    <p className={`mt-3 inline-flex rounded-lg px-3 py-1.5 text-sm font-medium ${
                      activity.kind === 'missed'
                        ? 'bg-[#f6e8f0] text-[#9b4b72]'
                        : 'bg-[#efe7ff] text-[#5d34df]'
                    }`}>
                      {activity.note}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>

          <button
            aria-label="Add attendance note"
            className="absolute bottom-28 right-8 grid h-[4.5rem] w-[4.5rem] place-items-center rounded-[24px] bg-[linear-gradient(135deg,#8b5cf6_0%,#6d38de_100%)] text-white shadow-[0_28px_38px_-20px_rgba(109,56,222,0.9)] transition hover:scale-105"
          >
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              <path d="m8.5 16 2 2 5-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button className="mt-10 w-full rounded-[20px] bg-[#f5f0ff] px-5 py-4 text-lg font-semibold text-[#5d34df] transition hover:bg-[#eee4ff]">
            View Full History
          </button>
        </section>
      </div>
    </div>
  );
}
