'use client';

import Link from 'next/link';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import LecturerTabsNav from '@/components/lecturer/LecturerTabsNav';
import { buildAuthHeaders, getApiBaseUrl, getAuthRequestErrorMessage, readAuthSession } from '@/lib/auth';

type Course = { id: number; name: string; code: string };
type Assignment = {
  course?: { id: number; name?: string | null; code?: string | null } | null;
  courseId: number;
  description?: string | null;
  dueDate?: string | null;
  id: number;
  maxScore?: number | string | null;
  title: string;
};

const formatDateTimeLocal = (date: Date) => {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
};

const formatDue = (value?: string | null) => {
  if (!value) return 'No due date';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No due date';
  return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
};

function LecturerClassworkPageContent() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | 'all'>('all');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(formatDateTimeLocal(new Date(Date.now() + 24 * 60 * 60 * 1000)));
  const [maxScore, setMaxScore] = useState('100');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = useCallback(async () => {
    const session = readAuthSession();
    if (!session) {
      setErrorMessage('Sign in again to load classwork.');
      setIsLoading(false);
      return;
    }

    try {
      const headers = buildAuthHeaders(session.accessToken);
      const [coursesResponse, assignmentsResponse] = await Promise.all([
        fetch(`${apiBaseUrl}/api/courses`, { headers }),
        fetch(`${apiBaseUrl}/api/assignments`, { headers }),
      ]);
      const [coursesPayload, assignmentsPayload] = await Promise.all([
        coursesResponse.json().catch(() => null) as Promise<{ courses?: Course[]; error?: string } | null>,
        assignmentsResponse.json().catch(() => null) as Promise<{ assignments?: Assignment[]; error?: string; message?: string } | null>,
      ]);

      if (!coursesResponse.ok) throw new Error(coursesPayload?.error?.trim() || 'Unable to load courses.');
      if (!assignmentsResponse.ok) throw new Error(assignmentsPayload?.error?.trim() || assignmentsPayload?.message?.trim() || 'Unable to load classwork.');

      setCourses(coursesPayload?.courses ?? []);
      setAssignments(assignmentsPayload?.assignments ?? []);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(getAuthRequestErrorMessage(error, 'Unable to load classwork right now.', apiBaseUrl));
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const visibleAssignments = assignments.filter((assignment) => selectedCourseId === 'all' || assignment.courseId === selectedCourseId);
  const targetCourseId = selectedCourseId === 'all' ? courses[0]?.id : selectedCourseId;

  const createAssignment = async () => {
    const session = readAuthSession();
    const trimmedTitle = title.trim();

    if (!session) {
      setErrorMessage('Sign in again to create classwork.');
      return;
    }

    if (!targetCourseId) {
      setErrorMessage('Create a course before adding classwork.');
      return;
    }

    if (trimmedTitle.length < 3) {
      setErrorMessage('Assignment title must be at least 3 characters.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/assignments`, {
        method: 'POST',
        headers: buildAuthHeaders(session.accessToken),
        body: JSON.stringify({
          courseId: targetCourseId,
          description: description.trim() || null,
          dueDate: new Date(dueDate).toISOString(),
          maxScore: Number(maxScore) || null,
          title: trimmedTitle,
        }),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error?.trim() || 'Unable to create classwork right now.');
      }

      setTitle('');
      setDescription('');
      setSuccessMessage(payload?.message?.trim() || 'Classwork added to this course.');
      await loadData();
    } catch (error) {
      setErrorMessage(getAuthRequestErrorMessage(error, 'Unable to create classwork right now.', apiBaseUrl));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1120px] space-y-6">
      <LecturerTabsNav />
      <section className="space-y-6 pt-5">
        <header className="rounded-[28px] border border-[#eadcf7] bg-white px-6 py-6 shadow-[0_24px_40px_-34px_rgba(84,39,174,0.82)]">
          <span className="inline-flex rounded-full bg-[#efe3ff] px-3.5 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#6d38de]">
            Course Classwork
          </span>
          <h1 className="mt-3 text-[2.2rem] font-bold tracking-[-0.05em] text-[#28163f]">Classwork</h1>
          <p className="mt-2 max-w-[680px] text-[0.98rem] leading-7 text-[#5f4a79]">
            Only assignments you add to each course appear here and on enrolled students&apos; assignment dashboards.
          </p>
        </header>

        {errorMessage ? <p className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{errorMessage}</p> : null}
        {successMessage ? <p className="rounded-[18px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{successMessage}</p> : null}

        <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="rounded-[28px] border border-[#eadcf7] bg-white p-6 shadow-[0_24px_40px_-34px_rgba(84,39,174,0.82)]">
            <h2 className="text-[1.35rem] font-bold tracking-[-0.03em] text-[#28163f]">Add classwork</h2>
            <div className="mt-5 space-y-4">
              <select value={selectedCourseId} onChange={(event) => setSelectedCourseId(event.target.value === 'all' ? 'all' : Number(event.target.value))} className="h-12 w-full rounded-[16px] border border-[#e4d8fb] bg-[#fcfaff] px-4 text-sm font-semibold text-[#2a1842] outline-none">
                <option value="all">All courses</option>
                {courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}
              </select>
              <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Assignment title" className="h-12 w-full rounded-[16px] border border-[#e4d8fb] bg-[#fcfaff] px-4 text-sm text-[#2a1842] outline-none" />
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} placeholder="Instructions" className="w-full rounded-[16px] border border-[#e4d8fb] bg-[#fcfaff] px-4 py-3 text-sm text-[#2a1842] outline-none" />
              <input type="datetime-local" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="h-12 w-full rounded-[16px] border border-[#e4d8fb] bg-[#fcfaff] px-4 text-sm text-[#2a1842] outline-none" />
              <input type="number" value={maxScore} onChange={(event) => setMaxScore(event.target.value)} min="0" placeholder="Points" className="h-12 w-full rounded-[16px] border border-[#e4d8fb] bg-[#fcfaff] px-4 text-sm text-[#2a1842] outline-none" />
              <button type="button" onClick={createAssignment} disabled={isSaving} className="w-full rounded-full bg-[linear-gradient(135deg,#7641e8_0%,#9a73ef_100%)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
                {isSaving ? 'Adding...' : 'Add to course'}
              </button>
            </div>
          </aside>

          <div className="space-y-4">
            {isLoading ? <div className="rounded-[24px] border border-[#eadcf7] bg-white px-6 py-8 text-sm font-semibold text-[#6d38de]">Loading classwork...</div> : null}
            {!isLoading && visibleAssignments.length === 0 ? <div className="rounded-[24px] border border-[#eadcf7] bg-white px-6 py-8 text-sm font-semibold text-[#5f4a79]">No classwork yet for this course.</div> : null}
            {visibleAssignments.map((assignment) => (
              <article key={assignment.id} className="rounded-[26px] border border-[#eadcf7] bg-white p-5 shadow-[0_22px_38px_-32px_rgba(82,36,163,0.7)]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#7c6d92]">{assignment.course?.name ?? 'Course'}</p>
                    <h2 className="mt-1 text-[1.35rem] font-bold tracking-[-0.04em] text-[#28163f]">{assignment.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-[#6b5a88]">{assignment.description || 'No instructions added.'}</p>
                  </div>
                  <Link href={`/lecturer/grades?assignment=${assignment.id}`} className="rounded-full bg-[#efe6ff] px-4 py-2 text-sm font-semibold text-[#5a2ddf]">View submissions</Link>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[18px] bg-[#fcfaff] px-4 py-3"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">Due</p><p className="mt-1 text-sm font-semibold text-[#2a1842]">{formatDue(assignment.dueDate)}</p></div>
                  <div className="rounded-[18px] bg-[#fcfaff] px-4 py-3"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">Points</p><p className="mt-1 text-sm font-semibold text-[#2a1842]">{assignment.maxScore ?? 'Ungraded'}</p></div>
                  <div className="rounded-[18px] bg-[#fcfaff] px-4 py-3"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">Source</p><p className="mt-1 text-sm font-semibold text-[#2a1842]">Backend</p></div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}

export default function LecturerClassworkPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1120px] px-5 py-8 text-sm font-semibold text-[#6d38de]">Loading classwork...</div>}>
      <LecturerClassworkPageContent />
    </Suspense>
  );
}
