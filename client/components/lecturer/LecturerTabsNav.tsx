'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const lecturerTabs = [
  { href: '/lecturer', label: 'Dashboard' },
  { href: '/lecturer/classwork', label: 'Classwork' },
  { href: '/lecturer/grades', label: 'Grades' },
  { href: '/lecturer/analytics', label: 'Analytics' },
] as const;

export default function LecturerTabsNav() {
  const pathname = usePathname();

  return (
    <nav className="rounded-[24px] border border-[#eadcf7] bg-white p-3 shadow-[0_18px_34px_-30px_rgba(84,39,174,0.65)]">
      <div className="flex flex-wrap gap-2">
        {lecturerTabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? 'page' : undefined}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? 'bg-[linear-gradient(135deg,#7641e8_0%,#9a73ef_100%)] text-white shadow-[0_18px_28px_-20px_rgba(118,65,232,0.95)]'
                  : 'text-[#6b5a88] hover:bg-[#f6f1ff] hover:text-[#5a2ddf]'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
