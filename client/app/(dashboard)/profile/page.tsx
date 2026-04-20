'use client';

const user = {
  name: 'Username',
  role: 'Student / Teacher / Admin',
  email: 'example@kit.edu.kh',
  joined: 'September 12, 2022',
  studentId: '',
  status: 'Teacher / Student / Admin',
  coursesCount: 12,
};

function ProfilePhoto() {
  return (
    <div className="flex h-28 w-28 shrink-0 items-end justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#e4e6eb] shadow-[0_8px_16px_-6px_rgba(95,41,210,0.25)]">
      <svg 
        viewBox="0 0 24 24" 
        className="h-[110px] w-[110px] translate-y-3 text-[#bcc0c4]"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  );
}

function CoursesBadge({ count }: { count: number }) {
  return (
    <div className="inline-flex min-w-[110px] flex-col items-center rounded-xl bg-[#f6f2ff] px-4 py-3 text-center">
      <span className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[#7c6d92]">Courses</span>
      <span className="mt-1 text-[1.4rem] font-bold text-[#5a2ddf]">{count}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[#8a7ca4]">{label}</p>
      <p className="text-[0.95rem] font-semibold text-[#2d1b45]">{value || '-'}</p>
      <div className="h-px w-full bg-[#eee7fb]" />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-[1180px] space-y-6 text-[#2a1842]">
      <h1 className="mt-1 text-[2.15rem] font-bold leading-[1.05] tracking-[-0.04em] text-[#6d38de]">Profile</h1>
      <header className="flex flex-col gap-4 rounded-[24px] border border-[#eadcf7] bg-white px-6 py-6 shadow-[0_26px_46px_-42px_rgba(95,41,210,0.8)] sm:flex-row sm:items-center sm:gap-6">
        <ProfilePhoto />
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[2rem] font-bold tracking-[-0.04em] text-[#5a2ddf]">{user.name}</h1>
            <p className="text-[0.98rem] text-[#6f5f8f]">{user.role}</p>
          </div>
          <CoursesBadge count={user.coursesCount} />
        </div>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <section className="flex-1 min-w-0 rounded-[24px] border border-[#eadcf7] bg-white px-6 py-6 shadow-[0_22px_40px_-40px_rgba(95,41,210,0.85)]">
          <div className="grid gap-6 md:grid-cols-2">
            <InfoRow label="Name" value={user.name} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Joined Date" value={user.joined} />
            <InfoRow label="Student ID" value={user.studentId} />
            <InfoRow label="Status" value={user.status} />
          </div>
        </section>

        <aside
          className="relative w-full overflow-hidden rounded-[24px] px-6 py-7 text-white shadow-[0_26px_46px_-38px_rgba(95,41,210,0.9)] lg:w-[320px] lg:shrink-0 lg:self-start"
          style={{ background: 'linear-gradient(180deg, #6d38de 0%, #5b28d3 100%)' }}
        >
          <div className="absolute -right-10 -top-14 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
          <div className="relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/20">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M12 6.5c-2.2 0-4 1.7-4 3.8 0 3.1 4 7.2 4 7.2s4-4.1 4-7.2c0-2.1-1.8-3.8-4-3.8Z" />
                  <circle cx="12" cy="10" r="1.6" />
                </svg>
              </div>
              <div>
                <p className="text-[0.76rem] font-semibold uppercase tracking-[0.18em] text-white/85">AI Study Planner</p>
                <p className="text-[1.05rem] font-semibold">Personal insight</p>
              </div>
            </div>
            <p className="text-[0.9rem] leading-6 text-white">
              "You've been most productive during late evening sessions. Your research on Digital Ethics is 85% complete."
            </p>
            <div className="pt-2">
              <p className="text-[0.76rem] font-semibold uppercase tracking-[0.18em] text-white/85">Semester Progress</p>
              <div className="mt-3 h-2 rounded-full bg-white/30">
                <div className="h-2 w-[75%] rounded-full bg-white drop-shadow-[0_0_8px_rgba(255,255,255,0.28)]" />
              </div>
              <p className="mt-1 text-sm font-semibold text-white">75%</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
