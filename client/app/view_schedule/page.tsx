'use client';

import { useMemo, useState } from 'react';
import { Inter, Manrope } from 'next/font/google';
import Sidebar from '@/components/layout/Sidebar';
import DashboardShellHeader from '@/components/layout/DashboardShellHeader';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['700', '800'],
});

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;

const HOUR_START = 8;
const HOUR_END = 18;
const PX_PER_HOUR = 52;

type ScheduleBlock = {
  id: string;
  title: string;
  code: string;
  room: string;
  /** 0 = Monday … 4 = Friday */
  dayIndex: number;
  /** Decimal hours, e.g. 9.5 = 9:30 */
  start: number;
  end: number;
  gradient: string;
};

/** Demo schedule — replace with API data later */
const SAMPLE_BLOCKS: ScheduleBlock[] = [
  {
    id: '1',
    title: 'Machine Learning',
    code: 'CS 401',
    room: 'Lab A • KIT',
    dayIndex: 0,
    start: 9,
    end: 10.5,
    gradient: 'from-[#7641e8] to-[#9a73ef]',
  },
  {
    id: '2',
    title: 'Digital Ethics',
    code: 'HU 210',
    room: 'Room 304',
    dayIndex: 0,
    start: 13,
    end: 14.5,
    gradient: 'from-[#5a2ddf] to-[#7c5cfa]',
  },
  {
    id: '3',
    title: 'Data Structures',
    code: 'CS 202',
    room: 'Room 112',
    dayIndex: 1,
    start: 10,
    end: 11.5,
    gradient: 'from-[#6d38de] to-[#a78bfa]',
  },
  {
    id: '4',
    title: 'Linear Algebra',
    code: 'MA 201',
    room: 'Hall B',
    dayIndex: 2,
    start: 8,
    end: 9.5,
    gradient: 'from-[#602dce] to-[#8b5cf6]',
  },
  {
    id: '5',
    title: 'AI Planner Review',
    code: 'Workshop',
    room: 'Online',
    dayIndex: 2,
    start: 15,
    end: 16.5,
    gradient: 'from-[#7c3aed] to-[#c4b5fd]',
  },
  {
    id: '6',
    title: 'Software Engineering',
    code: 'CS 305',
    room: 'Room 220',
    dayIndex: 3,
    start: 11,
    end: 12.5,
    gradient: 'from-[#5b21b6] to-[#7c3aed]',
  },
  {
    id: '7',
    title: 'Database Systems',
    code: 'CS 310',
    room: 'Lab C',
    dayIndex: 4,
    start: 9,
    end: 11,
    gradient: 'from-[#6d28d9] to-[#a855f7]',
  },
  {
    id: '8',
    title: 'Study group',
    code: 'Group',
    room: 'Library 2F',
    dayIndex: 4,
    start: 14,
    end: 15.5,
    gradient: 'from-[#4c1d95] to-[#7c3aed]',
  },
];

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
  return `${a} – ${b}, ${y}`;
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

function ScheduleBlockCard({ block }: { block: ScheduleBlock }) {
  const top = (block.start - HOUR_START) * PX_PER_HOUR;
  const height = Math.max((block.end - block.start) * PX_PER_HOUR - 4, 36);

  return (
    <div
      className={`absolute left-0.5 right-0.5 z-10 overflow-hidden rounded-xl border border-white/25 bg-gradient-to-br px-2 py-1.5 text-white shadow-[0_8px_20px_-12px_rgba(109,56,222,0.85)] ${block.gradient}`}
      style={{ top, height }}
    >
      <p className={`${inter.className} text-[10px] font-semibold uppercase tracking-[0.06em] text-white/90`}>
        {block.code}
      </p>
      <p className={`${inter.className} text-[11px] font-bold leading-tight`}>{block.title}</p>
      <p className={`${inter.className} mt-0.5 text-[9px] font-medium text-white/85`}>
        {formatHour(block.start)} – {formatHour(block.end)}
      </p>
      <p className={`${inter.className} text-[9px] text-white/75`}>{block.room}</p>
    </div>
  );
}

export default function ViewSchedulePage() {
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = useMemo(() => {
    const base = startOfWeekMonday(new Date());
    return addDays(base, weekOffset * 7);
  }, [weekOffset]);

  const dayDates = useMemo(
    () => DAY_LABELS.map((_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const hours = useMemo(() => {
    const list: number[] = [];
    for (let h = HOUR_START; h <= HOUR_END; h += 1) list.push(h);
    return list;
  }, []);

  const gridHeight = (HOUR_END - HOUR_START) * PX_PER_HOUR;

  return (
    <div className="min-h-screen bg-[#fcf7ff]">
      <DashboardShellHeader />
      <Sidebar />
      <main className="min-h-screen px-4 pb-4 pt-[84px] sm:px-5 sm:pt-[86px] lg:ml-[210px] lg:px-5 lg:pb-5 lg:pt-[88px] xl:px-6">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-3 py-8 sm:px-5 lg:px-2">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <p className={`${inter.className} text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a7ca4]`}>
                Student schedule
              </p>
              <h1 className={`${manrope.className} text-[32px] font-extrabold tracking-[-0.04em] text-[#630ED4] sm:text-[36px]`}>
                View schedule
              </h1>
              <p className={`${inter.className} max-w-xl text-[14px] leading-relaxed text-[#4A4455]`}>
                Your weekly classes and blocks in one view. Scroll horizontally on smaller screens if needed.
              </p>
            </div>
            <div
              className={`${inter.className} flex items-center gap-2 rounded-2xl border border-[#eadcf7] bg-white px-3 py-2 shadow-[0_12px_30px_-28px_rgba(95,41,210,0.55)]`}
            >
              <button
                type="button"
                onClick={() => setWeekOffset((o) => o - 1)}
                className="rounded-xl px-3 py-1.5 text-[13px] font-semibold text-[#5a2ddf] transition hover:bg-[#f6f2ff]"
              >
                Prev
              </button>
              <span className="min-w-[10.5rem] text-center text-[13px] font-semibold text-[#2a1842]">
                {formatRange(weekStart)}
              </span>
              <button
                type="button"
                onClick={() => setWeekOffset((o) => o + 1)}
                className="rounded-xl px-3 py-1.5 text-[13px] font-semibold text-[#5a2ddf] transition hover:bg-[#f6f2ff]"
              >
                Next
              </button>
              <button
                type="button"
                onClick={() => setWeekOffset(0)}
                className="ml-1 rounded-xl bg-[#6d38de] px-3 py-1.5 text-[12px] font-bold uppercase tracking-wide text-white shadow-[0_10px_24px_-14px_rgba(109,56,222,0.9)] transition hover:bg-[#602dce]"
              >
                This week
              </button>
            </div>
          </header>

          <section className="overflow-hidden rounded-[28px] border border-[#eadcf7] bg-white shadow-[0_30px_46px_-40px_rgba(95,41,210,0.7)]">
            <div className="border-b border-[#efe7fa] px-5 py-4 sm:px-6">
              <p className={`${inter.className} text-[1.05rem] font-semibold tracking-[-0.02em] text-[#2e2e2e]`}>
                Week overview
              </p>
              <p className={`${inter.className} mt-1 text-[13px] text-[#6f5f8f]`}>
                {HOUR_START}:00 – {HOUR_END}:00 · Monday to Friday
              </p>
            </div>

            <div className="overflow-x-auto px-2 pb-4 pt-3 sm:px-4">
              <div className="min-w-[720px]">
                <div className="grid gap-0" style={{ gridTemplateColumns: `44px repeat(5, minmax(0, 1fr))` }}>
                  <div />
                  {DAY_LABELS.map((label, i) => {
                    const d = dayDates[i];
                    const isToday = d.toDateString() === new Date().toDateString();
                    return (
                      <div
                        key={label}
                        className={`border-b border-[#efe7fa] px-1 pb-2 text-center ${isToday ? 'rounded-t-xl bg-[#f6f2ff]/80' : ''}`}
                      >
                        <p className={`${inter.className} text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a7ca4]`}>
                          {label}
                        </p>
                        <p className={`${inter.className} text-[15px] font-bold ${isToday ? 'text-[#5a2ddf]' : 'text-[#2a1842]'}`}>
                          {d.getDate()}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="grid gap-0" style={{ gridTemplateColumns: `44px repeat(5, minmax(0, 1fr))` }}>
                  <div className="relative pr-1 text-right" style={{ height: gridHeight }}>
                    {hours.map((h) => (
                      <div
                        key={h}
                        className="absolute right-1 text-[10px] font-medium text-[#9ca3af]"
                        style={{ top: (h - HOUR_START) * PX_PER_HOUR - 6 }}
                      >
                        {formatAxisHour(h)}
                      </div>
                    ))}
                  </div>

                  {DAY_LABELS.map((_, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="relative border-l border-[#efe7fa] bg-[#faf8fc]/90"
                      style={{ height: gridHeight }}
                    >
                      {hours.slice(0, -1).map((h) => (
                        <div
                          key={h}
                          className="pointer-events-none absolute left-0 right-0 border-b border-[#f0e8fa]"
                          style={{ top: (h - HOUR_START + 1) * PX_PER_HOUR }}
                        />
                      ))}
                      {SAMPLE_BLOCKS.filter((b) => b.dayIndex === dayIndex).map((block) => (
                        <ScheduleBlockCard key={block.id} block={block} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#eadcf7] bg-white px-5 py-4 shadow-[0_22px_40px_-40px_rgba(95,41,210,0.85)] sm:px-6">
            <p className={`${inter.className} text-[0.9rem] font-semibold text-[#2e2e2e]`}>Up next</p>
            <ul className={`${inter.className} mt-3 space-y-2 text-[13px] text-[#5f4d7c]`}>
              {SAMPLE_BLOCKS.slice(0, 4).map((b) => (
                <li key={`list-${b.id}`} className="flex items-center justify-between gap-3 rounded-xl bg-[#faf7ff] px-3 py-2">
                  <span className="font-semibold text-[#4d2ca8]">
                    {b.code} · {b.title}
                  </span>
                  <span className="shrink-0 text-[#7b69a0]">
                    {DAY_LABELS[b.dayIndex]} · {formatHour(b.start)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
