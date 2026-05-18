import Link from 'next/link';
import PublicRouteRedirect from '@/components/auth/PublicRouteRedirect';

type FeatureCard = {
  title: string;
  description: string;
  tone: 'light' | 'accent';
  icon: 'analytics' | 'planner';
};

const featureCards: FeatureCard[] = [
  {
    title: 'Real-time Learning Analytics',
    description:
      'Visualize your mastery of concepts across subjects. Know exactly where your gaps are before the exam starts.',
    tone: 'light',
    icon: 'analytics',
  },
  {
    title: 'AI-Powered Study Planner',
    description:
      "We don't just schedule: we optimize. The system learns your peak focus hours and builds a dynamic schedule around your life.",
    tone: 'accent',
    icon: 'planner',
  },
];

const dashboardPreviewMenuItems = [
  'Dashboard',
  'My Course',
  'Assignments',
  'Attendance',
  'Performance',
  'AI Planner',
  'Subscription',
  'Setting',
] as const;

const dashboardPreviewCourses = [
  {
    title: 'Machine Learning',
    instructor: 'Dr. Sarah Chen',
    progress: '64%',
    tone: 'bg-[linear-gradient(135deg,#6e2fdf_0%,#5c24d4_100%)]',
  },
  {
    title: 'Python Programming',
    instructor: 'Prof. Alex Rivera',
    progress: '82%',
    tone: 'bg-[linear-gradient(135deg,#5b4cff_0%,#4d43df_100%)]',
  },
  {
    title: 'Japanese I',
    instructor: 'Yuki Tanaka Sensei',
    progress: '25%',
    tone: 'bg-[linear-gradient(135deg,#b12555_0%,#94204a_100%)]',
  },
  {
    title: 'Cryptography',
    instructor: 'Dr. Alan Turing Jr.',
    progress: '45%',
    tone: 'bg-[linear-gradient(135deg,#9b6cff_0%,#6e2fdf_100%)]',
  },
] as const;

function LogoBadge() {
  return (
    <div className="grid h-10 w-10 place-items-center rounded-xl bg-[linear-gradient(135deg,#7a47f0_0%,#9567f6_100%)] text-lg font-bold text-white shadow-[0_16px_26px_-18px_rgba(122,71,240,0.85)]">
      A
    </div>
  );
}

function AnalyticsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="4" y="11" width="3.5" height="7" rx="1.2" />
      <rect x="10.2" y="7.5" width="3.5" height="10.5" rx="1.2" />
      <rect x="16.4" y="4.5" width="3.5" height="13.5" rx="1.2" />
    </svg>
  );
}

function PlannerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="4" y="5.5" width="16" height="14.5" rx="3" />
      <path d="M8 3.8v3.4M16 3.8v3.4M4 10h16" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="M5 12h13M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeroIllustration() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative mx-auto w-full max-w-[500px] select-none lg:max-w-[540px]"
    >
      <div className="rounded-[34px] bg-[radial-gradient(circle_at_bottom_left,rgba(142,91,245,0.16),transparent_42%),linear-gradient(180deg,#fbfaff_0%,#f3efff_100%)] p-3 shadow-[0_34px_60px_-32px_rgba(109,56,222,0.34)]">
        <div className="overflow-hidden rounded-[28px] border border-white/85 bg-white/95 shadow-[0_28px_48px_-30px_rgba(109,56,222,0.28)] backdrop-blur">
          <div className="flex items-center justify-between border-b border-[#eee7fb] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-[linear-gradient(135deg,#7a47f0_0%,#9567f6_100%)] text-sm font-bold text-white">
                A
              </div>
              <div>
                <p className="text-[0.8rem] font-semibold leading-none text-[#6f42eb]">Academic Flow</p>
                <p className="mt-1 text-[0.52rem] uppercase tracking-[0.18em] text-[#9ea5bc]">Student Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-2.5 w-14 rounded-full bg-[#eef0f7]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#cad0de]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#f1ac79]" />
            </div>
          </div>

          <div className="grid gap-3 p-3 lg:grid-cols-[76px_minmax(0,1fr)]">
            <aside className="rounded-[20px] bg-[#faf7ff] px-2 py-3 shadow-[inset_0_0_0_1px_rgba(236,228,250,1)]">
              <div className="space-y-2">
                {dashboardPreviewMenuItems.map((item, index) => (
                  <div
                    key={item}
                    className={`rounded-[14px] px-2 py-2 text-center text-[0.42rem] font-semibold uppercase tracking-[0.12em] ${
                      index === 0 ? 'bg-[#eee2ff] text-[#6d38de]' : 'bg-white text-[#a09ab3] shadow-[inset_0_0_0_1px_rgba(239,235,249,1)]'
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </aside>

            <div className="space-y-3">
              <div className="rounded-[22px] bg-[#fdfbff] p-4 shadow-[inset_0_0_0_1px_rgba(239,235,249,1)]">
                <h3 className="text-[1.45rem] font-bold leading-[0.95] tracking-[-0.05em] text-[#2f1d47]">
                  Welcome
                  <br />
                  Back
                </h3>
                <p className="mt-1 text-[1.3rem] font-bold leading-none tracking-[-0.05em] text-[#6d38de]">Username</p>
                <p className="mt-3 max-w-[220px] text-[0.72rem] leading-5 text-[#7d7596]">
                  Your academic journey is progressing smoothly.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between px-1">
                  <p className="text-[0.88rem] font-semibold text-[#4f4967]">My Courses</p>
                  <span className="text-[0.5rem] font-semibold uppercase tracking-[0.16em] text-[#8d84a6]">Study Flow</span>
                </div>

                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {dashboardPreviewCourses.map((course) => (
                    <div
                      key={course.title}
                      className="overflow-hidden rounded-[20px] border border-[#eee7fb] bg-white shadow-[0_14px_24px_-22px_rgba(94,36,209,0.45)]"
                    >
                      <div className={`relative min-h-[72px] px-4 py-3 text-white ${course.tone}`}>
                        <div
                          className="absolute inset-0 opacity-25"
                          style={{
                            backgroundImage:
                              'radial-gradient(circle, rgba(255,255,255,0.32) 1.4px, transparent 1.4px)',
                            backgroundSize: '18px 18px',
                          }}
                        />
                        <span className="relative z-10 inline-flex rounded-full bg-white/18 px-2.5 py-1 text-[0.44rem] font-semibold uppercase tracking-[0.16em]">
                          In Progress
                        </span>
                        <p className="relative z-10 mt-2 text-[0.88rem] font-semibold leading-5">{course.title}</p>
                      </div>

                      <div className="space-y-2.5 px-4 py-3">
                        <p className="text-[0.54rem] text-[#857d9c]">{course.instructor}</p>
                        <div className="h-1.5 rounded-full bg-[#f0defd]">
                          <div className="h-1.5 w-2/3 rounded-full bg-[#6d38de]" />
                        </div>
                        <div className="flex justify-between text-[0.48rem] font-semibold uppercase tracking-[0.16em] text-[#9aa2b6]">
                          <span>In Progress</span>
                          <span>{course.progress}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f7ff] text-[#11172b]">
      <PublicRouteRedirect />
      <header className="sticky top-0 z-50 border-b border-[#ebe7f7] bg-white/92 backdrop-blur">
        <nav className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <LogoBadge />
            <div>
              <p className="text-lg font-semibold tracking-[-0.04em] text-[#11172b]">AcaFlow</p>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#96a0b8]">Academic Workspace</p>
            </div>
          </Link>

          <div className="hidden items-center gap-10 text-sm font-medium text-[#26314d] md:flex">
            <Link href="#features" className="transition hover:text-[#7b4bf1]">
              Features
            </Link>
            <Link href="#pricing" className="transition hover:text-[#7b4bf1]">
              Pricing
            </Link>
            <Link href="#about" className="transition hover:text-[#7b4bf1]">
              About
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm font-semibold text-[#11172b] transition hover:text-[#7b4bf1] sm:inline-flex">
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-[linear-gradient(135deg,#7a47f0_0%,#9567f6_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_28px_-18px_rgba(122,71,240,0.75)] transition hover:translate-y-[-1px]"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="bg-[linear-gradient(180deg,#f8f7ff_0%,#f4f1ff_100%)]">
          <div className="mx-auto grid max-w-[1180px] gap-14 px-6 py-20 lg:grid-cols-[1fr_1.02fr] lg:items-center lg:py-24">
            <div className="max-w-[560px]">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#dccdff] bg-[#f4edff] px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#7f52f1]">
                <span className="h-2 w-2 rounded-full bg-[#8b5cf6]" />
                Next-Gen Academic Intelligence
              </span>

              <h1 className="mt-8 text-[3.3rem] font-extrabold leading-[0.96] tracking-[-0.08em] text-[#10172d] sm:text-[4.3rem] lg:text-[4.7rem]">
                Master Your
                <br />
                Academic
                <br />
                <span className="text-[#7d52f4]">Universe</span> with AI
              </h1>

              <p className="mt-7 max-w-[520px] text-[1.08rem] leading-8 text-[#667089]">
                Experience the future of education with self-healing degree maps that adapt to your progress and
                AI-driven study planners designed for peak performance.
              </p>

              <div className="mt-10">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-3 rounded-2xl bg-[linear-gradient(135deg,#7a47f0_0%,#9567f6_100%)] px-6 py-4 text-base font-semibold text-white shadow-[0_24px_34px_-20px_rgba(122,71,240,0.78)] transition hover:translate-y-[-1px]"
                >
                  Get Started Free
                  <ArrowIcon />
                </Link>
              </div>
            </div>

            <HeroIllustration />
          </div>
        </section>

        <section id="features" className="bg-white">
          <div className="mx-auto max-w-[1180px] px-6 py-20 lg:py-24">
            <div className="mx-auto max-w-[720px] text-center">
              <h2 className="text-[2.5rem] font-bold tracking-[-0.05em] text-[#11172b] sm:text-[3rem]">
                Designed for Radical Efficiency
              </h2>
              <p className="mt-4 text-[1.03rem] leading-8 text-[#667089]">
                Our core pillars ensure you never miss a credit, a deadline, or an insight.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {featureCards.map((card) => (
                <article
                  key={card.title}
                  className={`relative overflow-hidden rounded-[30px] px-7 py-8 shadow-[0_28px_42px_-34px_rgba(34,24,82,0.2)] ${
                    card.tone === 'accent'
                      ? 'bg-[linear-gradient(135deg,#7b4bf1_0%,#9a67f7_100%)] text-white'
                      : 'border border-[#f0ecf9] bg-white text-[#11172b]'
                  }`}
                >
                  <div
                    className={`grid h-10 w-10 place-items-center rounded-2xl ${
                      card.tone === 'accent' ? 'bg-white/10 text-white' : 'bg-[#fff1f5] text-[#ff4d82]'
                    }`}
                  >
                    {card.icon === 'analytics' ? <AnalyticsIcon /> : <PlannerIcon />}
                  </div>

                  <h3 className="mt-8 text-[1.9rem] font-semibold tracking-[-0.04em]">{card.title}</h3>
                  <p className={`mt-4 max-w-[470px] text-[1rem] leading-8 ${card.tone === 'accent' ? 'text-white/82' : 'text-[#6b7388]'}`}>
                    {card.description}
                  </p>

                  {card.tone === 'accent' ? (
                    <div className="absolute bottom-6 right-6 h-14 w-14 rounded-[18px] bg-white/12 blur-[1px]" />
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-white pb-20 lg:pb-24">
          <div className="mx-auto max-w-[1180px] px-6">
            <div className="mx-auto max-w-[760px] rounded-[40px] bg-[linear-gradient(135deg,#26205f_0%,#31297b_50%,#37308c_100%)] px-8 py-14 text-center text-white shadow-[0_34px_60px_-34px_rgba(49,41,123,0.7)] sm:px-12">
              <h2 className="text-[2.7rem] font-bold tracking-[-0.06em] sm:text-[3.4rem]">The Semester Starts Here.</h2>
              <p className="mx-auto mt-6 max-w-[540px] text-[1.08rem] leading-8 text-white/82">
                Join 100,000+ scholars who have automated their academic path and focused on what truly matters:
                growing their intelligence.
              </p>
              <div className="mt-10">
                <Link
                  href="/register"
                  className="inline-flex rounded-2xl bg-[linear-gradient(135deg,#8a58f4_0%,#a674fb_100%)] px-8 py-4 text-base font-semibold text-white shadow-[0_22px_36px_-24px_rgba(166,116,251,0.95)] transition hover:translate-y-[-1px]"
                >
                  Get Started for Free Today
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="about" className="border-t border-[#ebe7f7] bg-white">
        <div className="mx-auto max-w-[1180px] px-6 py-10 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#96a0b8]">
            <Link href="#" className="transition hover:text-[#7b4bf1]">
              Privacy Policy
            </Link>
            <Link href="#" className="transition hover:text-[#7b4bf1]">
              Terms of Service
            </Link>
            <Link href="#" className="transition hover:text-[#7b4bf1]">
              Institutional Access
            </Link>
            <Link href="#" className="transition hover:text-[#7b4bf1]">
              Contact Support
            </Link>
          </div>
          <p className="mt-8 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#b1b8c9]">
            (c) 2024 Smart Learning &amp; Academic Planning.
          </p>
        </div>
      </footer>
    </div>
  );
}
