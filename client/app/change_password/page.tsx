import React, { Suspense } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import DashboardShellHeader from '@/components/layout/DashboardShellHeader';

const inter = { className: 'font-sans' };
const manrope = { className: 'font-sans' };

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[15px] w-[15px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        d="M2.5 12s3.3-5 9.5-5 9.5 5 9.5 5-3.3 5-9.5 5-9.5-5-9.5-5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-[#630ED4]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      aria-hidden="true"
    >
      <path
        d="M12 3.2 5.8 6v5.3c0 4.1 2.4 7.7 6.2 9.5 3.8-1.8 6.2-5.4 6.2-9.5V6L12 3.2Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m9.5 12.2 1.8 1.8 3.2-3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CircleCheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[13px] w-[13px] text-[#7C3AED]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.7 12.1 2.2 2.2 4.2-4.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PasswordField({
  label,
  placeholder,
  defaultValue,
}: {
  label: string;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span
        className={`${inter.className} text-[12px] leading-4 font-semibold uppercase tracking-[0.3px] text-[#1F2937]`}
      >
        {label}
      </span>
      <div className="relative mt-2">
        <input
          type="password"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={`${inter.className} h-11 w-full appearance-none rounded-[4px] border border-[#E5E7EB] bg-[#F8FAFC] px-3 pr-10 text-[13px] leading-5 font-normal text-[#1F2937] outline-none ring-0 placeholder:text-[#9CA3AF]`}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
          <EyeIcon />
        </span>
      </div>
    </label>
  );
}

export default function ChangePasswordPage() {
  return (
    <div className="min-h-screen bg-[#fcf7ff]">
      <Suspense fallback={null}>
        <DashboardShellHeader />
      </Suspense>
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>
      <main className="min-h-screen px-4 pt-[84px] pb-4 sm:px-5 sm:pt-[86px] lg:ml-[210px] lg:px-5 lg:pt-[88px] lg:pb-5 xl:px-6">
        <div className="mx-auto flex w-full max-w-[1024px] flex-col gap-7 px-5 py-10 lg:px-10">
          <header className="space-y-1">
            <h1 className={`${manrope.className} text-[36px] leading-10 font-extrabold tracking-[-0.9px] text-[#630ED4]`}>
              Change Password
            </h1>
            <p className={`${inter.className} text-[14px] leading-5 font-normal text-[#4A4455]`}>
              Ensure your academic account remains secure with a complex, unique password.
            </p>
          </header>

          <section className="grid w-full max-w-[944px] items-start gap-5 lg:grid-cols-[1fr_234px]">
            <div className="rounded-[8px] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
              <form className="max-w-[332px] space-y-5">
                <PasswordField label="Current Password" defaultValue="••••••••••••" />
                <PasswordField label="New Password" placeholder="At least 12 characters" />
                <PasswordField label="Confirm New Password" placeholder="Confirm your new password" />

                <button
                  type="button"
                  className={`${inter.className} inline-flex h-11 min-w-[172px] items-center justify-center rounded-[8px] bg-gradient-to-r from-[#630ED4] to-[#7C3AED] px-6 text-[12px] leading-4 font-bold uppercase tracking-[0.8px] text-white shadow-[0_8px_20px_-8px_rgba(99,14,212,0.5)]`}
                >
                  Update Password
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <div className="rounded-[8px] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between">
                  <span
                    className={`${inter.className} text-[10px] leading-4 font-semibold uppercase tracking-[0.6px] text-[#94A3B8]`}
                  >
                    Security Rating
                  </span>
                  <span className={`${inter.className} text-[10px] leading-4 font-bold text-[#D97706]`}>Moderate</span>
                </div>
                <div className="mt-2 h-[4px] w-[72px] rounded-full bg-[#C2410C]" />
                <p className={`${inter.className} mt-3 text-[10px] leading-4 font-normal text-[#6B7280]`}>
                  A strong password contains at least 12 characters, including uppercase letters, numbers, and symbols.
                </p>
              </div>

              <div className="rounded-[8px] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                <div className="mb-2 flex items-center gap-2">
                  <ShieldCheckIcon />
                  <h2 className={`${inter.className} text-[12px] leading-4 font-semibold text-[#1F2937]`}>
                    Archive Security Tips
                  </h2>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-[2px]">
                      <CircleCheckIcon />
                    </span>
                    <span className={`${inter.className} text-[10px] leading-4 font-normal text-[#6B7280]`}>
                      Don&apos;t reuse passwords from other academic platforms.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-[2px]">
                      <CircleCheckIcon />
                    </span>
                    <span className={`${inter.className} text-[10px] leading-4 font-normal text-[#6B7280]`}>
                      Your password will be updated across all Archivid devices.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
