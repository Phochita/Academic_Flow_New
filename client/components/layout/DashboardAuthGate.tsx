'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import {
  buildAuthHeaders,
  buildUserFromPayload,
  clearAuthSession,
  getApiBaseUrl,
  getDashboardPath,
  readAuthSession,
  saveAuthSession,
} from '@/lib/auth';

type DashboardAuthGateProps = {
  children: ReactNode;
};

type GateState = 'checking' | 'ready';

const getRouteRolePrefix = (pathname: string) => {
  if (pathname.startsWith('/admin')) {
    return 'admin';
  }

  if (pathname.startsWith('/lecturer')) {
    return 'lecturer';
  }

  if (pathname.startsWith('/student')) {
    return 'student';
  }

  return null;
};

export default function DashboardAuthGate({ children }: DashboardAuthGateProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [gateState, setGateState] = useState<GateState>('checking');

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const session = readAuthSession();

      if (!session) {
        router.replace('/login');
        return;
      }

      try {
        const response = await fetch(`${getApiBaseUrl()}/api/auth/me`, {
          headers: buildAuthHeaders(session.accessToken),
          method: 'GET',
        });

        const payload = (await response.json().catch(() => null)) as
          | {
              user?: {
                email?: string | null;
                fullName?: string | null;
                id?: string | null;
                isPro?: boolean | null;
                role?: string | null;
              } | null;
            }
          | null;

        if (!response.ok || !payload?.user) {
          throw new Error('Your session is no longer valid.');
        }

        const nextSession = {
          ...session,
          user: buildUserFromPayload(payload.user),
        };

        saveAuthSession(nextSession);

        const routeRolePrefix = getRouteRolePrefix(pathname);
        const expectedDashboardPath = getDashboardPath(nextSession.user.role);

        if (routeRolePrefix && !pathname.startsWith(expectedDashboardPath)) {
          router.replace(expectedDashboardPath);
          return;
        }

        if (!cancelled) {
          setGateState('ready');
        }
      } catch {
        clearAuthSession();
        router.replace('/login');
      }
    };

    setGateState('checking');
    void run();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (gateState !== 'ready') {
    return <div className="mx-auto max-w-[1180px] px-5 py-8 text-sm font-semibold text-[#6d38de]">Checking your session...</div>;
  }

  return <>{children}</>;
}
