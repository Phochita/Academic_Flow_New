'use client';

import { startTransition, useEffect, useMemo, useState } from 'react';
import { buildAuthHeaders, getApiBaseUrl, getAuthRequestErrorMessage, readAuthSession } from '@/lib/auth';

type AttendanceStatus = 'present' | 'absent' | 'late';
type AttendanceView = 'month' | 'all';

type ApiAttendanceRecord = {
  attendanceDate: string;
  course: {
    code?: string | null;
    id: number;
    name: string;
  };
  id: number;
  markedAt?: string | null;
  markedByUser?: {
    fullName?: string | null;
  } | null;
  status?: AttendanceStatus | null;
  student?: {
    fullName?: string | null;
  } | null;
};

type ApiAttendanceSummary = {
  absent: number;
  attendancePercentage: number;
  courseCode: string;
  courseId: number;
  courseName: string;
  present: number;
  total: number;
};

type CourseBreakdown = {
  name: string;
  attendance: number;
  barTone: string;
  valueTone: string;
  total: number;
};

type CalendarDay = {
  dateKey: string;
  label: string;
  state?: AttendanceStatus | 'today';
  outsideMonth?: boolean;
};

type ActivityItem = {
  id: number;
  title: string;
  time: string;
  kind: AttendanceStatus;
  note: string;
};

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const viewTabs: { key: AttendanceView; label: string }[] = [
  { key: 'month', label: 'This Month' },
  { key: 'all', label: 'All Records' },
];

const courseTones = [
  { barTone: 'bg-[#6d38de]', valueTone: 'text-[#5d34df]' },
  { barTone: 'bg-[#4f46e5]', valueTone: 'text-[#4f46e5]' },
  { barTone: 'bg-[#b83267]', valueTone: 'text-[#b83267]' },
  { barTone: 'bg-[#8b5cf6]', valueTone: 'text-[#8b5cf6]' },
];

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const parseLocalDate = (dateKey: string) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
};

const formatRecordTime = (record: ApiAttendanceRecord) => {
  const date = parseLocalDate(record.attendanceDate);
  const markedAt = record.markedAt ? new Date(record.markedAt) : null;
  const dateLabel = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  }).format(date);

  if (!markedAt || Number.isNaN(markedAt.getTime())) {
    return dateLabel;
  }

  return `${dateLabel}, ${new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(markedAt)}`;
};

const buildCalendarDays = (records: ApiAttendanceRecord[], visibleMonth: Date): CalendarDay[] => {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(year, month, 1 - startOffset);
  const todayKey = toDateKey(new Date());
  const statusByDate = new Map<string, AttendanceStatus>();

  for (const record of records) {
    if (record.status === 'absent') {
      statusByDate.set(record.attendanceDate, 'absent');
    } else if (record.status === 'late' && statusByDate.get(record.attendanceDate) !== 'absent') {
      statusByDate.set(record.attendanceDate, 'late');
    } else if (record.status === 'present' && !statusByDate.has(record.attendanceDate)) {
      statusByDate.set(record.attendanceDate, 'present');
    }
  }

  return Array.from({ length: 35 }, (_, index) => {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + index);
    const dateKey = toDateKey(current);

    return {
      dateKey,
      label: String(current.getDate()).padStart(2, '0'),
      outsideMonth: current.getMonth() !== month,
      state: dateKey === todayKey ? 'today' : statusByDate.get(dateKey),
    };
  });
};

const buildActivities = (records: ApiAttendanceRecord[]): ActivityItem[] =>
  records.slice(0, 6).map((record) => {
    const status = record.status ?? 'absent';
    const teacherName = record.markedByUser?.fullName?.trim() || 'teacher';
    const statusLabel = status === 'present' ? 'Present' : status === 'late' ? 'Late' : 'Absent';

    return {
      id: record.id,
      title: `${record.course.name} marked ${statusLabel.toLowerCase()}`,
      time: formatRecordTime(record),
      kind: status,
      note: `Signed by ${teacherName}`,
    };
  });

function ActivityIcon({ kind }: { kind: ActivityItem['kind'] }) {
  if (kind === 'absent') {
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
  const [activeView, setActiveView] = useState<AttendanceView>('month');
  const [records, setRecords] = useState<ApiAttendanceRecord[]>([]);
  const [summary, setSummary] = useState<ApiAttendanceSummary[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const visibleMonth = useMemo(() => new Date(), []);

  useEffect(() => {
    let ignore = false;
    const session = readAuthSession();

    const loadAttendance = async () => {
      if (!session) {
        if (!ignore) {
          setErrorMessage('Sign in again to load teacher-signed attendance records.');
          setIsLoading(false);
        }
        return;
      }

      try {
        const headers = buildAuthHeaders(session.accessToken);
        const [attendanceResponse, summaryResponse] = await Promise.all([
          fetch(`${getApiBaseUrl()}/api/attendance`, { headers }),
          fetch(`${getApiBaseUrl()}/api/attendance/summary`, { headers }),
        ]);

        const [attendancePayload, summaryPayload] = await Promise.all([
          attendanceResponse.json().catch(() => null) as Promise<{ attendance?: ApiAttendanceRecord[]; message?: string } | null>,
          summaryResponse.json().catch(() => null) as Promise<{ summary?: ApiAttendanceSummary[]; message?: string } | null>,
        ]);

        if (!attendanceResponse.ok) {
          throw new Error(attendancePayload?.message || 'Unable to load attendance records right now.');
        }

        if (!summaryResponse.ok) {
          throw new Error(summaryPayload?.message || 'Unable to load attendance summary right now.');
        }

        if (!ignore) {
          setRecords(attendancePayload?.attendance ?? []);
          setSummary(summaryPayload?.summary ?? []);
          setErrorMessage('');
          setIsLoading(false);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(getAuthRequestErrorMessage(error, 'Unable to load attendance right now.'));
          setIsLoading(false);
        }
      }
    };

    void loadAttendance();

    return () => {
      ignore = true;
    };
  }, []);

  const monthKey = `${visibleMonth.getFullYear()}-${String(visibleMonth.getMonth() + 1).padStart(2, '0')}`;
  const filteredRecords = useMemo(
    () => (activeView === 'month' ? records.filter((record) => record.attendanceDate.startsWith(monthKey)) : records),
    [activeView, monthKey, records],
  );
  const presentCount = filteredRecords.filter((record) => record.status === 'present' || record.status === 'late').length;
  const absentCount = filteredRecords.filter((record) => record.status === 'absent').length;
  const totalCount = filteredRecords.length;
  const overall = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
  const courseBreakdown: CourseBreakdown[] = summary.map((item, index) => {
    const tones = courseTones[index % courseTones.length];

    return {
      name: item.courseName,
      attendance: item.attendancePercentage,
      total: item.total,
      ...tones,
    };
  });
  const calendarDays = useMemo(() => buildCalendarDays(records, visibleMonth), [records, visibleMonth]);
  const activities = useMemo(() => buildActivities(filteredRecords), [filteredRecords]);
  const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(visibleMonth);

  return (
    <div className="mx-auto max-w-[1120px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="space-y-2">
          <p className="text-[0.82rem] font-semibold uppercase tracking-[0.32em] text-[#6d38de]">Student Performance</p>
          <h1 className="text-3xl font-bold tracking-[-0.05em] text-[#2a1842] md:text-[2.75rem]">Attendance Tracking</h1>
          <p className="max-w-2xl text-base leading-7 text-[#5f4a79]">
            Attendance is loaded from backend records marked present or absent by a teacher.
          </p>
        </div>

        <div className="flex items-center rounded-[22px] border border-[#eadcf7] bg-[#f4e8ff] p-1.5 shadow-[0_12px_24px_-28px_rgba(91,46,199,0.95)]">
          {viewTabs.map((tab) => {
            const isActive = activeView === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => startTransition(() => setActiveView(tab.key))}
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

      {errorMessage ? (
        <p className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
        <section className="relative overflow-hidden rounded-[28px] border border-[#eadcf7] bg-white p-6 shadow-[0_28px_46px_-38px_rgba(95,41,210,0.75)]">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-[60px] bg-[#f2ecff]" />

          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
            <div
              className="grid h-[198px] w-[198px] place-items-center rounded-full"
              style={{
                background: `conic-gradient(#6d38de ${overall * 3.6}deg, #efe5fb ${overall * 3.6}deg 360deg)`,
              }}
            >
              <div className="grid h-[156px] w-[156px] place-items-center rounded-full bg-white">
                <div>
                  <p className="text-[3rem] font-bold tracking-[-0.08em] text-[#2d1847]">{isLoading ? '...' : `${overall}%`}</p>
                  <p className="text-[0.82rem] font-semibold uppercase tracking-[0.18em] text-[#5e4a79]">Overall</p>
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-[260px] text-base leading-7 text-[#5f4a79]">
              {isLoading
                ? 'Loading teacher-signed attendance...'
                : `${presentCount} attended and ${absentCount} absent records are signed by teachers.`}
            </p>
          </div>
        </section>

        <section className="rounded-[28px] border border-[#eadcf7] bg-white p-6 shadow-[0_28px_46px_-38px_rgba(95,41,210,0.75)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[1.7rem] font-bold tracking-[-0.04em] text-[#2a1842]">Course Breakdown</h2>
            <span className="text-sm font-semibold text-[#5d34df]">{totalCount} signed records</span>
          </div>

          <div className="mt-6 space-y-6">
            {courseBreakdown.map((course) => (
              <article key={course.name}>
                <div className="flex items-center justify-between gap-4 text-[0.96rem] font-semibold">
                  <h3 className="text-[#28163f]">{course.name}</h3>
                  <span className={course.valueTone}>{course.attendance}%</span>
                </div>
                <div className="mt-3 h-2.5 rounded-full bg-[#f1e6fc]">
                  <div className={`h-2.5 rounded-full shadow-[0_12px_18px_-16px_rgba(93,52,223,1)] ${course.barTone}`} style={{ width: `${course.attendance}%` }} />
                </div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#8f80aa]">{course.total} records</p>
              </article>
            ))}
          </div>

          {!isLoading && courseBreakdown.length === 0 ? (
            <p className="mt-6 rounded-[18px] border border-[#eadcf7] bg-[#fcfaff] px-4 py-3 text-sm font-semibold text-[#5f4a79]">
              No attendance has been signed by a teacher yet.
            </p>
          ) : null}
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-[30px] border border-[#eadcf7] bg-white p-6 shadow-[0_28px_46px_-38px_rgba(95,41,210,0.75)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-[1.7rem] font-bold tracking-[-0.04em] text-[#2a1842]">Attendance Calendar</h2>
              <p className="mt-2 text-[0.96rem] text-[#6b5a88]">{monthLabel}</p>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-7 gap-x-4 gap-y-5 text-center">
            {weekdayLabels.map((day) => (
              <div key={day} className="text-[0.82rem] font-semibold uppercase tracking-[0.24em] text-[#7d6d96]">
                {day}
              </div>
            ))}

            {calendarDays.map((day) => {
              const stateStyles =
                day.state === 'present'
                  ? 'bg-[#ede7ff] text-[#2d1847]'
                  : day.state === 'absent'
                    ? 'bg-[#fce9ef] text-[#c33462]'
                    : day.state === 'late'
                      ? 'bg-[#ece9ff] text-[#4f46e5]'
                      : day.state === 'today'
                        ? 'bg-[#6d38de] text-white shadow-[0_22px_30px_-18px_rgba(109,56,222,1)]'
                        : day.outsideMonth
                          ? 'text-[#ddd1ea]'
                          : 'text-[#3f2d61]';

              return (
                <div key={day.dateKey} className="flex justify-center">
                  <div className={`grid h-14 w-14 place-items-center rounded-[18px] text-[1.05rem] font-semibold ${stateStyles}`}>
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

        <section className="rounded-[32px] border border-[#eadcf7] bg-white p-8 shadow-[0_28px_46px_-38px_rgba(95,41,210,0.75)]">
          <h2 className="text-[1.7rem] font-bold tracking-[-0.04em] text-[#2a1842]">Recent Activity</h2>

          <div className="mt-8 space-y-7">
            {activities.map((activity) => (
              <article key={activity.id} className="flex items-start gap-4">
                <ActivityIcon kind={activity.kind} />
                <div>
                  <h3 className="text-[1.15rem] font-semibold text-[#28163f]">{activity.title}</h3>
                  <p className="mt-1 text-[1rem] text-[#6b5a88]">{activity.time}</p>
                  <p
                    className={`mt-3 inline-flex rounded-lg px-3 py-1.5 text-sm font-medium ${
                      activity.kind === 'absent' ? 'bg-[#f6e8f0] text-[#9b4b72]' : 'bg-[#efe7ff] text-[#5d34df]'
                    }`}
                  >
                    {activity.note}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {!isLoading && activities.length === 0 ? (
            <p className="mt-8 rounded-[18px] border border-[#eadcf7] bg-[#fcfaff] px-4 py-3 text-sm font-semibold text-[#5f4a79]">
              No present or absent records have been signed yet.
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
