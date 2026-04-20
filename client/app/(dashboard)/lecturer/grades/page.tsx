'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import LecturerTabsNav from '@/components/lecturer/LecturerTabsNav';
import { lecturerAssignmentGroups, type LecturerAssignmentGroup } from '../lecturerData';

function cloneAssignmentGroups() {
  return lecturerAssignmentGroups.map((assignment) => ({
    ...assignment,
    students: assignment.students.map((student) => ({ ...student })),
  }));
}

export default function LecturerGradesPage() {
  const searchParams = useSearchParams();
  const [gradebook, setGradebook] = useState<LecturerAssignmentGroup[]>(() => cloneAssignmentGroups());
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const [openWorkKey, setOpenWorkKey] = useState<string | null>(null);

  const selectedAssignmentId = searchParams.get('assignment');
  const orderedAssignments = selectedAssignmentId
    ? [
        ...gradebook.filter((assignment) => assignment.id === selectedAssignmentId),
        ...gradebook.filter((assignment) => assignment.id !== selectedAssignmentId),
      ]
    : gradebook;

  const toGradeCount = gradebook.reduce(
    (total, assignment) =>
      total + assignment.students.filter((student) => student.status === 'Ready to grade' || student.status === 'Needs review').length,
    0
  );
  const gradedCount = gradebook.reduce(
    (total, assignment) =>
      total + assignment.students.filter((student) => student.status === 'Graded' || student.status === 'Returned').length,
    0
  );
  const missingCount = gradebook.reduce(
    (total, assignment) => total + assignment.students.filter((student) => student.status === 'Missing').length,
    0
  );

  function updateStudentScore(assignmentId: string, studentId: string, score: string) {
    setGradebook((current) =>
      current.map((assignment) =>
        assignment.id !== assignmentId
          ? assignment
          : {
              ...assignment,
              students: assignment.students.map((student) =>
                student.id === studentId ? { ...student, score } : student
              ),
            }
      )
    );
  }

  function updateStudentFeedback(assignmentId: string, studentId: string, feedback: string) {
    setGradebook((current) =>
      current.map((assignment) =>
        assignment.id !== assignmentId
          ? assignment
          : {
              ...assignment,
              students: assignment.students.map((student) =>
                student.id === studentId ? { ...student, feedback } : student
              ),
            }
      )
    );
  }

  function saveGrade(assignmentId: string, studentId: string) {
    setGradebook((current) =>
      current.map((assignment) =>
        assignment.id !== assignmentId
          ? assignment
          : {
              ...assignment,
              students: assignment.students.map((student) => {
                if (student.id !== studentId) {
                  return student;
                }

                const isMissing = student.score.trim() === '' || student.score.trim() === '-';

                return {
                  ...student,
                  status: isMissing ? 'Missing' : 'Graded',
                  submittedAt: isMissing ? 'Missing' : 'Saved just now',
                };
              }),
            }
      )
    );

    setBannerMessage('Grade saved successfully.');
  }

  function returnAllGraded(assignmentId: string) {
    setGradebook((current) =>
      current.map((assignment) =>
        assignment.id !== assignmentId
          ? assignment
          : {
              ...assignment,
              students: assignment.students.map((student) =>
                student.status === 'Graded' ? { ...student, status: 'Returned' } : student
              ),
            }
      )
    );

    setBannerMessage('All graded work for this assignment has been returned.');
  }

  return (
    <div className="mx-auto max-w-[1120px] space-y-6">
      <LecturerTabsNav />

      <section className="space-y-6 pt-5">
        {bannerMessage ? (
          <div className="rounded-[20px] border border-[#d8c4f8] bg-[#f7f2ff] px-5 py-4 text-sm font-semibold text-[#5a2ddf]">
            {bannerMessage}
          </div>
        ) : null}

        <header className="rounded-[28px] border border-[#eadcf7] bg-white px-6 py-6 shadow-[0_24px_40px_-34px_rgba(84,39,174,0.82)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex rounded-full bg-[#efe3ff] px-3.5 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#6d38de]">
                Assignment Grading
              </span>
              <h1 className="text-[2.2rem] font-bold tracking-[-0.05em] text-[#28163f]">Grades</h1>
              <p className="max-w-[680px] text-[0.98rem] leading-7 text-[#5f4a79]">
                Review each assignment, see who it was assigned to, and grade students directly from the same page.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <article className="rounded-[22px] border border-[#efe3fb] bg-[#fcf9ff] px-4 py-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#7c6d92]">To Grade</p>
                <p className="mt-2 text-[1.45rem] font-bold text-[#2a1842]">{toGradeCount}</p>
              </article>
              <article className="rounded-[22px] border border-[#efe3fb] bg-[#fcf9ff] px-4 py-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#7c6d92]">Graded</p>
                <p className="mt-2 text-[1.45rem] font-bold text-[#2a1842]">{gradedCount}</p>
              </article>
              <article className="rounded-[22px] border border-[#efe3fb] bg-[#fcf9ff] px-4 py-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#7c6d92]">Missing</p>
                <p className="mt-2 text-[1.45rem] font-bold text-[#2a1842]">{missingCount}</p>
              </article>
            </div>
          </div>
        </header>

        <div className="space-y-5">
          {orderedAssignments.map((assignment) => (
            <section
              key={assignment.id}
              className={`rounded-[28px] border bg-white p-6 shadow-[0_24px_40px_-34px_rgba(84,39,174,0.82)] ${
                assignment.id === selectedAssignmentId ? 'border-[#ccb4f5]' : 'border-[#eadcf7]'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">
                    <span>{assignment.course}</span>
                    <span className="text-[#b59ed8]">/</span>
                    <span>{assignment.points}</span>
                  </div>
                  <h2 className="text-[1.35rem] font-bold tracking-[-0.04em] text-[#28163f]">{assignment.title}</h2>
                  <p className="text-sm text-[#6b5a88]">Due {assignment.due}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/lecturer/classwork?item=${encodeURIComponent(assignment.id)}&mode=details`}
                    className="rounded-full border border-[#dbc8fa] px-4 py-2 text-sm font-semibold text-[#5a2ddf] transition hover:border-[#cdb5f7]"
                  >
                    View assignment
                  </Link>
                  <button
                    type="button"
                    onClick={() => returnAllGraded(assignment.id)}
                    className="rounded-full bg-[#efe6ff] px-4 py-2 text-sm font-semibold text-[#5a2ddf] transition hover:bg-[#e5d6ff]"
                  >
                    Return all graded
                  </button>
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-[22px] border border-[#f0e7fb]">
                <div className="grid grid-cols-[1.1fr_1fr_0.9fr_0.8fr_1fr] gap-4 bg-[#faf7ff] px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">
                  <span>Student</span>
                  <span>Submission</span>
                  <span>Status</span>
                  <span>Score</span>
                  <span>Actions</span>
                </div>
                {assignment.students.map((student) => {
                  const workKey = `${assignment.id}:${student.id}`;
                  const isOpen = openWorkKey === workKey;

                  return (
                    <div key={workKey}>
                      <div className="grid grid-cols-[1.1fr_1fr_0.9fr_0.8fr_1fr] items-center gap-4 border-t border-[#f2ebfb] px-5 py-4 text-sm text-[#2a1842]">
                        <span className="font-semibold">{student.student}</span>
                        <span>{student.submittedAt}</span>
                        <span>{student.status}</span>
                        <div>
                          <input
                            type="text"
                            value={student.score}
                            onChange={(event) => updateStudentScore(assignment.id, student.id, event.target.value)}
                            className="w-20 rounded-[12px] border border-[#e4d8fb] bg-[#fcfaff] px-3 py-2 text-sm font-semibold text-[#5a2ddf] outline-none focus:border-[#cdb5f7]"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setOpenWorkKey(isOpen ? null : workKey)}
                            className="rounded-full border border-[#dbc8fa] px-3 py-1.5 text-xs font-semibold text-[#5a2ddf] transition hover:border-[#cdb5f7]"
                          >
                            Open work
                          </button>
                          <button
                            type="button"
                            onClick={() => saveGrade(assignment.id, student.id)}
                            className="rounded-full bg-[#efe6ff] px-3 py-1.5 text-xs font-semibold text-[#5a2ddf] transition hover:bg-[#e5d6ff]"
                          >
                            Save grade
                          </button>
                        </div>
                      </div>

                      {isOpen ? (
                        <div className="border-t border-[#f2ebfb] bg-[#fcf9ff] px-5 py-5">
                          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                            <div className="space-y-4">
                              <div className="rounded-[18px] bg-white p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">Submission Summary</p>
                                <p className="mt-2 text-sm leading-6 text-[#5f4a79]">{student.submissionNote}</p>
                              </div>
                              <div className="rounded-[18px] bg-white p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">Assignment Guidance</p>
                                <p className="mt-2 text-sm leading-6 text-[#5f4a79]">{assignment.assignmentSummary}</p>
                              </div>
                            </div>

                            <div className="rounded-[18px] bg-white p-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">Feedback</p>
                              <textarea
                                rows={5}
                                value={student.feedback}
                                onChange={(event) => updateStudentFeedback(assignment.id, student.id, event.target.value)}
                                className="mt-2 w-full rounded-[14px] border border-[#e4d8fb] bg-[#fcfaff] px-3 py-3 text-sm text-[#2a1842] outline-none focus:border-[#cdb5f7]"
                              />
                              <button
                                type="button"
                                onClick={() => saveGrade(assignment.id, student.id)}
                                className="mt-4 w-full rounded-full bg-[linear-gradient(135deg,#7641e8_0%,#9a73ef_100%)] px-4 py-2.5 text-sm font-semibold text-white"
                              >
                                Save Grade And Feedback
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
