import type { ReactNode } from 'react';

type LecturerStat = {
  label: string;
  value: string;
  tone: string;
  icon: ReactNode;
};

type LecturerCourse = {
  title: string;
  code: string;
  program: string;
  students: string;
  schedule: string;
  semester: string;
  iconTone: string;
  icon: ReactNode;
};

type PendingSubmission = {
  student: string;
  submittedAt: string;
  work: string;
  accent: string;
  avatarTone: string;
  initials: string;
};

type LecturerTab = {
  label: string;
  isActive?: boolean;
  badge?: string;
};

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
      <path d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm8.2 1c-2.04 0-3.74.9-4.27 2.15A8.25 8.25 0 0 1 19.5 19v1H12v-1c0-2.94 2-6 4.2-6ZM8 13c-3.33 0-6 2.16-6 4.82V20h11.5v-2.18C13.5 15.16 10.96 13 8 13Z" />
    </svg>
  );
}

function GradeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M7 4h10a2 2 0 0 1 2 2v13l-4-2-4 2-4-2-4 2V6a2 2 0 0 1 2-2h2Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 8h4M9 11h6" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.25" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
      <path d="M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4Zm0 2c3.68 0 6 .99 6 2s-2.32 2-6 2-6-.99-6-2 2.32-2 6-2Zm0 6c3.11 0 5.68-.7 7-1.75V12c0 1.01-2.53 2.5-7 2.5S5 13.01 5 12V9.25C6.32 10.3 8.89 11 12 11Zm0 7.5c-4.47 0-7-1.49-7-2.5v-1.75C6.32 15.3 8.89 16 12 16s5.68-.7 7-1.75V16c0 1.01-2.53 2.5-7 2.5Z" />
    </svg>
  );
}

function NeuralIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
      <path d="M12 3a2.75 2.75 0 0 0-2.75 2.75c0 .47.12.91.33 1.3L7.3 9.34A2.74 2.74 0 0 0 6 9a3 3 0 1 0 2.83 4l2.55 1.02a2.75 2.75 0 1 0 4.56 1.94c0-.54-.16-1.04-.42-1.46l2.06-2.58c.13.02.27.03.42.03A3 3 0 1 0 15.16 8l-2.02-.9c.07-.21.11-.44.11-.68A2.75 2.75 0 0 0 12 3Zm-6 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm11.5-1a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM12 17.25a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
      <path d="M11.63 8.53 8.62 11.2m4.11-2.1 2.66 1.18m-3.62 3.3-2.6-1.04m4.88-.14 2.3-2.88" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <path d="m8 10 2.5 2.5L8 15" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.5 15H16" strokeLinecap="round" />
    </svg>
  );
}

function StudentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.42 0-8 2.01-8 4.5V20h16v-1.5c0-2.49-3.58-4.5-8-4.5Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10.5h16" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="m12 3 2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 17.2 6.44 20.1l1.06-6.2L3 9.52l6.22-.9L12 3Z" />
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

function FileUploadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M8 3.5h6l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20V5A1.5 1.5 0 0 1 7.5 3.5H8Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 3.5V8h4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 17V10" strokeLinecap="round" />
      <path d="m9.5 12.5 2.5-2.5 2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ApproveIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m7.7 11.1 2.2 2.3 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 6v4M16 8h4" strokeLinecap="round" />
    </svg>
  );
}

const lecturerTabs: LecturerTab[] = [
  { label: 'Stream', isActive: true },
  { label: 'Classwork' },
  { label: 'People' },
  { label: 'Grades' },
  { label: 'Analytics', badge: 'New' },
];

const lecturerStats: LecturerStat[] = [
  {
    label: 'Total Students',
    value: '342',
    tone: 'bg-[#dcd7ff] text-[#5d3de3]',
    icon: <PeopleIcon />,
  },
  {
    label: 'Avg. Grade',
    value: '84%',
    tone: 'bg-[#ffd5e2] text-[#de4e84]',
    icon: <GradeIcon />,
  },
];

const lecturerCourses: LecturerCourse[] = [
  {
    title: 'Advanced Data Structures',
    code: 'CS-402',
    program: 'Post-Graduate',
    students: '124 Students Enrolled',
    schedule: 'Mon, Wed - 10:00 AM - 11:30 AM',
    semester: 'Semester 1',
    iconTone: 'bg-[#ece6ff] text-[#6d38de]',
    icon: <DatabaseIcon />,
  },
  {
    title: 'Neural Network Architecture',
    code: 'AI-505',
    program: "Master's Program",
    students: '88 Students Enrolled',
    schedule: 'Tue, Thu - 02:00 PM - 03:30 PM',
    semester: 'Semester 1',
    iconTone: 'bg-[#ece9ff] text-[#6255e7]',
    icon: <NeuralIcon />,
  },
  {
    title: 'Cloud Computing Systems',
    code: 'CS-308',
    program: 'Undergraduate',
    students: '130 Students Enrolled',
    schedule: 'Fri - 09:00 AM - 12:00 PM',
    semester: 'Semester 1',
    iconTone: 'bg-[#ffdce8] text-[#bb4b78]',
    icon: <TerminalIcon />,
  },
];

const pendingSubmissions: PendingSubmission[] = [
  {
    student: 'Marcus Chen',
    submittedAt: '2 hours ago',
    work: 'Recursive Algorithms - Lab 4',
    accent: 'border-l-[#6d38de]',
    avatarTone: 'bg-[#12394d] text-white',
    initials: 'MC',
  },
  {
    student: 'Elena Rodriguez',
    submittedAt: '5 hours ago',
    work: 'Neural Net Visualizer - Midterm',
    accent: 'border-l-[#5d48e5]',
    avatarTone: 'bg-[#2c89a0] text-white',
    initials: 'ER',
  },
  {
    student: 'Jordan Smith',
    submittedAt: 'Yesterday',
    work: 'AWS Lambda Deploy Script',
    accent: 'border-l-[#c23d67]',
    avatarTone: 'bg-[#2a7a8a] text-white',
    initials: 'JS',
  },
];

export default function LecturerDashboard() {
  return (
    <div className="mx-auto max-w-[1120px]">
      <div className="border-b border-[#eadcf7] pb-5">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-[0.94rem] text-[#4a3a68]">
          {lecturerTabs.map((tab) => (
            <button
              key={tab.label}
              className={`relative flex items-center gap-2 pb-3 font-medium transition ${
                tab.isActive ? 'text-[#5a2ddf]' : 'text-[#4c3d69] hover:text-[#5a2ddf]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge ? (
                <span className="rounded-full bg-[#caf0cc] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#21743a]">
                  {tab.badge}
                </span>
              ) : null}
              {tab.isActive ? (
                <span className="absolute inset-x-0 bottom-0 h-1 rounded-full bg-[#6b35e3]" />
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 pt-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-6">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-[-0.05em] text-[#28163f] md:text-[2.85rem]">
                Welcome Back, Dr. Thorne
              </h1>
              <p className="max-w-3xl text-base leading-7 text-[#5f4a79]">
                You have 4 courses active this semester. There are 12 assignments pending your review and a
                faculty meeting scheduled for 3:00 PM.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {lecturerStats.map((stat) => (
                <article
                  key={stat.label}
                  className="rounded-[24px] border border-[#efe3fb] bg-white px-5 py-5 shadow-[0_22px_36px_-34px_rgba(84,39,174,0.9)]"
                >
                  <div className="flex items-center gap-4">
                    <div className={`grid h-14 w-14 place-items-center rounded-[16px] ${stat.tone}`}>{stat.icon}</div>
                    <div>
                      <p className="text-sm font-medium uppercase tracking-[0.04em] text-[#5a4b77]">{stat.label}</p>
                      <p className="mt-1 text-[1.7rem] font-bold tracking-[-0.04em] text-[#24163a]">{stat.value}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="h-8 w-2 rounded-full bg-[#6d38de]" aria-hidden="true" />
                <h2 className="text-[1.7rem] font-bold tracking-[-0.04em] text-[#26173d]">Manage My Courses</h2>
              </div>

              <button className="inline-flex items-center gap-2 text-sm font-semibold text-[#5a2ddf] transition hover:gap-3">
                View All Courses
                <ArrowRightIcon />
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {lecturerCourses.map((course) => (
                <article
                  key={course.title}
                  className="rounded-[26px] border border-[#eadcf7] bg-white p-5 shadow-[0_24px_44px_-38px_rgba(82,36,163,0.85)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className={`grid h-16 w-16 place-items-center rounded-[18px] ${course.iconTone}`}>
                      {course.icon}
                    </div>
                    <span className="rounded-xl bg-[#f3e8ff] px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#6d38de]">
                      {course.semester}
                    </span>
                  </div>

                  <h3 className="mt-6 text-[1.7rem] font-bold leading-tight tracking-[-0.04em] text-[#26173d]">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-[0.96rem] text-[#66527f]">
                    {course.code} / {course.program}
                  </p>

                  <div className="mt-5 space-y-3 text-[0.94rem] text-[#58496d]">
                    <div className="flex items-center gap-3">
                      <span className="text-[#6936de]">
                        <StudentIcon />
                      </span>
                      <span>{course.students}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#6936de]">
                        <CalendarIcon />
                      </span>
                      <span>{course.schedule}</span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button className="rounded-[16px] bg-[#e0c7ff] px-4 py-3 text-sm font-semibold text-[#5a2ddf] transition hover:bg-[#d5b8ff]">
                      Manage Course
                    </button>
                    <button className="rounded-[16px] border border-[#e4d8fb] bg-white px-4 py-3 text-sm font-semibold text-[#53426d] transition hover:border-[#d4c1f7] hover:text-[#4f2ccf]">
                      Quick Attendance
                    </button>
                  </div>
                </article>
              ))}

              <article className="flex min-h-[360px] items-center justify-center rounded-[26px] border-2 border-dashed border-[#c9afe9] bg-[#fff8ff] p-6 shadow-[0_16px_32px_-38px_rgba(84,39,174,0.8)]">
                <div className="text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#f3e1ff] text-[#7a4be9]">
                    <PlusIcon />
                  </div>
                  <h3 className="mt-6 text-[1.7rem] font-bold tracking-[-0.04em] text-[#503466]">Create New Course</h3>
                  <p className="mt-3 text-[0.94rem] text-[#88779f]">Set up a new curriculum module</p>
                </div>
              </article>
            </div>
          </section>
        </section>

        <aside className="relative rounded-[30px] border border-[#eddffb] bg-[linear-gradient(180deg,#f3e7ff_0%,#f7edff_100%)] px-5 py-6 shadow-[0_32px_50px_-44px_rgba(93,39,189,0.95)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[1.7rem] font-bold tracking-[-0.04em] text-[#28163f]">Pending Submissions</h2>
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[#6d38de] text-sm font-semibold text-white shadow-[0_14px_24px_-16px_rgba(109,56,222,1)]">
              12
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {pendingSubmissions.map((submission) => (
              <article
                key={`${submission.student}-${submission.work}`}
                className={`rounded-[24px] border border-white/80 border-l-4 ${submission.accent} bg-white px-5 py-5 shadow-[0_18px_30px_-28px_rgba(89,38,179,0.95)]`}
              >
                <div className="flex items-start gap-4">
                  <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-sm font-semibold ${submission.avatarTone}`}>
                    {submission.initials}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[1.15rem] font-semibold text-[#26173d]">{submission.student}</p>
                    <p className="text-sm text-[#79698f]">{submission.submittedAt}</p>
                  </div>
                </div>

                <p className="mt-5 text-[1.05rem] leading-8 text-[#2f2144]">{submission.work}</p>

                <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#efe6ff] px-4 py-3.5 text-base font-semibold text-[#5a2ddf] transition hover:bg-[#e5d6ff]">
                  <StarBadgeIcon />
                  Grade Now
                </button>
              </article>
            ))}
          </div>

          <button className="mt-8 w-full py-4 text-center text-sm font-semibold uppercase tracking-[0.28em] text-[#56446f] transition hover:text-[#5a2ddf]">
            View All Submissions
          </button>

          <div className="mt-10 flex items-end justify-end gap-4">
            <button
              aria-label="Upload material"
              className="grid h-14 w-14 place-items-center rounded-2xl bg-[#efe0ff] text-[#6e39de] shadow-[0_18px_30px_-22px_rgba(109,56,222,0.8)] transition hover:scale-105"
            >
              <FileUploadIcon />
            </button>
            <button
              aria-label="Approve submissions"
              className="grid h-20 w-20 place-items-center rounded-[26px] bg-[linear-gradient(135deg,#8453f0_0%,#6b35e3_100%)] text-white shadow-[0_24px_36px_-20px_rgba(107,53,227,1)] transition hover:scale-105"
            >
              <ApproveIcon />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
