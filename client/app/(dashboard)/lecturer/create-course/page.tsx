import Link from 'next/link';

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

function InputField({
  label,
  placeholder,
  required = false,
}: {
  label: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">
        <span>{label}</span>
        {required ? <span className="text-[#8b5cf6]">Required</span> : <span className="text-[#a092bc]">Optional</span>}
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className="h-13 w-full rounded-[16px] border border-[#e7daf8] bg-[#fcfaff] px-4 text-[1rem] text-[#2a1842] outline-none transition placeholder:text-[#ab9cc6] focus:border-[#c8b0f4] focus:bg-white focus:ring-2 focus:ring-[#eee4ff]"
      />
    </label>
  );
}

export default function CreateCoursePage() {
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

        <form className="mt-7 space-y-5">
          <InputField label="Course Name" placeholder="e.g. Software Engineering" required />
          <InputField label="Section" placeholder="e.g. Year 3 - Group A" />
          <InputField label="Subject" placeholder="e.g. Computer Science" />
          <InputField label="Room" placeholder="e.g. Room B-204" />

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <Link
              href="/lecturer?view=courses"
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-[#6b5a88] transition hover:text-[#5a2ddf]"
            >
              Cancel
            </Link>
            <button
              type="button"
              className="rounded-full bg-[linear-gradient(135deg,#7641e8_0%,#9a73ef_100%)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_18px_28px_-20px_rgba(118,65,232,0.95)] transition hover:scale-[1.01]"
            >
              Create
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
