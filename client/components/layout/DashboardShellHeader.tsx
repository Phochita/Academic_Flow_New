'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import DashboardHeader from '@/components/layout/DashboardHeader';

export default function DashboardShellHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchPlaceholder = (() => {
    if (pathname === '/student') {
      return searchParams.get('view') === 'courses' ? 'Search courses...' : 'Search resources...';
    }

    if (pathname.startsWith('/assignments')) {
      return 'Search assignments...';
    }

    if (pathname.startsWith('/attendance')) {
      return 'Search attendance...';
    }

    if (pathname.startsWith('/performance')) {
      return 'Search analytics...';
    }

    if (pathname.startsWith('/ai-planner')) {
      return 'Search courses, assignments...';
    }

    if (pathname.startsWith('/lecturer')) {
      return 'Search courses, students, or resources...';
    }

    return 'Search resources...';
  })();

  const initials = pathname.startsWith('/lecturer') ? 'AT' : 'AR';

  return <DashboardHeader searchPlaceholder={searchPlaceholder} initials={initials} />;
}
