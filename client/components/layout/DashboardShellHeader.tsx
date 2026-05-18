'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { getUserInitials, useStoredAuthUser } from '@/lib/auth';

export default function DashboardShellHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const authUser = useStoredAuthUser();

  const dashboardMode = pathname.startsWith('/admin')
    ? 'admin'
    : pathname.startsWith('/lecturer')
      ? 'lecturer'
      : pathname.startsWith('/student')
        ? 'student'
        : authUser?.role ?? 'student';
  const fallbackInitials = dashboardMode === 'admin' ? 'PM' : dashboardMode === 'lecturer' ? 'AT' : 'AR';
  const initials = getUserInitials(authUser?.fullName, fallbackInitials);

  const searchPlaceholder = (() => {
    if (pathname === '/admin') {
      return 'Search users, courses, subscriptions, or alerts...';
    }

    if (pathname.startsWith('/admin/users')) {
      return 'Search users, email, role, or access level...';
    }

    if (pathname.startsWith('/admin/courses')) {
      return 'Search courses, lecturers, or risk level...';
    }

    if (pathname.startsWith('/admin/assignments')) {
      return 'Search assignments, due dates, or flagged work...';
    }

    if (pathname.startsWith('/admin/attendance')) {
      return 'Search attendance trends, absences, or audits...';
    }

    if (pathname.startsWith('/admin/subscriptions')) {
      return 'Search plans, customers, revenue, or churn...';
    }

    if (pathname.startsWith('/admin/analytics')) {
      return 'Search platform KPIs, cohorts, or funnels...';
    }

    if (pathname.startsWith('/admin/activity')) {
      return 'Search audit logs, security events, or system actions...';
    }

    if (pathname.startsWith('/admin/reports')) {
      return 'Search reports, moderation queues, or exports...';
    }

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

    if (dashboardMode === 'admin') {
      return 'Search platform operations...';
    }

    return 'Search resources...';
  })();

  const headerTitle = dashboardMode === 'admin' ? 'AcaFlow Admin' : 'Academic Flow';
  const headerSubtitle =
    dashboardMode === 'admin'
      ? 'Platform Command Center'
      : dashboardMode === 'lecturer'
        ? 'Teach With Clarity'
        : 'View Your Progress';

  return (
    <DashboardHeader
      avatarUrl={authUser?.avatarUrl ?? null}
      searchPlaceholder={searchPlaceholder}
      title={headerTitle}
      subtitle={headerSubtitle}
      initials={initials}
    />
  );
}
