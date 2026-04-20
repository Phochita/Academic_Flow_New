'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { getUserInitials, readDemoUser } from '@/lib/demo-user';

export default function DashboardShellHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fallbackInitials = pathname.startsWith('/lecturer') ? 'AT' : 'AR';
  const demoUser = typeof window === 'undefined' ? null : readDemoUser();
  const initials = getUserInitials(demoUser?.fullName, fallbackInitials);

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
  return <DashboardHeader searchPlaceholder={searchPlaceholder} initials={initials} />;
}
