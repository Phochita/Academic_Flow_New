'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const menuItems = [
  {
    name: 'Dashboard',
    href: '/student',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'My Course',
    href: '/courses',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path
          d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Zm3 4.7 6 3 6-3M6 13.2V17l6 3 6-3v-3.8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: 'Assignments',
    href: '/assignments',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <rect x="6" y="4" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Attendance',
    href: '/attendance',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 3v4M16 3v4M7.5 11.5l2.2 2.2 4.8-4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Performance',
    href: '/performance',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M5 19.5h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="6" y="11" width="3" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.8" />
        <rect x="10.5" y="8.5" width="3" height="8" rx="1" stroke="currentColor" strokeWidth="1.8" />
        <rect x="15" y="6" width="3" height="10.5" rx="1" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    name: 'AI Planner',
    href: '/ai-planner',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M12 3 9.8 8.1 5 10.3l4.8 2.2L12 17.7l2.2-5.2 4.8-2.2-4.8-2.2L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M19 16.5 18 19l-2.5 1 2.5 1L19 23l1-2 2.5-1-2.5-1-1-2.5Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'Subscription',
    href: '/subscription',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M7 5h10a2 2 0 0 1 2 2v10l-3.5-1.7L12 17l-3.5-1.7L5 17V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Setting',
    href: '/settings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path
          d="m19.43 12.98.04-.32c.02-.21.03-.43.03-.66s-.01-.45-.03-.66l-.04-.32 2.11-1.65a.72.72 0 0 0 .17-.92l-2-3.46a.75.75 0 0 0-.9-.32l-2.49 1a7.57 7.57 0 0 0-1.14-.66l-.38-2.65A.74.74 0 0 0 14.07 2h-4a.74.74 0 0 0-.73.61l-.38 2.65c-.4.17-.78.39-1.14.66l-2.49-1a.75.75 0 0 0-.9.32l-2 3.46c-.17.3-.1.67.17.92l2.11 1.65-.04.32A5.96 5.96 0 0 0 4.5 12c0 .23.01.45.03.66l.04.32-2.11 1.65a.72.72 0 0 0-.17.92l2 3.46c.18.31.55.43.9.32l2.49-1c.36.27.74.49 1.14.66l.38 2.65c.06.36.37.61.73.61h4c.36 0 .67-.25.73-.61l.38-2.65c.4-.17.78-.39 1.14-.66l2.49 1c.35.11.72-.01.9-.32l2-3.46a.72.72 0 0 0-.17-.92l-2.11-1.65ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LegacySidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-[#e5d8fb] bg-[#f6f0ff] px-6 py-7">
      <div className="mb-10 flex items-center space-x-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6C2BD9] text-sm font-bold text-white shadow-[0_10px_20px_-12px_rgba(108,43,217,0.9)]">
          A
        </div>
        <span className="text-xl font-bold tracking-tight text-[#2f2143]">AcaFlow</span>
      </div>

      <nav className="flex-grow space-y-2.5">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group flex items-center space-x-3 rounded-2xl px-4 py-3 font-medium text-[#796992] transition-all hover:bg-white hover:text-[#5f33c9]"
          >
            <span className="text-xl transition-transform group-hover:scale-105">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t border-[#e6daf8] pt-6">
        <div className="mb-6 rounded-2xl border border-[#decdf8] bg-white p-4 shadow-[0_12px_20px_-20px_rgba(77,28,161,0.7)]">
          <div className="mb-1 flex items-center text-sm font-bold text-[#6a39df]">
            <span className="mr-2">✨</span> Pro Plan Active
          </div>
          <p className="text-xs leading-relaxed text-[#8777a3]">
            You have access to all AI features.
          </p>
        </div>

        <div className="mb-4 flex items-center space-x-3 rounded-2xl border border-[#e5d8fb] bg-white p-3">
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-[#f0e7ff] shadow-soft">
            <div className="gradient-bg h-full w-full opacity-60"></div>
          </div>
          <div className="min-w-0 flex-grow">
            <div className="truncate text-sm font-bold text-[#2f2143]">Alex Rivera</div>
            <div className="truncate text-xs text-[#8f80aa]">Student</div>
          </div>
        </div>

        <div className="space-y-2">
          <Link
            href="/support"
            className="flex items-center space-x-3 rounded-2xl px-4 py-3 font-medium text-[#796992] transition-all hover:bg-white hover:text-[#5f33c9]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 17h.01" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Support</span>
          </Link>
          <Link
            href="/logout"
            className="flex items-center space-x-3 rounded-2xl px-4 py-3 font-medium text-[#796992] transition-all hover:bg-white hover:text-[#5f33c9]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Logout</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

const studentDashboardMenuItems = [
  {
    name: 'Dashboard',
    href: '/student',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'My Course',
    href: '/student',
    queryKey: 'view',
    queryValue: 'courses',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path
          d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Zm3 4.7 6 3 6-3M6 13.2V17l6 3 6-3v-3.8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: 'Assignments',
    href: '/assignments',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <rect x="6" y="4" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Attendance',
    href: '/attendance',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M8 3v4M16 3v4M7.5 11.5l2.2 2.2 4.8-4.8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: 'Performance',
    href: '/performance',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M5 19.5h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="6" y="11" width="3" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.8" />
        <rect x="10.5" y="8.5" width="3" height="8" rx="1" stroke="currentColor" strokeWidth="1.8" />
        <rect x="15" y="6" width="3" height="10.5" rx="1" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    name: 'AI Planner',
    href: '/ai-planner',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path
          d="M12 3 9.8 8.1 5 10.3l4.8 2.2L12 17.7l2.2-5.2 4.8-2.2-4.8-2.2L12 3Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M19 16.5 18 19l-2.5 1 2.5 1L19 23l1-2 2.5-1-2.5-1-1-2.5Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'Subscription',
    href: '/subscription',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path
          d="M7 5h10a2 2 0 0 1 2 2v10l-3.5-1.7L12 17l-3.5-1.7L5 17V7a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: 'Setting',
    href: '/settings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path
          d="m19.43 12.98.04-.32c.02-.21.03-.43.03-.66s-.01-.45-.03-.66l-.04-.32 2.11-1.65a.72.72 0 0 0 .17-.92l-2-3.46a.75.75 0 0 0-.9-.32l-2.49 1a7.57 7.57 0 0 0-1.14-.66l-.38-2.65A.74.74 0 0 0 14.07 2h-4a.74.74 0 0 0-.73.61l-.38 2.65c-.4.17-.78.39-1.14.66l-2.49-1a.75.75 0 0 0-.9.32l-2 3.46c-.17.3-.1.67.17.92l2.11 1.65-.04.32A5.96 5.96 0 0 0 4.5 12c0 .23.01.45.03.66l.04.32-2.11 1.65a.72.72 0 0 0-.17.92l2 3.46c.18.31.55.43.9.32l2.49-1c.36.27.74.49 1.14.66l.38 2.65c.06.36.37.61.73.61h4c.36 0 .67-.25.73-.61l.38-2.65c.4-.17.78-.39 1.14-.66l2.49 1c.35.11.72-.01.9-.32l2-3.46a.72.72 0 0 0-.17-.92l-2.11-1.65ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const lecturerDashboardMenuItems = [
  {
    name: 'Dashboard',
    href: '/lecturer',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'My Courses',
    href: '/courses',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path
          d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Zm3 4.7 6 3 6-3M6 13.2V17l6 3 6-3v-3.8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: 'Assignments',
    href: '/assignments',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <rect x="6" y="4" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Attendance',
    href: '/attendance',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M8 3v4M16 3v4M7.5 11.5l2.2 2.2 4.8-4.8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: 'AI Planner',
    href: '/ai-planner',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path
          d="M12 3 9.8 8.1 5 10.3l4.8 2.2L12 17.7l2.2-5.2 4.8-2.2-4.8-2.2L12 3Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M19 16.5 18 19l-2.5 1 2.5 1L19 23l1-2 2.5-1-2.5-1-1-2.5Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'Subscription',
    href: '/subscription',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path
          d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v8A2.5 2.5 0 0 1 17.5 18H9l-5 3v-3.5A2.5 2.5 0 0 1 1.5 15V7.5H4Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M8 9h8M8 12.5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

function SidebarSupportIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 17h.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SidebarLogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SidebarPlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isLecturerRoute = pathname === '/lecturer' || pathname.startsWith('/lecturer/');
  const dashboardMenuItems = isLecturerRoute ? lecturerDashboardMenuItems : studentDashboardMenuItems;
  const primaryActionLabel = isLecturerRoute ? 'Create New Course' : 'View Schedule';
  const supportLabel = isLecturerRoute ? 'Help Center' : 'Support';
  const menuItemClassName = isLecturerRoute
    ? 'text-[0.98rem] font-medium tracking-[-0.02em]'
    : 'text-[0.84rem] font-medium uppercase tracking-[0.03em]';

  return (
    <aside className="fixed left-0 top-[70px] hidden h-[calc(100vh-70px)] w-[210px] flex-col border-r border-[#eadcf7] bg-[#faf3ff] px-4 py-4 lg:flex">
      <nav className="flex-1 space-y-1.5 pt-1">
        {dashboardMenuItems.map((item) => {
          const itemHref =
            'queryKey' in item && item.queryKey && item.queryValue
              ? `${item.href}?${item.queryKey}=${item.queryValue}`
              : item.href;
          const isActive =
            !isLecturerRoute && item.href === '/student'
              ? 'queryKey' in item && item.queryKey && item.queryValue
                ? pathname === item.href && searchParams.get(item.queryKey) === item.queryValue
                : pathname === item.href && searchParams.get('view') !== 'courses'
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.name}
              href={itemHref}
              className={`group flex items-center gap-3 rounded-[16px] px-3.5 py-2.5 transition-all ${
                menuItemClassName
              } ${
                isActive
                  ? 'bg-white text-[#5a2ddf] shadow-[0_18px_35px_-30px_rgba(90,45,223,0.95)]'
                  : 'text-[#7b69a0] hover:bg-white/85 hover:text-[#5a2ddf]'
              }`}
            >
              <span className={`${isActive ? 'text-[#5a2ddf]' : 'text-[#6c31dd]'}`}>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pb-5">
        <button
          className={`w-full rounded-[15px] bg-[linear-gradient(135deg,#7641e8_0%,#9a73ef_100%)] px-4 py-3 text-white shadow-[0_24px_34px_-24px_rgba(118,65,232,1)] transition hover:scale-[1.01] ${
            isLecturerRoute ? 'flex items-center justify-center gap-2.5 text-[0.88rem] font-semibold' : 'text-[0.92rem] font-semibold'
          }`}
        >
          {isLecturerRoute ? <SidebarPlusIcon /> : null}
          {primaryActionLabel}
        </button>
      </div>

      <div className="space-y-1.5 border-t border-[#eadcf7] pt-3">
        <Link
          href="/support"
          className={`flex items-center gap-3 rounded-[16px] px-3.5 py-2.5 text-[#7b69a0] transition hover:bg-white/85 hover:text-[#5a2ddf] ${menuItemClassName}`}
        >
          <span className="text-[#7f73e8]">
            <SidebarSupportIcon />
          </span>
          <span>{supportLabel}</span>
        </Link>
        <Link
          href="/logout"
          className={`flex items-center gap-3 rounded-[16px] px-3.5 py-2.5 text-[#7b69a0] transition hover:bg-white/85 hover:text-[#5a2ddf] ${menuItemClassName}`}
        >
          <span className="text-[#7f73e8]">
            <SidebarLogoutIcon />
          </span>
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
