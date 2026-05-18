'use client';

import Link from 'next/link';
import { useId } from 'react';

type DashboardHeaderProps = {
  avatarUrl?: string | null;
  searchPlaceholder?: string;
  title?: string;
  subtitle?: string;
  initials?: string;
};

function DashboardHeaderSearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function DashboardHeaderBellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
      <path d="M12 3a5 5 0 0 0-5 5v2.81c0 .73-.2 1.44-.58 2.07L5 15h14l-1.42-2.12a3.98 3.98 0 0 1-.58-2.07V8a5 5 0 0 0-5-5Zm0 18a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 21Z" />
    </svg>
  );
}

export default function DashboardHeader({
  avatarUrl = null,
  searchPlaceholder = 'Search resources...',
  title = 'Academic Flow',
  subtitle = 'View Your Progress',
  initials = 'AR',
}: DashboardHeaderProps) {
  const searchId = useId();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#e7d8fb] bg-white/95 backdrop-blur">
      <div className="flex min-h-[70px] items-center justify-between gap-3 px-4 sm:px-5 lg:px-6 xl:px-7">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[16px] bg-[linear-gradient(135deg,#8a57f5_0%,#5f29d2_100%)] text-white shadow-[0_18px_28px_-20px_rgba(95,41,210,0.95)]">
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
              <path d="M12 3 2.5 8 12 13 21.5 8 12 3Zm-7 7.48V16l7 3.7 7-3.7v-5.52L12 15l-7-4.52Z" />
            </svg>
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-[1.42rem] font-bold tracking-[-0.05em] text-[#5c2ddd]">{title}</h2>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[#8b7aa9]">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <label
            htmlFor={searchId}
            className="hidden items-center gap-3 rounded-full bg-[#f7f3fb] px-4 py-2 text-sm text-[#8d7fa7] sm:flex sm:w-[240px] lg:w-[320px]"
          >
            <DashboardHeaderSearchIcon />
            <input
              id={searchId}
              type="search"
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-[#36234f] outline-none placeholder:text-[#9d92b0]"
            />
          </label>

          <button
            type="button"
            aria-label="Notifications"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#625473] transition hover:bg-[#f3e8ff] hover:text-[#5d34df]"
          >
            <DashboardHeaderBellIcon />
          </button>

          <Link
            href="/profile"
            aria-label="Open profile"
            className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-[#ff9d75] bg-[radial-gradient(circle_at_35%_28%,#fff2cf_0%,#f4dcb5_45%,#c79f74_100%)] text-[0.7rem] font-bold text-[#4a3427] shadow-[0_14px_24px_-20px_rgba(91,46,199,0.95)] transition hover:scale-105"
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="Profile avatar" className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
