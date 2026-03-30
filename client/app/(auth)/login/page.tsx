import Link from 'next/link';

function BrandIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
      <path d="M12 3 2.8 7.9 12 12.8l7.46-3.98V16h1.74V7.9L12 3Z" />
      <path d="M5.2 11.33V16L12 20l6.8-4v-4.67L12 15l-6.8-3.67Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 7.5 12 13l8-5.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="5" width="18" height="14" rx="3" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7.8a4 4 0 1 1 8 0V10" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <path d="M5 12h13M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M21.8 12.23c0-.72-.06-1.25-.19-1.81H12v3.44h5.64c-.11.86-.71 2.16-2.05 3.03l-.02.11 2.75 2.13.19.02c1.76-1.62 2.79-4 2.79-6.92Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.08-.91 6.77-2.47l-3.23-2.5c-.86.6-2.01 1.02-3.54 1.02-2.7 0-4.99-1.78-5.81-4.24l-.1.01-2.86 2.21-.03.1A10.24 10.24 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.19 13.81A6.15 6.15 0 0 1 5.87 12c0-.63.11-1.24.3-1.81l-.01-.12-2.89-2.24-.09.04A10.09 10.09 0 0 0 2.1 12c0 1.45.35 2.82.97 4.03l3.12-2.22Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.95c1.93 0 3.23.84 3.97 1.54l2.9-2.83C17.07 2.98 14.76 2 12 2a10.24 10.24 0 0 0-8.82 4.87l3.11 2.32c.83-2.46 3.12-4.24 5.71-4.24Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f8efff] text-[15px]">
      <div className="grid min-h-screen lg:grid-cols-[1.02fr_1fr]">
        <section className="relative overflow-hidden bg-[linear-gradient(140deg,#6d38de_0%,#8357eb_48%,#a37ef6_100%)] px-7 py-8 text-white sm:px-10 lg:px-12 lg:py-10">
          <div className="absolute inset-y-0 right-0 hidden w-px bg-white/15 lg:block" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/14">
                <BrandIcon />
              </div>
              <span className="text-[1.6rem] font-extrabold tracking-[-0.05em]">AcaFlow</span>
            </div>

            <div className="mt-10 max-w-[500px] lg:mt-16">
              <h1 className="text-[2.8rem] font-extrabold leading-[0.95] tracking-[-0.07em] sm:text-[3.5rem]">
                Elevate Your
                <br />
                Academic
                <br />
                Success
              </h1>

              <p className="mt-6 max-w-[490px] text-[1rem] leading-8 text-white/85 sm:text-[1.08rem]">
                Join the next generation of scholars using precision-engineered tools for research, curation, and
                institutional excellence.
              </p>
            </div>

            <div className="mt-10 max-w-[560px] flex-1 lg:mt-12">
              <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,#0e1117_0%,#121826_100%)] p-4 shadow-[0_30px_48px_-28px_rgba(0,0,0,0.55)]">
                <div className="rounded-[20px] border border-white/8 bg-[radial-gradient(circle_at_top,#171d2c_0%,#0d1018_70%)] p-4">
                  <div className="flex items-center justify-between text-[0.72rem] uppercase tracking-[0.2em] text-white/45">
                    <span>Dashboard</span>
                    <span>Overview</span>
                    <span>Planner</span>
                  </div>
                  <div className="mt-5 h-1 rounded-full bg-white/10">
                    <div className="h-1 w-1/3 rounded-full bg-[#f0b24f]" />
                  </div>
                  <div className="mt-5 rounded-[16px] bg-white/5 p-4">
                    <p className="text-sm text-white/55">Learning goal detection</p>
                    <p className="mt-2 text-lg font-semibold text-white">Curated study flow ready</p>
                    <p className="mt-2 text-sm leading-6 text-white/55">
                      Research tasks, planner reminders, and analytics are organized in one focused workflow.
                    </p>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
                    <div className="rounded-[16px] bg-white/5 p-4">
                      <div className="flex items-center justify-between text-sm text-white/55">
                        <span>Live coursework</span>
                        <span>5 active</span>
                      </div>
                      <div className="mt-4 space-y-3">
                        {[72, 48, 84].map((width, index) => (
                          <div key={width} className="space-y-2">
                            <div className="h-2 rounded-full bg-white/8">
                              <div
                                className={`h-2 rounded-full ${
                                  index === 1 ? 'bg-[#7c59e7]' : index === 2 ? 'bg-[#55c4d8]' : 'bg-[#88e26a]'
                                }`}
                                style={{ width: `${width}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-white/35">
                              <span>Module {index + 1}</span>
                              <span>{width}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[16px] bg-white/5 p-4">
                      <div className="space-y-3">
                        <div className="h-20 rounded-2xl bg-white/6 p-3">
                          <div className="h-2 w-16 rounded-full bg-white/15" />
                          <div className="mt-3 h-8 rounded-xl bg-white/10" />
                        </div>
                        <div className="h-20 rounded-2xl bg-white/6 p-3">
                          <div className="h-2 w-20 rounded-full bg-white/15" />
                          <div className="mt-3 h-8 rounded-xl bg-white/10" />
                        </div>
                        <div className="h-20 rounded-2xl bg-white/6 p-3">
                          <div className="h-2 w-14 rounded-full bg-white/15" />
                          <div className="mt-3 h-8 rounded-xl bg-white/10" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {['#9cc5ff', '#f5b2de', '#7ce0af'].map((color, index) => (
                    <div
                      key={color}
                      className="grid h-12 w-12 place-items-center rounded-full border-2 border-white/70 text-sm font-bold text-[#2a1842]"
                      style={{ backgroundColor: color, zIndex: 3 - index }}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                  ))}
                </div>
                <p className="text-sm font-medium tracking-[0.18em] text-white/90 sm:text-base">TRUSTED BY 10k+ SCHOLARS</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col justify-between bg-[#fbf4ff] px-7 py-8 sm:px-10 lg:px-12 lg:py-10">
          <div className="mx-auto flex w-full max-w-[500px] flex-1 flex-col justify-center">
            <div>
              <h2 className="text-[2.35rem] font-bold tracking-[-0.05em] text-[#2d1852] sm:text-[2.8rem]">Welcome Back</h2>
              <p className="mt-3 max-w-[420px] text-[1rem] leading-7 text-[#644f87]">
                Please enter your details to access your dashboard.
              </p>
            </div>

            <form className="mt-10 space-y-6">
              <div>
                <label htmlFor="email" className="mb-3 block text-[0.9rem] font-semibold uppercase tracking-[0.24em] text-[#68517f]">
                  Email Address
                </label>
                <div className="flex items-center gap-4 rounded-[16px] bg-[#f3e8ff] px-5 py-3.5 text-[#8c77ac] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
                  <MailIcon />
                  <input
                    id="email"
                    type="email"
                    placeholder="scholar@institution.edu"
                    className="w-full bg-transparent text-[1rem] text-[#2d1852] outline-none placeholder:text-[#ab99c6]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-3 block text-[0.9rem] font-semibold uppercase tracking-[0.24em] text-[#68517f]">
                  Password
                </label>
                <div className="flex items-center gap-4 rounded-[16px] bg-[#f3e8ff] px-5 py-3.5 text-[#8c77ac] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
                  <LockIcon />
                  <input
                    id="password"
                    type="password"
                    placeholder="........"
                    className="w-full bg-transparent text-[1rem] text-[#2d1852] outline-none placeholder:text-[#ab99c6]"
                  />
                  <button type="button" className="transition hover:text-[#6d38de]">
                    <EyeIcon />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4 text-[0.98rem] text-[#5c467f] sm:flex-row sm:items-center sm:justify-between">
                <label htmlFor="remember" className="flex items-center gap-3">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-5 w-5 rounded-md border-[#ccb6ea] bg-transparent text-[#6d38de] focus:ring-[#6d38de]"
                  />
                  <span>Remember for 30 days</span>
                </label>
                <Link href="#" className="font-semibold text-[#5a2ce4] transition hover:opacity-80">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-[16px] bg-[linear-gradient(90deg,#6d38de_0%,#9b78f6_100%)] px-6 py-4 text-[1.05rem] font-semibold text-white shadow-[0_24px_34px_-20px_rgba(109,56,222,0.65)] transition hover:translate-y-[-1px]"
              >
                <span>Sign In</span>
                <ArrowIcon />
              </button>

              <div className="flex items-center gap-4 pt-2">
                <div className="h-px flex-1 bg-[#e8daf7]" />
                <span className="text-[0.82rem] font-semibold uppercase tracking-[0.32em] text-[#8d79ab]">or continue with</span>
                <div className="h-px flex-1 bg-[#e8daf7]" />
              </div>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-4 rounded-[16px] bg-white px-6 py-4 text-[1rem] font-semibold text-[#2d1852] shadow-[0_12px_28px_-24px_rgba(45,24,82,0.35)] ring-1 ring-[#efe3fb] transition hover:bg-[#fffafe]"
              >
                <GoogleIcon />
                <span>Sign in with Google</span>
              </button>
            </form>

            <p className="mt-10 text-center text-[1rem] text-[#5c467f]">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold text-[#5a2ce4] transition hover:opacity-80">
                Sign up for free
              </Link>
            </p>
          </div>

          <footer className="mx-auto mt-8 flex w-full max-w-[1120px] flex-col gap-4 border-t border-[#eadcf7] pt-5 text-[0.76rem] uppercase tracking-[0.22em] text-[#7d689c] sm:flex-row sm:items-center sm:justify-between">
            <p>(c) 2024 AcaFlow. All rights reserved.</p>
            <div className="flex flex-wrap gap-6">
              <Link href="#" className="transition hover:text-[#5a2ce4]">
                Privacy Policy
              </Link>
              <Link href="#" className="transition hover:text-[#5a2ce4]">
                Terms of Service
              </Link>
              <Link href="#" className="transition hover:text-[#5a2ce4]">
                Institutional Access
              </Link>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}
