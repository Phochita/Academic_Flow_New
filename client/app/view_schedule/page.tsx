'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import DashboardShellHeader from '@/components/layout/DashboardShellHeader';
import Sidebar from '@/components/layout/Sidebar';
import { buildAuthHeaders, getApiBaseUrl, readAuthSession } from '@/lib/auth';

const inter = { className: 'font-sans' };
const manrope = { className: 'font-sans' };

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;
const DAY_ALIASES: Record<string, number> = {
  friday: 4,
  fri: 4,
  monday: 0,
  mon: 0,
  thursday: 3,
  thu: 3,
  thur: 3,
  thurs: 3,
  tuesday: 1,
  tue: 1,
  tues: 1,
  wednesday: 2,
  wed: 2,
};

const HOUR_START = 8;
const HOUR_END = 18;
const PX_PER_HOUR = 52;
const BLOCK_GRADIENTS = [
  'from-[#5f43d8] to-[#2383c4]',
  'from-[#167a72] to-[#2da78f]',
  'from-[#ba3f7f] to-[#e0719a]',
  'from-[#7257bd] to-[#4178c7]',
  'from-[#2d7f5e] to-[#82a83a]',
  'from-[#9a4d3f] to-[#d87955]',
];

type ApiCourse = {
  code?: string | null;
  id: number;
  lecturer?: {
    fullName?: string | null;
  } | null;
  name?: string | null;
  room?: string | null;
  schedule?: string | null;
  section?: string | null;
};

type ScheduleBlock = {
  calendarUrl: string;
  code: string;
  dayIndex: number;
  end: number;
  gradient: string;
  id: string;
  room: string;
  scheduleText: string;
  start: number;
  title: string;
};

function startOfWeekMonday(ref: Date) {
  const d = new Date(ref);
  d.setHours(12, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatRange(weekStart: Date) {
  const weekEnd = addDays(weekStart, 4);
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const y = weekStart.getFullYear();
  const a = weekStart.toLocaleDateString('en-US', opts);
  const b = weekEnd.toLocaleDateString('en-US', opts);
  return `${a} - ${b}, ${y}`;
}

function formatHour(h: number) {
  const hour = Math.floor(h);
  const min = Math.round((h - hour) * 60);
  const d = new Date();
  d.setHours(hour, min, 0, 0);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatAxisHour(h: number) {
  if (h === 12) return '12 PM';
  if (h > 12) return `${h - 12} PM`;
  return `${h} AM`;
}

function parseTimeToHour(value: string) {
  const match = value.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);

  if (!match) {
    return null;
  }

  let hour = Number(match[1]);
  const minute = Number(match[2] ?? 0);
  const meridiem = match[3]?.toLowerCase();

  if (minute < 0 || minute > 59 || hour < 0 || hour > 24) {
    return null;
  }

  if (meridiem === 'pm' && hour < 12) {
    hour += 12;
  }

  if (meridiem === 'am' && hour === 12) {
    hour = 0;
  }

  return hour + minute / 60;
}

function buildGoogleCalendarUrl(block: Omit<ScheduleBlock, 'calendarUrl'>, weekStart: Date) {
  const day = addDays(weekStart, block.dayIndex);
  const start = new Date(day);
  const end = new Date(day);

  start.setHours(Math.floor(block.start), Math.round((block.start % 1) * 60), 0, 0);
  end.setHours(Math.floor(block.end), Math.round((block.end % 1) * 60), 0, 0);

  const formatDate = (date: Date) => date.toISOString().replace(/[-:]|\.\d{3}/g, '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    dates: `${formatDate(start)}/${formatDate(end)}`,
    details: `${block.code} class hour from AcaFlow schedule.`,
    location: block.room,
    text: `${block.code} - ${block.title}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function parseCourseSchedule(course: ApiCourse, index: number, weekStart: Date): ScheduleBlock[] {
  const schedule = course.schedule?.trim();

  if (!schedule) {
    return [];
  }

  const pieces = schedule.split(/[;\n]+/).map((piece) => piece.trim()).filter(Boolean);
  const blocks: ScheduleBlock[] = [];

  for (const [pieceIndex, piece] of pieces.entries()) {
    const match = piece.match(/\b(mon(?:day)?|tue(?:s|sday)?|wed(?:nesday)?|thu(?:r|rs|rsday|rday)?|fri(?:day)?)\b[^0-9]*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\s*(?:-|to|–|—)\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
    const dayIndex = match ? DAY_ALIASES[match[1].toLowerCase()] : undefined;
    const start = match ? parseTimeToHour(match[2]) : null;
    const end = match ? parseTimeToHour(match[3]) : null;

    if (dayIndex === undefined || start === null || end === null || end <= start) {
      continue;
    }

    const baseBlock = {
      code: course.code?.trim() || `COURSE-${course.id}`,
      dayIndex,
      end: Math.min(end, HOUR_END),
      gradient: BLOCK_GRADIENTS[(index + pieceIndex) % BLOCK_GRADIENTS.length],
      id: `${course.id}-${pieceIndex}`,
      room: course.room?.trim() || 'Room not set',
      scheduleText: piece,
      start: Math.max(start, HOUR_START),
      title: course.name?.trim() || 'Untitled course',
    };

    blocks.push({
      ...baseBlock,
      calendarUrl: buildGoogleCalendarUrl(baseBlock, weekStart),
    });
  }

  return blocks;
}

function ScheduleBlockCard({ block }: { block: ScheduleBlock }) {
  const top = (block.start - HOUR_START) * PX_PER_HOUR;
  const height = Math.max((block.end - block.start) * PX_PER_HOUR - 4, 42);

  return (
    <a
      className={`absolute left-0.5 right-0.5 z-10 overflow-hidden rounded-xl border border-white/25 bg-gradient-to-br px-2 py-1.5 text-white shadow-[0_8px_20px_-12px_rgba(43,65,142,0.85)] transition hover:translate-y-[-1px] ${block.gradient}`}
      href={block.calendarUrl}
      rel="noreferrer"
      style={{ top, height }}
      target="_blank"
      title="Open in Google Calendar"
    >
      <p className={`${inter.className} text-[10px] font-semibold uppercase tracking-[0.06em] text-white/90`}>
        {block.code}
      </p>
      <p className={`${inter.className} text-[11px] font-bold leading-tight`}>{block.title}</p>
      <p className={`${inter.className} mt-0.5 text-[9px] font-medium text-white/85`}>
        {formatHour(block.start)} - {formatHour(block.end)}
      </p>
      <p className={`${inter.className} text-[9px] text-white/75`}>{block.room}</p>
    </a>
  );
}

export default function ViewSchedulePage() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [weekOffset, setWeekOffset] = useState(0);
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const weekStart = useMemo(() => {
    const base = startOfWeekMonday(new Date());
    return addDays(base, weekOffset * 7);
  }, [weekOffset]);

  useEffect(() => {
    let ignore = false;

    const loadCourses = async () => {
      const session = readAuthSession();

      if (!session) {
        if (!ignore) {
          setErrorMessage('Sign in again to load your class schedule.');
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(`${apiBaseUrl}/api/courses`, {
          headers: buildAuthHeaders(session.accessToken),
        });
        const payload = (await response.json().catch(() => null)) as { courses?: ApiCourse[]; error?: string } | null;

        if (!response.ok) {
          throw new Error(payload?.error?.trim() || 'Unable to load your class schedule right now.');
        }

        if (!ignore) {
          setCourses(payload?.courses ?? []);
          setErrorMessage('');
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load your class schedule right now.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void loadCourses();

    return () => {
      ignore = true;
    };
  }, [apiBaseUrl]);

  const dayDates = useMemo(
    () => DAY_LABELS.map((_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const hours = useMemo(() => {
    const list: number[] = [];
    for (let h = HOUR_START; h <= HOUR_END; h += 1) list.push(h);
    return list;
  }, []);

  const scheduleBlocks = useMemo(
    () => courses.flatMap((course, index) => parseCourseSchedule(course, index, weekStart)).sort((a, b) => a.dayIndex - b.dayIndex || a.start - b.start),
    [courses, weekStart],
  );
  const unscheduledCourses = useMemo(() => courses.filter((course) => !course.schedule?.trim()), [courses]);
  const gridHeight = (HOUR_END - HOUR_START) * PX_PER_HOUR;

  return (
    <div className="min-h-screen bg-[#fcf7ff]">
      <Suspense fallback={null}>
        <DashboardShellHeader />
      </Suspense>
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>
      <main className="min-h-screen px-4 pb-4 pt-[84px] sm:px-5 sm:pt-[86px] lg:ml-[210px] lg:px-5 lg:pb-5 lg:pt-[88px] xl:px-6">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-3 py-8 sm:px-5 lg:px-2">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <p className={`${inter.className} text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a7ca4]`}>
                Student schedule
              </p>
              <h1 className={`${manrope.className} text-[32px] font-extrabold tracking-[-0.04em] text-[#285f6f] sm:text-[36px]`}>
                View schedule
              </h1>
              <p className={`${inter.className} max-w-xl text-[14px] leading-relaxed text-[#4A4455]`}>
                Your weekly classes come from the class hours saved on each course. Click any class block to open it in Google Calendar.
              </p>
            </div>
            <div
              className={`${inter.className} flex items-center gap-2 rounded-2xl border border-[#d7e7eb] bg-white px-3 py-2 shadow-[0_12px_30px_-28px_rgba(31,92,111,0.55)]`}
            >
              <button
                type="button"
                onClick={() => setWeekOffset((o) => o - 1)}
                className="rounded-xl px-3 py-1.5 text-[13px] font-semibold text-[#276476] transition hover:bg-[#edf8fa]"
              >
                Prev
              </button>
              <span className="min-w-[10.5rem] text-center text-[13px] font-semibold text-[#1f2d35]">
                {formatRange(weekStart)}
              </span>
              <button
                type="button"
                onClick={() => setWeekOffset((o) => o + 1)}
                className="rounded-xl px-3 py-1.5 text-[13px] font-semibold text-[#276476] transition hover:bg-[#edf8fa]"
              >
                Next
              </button>
              <button
                type="button"
                onClick={() => setWeekOffset(0)}
                className="ml-1 rounded-xl bg-[#276476] px-3 py-1.5 text-[12px] font-bold uppercase tracking-wide text-white shadow-[0_10px_24px_-14px_rgba(39,100,118,0.9)] transition hover:bg-[#1e5565]"
              >
                This week
              </button>
            </div>
          </header>

          {errorMessage ? (
            <p className={`${inter.className} rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700`}>
              {errorMessage}
            </p>
          ) : null}

          <section className="overflow-hidden rounded-[28px] border border-[#d7e7eb] bg-white shadow-[0_30px_46px_-40px_rgba(31,92,111,0.7)]">
            <div className="border-b border-[#e7f0f2] px-5 py-4 sm:px-6">
              <p className={`${inter.className} text-[1.05rem] font-semibold tracking-[-0.02em] text-[#1f2d35]`}>
                Week overview
              </p>
              <p className={`${inter.className} mt-1 text-[13px] text-[#60757d]`}>
                {HOUR_START}:00 - {HOUR_END}:00, Monday to Friday
              </p>
            </div>

            <div className="overflow-x-auto px-2 pb-4 pt-3 sm:px-4">
              <div className="min-w-[720px]">
                <div className="grid gap-0" style={{ gridTemplateColumns: '44px repeat(5, minmax(0, 1fr))' }}>
                  <div />
                  {DAY_LABELS.map((label, i) => {
                    const d = dayDates[i];
                    const isToday = d.toDateString() === new Date().toDateString();
                    return (
                      <div
                        key={label}
                        className={`border-b border-[#e7f0f2] px-1 pb-2 text-center ${isToday ? 'rounded-t-xl bg-[#edf8fa]' : ''}`}
                      >
                        <p className={`${inter.className} text-[11px] font-semibold uppercase tracking-[0.12em] text-[#60757d]`}>
                          {label}
                        </p>
                        <p className={`${inter.className} text-[15px] font-bold ${isToday ? 'text-[#276476]' : 'text-[#1f2d35]'}`}>
                          {d.getDate()}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="grid gap-0" style={{ gridTemplateColumns: '44px repeat(5, minmax(0, 1fr))' }}>
                  <div className="relative pr-1 text-right" style={{ height: gridHeight }}>
                    {hours.map((h) => (
                      <div
                        key={h}
                        className="absolute right-1 text-[10px] font-medium text-[#8b9aa0]"
                        style={{ top: (h - HOUR_START) * PX_PER_HOUR - 6 }}
                      >
                        {formatAxisHour(h)}
                      </div>
                    ))}
                  </div>

                  {DAY_LABELS.map((_, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="relative border-l border-[#e7f0f2] bg-[#f8fbfc]"
                      style={{ height: gridHeight }}
                    >
                      {hours.slice(0, -1).map((h) => (
                        <div
                          key={h}
                          className="pointer-events-none absolute left-0 right-0 border-b border-[#edf3f5]"
                          style={{ top: (h - HOUR_START + 1) * PX_PER_HOUR }}
                        />
                      ))}
                      {scheduleBlocks.filter((block) => block.dayIndex === dayIndex).map((block) => (
                        <ScheduleBlockCard key={block.id} block={block} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#d7e7eb] bg-white px-5 py-4 shadow-[0_22px_40px_-40px_rgba(31,92,111,0.85)] sm:px-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className={`${inter.className} text-[0.9rem] font-semibold text-[#1f2d35]`}>Up next</p>
                <p className={`${inter.className} mt-1 text-[12px] text-[#60757d]`}>
                  {isLoading ? 'Loading class hours...' : `${scheduleBlocks.length} scheduled class block${scheduleBlocks.length === 1 ? '' : 's'}`}
                </p>
              </div>
              {unscheduledCourses.length > 0 ? (
                <p className={`${inter.className} text-[12px] font-semibold text-[#9a5b2f]`}>
                  {unscheduledCourses.length} course{unscheduledCourses.length === 1 ? '' : 's'} missing class hours
                </p>
              ) : null}
            </div>

            {scheduleBlocks.length > 0 ? (
              <ul className={`${inter.className} mt-3 space-y-2 text-[13px] text-[#41575f]`}>
                {scheduleBlocks.slice(0, 5).map((block) => (
                  <li key={`list-${block.id}`} className="flex items-center justify-between gap-3 rounded-xl bg-[#f3fafb] px-3 py-2">
                    <span className="font-semibold text-[#285f6f]">
                      {block.code} - {block.title}
                    </span>
                    <a className="shrink-0 text-[#276476] underline-offset-4 hover:underline" href={block.calendarUrl} rel="noreferrer" target="_blank">
                      {DAY_LABELS[block.dayIndex]} - {formatHour(block.start)}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`${inter.className} mt-3 rounded-xl bg-[#f7f4ed] px-3 py-3 text-[13px] text-[#725c3e]`}>
                No class hours found yet. Add class hours on courses using a format like `Mon 9:00-10:30; Wed 13:00-14:30`.
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
