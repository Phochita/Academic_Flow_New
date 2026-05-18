'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { buildAuthHeaders, getApiBaseUrl, readAuthSession } from '@/lib/auth';

type CreateCourseFormState = {
  courseName: string;
  room: string;
  section: string;
  subject: string;
};

type CoursePayload = {
  course?: {
    code?: string | null;
    id?: number | null;
    name?: string | null;
  } | null;
  error?: string;
  issues?: Array<{ message?: string }>;
  message?: string;
};

const initialFormState: CreateCourseFormState = {
  courseName: '',
  room: '',
  section: '',
  subject: '',
};

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

function InputField({
  label,
  name,
  onChange,
  placeholder,
  required = false,
  value,
}: {
  label: string;
  name: keyof CreateCourseFormState;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  value: string;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">
        <span>{label}</span>
        {required ? <span className="text-[#8b5cf6]">Required</span> : <span className="text-[#a092bc]">Optional</span>}
      </div>
      <input
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-13 w-full rounded-[16px] border border-[#e7daf8] bg-[#fcfaff] px-4 text-[1rem] text-[#2a1842] outline-none transition placeholder:text-[#ab9cc6] focus:border-[#c8b0f4] focus:bg-white focus:ring-2 focus:ring-[#eee4ff]"
      />
    </label>
  );
}

const getErrorMessage = (payload: CoursePayload | null, fallback: string) => {
  const issuesMessage = payload?.issues?.map((issue) => issue.message?.trim()).filter(Boolean).join(' ');

  return issuesMessage || payload?.error?.trim() || fallback;
};

export default function CreateCoursePage() {
  const router = useRouter();
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [form, setForm] = useState<CreateCourseFormState>(initialFormState);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const session = readAuthSession();

    if (!session) {
      setSuccessMessage('');
      setErrorMessage('Your session has expired. Please sign in again as a lecturer.');
      router.replace('/login');
      return;
    }

    const courseName = form.courseName.trim();
    const section = form.section.trim();
    const subject = form.subject.trim();
    const room = form.room.trim();

    if (courseName.length < 3) {
      setSuccessMessage('');
      setErrorMessage('Course name must be at least 3 characters long.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/courses`, {
        method: 'POST',
        headers: buildAuthHeaders(session.accessToken),
        body: JSON.stringify({
          name: courseName,
          room: room || null,
          section: section || null,
          subject: subject || null,
        }),
      });

      const payload = (await response.json().catch(() => null)) as CoursePayload | null;

      if (!response.ok) {
        throw new Error(getErrorMessage(payload, 'Unable to create this course right now.'));
      }

      const courseLabel = payload?.course?.name?.trim() || courseName;
      setForm(initialFormState);
      setSuccessMessage(payload?.message?.trim() || `${courseLabel} created successfully. Redirecting to your course list...`);

      const nextPath = '/lecturer?view=courses&created=1';
      router.replace(nextPath);

      window.setTimeout(() => {
        if (window.location.pathname !== '/lecturer') {
          window.location.replace(nextPath);
        }
      }, 150);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create this course right now.';
      setSuccessMessage('');
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-[980px] items-center justify-center px-4 py-8">
      <section className="w-full max-w-[620px] rounded-[32px] border border-[#eadcf7] bg-white p-6 shadow-[0_30px_46px_-40px_rgba(95,41,210,0.7)] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex rounded-full bg-[#efe3ff] px-3.5 py-1.5 text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[#6d38de]">
              Lecturer Dashboard
            </span>
            <h1 className="text-[2rem] font-bold tracking-[-0.04em] text-[#2a1842] sm:text-[2.25rem]">Create course</h1>
            <p className="max-w-[460px] text-[0.98rem] leading-7 text-[#6b5a88]">
              Keep it simple. Just enter the course name to create the class, then you can add the rest later.
            </p>
          </div>

          <Link
            href="/lecturer?view=courses"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#eadcf7] bg-white text-[#6b5a88] transition hover:border-[#d8c3fb] hover:text-[#5a2ddf]"
            aria-label="Close create course page"
          >
            <CloseIcon />
          </Link>
        </div>

        <div className="mt-6 rounded-[24px] border border-[#f0e8fb] bg-[#faf7ff] p-4 text-sm text-[#66557f]">
          Similar to Google Classroom:
          `Course name` is required. `Section`, `Subject`, and `Room` are optional and can be filled in later.
        </div>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <InputField
            label="Course Name"
            name="courseName"
            onChange={handleChange}
            placeholder="e.g. Software Engineering"
            required
            value={form.courseName}
          />
          <InputField
            label="Section"
            name="section"
            onChange={handleChange}
            placeholder="e.g. Year 3 - Group A"
            value={form.section}
          />
          <InputField
            label="Subject"
            name="subject"
            onChange={handleChange}
            placeholder="e.g. Computer Science"
            value={form.subject}
          />
          <InputField
            label="Room"
            name="room"
            onChange={handleChange}
            placeholder="e.g. Room B-204"
            value={form.room}
          />

          {errorMessage ? (
            <p className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
          ) : null}

          {successMessage ? (
            <p className="rounded-[18px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</p>
          ) : null}

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <Link
              href="/lecturer?view=courses"
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-[#6b5a88] transition hover:text-[#5a2ddf]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[linear-gradient(135deg,#7641e8_0%,#9a73ef_100%)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_18px_28px_-20px_rgba(118,65,232,0.95)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
