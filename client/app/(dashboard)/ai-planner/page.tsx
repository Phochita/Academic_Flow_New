'use client';

import { startTransition, useState } from 'react';

type FlowMode = 'daily' | 'weekly';
type FocusGoal = 'exam' | 'growth';

type FlowItem = {
  timeLabel: string;
  timeValue: string;
  title: string;
  subtitle: string;
  category: string;
  tone: 'class' | 'focus' | 'social' | 'deadline' | 'review';
  highlight?: string;
  actionLabel?: string;
};

type QueueItem = {
  label: string;
  title: string;
  due: string;
  intensity: string;
  tone: 'urgent' | 'major';
};

const flowSchedule: Record<FlowMode, FlowItem[]> = {
  daily: [
    {
      timeLabel: 'Start',
      timeValue: '08:30',
      title: 'CS402: Advanced Algorithms',
      subtitle: 'Lecture Hall B-12 â€¢ Professor Miller',
      category: 'Academic',
      tone: 'class',
    },
    {
      timeLabel: 'Deep',
      timeValue: '14:00',
      title: 'Deep Focus: Project Phase 2',
      subtitle: 'AI Recommended: Your brain is at peak analytical state.',
      category: 'Focus',
      tone: 'focus',
      highlight: 'Now',
      actionLabel: 'Start Session',
    },
    {
      timeLabel: 'Start',
      timeValue: '11:00',
      title: 'Team Sync: Final Project',
      subtitle: 'Library Study Pod 04 â€¢ 4 Members',
      category: 'Social',
      tone: 'social',
    },
    {
      timeLabel: 'Due',
      timeValue: '17:00',
      title: 'Network Security Paper Submission',
      subtitle: 'Critical Deadline â€¢ 15% of Final Grade',
      category: 'Deadline',
      tone: 'deadline',
    },
    {
      timeLabel: 'Start',
      timeValue: '19:30',
      title: 'Personal Study: Discrete Math',
      subtitle: 'Reviewing Week 7 Lectures',
      category: 'Review',
      tone: 'review',
    },
  ],
  weekly: [
    {
      timeLabel: 'Mon',
      timeValue: '08:00',
      title: 'Systems Design Studio',
      subtitle: 'Prototype walkthrough and sprint planning.',
      category: 'Academic',
      tone: 'class',
    },
    {
      timeLabel: 'Tue',
      timeValue: '15:00',
      title: 'Peak Focus: Compiler Architecture',
      subtitle: 'Reserved for deep implementation work.',
      category: 'Focus',
      tone: 'focus',
      highlight: 'Best block',
      actionLabel: 'Start Session',
    },
    {
      timeLabel: 'Wed',
      timeValue: '13:30',
      title: 'Research Sync with Mentor',
      subtitle: 'Milestone review and paper structure feedback.',
      category: 'Social',
      tone: 'social',
    },
    {
      timeLabel: 'Thu',
      timeValue: '18:00',
      title: 'Operating Systems Lab Submission',
      subtitle: 'Deadline window closes tonight.',
      category: 'Deadline',
      tone: 'deadline',
    },
    {
      timeLabel: 'Fri',
      timeValue: '19:00',
      title: 'Concept Review: Discrete Structures',
      subtitle: 'Light revision block to consolidate the week.',
      category: 'Review',
      tone: 'review',
    },
  ],
};

const priorityQueues: QueueItem[] = [
  { label: 'Urgent', title: 'Algorithm Analysis Quiz', due: 'Due in 4h', intensity: 'High', tone: 'urgent' },
  { label: 'Major', title: 'Compiler Design Project', due: 'Oct 24', intensity: 'Medium', tone: 'major' },
];

function PlannerSparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5 9.9 7.9 4.5 10 9.9 12.1 12 17.5l2.1-5.4 5.4-2.1-5.4-2.1L12 2.5Z" />
      <path d="M19 15.5 18.15 17.7 16 18.55l2.15.85L19 21.5l.85-2.1 2.15-.85-2.15-.85L19 15.5Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2.5" />
      <path d="M8 3v4M16 3v4M4 10h16" strokeLinecap="round" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M4 12a8 8 0 0 1 13.66-5.66L20 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 4v4h-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 12a8 8 0 0 1-13.66 5.66L4 16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 20v-4h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LightningIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M13.2 2 6.7 12.03h4.37L10.8 22l6.5-10.02h-4.36L13.2 2Z" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M12 3.4 2.8 20h18.4L12 3.4Zm.95 12.48h-1.9V10.1h1.9v5.78Zm0 3.02h-1.9v-1.9h1.9v1.9Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function SummaryIcon({ kind }: { kind: 'study' | 'breaks' | 'prep' }) {
  if (kind === 'breaks') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <path d="M12 4v5" strokeLinecap="round" />
        <path d="M12 15v5" strokeLinecap="round" />
        <path d="M5.5 8.5 9 10.2" strokeLinecap="round" />
        <path d="m15 13.8 3.5 1.7" strokeLinecap="round" />
        <path d="m18.5 8.5-3.5 1.7" strokeLinecap="round" />
        <path d="m9 13.8-3.5 1.7" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2.8" />
      </svg>
    );
  }

  if (kind === 'prep') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M12 2.8 14 7l4.6.67-3.3 3.22.78 4.55L12 13.35 7.92 15.44l.78-4.55L5.4 7.67 10 7l2-4.2Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function getFlowItemStyles(tone: FlowItem['tone']) {
  switch (tone) {
    case 'focus':
      return {
        card: 'border-[#cdb8ff] bg-[linear-gradient(135deg,#f7f1ff_0%,#efe5ff_100%)] shadow-[0_24px_40px_-36px_rgba(109,56,222,0.95)]',
        category: 'bg-[#eadcff] text-[#6d38de]',
        accent: 'bg-[#6d38de]',
        time: 'text-[#5d34df]',
        action: 'bg-[linear-gradient(135deg,#6d38de_0%,#7645ef_100%)] text-white shadow-[0_22px_28px_-22px_rgba(109,56,222,0.95)]',
      };
    case 'deadline':
      return {
        card: 'border-[#f1ccd6] bg-white',
        category: 'bg-[#fbe7ec] text-[#bb2e58]',
        accent: 'bg-[#c33361]',
        time: 'text-[#c33361]',
        action: 'bg-[#fbe7ec] text-[#bb2e58]',
      };
    case 'social':
      return {
        card: 'border-[#f0e3fb] bg-[#fbf7ff]',
        category: 'bg-[#efe2fa] text-[#9b6ab4]',
        accent: 'bg-[#cab2e6]',
        time: 'text-[#74608f]',
        action: 'bg-white text-[#5d34df]',
      };
    case 'review':
      return {
        card: 'border-[#efe4f8] bg-[#faf7fd]',
        category: 'bg-[#f1e8fa] text-[#b49bc3]',
        accent: 'bg-[#ded0ea]',
        time: 'text-[#a496b4]',
        action: 'bg-white text-[#5d34df]',
      };
    default:
      return {
        card: 'border-[#efe4f8] bg-[#faf5ff]',
        category: 'bg-[#ece2fb] text-[#6d38de]',
        accent: 'bg-[#d8c5fb]',
        time: 'text-[#2a1842]',
        action: 'bg-white text-[#5d34df]',
      };
  }
}

export default function AiPlannerPage() {
  const [flowMode, setFlowMode] = useState<FlowMode>('daily');
  const [focusGoal, setFocusGoal] = useState<FocusGoal>('exam');
  const [studyIntensity, setStudyIntensity] = useState(50);
  const [prioritizeDifficult, setPrioritizeDifficult] = useState(true);
  const activeFlow = flowSchedule[flowMode];

  return (
    <div className="mx-auto max-w-[1120px] space-y-6">
      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-3 text-[1.7rem] font-semibold text-[#5d34df]">
              <PlannerSparkIcon />
              <span className="tracking-[0.18em] text-[0.95rem] uppercase">Academic Engine v2.4</span>
            </div>
            <h1 className="text-[2.8rem] font-bold tracking-[-0.06em] text-[#2a1842]">AceFlow Intelligence</h1>
            <p className="max-w-[540px] text-[0.98rem] leading-7 text-[#66567f]">
              Predictive scheduling engine optimizing your cognitive load for maximum academic efficiency.
            </p>
          </div>

          <section className="rounded-[28px] border border-[#eadcf7] bg-white p-6 shadow-[0_28px_46px_-38px_rgba(95,41,210,0.7)]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-[1.7rem] font-bold tracking-[-0.05em] text-[#2a1842]">AI Insights</h2>
              <span className="rounded-[12px] bg-[#efe3ff] px-3 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#6d38de]">
                Live Data
              </span>
            </div>

            <div className="mt-6 space-y-6">
              <div className="flex gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#ece5ff] text-[#6d38de]">
                  <LightningIcon />
                </div>
                <div>
                  <p className="text-[0.88rem] font-semibold uppercase tracking-[0.16em] text-[#6d5b87]">Peak Focus Window</p>
                  <h3 className="mt-2 text-[1.7rem] font-bold tracking-[-0.05em] text-[#2a1842]">14:00 - 16:30 Today</h3>
                  <p className="mt-2 text-[0.94rem] leading-7 text-[#6b5a88]">
                    Your cognitive performance is projected to be 24% higher during this block.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#fbe0ea] text-[#b52f5a]">
                  <AlertIcon />
                </div>
                <div className="w-full">
                  <p className="text-[0.88rem] font-semibold uppercase tracking-[0.16em] text-[#6d5b87]">Burnout Risk</p>
                  <div className="mt-2 flex items-center gap-3">
                    <h3 className="text-[1.6rem] font-bold tracking-[-0.05em] text-[#b52f5a]">Low-Medium</h3>
                    <div className="h-2 w-20 rounded-full bg-[#eedaf1]">
                      <div className="h-2 w-9 rounded-full bg-[#b52f5a]" />
                    </div>
                  </div>
                  <p className="mt-2 text-[0.94rem] leading-7 text-[#6b5a88]">
                    Consistent sleep patterns have stabilized your risk level. Maintain 7.5h tonight.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[20px] bg-[#f4e8ff] px-5 py-5 text-center">
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#5f4a79]">Efficiency</p>
                <p className="mt-2 text-[1.7rem] font-bold tracking-[-0.05em] text-[#5d34df]">92%</p>
              </div>
              <div className="rounded-[20px] bg-[#f4e8ff] px-5 py-5 text-center">
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#5f4a79]">Tasks Cleared</p>
                <p className="mt-2 text-[1.7rem] font-bold tracking-[-0.05em] text-[#5d34df]">14/16</p>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#eadcf7] bg-white p-6 shadow-[0_28px_46px_-38px_rgba(95,41,210,0.7)]">
            <h2 className="text-[1.7rem] font-bold tracking-[-0.05em] text-[#2a1842]">Smart Parameters</h2>

            <div className="mt-6 space-y-6">
              <div>
                <p className="text-[0.88rem] font-semibold uppercase tracking-[0.16em] text-[#5f4a79]">Focus Goal</p>
                <div className="mt-4 grid grid-cols-2 gap-3 rounded-[20px] bg-[#f5ecff] p-1.5">
                  <button
                    type="button"
                    onClick={() => startTransition(() => setFocusGoal('exam'))}
                    className={`rounded-[16px] px-4 py-4 text-[1rem] font-semibold transition ${
                      focusGoal === 'exam'
                        ? 'bg-[linear-gradient(135deg,#6d38de_0%,#5f29d2_100%)] text-white shadow-[0_20px_24px_-20px_rgba(95,41,210,0.95)]'
                        : 'text-[#6c5d86]'
                    }`}
                  >
                    Exam Prep
                  </button>
                  <button
                    type="button"
                    onClick={() => startTransition(() => setFocusGoal('growth'))}
                    className={`rounded-[16px] px-4 py-4 text-[1rem] font-semibold transition ${
                      focusGoal === 'growth'
                        ? 'bg-[linear-gradient(135deg,#6d38de_0%,#5f29d2_100%)] text-white shadow-[0_20px_24px_-20px_rgba(95,41,210,0.95)]'
                        : 'text-[#6c5d86]'
                    }`}
                  >
                    Skill Growth
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[0.88rem] font-semibold uppercase tracking-[0.16em] text-[#5f4a79]">Study Intensity</p>
                  <span className="text-sm font-semibold text-[#6d38de]">{studyIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={studyIntensity}
                  onChange={(event) => setStudyIntensity(Number(event.target.value))}
                  className="mt-5 h-2 w-full cursor-pointer appearance-none rounded-full bg-[#ecd9ff] accent-[#6d38de]"
                />
                <div className="mt-3 flex items-center justify-between text-[0.88rem] font-semibold uppercase tracking-[0.14em] text-[#6b5a88]">
                  <span>Chill</span>
                  <span className="text-[#6d38de]">Balanced</span>
                  <span>Crunch</span>
                </div>
              </div>

              <div className="rounded-[22px] bg-[#f7ecff] px-5 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl font-semibold text-[#6d38de]">!</div>
                    <div>
                      <p className="text-[1.12rem] font-semibold leading-7 text-[#2a1842]">Prioritize Difficult Subjects</p>
                      <p className="mt-1 text-sm text-[#7b6d90]">Weighted ML/Algorithms</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPrioritizeDifficult((current) => !current)}
                    aria-pressed={prioritizeDifficult}
                    className={`relative h-8 w-14 rounded-full transition ${
                      prioritizeDifficult ? 'bg-[#6d38de]' : 'bg-[#d9cdeb]'
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-[0_8px_18px_-14px_rgba(0,0,0,0.6)] transition ${
                        prioritizeDifficult ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-[1.7rem] font-bold tracking-[-0.05em] text-[#2a1842]">Priority Queues</h2>

            {priorityQueues.map((item) => {
              const isUrgent = item.tone === 'urgent';

              return (
                <article
                  key={item.title}
                  className={`rounded-[26px] border bg-white px-6 py-5 shadow-[0_26px_44px_-40px_rgba(95,41,210,0.7)] ${
                    isUrgent ? 'border-[#f0ccd6]' : 'border-[#dcd1ff]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={`rounded-[12px] px-3 py-1.5 text-[0.76rem] font-semibold uppercase tracking-[0.14em] ${
                        isUrgent ? 'bg-[#fde8ee] text-[#c33361]' : 'bg-[#efe5ff] text-[#6d38de]'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="text-sm text-[#7b6d90]">{item.due}</span>
                  </div>

                  <h3 className="mt-4 text-[1.75rem] font-bold tracking-[-0.05em] text-[#2a1842]">{item.title}</h3>

                  <div className="mt-4 flex items-center gap-3 text-[0.9rem] font-semibold uppercase tracking-[0.14em] text-[#5f4a79]">
                    <span className={`h-2.5 w-2.5 rounded-full ${isUrgent ? 'bg-[#c33361]' : 'bg-[#6d38de]'}`} />
                    <span>Intensity: {item.intensity}</span>
                  </div>
                </article>
              );
            })}
          </section>
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div />
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-3 rounded-[20px] border border-[#eadcf7] bg-white px-6 py-4 text-[1.1rem] font-semibold text-[#5f4a79] shadow-[0_22px_30px_-34px_rgba(95,41,210,0.95)] transition hover:border-[#d9c7ff] hover:text-[#5d34df]"
              >
                <CalendarIcon />
                Export Schedule
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-3 rounded-[20px] bg-[linear-gradient(135deg,#6d38de_0%,#8a63ff_100%)] px-6 py-4 text-[1.1rem] font-semibold text-white shadow-[0_24px_30px_-24px_rgba(109,56,222,0.95)] transition hover:translate-y-[-1px]"
              >
                <RefreshIcon />
                Recalculate Flow
              </button>
            </div>
          </div>

          <section className="overflow-hidden rounded-[34px] border border-[#eadcf7] bg-white shadow-[0_30px_46px_-40px_rgba(95,41,210,0.7)]">
            <div className="flex flex-wrap items-center justify-between gap-5 border-b border-[#f0e5fb] px-7 py-7">
              <div className="flex items-center gap-5">
                <h2 className="text-[1.7rem] font-bold tracking-[-0.05em] text-[#2a1842]">Weekly Flow</h2>

                <div className="flex items-center rounded-[18px] bg-[#f3e8ff] p-1.5">
                  <button
                    type="button"
                    onClick={() => startTransition(() => setFlowMode('daily'))}
                    className={`rounded-[14px] px-4 py-2.5 text-[1rem] font-semibold transition ${
                      flowMode === 'daily' ? 'bg-white text-[#5d34df] shadow-[0_10px_20px_-18px_rgba(93,52,223,0.75)]' : 'text-[#6d5b87]'
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    type="button"
                    onClick={() => startTransition(() => setFlowMode('weekly'))}
                    className={`rounded-[14px] px-4 py-2.5 text-[1rem] font-semibold transition ${
                      flowMode === 'weekly' ? 'bg-white text-[#5d34df] shadow-[0_10px_20px_-18px_rgba(93,52,223,0.75)]' : 'text-[#6d5b87]'
                    }`}
                  >
                    Weekly
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Previous date range"
                  className="grid h-11 w-11 place-items-center rounded-full border border-[#eadcf7] text-[#7c6d92] transition hover:text-[#5d34df]"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="m14.5 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <span className="text-[1.15rem] font-semibold text-[#2a1842]">Oct 16 - Oct 22</span>
                <button
                  type="button"
                  aria-label="Next date range"
                  className="grid h-11 w-11 place-items-center rounded-full border border-[#eadcf7] text-[#7c6d92] transition hover:text-[#5d34df]"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="m9.5 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="relative px-7 py-7">
              <div className="pointer-events-none absolute left-[76px] right-7 top-[287px] hidden border-t-2 border-dashed border-[#cfb7ff] xl:block" />
              <div className="pointer-events-none absolute left-[47px] top-[274px] hidden rounded-[10px] bg-[#b99cff] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white xl:block">
                Now
              </div>

              <div className="space-y-7">
                {activeFlow.map((item) => {
                  const styles = getFlowItemStyles(item.tone);

                  return (
                    <div key={`${flowMode}-${item.title}`} className="grid gap-4 xl:grid-cols-[76px_minmax(0,1fr)] xl:items-start">
                      <div className="pt-6 text-[0.95rem] font-semibold tracking-[0.04em] text-[#b0a2c4] xl:text-right">
                        {item.tone === 'focus' && item.highlight ? (
                          <div className="mb-4 hidden xl:block" />
                        ) : null}
                        {item.timeLabel === 'Mon' || item.timeLabel === 'Tue' || item.timeLabel === 'Wed' || item.timeLabel === 'Thu' || item.timeLabel === 'Fri'
                          ? item.timeValue
                          : item.timeValue}
                      </div>

                      <article
                        className={`rounded-[28px] border px-7 py-6 transition ${styles.card}`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-5">
                          <div className="flex min-w-0 flex-1 items-start gap-5">
                            <div className="min-w-[90px] border-r border-[#e6d8f8] pr-5">
                              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[#85749c]">{item.timeLabel}</p>
                              <p className={`mt-2 text-[1.7rem] font-bold tracking-[-0.05em] ${styles.time}`}>{item.timeValue}</p>
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-3">
                                {item.highlight ? (
                                  <span className="rounded-[10px] bg-[#efe4ff] px-2.5 py-1 text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-[#6d38de]">
                                    {item.highlight}
                                  </span>
                                ) : null}
                                <h3 className="text-[1.65rem] font-bold leading-tight tracking-[-0.05em] text-[#2a1842]">{item.title}</h3>
                              </div>
                              <p className={`mt-2 text-[0.95rem] leading-6 ${item.tone === 'deadline' ? 'text-[#c33361]' : 'text-[#6b5a88]'}`}>
                                {item.subtitle}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className={`rounded-full px-4 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] ${styles.category}`}>
                              {item.category}
                            </span>
                            {item.actionLabel ? (
                              <button type="button" className={`rounded-[16px] px-6 py-4 text-[1rem] font-semibold transition hover:translate-y-[-1px] ${styles.action}`}>
                                {item.actionLabel}
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                aria-label="Add planner item"
                className="fixed bottom-8 right-8 grid h-16 w-16 place-items-center rounded-full bg-[linear-gradient(135deg,#6d38de_0%,#7a4af1_100%)] text-white shadow-[0_28px_34px_-22px_rgba(109,56,222,1)] transition hover:scale-[1.02] xl:absolute xl:bottom-8 xl:right-8"
              >
                <PlusIcon />
              </button>
            </div>

            <div className="grid gap-4 border-t border-[#f0e5fb] px-7 py-6 sm:grid-cols-3">
              <div className="flex items-center gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#efe5ff] text-[#6d38de]">
                  <SummaryIcon kind="study" />
                </div>
                <div>
                  <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[#7e7092]">Study Time</p>
                  <p className="mt-1 text-[1.55rem] font-bold tracking-[-0.04em] text-[#2a1842]">4h 45m Scheduled</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#f6ebff] text-[#6d38de]">
                  <SummaryIcon kind="breaks" />
                </div>
                <div>
                  <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[#7e7092]">Breaks</p>
                  <p className="mt-1 text-[1.55rem] font-bold tracking-[-0.04em] text-[#2a1842]">1h 15m Allocated</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#fce7f0] text-[#b52f5a]">
                  <SummaryIcon kind="prep" />
                </div>
                <div>
                  <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[#7e7092]">Prep Level</p>
                  <p className="mt-1 text-[1.55rem] font-bold tracking-[-0.04em] text-[#2a1842]">High (78%)</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
