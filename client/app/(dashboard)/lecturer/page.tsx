'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import LecturerTabsNav from '@/components/lecturer/LecturerTabsNav';
import { buildAuthHeaders, getApiBaseUrl, readAuthSession, useStoredAuthUser } from '@/lib/auth';

type LecturerCourse = {
  code: string;
  createdAt?: string | null;
  id: number;
  name: string;
  room?: string | null;
  section?: string | null;
  subject?: string | null;
};

type CourseListPayload = {
  courses?: LecturerCourse[];
  error?: string;
};

type CourseTone = {
  cardTone: string;
  iconTone: string;
};

const courseTones: CourseTone[] = [
  {
    cardTone: 'bg-[linear-gradient(135deg,#efe4ff_0%,#f7f2ff_100%)]',
    iconTone: 'bg-[#e4d4ff] text-[#6d38de]',
  },
  {
    cardTone: 'bg-[linear-gradient(135deg,#ffe8f0_0%,#fff4f8_100%)]',
    iconTone: 'bg-[#ffd9e7] text-[#c44a7d]',
  },
  {
    cardTone: 'bg-[linear-gradient(135deg,#e9f0ff_0%,#f4f7ff_100%)]',
    iconTone: 'bg-[#dce6ff] text-[#4865df]',
  },
];

function CourseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="2.5" />
      <path d="M8 9h8M8 13h5" strokeLinecap="round" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
      <path d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm8.2 1c-2.04 0-3.74.9-4.27 2.15A8.25 8.25 0 0 1 19.5 19v1H12v-1c0-2.94 2-6 4.2-6ZM8 13c-3.33 0-6 2.16-6 4.82V20h11.5v-2.18C13.5 15.16 10.96 13 8 13Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M19 12H5m7-7-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function getCourseMetaLabel(course: LecturerCourse) {
  return course.subject?.trim() || course.section?.trim() || 'New course';
}

function getCourseSupportLabel(course: LecturerCourse) {
  return course.room?.trim() || course.section?.trim() || 'Room not added yet';
}

function formatCreatedAt(createdAt?: string | null) {
  if (!createdAt) {
    return 'Created recently';
  }

  const parsedDate = new Date(createdAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Created recently';
  }

  return parsedDate.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function LecturerCourseCard({
  course,
  index,
  inviteDraft,
  isInviting,
  onInvite,
  onInviteDraftChange,
}: {
  course: LecturerCourse;
  index: number;
  inviteDraft: string;
  isInviting: boolean;
  onInvite: (courseId: number) => void;
  onInviteDraftChange: (courseId: number, value: string) => void;
}) {
  const tone = courseTones[index % courseTones.length];

  return (
    <article className="rounded-[26px] border border-[#eadcf7] bg-white p-5 shadow-[0_24px_44px_-38px_rgba(82,36,163,0.85)]">
      <div className={`rounded-[22px] px-5 py-5 ${tone.cardTone}`}>
        <div className="flex items-start justify-between gap-4">
          <div className={`grid h-14 w-14 place-items-center rounded-[18px] ${tone.iconTone}`}>
            <CourseIcon />
          </div>
          <span className="rounded-xl bg-white/80 px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#6d38de]">
            {course.code}
          </span>
        </div>

        <h3 className="mt-5 text-[1.55rem] font-bold leading-tight tracking-[-0.04em] text-[#26173d]">{course.name}</h3>
        <p className="mt-2 text-[0.95rem] text-[#66527f]">{getCourseMetaLabel(course)}</p>
      </div>

      <div className="mt-5 space-y-3 text-[0.94rem] text-[#58496d]">
        <div className="flex items-center justify-between gap-3 rounded-[18px] bg-[#faf6ff] px-4 py-3">
          <span className="font-semibold text-[#4d3c68]">Section / Room</span>
          <span className="text-right text-[#6d38de]">{getCourseSupportLabel(course)}</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-[18px] bg-[#faf6ff] px-4 py-3">
          <span className="font-semibold text-[#4d3c68]">Created</span>
          <span>{formatCreatedAt(course.createdAt)}</span>
        </div>
      </div>

      <div className="mt-5 rounded-[18px] border border-[#efe3fb] bg-[#fcfaff] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">Invite student by account email</p>
        <div className="mt-3 flex gap-2">
          <input
            type="email"
            value={inviteDraft}
            onChange={(event) => onInviteDraftChange(course.id, event.target.value)}
            placeholder="student@example.com"
            className="min-w-0 flex-1 rounded-[14px] border border-[#e4d8fb] bg-white px-3 py-2 text-sm text-[#2a1842] outline-none focus:border-[#cdb5f7]"
          />
          <button
            type="button"
            onClick={() => onInvite(course.id)}
            disabled={isInviting}
            className="rounded-[14px] bg-[#6d38de] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isInviting ? 'Inviting...' : 'Invite'}
          </button>
        </div>
      </div>
    </article>
  );
}

function CreateCourseCard() {
  return (
    <Link
      href="/lecturer/create-course"
      className="flex min-h-[320px] items-center justify-center rounded-[26px] border-2 border-dashed border-[#c9afe9] bg-[#fff8ff] p-6 text-center shadow-[0_16px_32px_-38px_rgba(84,39,174,0.8)] transition hover:-translate-y-0.5 hover:border-[#b593e8] hover:bg-white"
    >
      <div>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#f3e1ff] text-[#7a4be9]">
          <PlusIcon />
        </div>
        <h3 className="mt-6 text-[1.7rem] font-bold tracking-[-0.04em] text-[#503466]">Create New Course</h3>
        <p className="mt-3 text-[0.94rem] text-[#88779f]">Save a real course to the database</p>
      </div>
    </Link>
  );
}

function LecturerDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authUser = useStoredAuthUser();
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const isCourseView = searchParams.get('view') === 'courses';
  const wasJustCreated = searchParams.get('created') === '1';

  const [courses, setCourses] = useState<LecturerCourse[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [inviteDrafts, setInviteDrafts] = useState<Record<number, string>>({});
  const [inviteMessage, setInviteMessage] = useState('');
  const [invitingCourseId, setInvitingCourseId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadCourses = async () => {
      const session = readAuthSession();

      if (!session) {
        router.replace('/login');
        return;
      }

      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await fetch(`${apiBaseUrl}/api/courses`, {
          method: 'GET',
          headers: buildAuthHeaders(session.accessToken),
        });

        const payload = (await response.json().catch(() => null)) as CourseListPayload | null;

        if (!response.ok) {
          throw new Error(payload?.error?.trim() || 'Unable to load your courses right now.');
        }

        if (!isActive) {
          return;
        }

        setCourses(Array.isArray(payload?.courses) ? payload.courses : []);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setErrorMessage(error instanceof Error ? error.message : 'Unable to load your courses right now.');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadCourses();

    return () => {
      isActive = false;
    };
  }, [apiBaseUrl, router]);

  const displayName = authUser?.fullName?.trim() || 'Lecturer';
  const totalCourses = courses.length;
  const newestCourse = courses[0]?.name ?? 'No courses yet';

  const updateInviteDraft = (courseId: number, value: string) => {
    setInviteDrafts((current) => ({ ...current, [courseId]: value }));
  };

  const inviteStudent = async (courseId: number) => {
    const session = readAuthSession();
    const studentEmail = inviteDrafts[courseId]?.trim();

    if (!session) {
      router.replace('/login');
      return;
    }

    if (!studentEmail) {
      setInviteMessage('');
      setErrorMessage('Enter the email the student used to create their account.');
      return;
    }

    setInvitingCourseId(courseId);
    setErrorMessage('');
    setInviteMessage('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/courses/${courseId}/enrollments`, {
        method: 'POST',
        headers: buildAuthHeaders(session.accessToken),
        body: JSON.stringify({ studentEmail }),
      });
      const payload = (await response.json().catch(() => null)) as { message?: string; error?: string; student?: { fullName?: string | null; email?: string | null } } | null;

      if (!response.ok) {
        throw new Error(payload?.error?.trim() || 'Unable to invite this student right now.');
      }

      setInviteDrafts((current) => ({ ...current, [courseId]: '' }));
      setInviteMessage(payload?.message?.trim() || `${payload?.student?.email ?? studentEmail} invited successfully.`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to invite this student right now.');
    } finally {
      setInvitingCourseId(null);
    }
  };

  return (
    <div className="mx-auto max-w-[1120px] space-y-6">
      <LecturerTabsNav />

      <section className="space-y-6 pt-5">
        {wasJustCreated ? (
          <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
            Course created successfully and saved to the database.
          </div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-[20px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {errorMessage}
          </div>
        ) : null}
        {inviteMessage ? (
          <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
            {inviteMessage}
          </div>
        ) : null}

        <header className="rounded-[28px] border border-[#eadcf7] bg-white px-6 py-6 shadow-[0_24px_40px_-34px_rgba(84,39,174,0.82)]">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-[#efe3ff] px-3.5 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#6d38de]">
                Lecturer Dashboard
              </span>
              <h1 className="text-3xl font-bold tracking-[-0.05em] text-[#28163f] md:text-[2.85rem]">Welcome Back, {displayName}</h1>
              <p className="max-w-3xl text-base leading-7 text-[#5f4a79]">
                Your course list below now comes from the real backend. New courses created here will persist in the database for this lecturer account.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-[24px] border border-[#efe3fb] bg-white px-5 py-5 shadow-[0_22px_36px_-34px_rgba(84,39,174,0.9)]">
                <div className="flex items-center gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-[16px] bg-[#dcd7ff] text-[#5d3de3]">
                    <PeopleIcon />
                  </div>
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.04em] text-[#5a4b77]">Total Courses</p>
                    <p className="mt-1 text-[1.7rem] font-bold tracking-[-0.04em] text-[#24163a]">{totalCourses}</p>
                  </div>
                </div>
              </article>

              <article className="rounded-[24px] border border-[#efe3fb] bg-white px-5 py-5 shadow-[0_22px_36px_-34px_rgba(84,39,174,0.9)]">
                <div className="flex items-center gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-[16px] bg-[#ffd5e2] text-[#de4e84]">
                    <ClockIcon />
                  </div>
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.04em] text-[#5a4b77]">Latest Course</p>
                    <p className="mt-1 line-clamp-2 text-[1.1rem] font-bold tracking-[-0.04em] text-[#24163a]">{newestCourse}</p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </header>

        <section className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="space-y-2">
              <h2 className="text-[1.7rem] font-bold tracking-[-0.04em] text-[#26173d]">
                {isCourseView ? 'My Courses' : 'Manage My Courses'}
              </h2>
              <p className="max-w-2xl text-base text-[#5f4a79]">
                Lecturer-created courses are shown here. Students will only see a course after they are enrolled in it.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-[#eadcf7] bg-white px-4 py-2 text-sm font-semibold text-[#5f4a79] shadow-[0_12px_24px_-24px_rgba(90,45,223,1)]">
                {totalCourses} saved course{totalCourses === 1 ? '' : 's'}
              </div>

              <Link
                href="/lecturer/create-course"
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#7641e8_0%,#9a73ef_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_28px_-20px_rgba(118,65,232,0.95)] transition hover:scale-[1.01]"
              >
                <PlusIcon />
                Create New Course
              </Link>

              {isCourseView ? (
                <Link
                  href="/lecturer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#dbc8fa] bg-white px-5 py-2.5 text-sm font-semibold text-[#5a2ddf] shadow-[0_16px_28px_-24px_rgba(90,45,223,0.95)] transition hover:border-[#cdb5f7]"
                >
                  <ArrowLeftIcon />
                  Back to Dashboard
                </Link>
              ) : (
                <Link
                  href="/lecturer?view=courses"
                  className="inline-flex items-center gap-2 rounded-full border border-[#dbc8fa] bg-white px-5 py-2.5 text-sm font-semibold text-[#5a2ddf] shadow-[0_16px_28px_-24px_rgba(90,45,223,0.95)] transition hover:border-[#cdb5f7]"
                >
                  View All Courses
                </Link>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-[24px] border border-[#eadcf7] bg-white px-6 py-8 text-sm font-semibold text-[#6d38de]">
              Loading lecturer courses...
            </div>
          ) : courses.length === 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-[26px] border border-[#eadcf7] bg-white p-6 shadow-[0_24px_44px_-38px_rgba(82,36,163,0.85)]">
                <h3 className="text-[1.55rem] font-bold tracking-[-0.04em] text-[#26173d]">No courses yet</h3>
                <p className="mt-3 text-[0.96rem] leading-7 text-[#66527f]">
                  Create your first course here and it will be saved to the real database for this lecturer account.
                </p>
              </div>
              <CreateCourseCard />
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course, index) => (
                <LecturerCourseCard
                  key={course.id}
                  course={course}
                  index={index}
                  inviteDraft={inviteDrafts[course.id] ?? ''}
                  isInviting={invitingCourseId === course.id}
                  onInvite={inviteStudent}
                  onInviteDraftChange={updateInviteDraft}
                />
              ))}
              <CreateCourseCard />
            </div>
          )}
        </section>
      </section>
    </div>
  );
}

export default function LecturerDashboard() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1120px] px-5 py-8 text-sm font-semibold text-[#6d38de]">Loading lecturer dashboard...</div>}>
      <LecturerDashboardContent />
    </Suspense>
  );
}
