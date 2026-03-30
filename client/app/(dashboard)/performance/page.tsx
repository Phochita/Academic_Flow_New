'use client';

import { startTransition, useState } from 'react';

type TrajectoryMode = 'gpa' | 'scores';

type TrajectoryPoint = {
  label: string;
  value: number;
  displayValue: string;
};

type DisciplineStat = {
  name: string;
  level: string;
  progress: number;
  tone: string;
};

const trajectorySeries: Record<TrajectoryMode, TrajectoryPoint[]> = {
  gpa: [
    { label: 'Sep', value: 64, displayValue: '3.11' },
    { label: 'Oct', value: 78, displayValue: '3.34' },
    { label: 'Nov', value: 85, displayValue: '3.51' },
    { label: 'Dec', value: 93, displayValue: '3.68' },
    { label: 'Jan', value: 98, displayValue: '3.82' },
  ],
  scores: [
    { label: 'Sep', value: 72, displayValue: '82' },
    { label: 'Oct', value: 79, displayValue: '86' },
    { label: 'Nov', value: 87, displayValue: '89' },
    { label: 'Dec', value: 91, displayValue: '92' },
    { label: 'Jan', value: 95, displayValue: '94' },
  ],
};

const disciplineStats: DisciplineStat[] = [
  { name: 'Computer Science', level: 'Mastery (98%)', progress: 98, tone: 'bg-[#6d38de]' },
  { name: 'Mathematics', level: 'Advanced (92%)', progress: 92, tone: 'bg-[#6d38de]' },
  { name: 'Biology', level: 'Proficient (84%)', progress: 84, tone: 'bg-[#6d38de]' },
  { name: 'Literature', level: 'Developing (68%)', progress: 68, tone: 'bg-[#c9bddb]' },
];

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="m12 3 2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 17.2 6.44 20.1l1.06-6.2L3 9.52l6.22-.9L12 3Z" />
    </svg>
  );
}

export default function PerformanceDashboard() {
  const [trajectoryMode, setTrajectoryMode] = useState<TrajectoryMode>('gpa');
  const activeSeries = trajectorySeries[trajectoryMode];

  return (
    <div className="mx-auto max-w-[1120px] space-y-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_250px_250px]">
        <section className="rounded-[28px] border border-[#eadcf7] bg-white px-7 py-7 shadow-[0_28px_44px_-38px_rgba(95,41,210,0.7)]">
          <p className="text-[0.82rem] font-semibold uppercase tracking-[0.32em] text-[#6d5b87]">Cumulative Achievement</p>
          <div className="mt-5 flex items-end gap-3">
            <span className="text-[3.1rem] font-bold tracking-[-0.08em] text-[#6d38de]">3.82</span>
            <span className="pb-2 text-[1.55rem] text-[#4f3d6c]">GPA</span>
          </div>
          <p className="mt-3 inline-flex items-center gap-2 text-[1.15rem] font-medium text-[#0f9d69]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m5 15 4-4 3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            +0.12 from last term
          </p>
        </section>

        <section className="rounded-[28px] border border-[#eadcf7] bg-white px-6 py-7 shadow-[0_28px_44px_-38px_rgba(95,41,210,0.7)]">
          <p className="text-[0.82rem] font-semibold uppercase tracking-[0.32em] text-[#6d5b87]">Class Rank</p>
          <div className="mt-5 flex items-end gap-2">
            <span className="text-[2.55rem] font-bold tracking-[-0.07em] text-[#2a1842]">Top 5</span>
            <span className="pb-2 text-[1.45rem] text-[#4f3d6c]">%</span>
          </div>
          <div className="mt-6 h-2.5 rounded-full bg-[#efe4fb]">
            <div className="h-2.5 w-[92%] rounded-full bg-[linear-gradient(90deg,#6d38de_0%,#4f46e5_100%)] shadow-[0_10px_18px_-16px_rgba(79,70,229,1)]" />
          </div>
        </section>

        <section className="rounded-[28px] border border-[#eadcf7] bg-white px-6 py-7 shadow-[0_28px_44px_-38px_rgba(95,41,210,0.7)]">
          <p className="text-[0.82rem] font-semibold uppercase tracking-[0.32em] text-[#6d5b87]">Total Credits</p>
          <div className="mt-5 flex items-end gap-2">
            <span className="text-[2.45rem] font-bold tracking-[-0.07em] text-[#2a1842]">112</span>
            <span className="pb-2 text-[1.45rem] text-[#4f3d6c]">/140</span>
          </div>
          <p className="mt-4 text-[1.05rem] text-[#6b5a88]">Senior Status approaching</p>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-[30px] border border-[#eadcf7] bg-white p-6 shadow-[0_28px_46px_-38px_rgba(95,41,210,0.7)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-[1.7rem] font-bold tracking-[-0.04em] text-[#2a1842]">Grade Trajectory</h2>
              <p className="mt-2 text-[0.96rem] text-[#6b5a88]">Monthly GPA progression across academic year</p>
            </div>

            <div className="flex items-center rounded-[18px] bg-[#f2e5ff] p-1.5">
              <button
                type="button"
                onClick={() => startTransition(() => setTrajectoryMode('gpa'))}
                className={`rounded-[14px] px-4 py-2 text-sm font-medium transition ${
                  trajectoryMode === 'gpa' ? 'bg-white text-[#5d34df] shadow-[0_10px_20px_-18px_rgba(93,52,223,0.75)]' : 'text-[#64547e]'
                }`}
              >
                GPA
              </button>
              <button
                type="button"
                onClick={() => startTransition(() => setTrajectoryMode('scores'))}
                className={`rounded-[14px] px-4 py-2 text-sm font-medium transition ${
                  trajectoryMode === 'scores' ? 'bg-white text-[#5d34df] shadow-[0_10px_20px_-18px_rgba(93,52,223,0.75)]' : 'text-[#64547e]'
                }`}
              >
                Scores
              </button>
            </div>
          </div>

          <div className="mt-7 rounded-[24px] border border-[#f1e8fb] bg-[#fffefe] px-6 py-5">
            <div className="relative h-[280px]">
              <div className="absolute inset-x-0 top-[18%] border-t border-dashed border-[#eee3fb]" />
              <div className="absolute inset-x-0 top-[49%] border-t border-dashed border-[#eee3fb]" />
              <div className="absolute inset-x-0 top-[80%] border-t border-dashed border-[#eee3fb]" />

              <div className="flex h-full items-end justify-between gap-6 border-b border-l border-[#f1e8fb] px-5 pb-1 pt-4">
                {activeSeries.map((point, index) => {
                  const isLatest = index === activeSeries.length - 1;

                  return (
                    <div key={`${trajectoryMode}-${point.label}`} className="flex w-full flex-col items-center gap-3">
                      <div className="h-10">
                        {isLatest ? (
                          <span className="inline-flex rounded-[12px] bg-[#6d38de] px-3 py-1.5 text-sm font-semibold text-white shadow-[0_14px_22px_-16px_rgba(109,56,222,0.95)]">
                            {point.displayValue}
                          </span>
                        ) : null}
                      </div>
                      <div className="flex h-full w-full items-end justify-center">
                        <div
                          className={`w-8 rounded-t-[12px] ${
                            isLatest
                              ? 'bg-[linear-gradient(180deg,#a788f5_0%,#6d38de_100%)] shadow-[0_20px_26px_-22px_rgba(109,56,222,1)]'
                              : 'bg-[linear-gradient(180deg,#d7c8f7_0%,#bea8f0_100%)]'
                          }`}
                          style={{ height: `${point.value}%` }}
                        />
                      </div>
                      <span className="pt-2 text-[0.95rem] font-semibold uppercase tracking-[0.18em] text-[#5f4a79]">
                        {point.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-[28px] border border-[#eadcf7] bg-white px-6 py-6 shadow-[0_28px_44px_-38px_rgba(95,41,210,0.7)]">
            <div className="flex items-center gap-5">
              <div
                className="grid h-[102px] w-[102px] place-items-center rounded-full"
                style={{ background: 'conic-gradient(#b12e60 0deg 317deg, #f2e5f0 317deg 360deg)' }}
              >
                <div className="grid h-[78px] w-[78px] place-items-center rounded-full bg-white text-center">
                  <div>
                    <p className="text-[1.9rem] font-bold tracking-[-0.06em] text-[#2a1842]">88</p>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#6d5b87]">Score</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[1.65rem] font-bold leading-tight tracking-[-0.04em] text-[#2a1842]">Engagement Metric</h3>
                <p className="mt-3 text-[0.94rem] leading-7 text-[#6b5a88]">
                  Reflects participation and lecture attendance.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#e5d6f7] bg-[#f5ecff] px-6 py-6 shadow-[0_28px_44px_-38px_rgba(95,41,210,0.55)]">
            <h3 className="text-[1.5rem] font-bold tracking-[-0.04em] text-[#5d34df]">Peer Benchmark</h3>

            <div className="mt-8 space-y-6">
              <div>
                <div className="flex items-center justify-between gap-4 text-[0.9rem] font-semibold uppercase tracking-[0.16em]">
                  <span className="text-[#2a1842]">Your Score</span>
                  <span className="text-[#5d34df]">94%</span>
                </div>
                <div className="mt-3 h-2.5 rounded-full bg-[#ebe0fa]">
                  <div className="h-2.5 w-[94%] rounded-full bg-[#6d38de]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-4 text-[0.9rem] font-semibold uppercase tracking-[0.16em]">
                  <span className="text-[#6b5a88]">Class Avg</span>
                  <span className="text-[#6b5a88]">76%</span>
                </div>
                <div className="mt-3 h-2.5 rounded-full bg-[#ebe0fa]">
                  <div className="h-2.5 w-[76%] rounded-full bg-[#bcaed2]" />
                </div>
              </div>
            </div>

            <p className="mt-6 text-[0.92rem] italic leading-7 text-[#7c5ce6]">
              You are performing 23% better than the peer average.
            </p>
          </section>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="rounded-[30px] border border-[#eadcf7] bg-white p-6 shadow-[0_28px_46px_-38px_rgba(95,41,210,0.7)]">
          <h2 className="text-[1.7rem] font-bold tracking-[-0.04em] text-[#2a1842]">Discipline Mastery</h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {disciplineStats.map((discipline) => (
              <article key={discipline.name} className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-[1rem] font-semibold text-[#28163f]">{discipline.name}</h3>
                  <span className="text-[0.94rem] font-medium text-[#5d34df]">{discipline.level}</span>
                </div>
                <div className="h-2.5 rounded-full bg-[#efe5fb]">
                  <div className={`h-2.5 rounded-full ${discipline.tone}`} style={{ width: `${discipline.progress}%` }} />
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex items-start gap-4 rounded-[22px] border border-[#eadcf7] bg-[#f8f1ff] px-5 py-5">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#6d38de] text-white">
              <StarIcon />
            </div>
            <p className="text-[0.95rem] leading-7 text-[#5f4a79]">
              <span className="font-semibold text-[#28163f]">Faculty Insight:</span> Your computational logic remains your strongest asset. Consider bridging these skills into your Biology research projects for interdisciplinary synergy.
            </p>
          </div>
        </section>

        <section className="rounded-[30px] bg-[#1b0930] px-6 py-6 text-white shadow-[0_32px_50px_-34px_rgba(27,9,48,0.95)]">
          <div className="flex items-center gap-3 text-[#f6f0ff]">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
              <StarIcon />
            </div>
            <p className="text-[0.95rem] font-semibold uppercase tracking-[0.14em]">AI Curator Insights</p>
          </div>

          <div className="mt-10 space-y-10">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#26d07c]" />
                <h3 className="text-[1.55rem] font-semibold tracking-[-0.03em]">Core Strength: Analytical Writing</h3>
              </div>
              <p className="mt-4 text-[1.05rem] leading-9 text-white/78">
                Your lab reports show consistently high structure scores, placing you in the top 3% of faculty ratings.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffbf1f]" />
                <h3 className="text-[1.8rem] font-semibold tracking-[-0.03em]">Improvement: Literature Syntax</h3>
              </div>
              <p className="mt-4 text-[1.05rem] leading-9 text-white/78">
                Review sessions for &apos;Romanticism&apos; are scheduled next Tuesday. Attendance is highly recommended to boost mid-term potential.
              </p>
            </div>
          </div>

          <button className="mt-12 inline-flex w-full items-center justify-center gap-3 rounded-[20px] bg-[linear-gradient(135deg,#7b47ed_0%,#5d34df_100%)] px-6 py-5 text-xl font-semibold text-white shadow-[0_20px_32px_-18px_rgba(93,52,223,0.95)] transition hover:scale-[1.01]">
            Open Personalized Study Plan
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </section>
      </div>
    </div>
  );
}
