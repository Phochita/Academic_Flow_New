'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getDashboardPath, readAuthSession } from '@/lib/auth';

export default function PublicRouteRedirect() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const session = readAuthSession();

    if (!session) {
      return;
    }

    const nextPath = getDashboardPath(session.user.role);

    if (pathname === nextPath) {
      return;
    }

    router.replace(nextPath);

    const fallbackTimer = window.setTimeout(() => {
      if (window.location.pathname !== nextPath) {
        window.location.replace(nextPath);
      }
    }, 150);

    return () => {
      window.clearTimeout(fallbackTimer);
    };
  }, [pathname, router]);

  return null;
}
