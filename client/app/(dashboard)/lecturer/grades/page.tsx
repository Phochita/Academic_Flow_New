'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import LecturerTabsNav from '@/components/lecturer/LecturerTabsNav';
import { buildAuthHeaders, getApiBaseUrl, getAuthRequestErrorMessage, readAuthSession } from '@/lib/auth';

type Assignment = {
  course?: { name?: string | null } | null;
  dueDate?: string | null;
  id: number;
  maxScore?: number | string | null;
  title: string;
};

type Submission = {
  feedback?: string | null;
  fileUrl?: string | null;
  grade?: number | string | null;
  gradedAt?: string | null;
  id: number;
  student?: { email?: string | null; fullName?: string | null; id?: string | null } | null;
  submittedAt?: string | null;
  submissionText?: string | null;
};

type AssignmentWithSubmissions = Assignment & { submissions: Submission[] };

const formatDate = (value?: string | null) => {
  if (!value) return 'Not submitted';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not submitted';
  return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
};

function LecturerGradesPageContent() {
  const searchParams = useSearchParams();
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const selectedAssignmentId = searchParams.get('assignment');
  const [gradebook, setGradebook] = useState<AssignmentWithSubmissions[]>([]);
  const [draftGrades, setDraftGrades] = useState<Record<number, string>>({});
  const [draftFeedback, setDraftFeedback] = useState<Record<number, string>>({});
  const [bannerMessage, setBannerMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [savingSubmissionId, setSavingSubmissionId] = useState<number | null>(null);

  const loadGradebook = useCallback(async () => {
    const session = readAuthSession();
    if (!session) {
      setErrorMessage('Sign in again to load submissions.');
      setIsLoading(false);
      return;
    }

    try {
      const headers = buildAuthHeaders(session.accessToken);
      const assignmentsResponse = await fetch(`${apiBaseUrl}/api/assignments`, { headers });
      const assignmentsPayload = (await assignmentsResponse.json().catch(() => null)) as { assignments?: Assignment[]; error?: string; message?: string } | null;

      if (!assignmentsResponse.ok) {
        throw new Error(assignmentsPayload?.error?.trim() || assignmentsPayload?.message?.trim() || 'Unable to load assignments.');
      }

      const assignments = assignmentsPayload?.assignments ?? [];
      const groups = await Promise.all(assignments.map(async (assignment) => {
        const response = await fetch(`${apiBaseUrl}/api/assignments/${assignment.id}/submissions`, { headers });
        const payload = (await response.json().catch(() => null)) as { submissions?: Submission[]; error?: string; message?: string } | null;

        if (!response.ok) {
          throw new Error(payload?.error?.trim() || payload?.message?.trim() || `Unable to load submissions for ${assignment.title}.`);
        }

        return { ...assignment, submissions: payload?.submissions ?? [] };
      }));

      const nextDraftGrades: Record<number, string> = {};
      const nextDraftFeedback: Record<number, string> = {};
      for (const group of groups) {
        for (const submission of group.submissions) {
          nextDraftGrades[submission.id] = submission.grade === null || submission.grade === undefined ? '' : String(submission.grade);
          nextDraftFeedback[submission.id] = submission.feedback ?? '';
        }
      }

      setGradebook(groups);
      setDraftGrades(nextDraftGrades);
      setDraftFeedback(nextDraftFeedback);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(getAuthRequestErrorMessage(error, 'Unable to load submissions right now.', apiBaseUrl));
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    void loadGradebook();
  }, [loadGradebook]);

  const orderedAssignments = selectedAssignmentId
    ? [
        ...gradebook.filter((assignment) => String(assignment.id) === selectedAssignmentId),
        ...gradebook.filter((assignment) => String(assignment.id) !== selectedAssignmentId),
      ]
    : gradebook;
  const submittedGroups = orderedAssignments.filter((assignment) => assignment.submissions.length > 0);
  const toGradeCount = gradebook.reduce((total, assignment) => total + assignment.submissions.filter((submission) => !submission.gradedAt).length, 0);
  const gradedCount = gradebook.reduce((total, assignment) => total + assignment.submissions.filter((submission) => submission.gradedAt).length, 0);

  const saveGrade = async (assignmentId: number, submissionId: number) => {
    const session = readAuthSession();
    const grade = Number(draftGrades[submissionId]);

    if (!session) {
      setErrorMessage('Sign in again to save grades.');
      return;
    }

    if (!Number.isFinite(grade)) {
      setErrorMessage('Enter a numeric grade before saving.');
      return;
    }

    setSavingSubmissionId(submissionId);
    setErrorMessage('');
    setBannerMessage('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/assignments/${assignmentId}/submissions/${submissionId}/grade`, {
        method: 'PATCH',
        headers: buildAuthHeaders(session.accessToken),
        body: JSON.stringify({
          feedback: draftFeedback[submissionId] ?? '',
          grade,
        }),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error?.trim() || 'Unable to save this grade.');
      }

      setBannerMessage(payload?.message?.trim() || 'Grade saved successfully.');
      await loadGradebook();
    } catch (error) {
      setErrorMessage(getAuthRequestErrorMessage(error, 'Unable to save this grade.', apiBaseUrl));
    } finally {
      setSavingSubmissionId(null);
    }
  };

  return (
    <div className="mx-auto max-w-[1120px] space-y-6">
      <LecturerTabsNav />
      <section className="space-y-6 pt-5">
        {bannerMessage ? <p className="rounded-[20px] border border-[#d8c4f8] bg-[#f7f2ff] px-5 py-4 text-sm font-semibold text-[#5a2ddf]">{bannerMessage}</p> : null}
        {errorMessage ? <p className="rounded-[20px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">{errorMessage}</p> : null}

        <header className="rounded-[28px] border border-[#eadcf7] bg-white px-6 py-6 shadow-[0_24px_40px_-34px_rgba(84,39,174,0.82)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex rounded-full bg-[#efe3ff] px-3.5 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#6d38de]">Submitted Work Only</span>
              <h1 className="mt-3 text-[2.2rem] font-bold tracking-[-0.05em] text-[#28163f]">Grades</h1>
              <p className="mt-2 max-w-[680px] text-[0.98rem] leading-7 text-[#5f4a79]">Students appear here only after they submit work for an assignment.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <article className="rounded-[22px] border border-[#efe3fb] bg-[#fcf9ff] px-4 py-4"><p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#7c6d92]">To Grade</p><p className="mt-2 text-[1.45rem] font-bold text-[#2a1842]">{isLoading ? '...' : toGradeCount}</p></article>
              <article className="rounded-[22px] border border-[#efe3fb] bg-[#fcf9ff] px-4 py-4"><p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#7c6d92]">Graded</p><p className="mt-2 text-[1.45rem] font-bold text-[#2a1842]">{isLoading ? '...' : gradedCount}</p></article>
            </div>
          </div>
        </header>

        {isLoading ? <div className="rounded-[24px] border border-[#eadcf7] bg-white px-6 py-8 text-sm font-semibold text-[#6d38de]">Loading submissions...</div> : null}
        {!isLoading && submittedGroups.length === 0 ? <div className="rounded-[24px] border border-[#eadcf7] bg-white px-6 py-8 text-sm font-semibold text-[#5f4a79]">No student submissions yet.</div> : null}

        <div className="space-y-5">
          {submittedGroups.map((assignment) => (
            <section key={assignment.id} className="rounded-[28px] border border-[#eadcf7] bg-white p-6 shadow-[0_24px_40px_-34px_rgba(84,39,174,0.82)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">{assignment.course?.name ?? 'Course'} / {assignment.maxScore ?? 100} points</p>
                  <h2 className="mt-1 text-[1.35rem] font-bold tracking-[-0.04em] text-[#28163f]">{assignment.title}</h2>
                  <p className="mt-1 text-sm text-[#6b5a88]">Due {formatDate(assignment.dueDate)}</p>
                </div>
                <Link href={`/lecturer/classwork`} className="rounded-full border border-[#dbc8fa] px-4 py-2 text-sm font-semibold text-[#5a2ddf]">Back to classwork</Link>
              </div>

              <div className="mt-5 space-y-4">
                {assignment.submissions.map((submission) => (
                  <article key={submission.id} className="rounded-[22px] border border-[#f0e7fb] bg-[#fcfaff] p-4">
                    <div className="grid gap-4 xl:grid-cols-[1fr_1fr_120px_140px] xl:items-start">
                      <div>
                        <p className="font-semibold text-[#2a1842]">{submission.student?.fullName || submission.student?.email || 'Student'}</p>
                        <p className="mt-1 text-xs text-[#7c6d92]">{submission.student?.email}</p>
                        <p className="mt-2 text-sm text-[#6b5a88]">Submitted {formatDate(submission.submittedAt)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">Work</p>
                        <p className="mt-2 text-sm leading-6 text-[#5f4a79]">{submission.submissionText || 'No text note submitted.'}</p>
                        {submission.fileUrl ? <a className="mt-2 inline-block text-sm font-semibold text-[#5a2ddf]" href={submission.fileUrl} target="_blank" rel="noreferrer">Open file</a> : null}
                      </div>
                      <input value={draftGrades[submission.id] ?? ''} onChange={(event) => setDraftGrades((current) => ({ ...current, [submission.id]: event.target.value }))} placeholder="Grade" className="h-11 rounded-[14px] border border-[#e4d8fb] bg-white px-3 text-sm font-semibold text-[#2a1842] outline-none" />
                      <button type="button" onClick={() => saveGrade(assignment.id, submission.id)} disabled={savingSubmissionId === submission.id} className="h-11 rounded-full bg-[#6d38de] px-4 text-sm font-semibold text-white disabled:opacity-60">{savingSubmissionId === submission.id ? 'Saving...' : 'Save grade'}</button>
                    </div>
                    <textarea value={draftFeedback[submission.id] ?? ''} onChange={(event) => setDraftFeedback((current) => ({ ...current, [submission.id]: event.target.value }))} rows={3} placeholder="Feedback" className="mt-4 w-full rounded-[16px] border border-[#e4d8fb] bg-white px-4 py-3 text-sm text-[#2a1842] outline-none" />
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function LecturerGradesPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1120px] px-5 py-8 text-sm font-semibold text-[#6d38de]">Loading grades...</div>}>
      <LecturerGradesPageContent />
    </Suspense>
  );
}
