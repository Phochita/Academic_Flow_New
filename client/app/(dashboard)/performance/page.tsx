'use client';

import { startTransition, useEffect, useMemo, useState } from 'react';
import { buildAuthHeaders, getApiBaseUrl, getAuthRequestErrorMessage, readAuthSession } from '@/lib/auth';
import { fetchMyProfile, type UserProfile } from '@/lib/profile';

type TrajectoryMode = 'gpa' | 'attendance';

type TrajectoryPoint = {
  label: string;
  value: number;
  displayValue: string;
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

type PerformanceAnalysis = {
  band: string;
  improvements: string[];
  performanceScore: number;
  provider: string;
  recommendation: string;
  strengths: string[];
  summary: string;
};

type PerformanceData = {
  analysis: PerformanceAnalysis | null;
  attendanceSummary: ApiAttendanceSummary[];
  errorMessage: string;
  isLoading: boolean;
  profile: UserProfile | null;
};

const courseTones = ['bg-[#6d38de]', 'bg-[#4f46e5]', 'bg-[#b83267]', 'bg-[#8b5cf6]'];

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="m12 3 2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 17.2 6.44 20.1l1.06-6.2L3 9.52l6.22-.9L12 3Z" />
    </svg>
  );
}

const calculateAttendance = (summary: ApiAttendanceSummary[]) => {
  const total = summary.reduce((sum, item) => sum + item.total, 0);
  const present = summary.reduce((sum, item) => sum + item.present, 0);

  return total > 0 ? Math.round((present / total) * 100) : 0;
};

const buildTrajectorySeries = (mode: TrajectoryMode, currentGpa: number | null, attendancePercentage: number): TrajectoryPoint[] => {
  const currentValue = mode === 'gpa' ? Math.round(((currentGpa ?? 0) / 4) * 100) : attendancePercentage;
  const currentDisplay = mode === 'gpa' ? (currentGpa === null ? '--' : currentGpa.toFixed(2)) : `${attendancePercentage}%`;
  const labels = ['Start', 'Checkpoint', 'Current'];

  return labels.map((label, index) => {
    if (index === labels.length - 1) {
      return { label, value: currentValue, displayValue: currentDisplay };
    }

    const drift = mode === 'gpa' ? 10 - index * 4 : 8 - index * 3;
    const value = Math.max(8, Math.min(100, currentValue - drift));
    const displayValue =
      mode === 'gpa'
        ? currentGpa === null
          ? '--'
          : ((value / 100) * 4).toFixed(2)
        : `${value}%`;

    return { label, value, displayValue };
  });
};

const requestPerformanceAnalysis = async (
  accessToken: string,
  currentGpa: number | null,
  earnedCredits: number | null,
  attendancePercentage: number,
  attendanceSummary: ApiAttendanceSummary[],
) => {
  const response = await fetch(`${getApiBaseUrl()}/api/ai/performance-analysis`, {
    method: 'POST',
    headers: buildAuthHeaders(accessToken),
    body: JSON.stringify({
      attendancePercentage,
      currentGpa,
      earnedCredits,
      courses: attendanceSummary.map((course) => ({
        attendancePercentage: course.attendancePercentage,
        courseName: course.courseName,
        totalRecords: course.total,
      })),
    }),
  });
  const payload = (await response.json().catch(() => null)) as { analysis?: PerformanceAnalysis; message?: string } | null;

  if (!response.ok || !payload?.analysis) {
    throw new Error(payload?.message || 'Unable to analyze performance right now.');
  }

  return payload.analysis;
};

const usePerformanceData = (): PerformanceData => {
  const [data, setData] = useState<PerformanceData>({
    analysis: null,
    attendanceSummary: [],
    errorMessage: '',
    isLoading: true,
    profile: null,
  });

  useEffect(() => {
    let ignore = false;
    const session = readAuthSession();

    const loadPerformance = async () => {
      if (!session) {
        if (!ignore) {
          setData((current) => ({
            ...current,
            errorMessage: 'Sign in again to load AI performance analysis.',
            isLoading: false,
          }));
        }
        return;
      }

      try {
        const headers = buildAuthHeaders(session.accessToken);
        const [profile, attendanceResponse] = await Promise.all([
          fetchMyProfile(session.accessToken),
          fetch(`${getApiBaseUrl()}/api/attendance/summary`, { headers }),
        ]);
        const attendancePayload = (await attendanceResponse.json().catch(() => null)) as { summary?: ApiAttendanceSummary[]; message?: string } | null;

        if (!attendanceResponse.ok) {
          throw new Error(attendancePayload?.message || 'Unable to load attendance summary right now.');
        }

        const attendanceSummary = attendancePayload?.summary ?? [];
        const attendancePercentage = calculateAttendance(attendanceSummary);
        const analysis = await requestPerformanceAnalysis(
          session.accessToken,
          profile.currentGpa,
          profile.earnedCredits,
          attendancePercentage,
          attendanceSummary,
        );

        if (!ignore) {
          setData({
            analysis,
            attendanceSummary,
            errorMessage: '',
            isLoading: false,
            profile,
          });
        }
      } catch (error) {
        if (!ignore) {
          setData((current) => ({
            ...current,
            errorMessage: getAuthRequestErrorMessage(error, 'Unable to load performance right now.'),
            isLoading: false,
          }));
        }
      }
    };

    void loadPerformance();

    return () => {
      ignore = true;
    };
  }, []);

  return data;
};

export default function PerformanceDashboard() {
  const [trajectoryMode, setTrajectoryMode] = useState<TrajectoryMode>('gpa');
  const performanceData = usePerformanceData();
  const currentGpa = performanceData.profile?.currentGpa ?? null;
  const earnedCredits = performanceData.profile?.earnedCredits ?? null;
  const attendancePercentage = useMemo(
    () => calculateAttendance(performanceData.attendanceSummary),
    [performanceData.attendanceSummary],
  );
  const performanceScore =
    performanceData.analysis?.performanceScore ??
    (currentGpa === null ? attendancePercentage : Math.round(((currentGpa / 4) * 100) * 0.65 + attendancePercentage * 0.35));
  const activeSeries = useMemo(
    () => buildTrajectorySeries(trajectoryMode, currentGpa, attendancePercentage),
    [attendancePercentage, currentGpa, trajectoryMode],
  );
  const strongestCourse = performanceData.attendanceSummary.slice().sort((a, b) => b.attendancePercentage - a.attendancePercentage)[0] ?? null;

  return (
    <div className="mx-auto max-w-[1120px] space-y-6">
      {performanceData.errorMessage ? (
        <p className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {performanceData.errorMessage}
        </p>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_250px_250px]">
        <section className="rounded-[28px] border border-[#eadcf7] bg-white px-7 py-7 shadow-[0_28px_44px_-38px_rgba(95,41,210,0.7)]">
          <p className="text-[0.82rem] font-semibold uppercase tracking-[0.32em] text-[#6d5b87]">GPA Achievement</p>
          <div className="mt-5 flex items-end gap-3">
            <span className="text-[3.1rem] font-bold tracking-[-0.08em] text-[#6d38de]">
              {performanceData.isLoading ? '...' : currentGpa === null ? '--' : currentGpa.toFixed(2)}
            </span>
            <span className="pb-2 text-[1.55rem] text-[#4f3d6c]">GPA</span>
          </div>
          <p className="mt-3 inline-flex items-center gap-2 text-[1.05rem] font-medium text-[#0f9d69]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m5 15 4-4 3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            From your backend profile
          </p>
        </section>

        <section className="rounded-[28px] border border-[#eadcf7] bg-white px-6 py-7 shadow-[0_28px_44px_-38px_rgba(95,41,210,0.7)]">
          <p className="text-[0.82rem] font-semibold uppercase tracking-[0.32em] text-[#6d5b87]">Attendance</p>
          <div className="mt-5 flex items-end gap-2">
            <span className="text-[2.55rem] font-bold tracking-[-0.07em] text-[#2a1842]">{performanceData.isLoading ? '...' : attendancePercentage}</span>
            <span className="pb-2 text-[1.45rem] text-[#4f3d6c]">%</span>
          </div>
          <div className="mt-6 h-2.5 rounded-full bg-[#efe4fb]">
            <div className="h-2.5 rounded-full bg-[linear-gradient(90deg,#6d38de_0%,#4f46e5_100%)] shadow-[0_10px_18px_-16px_rgba(79,70,229,1)]" style={{ width: `${attendancePercentage}%` }} />
          </div>
        </section>

        <section className="rounded-[28px] border border-[#eadcf7] bg-white px-6 py-7 shadow-[0_28px_44px_-38px_rgba(95,41,210,0.7)]">
          <p className="text-[0.82rem] font-semibold uppercase tracking-[0.32em] text-[#6d5b87]">Credits</p>
          <div className="mt-5 flex items-end gap-2">
            <span className="text-[2.45rem] font-bold tracking-[-0.07em] text-[#2a1842]">{earnedCredits ?? '--'}</span>
            <span className="pb-2 text-[1.45rem] text-[#4f3d6c]">earned</span>
          </div>
          <p className="mt-4 text-[1.05rem] text-[#6b5a88]">{performanceData.profile?.department ?? 'Profile department not set'}</p>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-[30px] border border-[#eadcf7] bg-white p-6 shadow-[0_28px_46px_-38px_rgba(95,41,210,0.7)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-[1.7rem] font-bold tracking-[-0.04em] text-[#2a1842]">Performance Trajectory</h2>
              <p className="mt-2 text-[0.96rem] text-[#6b5a88]">Derived from GPA and teacher-signed attendance.</p>
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
                onClick={() => startTransition(() => setTrajectoryMode('attendance'))}
                className={`rounded-[14px] px-4 py-2 text-sm font-medium transition ${
                  trajectoryMode === 'attendance' ? 'bg-white text-[#5d34df] shadow-[0_10px_20px_-18px_rgba(93,52,223,0.75)]' : 'text-[#64547e]'
                }`}
              >
                Attendance
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
                          style={{ height: `${Math.max(point.value, 4)}%` }}
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
                style={{ background: `conic-gradient(#b12e60 0deg ${performanceScore * 3.6}deg, #f2e5f0 ${performanceScore * 3.6}deg 360deg)` }}
              >
                <div className="grid h-[78px] w-[78px] place-items-center rounded-full bg-white text-center">
                  <div>
                    <p className="text-[1.9rem] font-bold tracking-[-0.06em] text-[#2a1842]">{performanceData.isLoading ? '...' : performanceScore}</p>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#6d5b87]">Score</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[1.65rem] font-bold leading-tight tracking-[-0.04em] text-[#2a1842]">AI Metric</h3>
                <p className="mt-3 text-[0.94rem] leading-7 text-[#6b5a88]">
                  Blends GPA with attendance consistency.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#e5d6f7] bg-[#f5ecff] px-6 py-6 shadow-[0_28px_44px_-38px_rgba(95,41,210,0.55)]">
            <h3 className="text-[1.5rem] font-bold tracking-[-0.04em] text-[#5d34df]">Performance Band</h3>
            <p className="mt-5 text-[2rem] font-bold tracking-[-0.05em] text-[#2a1842]">
              {performanceData.analysis?.band ?? 'Analyzing'}
            </p>
            <p className="mt-4 text-[0.92rem] italic leading-7 text-[#7c5ce6]">
              {performanceData.analysis?.summary ?? 'AI analysis will appear after backend metrics load.'}
            </p>
          </section>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="rounded-[30px] border border-[#eadcf7] bg-white p-6 shadow-[0_28px_46px_-38px_rgba(95,41,210,0.7)]">
          <h2 className="text-[1.7rem] font-bold tracking-[-0.04em] text-[#2a1842]">Attendance Mastery</h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {performanceData.attendanceSummary.map((course, index) => (
              <article key={course.courseId} className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-[1rem] font-semibold text-[#28163f]">{course.courseName}</h3>
                  <span className="text-[0.94rem] font-medium text-[#5d34df]">{course.attendancePercentage}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-[#efe5fb]">
                  <div className={`h-2.5 rounded-full ${courseTones[index % courseTones.length]}`} style={{ width: `${course.attendancePercentage}%` }} />
                </div>
              </article>
            ))}
          </div>

          {!performanceData.isLoading && performanceData.attendanceSummary.length === 0 ? (
            <p className="mt-6 rounded-[18px] border border-[#eadcf7] bg-[#fcfaff] px-4 py-3 text-sm font-semibold text-[#5f4a79]">
              No teacher-signed attendance records are available for performance analysis yet.
            </p>
          ) : null}

          <div className="mt-8 flex items-start gap-4 rounded-[22px] border border-[#eadcf7] bg-[#f8f1ff] px-5 py-5">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#6d38de] text-white">
              <StarIcon />
            </div>
            <p className="text-[0.95rem] leading-7 text-[#5f4a79]">
              <span className="font-semibold text-[#28163f]">Data Insight:</span>{' '}
              {strongestCourse
                ? `${strongestCourse.courseName} is currently the strongest attendance signal in your performance profile.`
                : 'Attendance and GPA will combine here after teachers mark records.'}
            </p>
          </div>
        </section>

        <section className="rounded-[30px] bg-[#1b0930] px-6 py-6 text-white shadow-[0_32px_50px_-34px_rgba(27,9,48,0.95)]">
          <div className="flex items-center gap-3 text-[#f6f0ff]">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
              <StarIcon />
            </div>
            <p className="text-[0.95rem] font-semibold uppercase tracking-[0.14em]">AI Performance Analysis</p>
          </div>

          <div className="mt-10 space-y-8">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#26d07c]" />
                <h3 className="text-[1.45rem] font-semibold tracking-[-0.03em]">Strengths</h3>
              </div>
              <ul className="mt-4 space-y-3 text-[1.02rem] leading-8 text-white/78">
                {(performanceData.analysis?.strengths.length ? performanceData.analysis.strengths : ['Loading GPA and attendance signals...']).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffbf1f]" />
                <h3 className="text-[1.45rem] font-semibold tracking-[-0.03em]">Improve Next</h3>
              </div>
              <ul className="mt-4 space-y-3 text-[1.02rem] leading-8 text-white/78">
                {(performanceData.analysis?.improvements.length ? performanceData.analysis.improvements : ['AI recommendations will appear after analysis.']).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 rounded-[20px] bg-white/10 px-5 py-5">
            <p className="text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-white/65">Recommendation</p>
            <p className="mt-3 text-[1.02rem] leading-8 text-white/82">
              {performanceData.analysis?.recommendation ?? 'Waiting for AI analysis.'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
