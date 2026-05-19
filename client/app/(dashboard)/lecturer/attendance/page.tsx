'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import LecturerTabsNav from '@/components/lecturer/LecturerTabsNav';
import { buildAuthHeaders, getApiBaseUrl, getAuthRequestErrorMessage, readAuthSession } from '@/lib/auth';

type Course = { id: number; name: string; code: string };
type Student = { email?: string | null; enrollmentStatus?: string | null; fullName?: string | null; id: string };
type AttendanceStatus = 'present' | 'absent';

const todayIsoDate = () => new Date().toISOString().slice(0, 10);

function LecturerAttendancePageContent() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [attendanceDate, setAttendanceDate] = useState(todayIsoDate());
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      const session = readAuthSession();
      if (!session) {
        setErrorMessage('Sign in again to load attendance.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiBaseUrl}/api/courses`, {
          headers: buildAuthHeaders(session.accessToken),
        });
        const payload = (await response.json().catch(() => null)) as { courses?: Course[]; error?: string } | null;

        if (!response.ok) throw new Error(payload?.error?.trim() || 'Unable to load courses.');

        const nextCourses = payload?.courses ?? [];
        setCourses(nextCourses);
        setSelectedCourseId((current) => current ?? nextCourses[0]?.id ?? null);
      } catch (error) {
        setErrorMessage(getAuthRequestErrorMessage(error, 'Unable to load courses.', apiBaseUrl));
      } finally {
        setIsLoading(false);
      }
    };

    void loadCourses();
  }, [apiBaseUrl]);

  useEffect(() => {
    const loadStudents = async () => {
      const session = readAuthSession();
      if (!session || !selectedCourseId) {
        setStudents([]);
        return;
      }

      try {
        const response = await fetch(`${apiBaseUrl}/api/courses/${selectedCourseId}/students`, {
          headers: buildAuthHeaders(session.accessToken),
        });
        const payload = (await response.json().catch(() => null)) as { students?: Student[]; error?: string } | null;

        if (!response.ok) throw new Error(payload?.error?.trim() || 'Unable to load students.');

        const nextStudents = (payload?.students ?? []).filter((student) => student.enrollmentStatus !== 'pending');
        setStudents(nextStudents);
        setStatuses(Object.fromEntries(nextStudents.map((student) => [student.id, 'present' as AttendanceStatus])));
        setErrorMessage('');
      } catch (error) {
        setErrorMessage(getAuthRequestErrorMessage(error, 'Unable to load students.', apiBaseUrl));
      }
    };

    void loadStudents();
  }, [apiBaseUrl, selectedCourseId]);

  const selectedCourse = courses.find((course) => course.id === selectedCourseId) ?? null;
  const presentCount = students.filter((student) => statuses[student.id] === 'present').length;
  const absentCount = students.length - presentCount;

  const saveAttendance = async () => {
    const session = readAuthSession();
    if (!session || !selectedCourseId) {
      setErrorMessage('Choose a course before saving attendance.');
      return;
    }

    if (students.length === 0) {
      setErrorMessage('Invite students to this course before marking attendance.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/attendance`, {
        method: 'POST',
        headers: buildAuthHeaders(session.accessToken),
        body: JSON.stringify({
          attendanceDate,
          courseId: selectedCourseId,
          records: students.map((student) => ({
            studentId: student.id,
            status: statuses[student.id] ?? 'absent',
          })),
        }),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;

      if (!response.ok) throw new Error(payload?.error?.trim() || 'Unable to save attendance.');

      setSuccessMessage(payload?.message?.trim() || 'Attendance saved successfully.');
    } catch (error) {
      setErrorMessage(getAuthRequestErrorMessage(error, 'Unable to save attendance.', apiBaseUrl));
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
            Attendance
          </span>
          <h1 className="mt-3 text-[2.2rem] font-bold tracking-[-0.05em] text-[#28163f]">Mark Attendance</h1>
          <p className="mt-2 max-w-[680px] text-[0.98rem] leading-7 text-[#5f4a79]">
            Mark students present or absent. The student dashboard attendance percentage updates from these records.
          </p>
        </header>

        {errorMessage ? <p className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{errorMessage}</p> : null}
        {successMessage ? <p className="rounded-[18px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{successMessage}</p> : null}

        <section className="rounded-[28px] border border-[#eadcf7] bg-white p-6 shadow-[0_24px_40px_-34px_rgba(84,39,174,0.82)]">
          <div className="grid gap-4 md:grid-cols-[1fr_220px_220px]">
            <select value={selectedCourseId ?? ''} onChange={(event) => setSelectedCourseId(Number(event.target.value))} className="h-12 rounded-[16px] border border-[#e4d8fb] bg-[#fcfaff] px-4 text-sm font-semibold text-[#2a1842] outline-none">
              {courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}
            </select>
            <input type="date" value={attendanceDate} onChange={(event) => setAttendanceDate(event.target.value)} className="h-12 rounded-[16px] border border-[#e4d8fb] bg-[#fcfaff] px-4 text-sm font-semibold text-[#2a1842] outline-none" />
            <button type="button" onClick={saveAttendance} disabled={isSaving} className="rounded-full bg-[linear-gradient(135deg,#7641e8_0%,#9a73ef_100%)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
              {isSaving ? 'Saving...' : 'Save attendance'}
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[18px] bg-[#faf6ff] px-4 py-3"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">Course</p><p className="mt-1 text-sm font-semibold text-[#2a1842]">{selectedCourse?.name ?? 'No course'}</p></div>
            <div className="rounded-[18px] bg-[#eef9f1] px-4 py-3"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3d775b]">Present</p><p className="mt-1 text-sm font-semibold text-[#17945d]">{presentCount}</p></div>
            <div className="rounded-[18px] bg-[#fff1f0] px-4 py-3"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#ad514b]">Absent</p><p className="mt-1 text-sm font-semibold text-[#c9443d]">{absentCount}</p></div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[22px] border border-[#f0e7fb]">
            <div className="grid grid-cols-[1fr_220px] gap-4 bg-[#faf7ff] px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">
              <span>Student</span>
              <span>Status</span>
            </div>
            {isLoading ? <div className="px-5 py-5 text-sm font-semibold text-[#6d38de]">Loading...</div> : null}
            {!isLoading && students.length === 0 ? <div className="px-5 py-5 text-sm font-semibold text-[#6b5a88]">No enrolled students yet. Invite students from the Lecturer Dashboard.</div> : null}
            {students.map((student) => (
              <div key={student.id} className="grid grid-cols-[1fr_220px] items-center gap-4 border-t border-[#f2ebfb] px-5 py-4 text-sm text-[#2a1842]">
                <div>
                  <p className="font-semibold">{student.fullName || student.email || 'Student'}</p>
                  <p className="mt-1 text-[#6b5a88]">{student.email}</p>
                </div>
                <div className="flex gap-2">
                  {(['present', 'absent'] as const).map((status) => (
                    <button key={status} type="button" onClick={() => setStatuses((current) => ({ ...current, [student.id]: status }))} className={`rounded-full px-4 py-2 text-sm font-semibold ${statuses[student.id] === status ? 'bg-[#6d38de] text-white' : 'bg-[#f3edff] text-[#5a2ddf]'}`}>
                      {status === 'present' ? 'Attend' : 'Absent'}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}

export default function LecturerAttendancePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1120px] px-5 py-8 text-sm font-semibold text-[#6d38de]">Loading attendance...</div>}>
      <LecturerAttendancePageContent />
    </Suspense>
  );
}
