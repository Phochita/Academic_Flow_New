'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { buildAuthHeaders, buildUserFromPayload, getApiBaseUrl, getDashboardPath, readAuthSession, saveAuthSession } from '@/lib/auth';

type ConfirmationState = 'loading' | 'success' | 'error';

type MeResponse = {
  user?: {
    avatarUrl?: string | null;
    email?: string | null;
    fullName?: string | null;
    id?: string | null;
    isPro?: boolean | null;
    role?: string | null;
  } | null;
};

const parseHashParams = () => {
  if (typeof window === 'undefined') {
    return new URLSearchParams();
  }

  const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
  return new URLSearchParams(hash);
};

const normalizeErrorMessage = (value?: string | null) => {
  if (!value) {
    return '';
  }

  return value.replace(/\+/g, ' ').trim();
};

export default function ConfirmEmailPage() {
  const router = useRouter();
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>('loading');
  const [message, setMessage] = useState('Finishing your email confirmation...');

  useEffect(() => {
    let isActive = true;
    let redirectTimer: number | undefined;

    const scheduleRedirect = (nextPath: string) => {
      router.replace(nextPath);

      redirectTimer = window.setTimeout(() => {
        if (window.location.pathname !== nextPath) {
          window.location.replace(nextPath);
        }
      }, 250);
    };

    const finishConfirmation = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = parseHashParams();
      const existingSession = readAuthSession();

      const errorMessage =
        normalizeErrorMessage(hashParams.get('error_description')) ||
        normalizeErrorMessage(searchParams.get('error_description'));

      if (errorMessage) {
        if (!isActive) {
          return;
        }

        setConfirmationState('error');
        setMessage(errorMessage);
        return;
      }

      const accessToken = hashParams.get('access_token')?.trim();
      const refreshToken = hashParams.get('refresh_token')?.trim();
      const tokenType = hashParams.get('token_type')?.trim();
      const expiresAtValue = hashParams.get('expires_at')?.trim();
      const expiresAt = expiresAtValue && /^\d+$/.test(expiresAtValue) ? Number(expiresAtValue) : null;

      if (!accessToken || !refreshToken || !tokenType) {
        if (existingSession) {
          const nextPath = getDashboardPath(existingSession.user.role);

          if (!isActive) {
            return;
          }

          setConfirmationState('success');
          setMessage('Your email is already confirmed. Taking you to your dashboard...');
          scheduleRedirect(nextPath);
          return;
        }

        if (!isActive) {
          return;
        }

        setConfirmationState('error');
        setMessage('This confirmation link is missing a valid sign-in session. Please open the newest email and try again.');
        return;
      }

      window.history.replaceState(null, '', window.location.pathname);

      try {
        const response = await fetch(`${apiBaseUrl}/api/auth/me`, {
          method: 'GET',
          headers: buildAuthHeaders(accessToken),
        });

        const payload = (await response.json().catch(() => null)) as MeResponse | null;

        if (!response.ok || !payload?.user) {
          throw new Error('Your email was confirmed, but we could not finish signing you in.');
        }

        const session = {
          accessToken,
          expiresAt,
          refreshToken,
          tokenType,
          user: buildUserFromPayload(payload.user),
        };

        saveAuthSession(session);

        const nextPath = getDashboardPath(session.user.role);

        if (!isActive) {
          return;
        }

        setConfirmationState('success');
        setMessage(`Email confirmed successfully. Taking you to your ${session.user.role} dashboard...`);
        scheduleRedirect(nextPath);
      } catch (error) {
        if (!isActive) {
          return;
        }

        const nextMessage =
          error instanceof Error
            ? error.message
            : 'We could not finish your email confirmation. Please try signing in manually.';

        setConfirmationState('error');
        setMessage(nextMessage);
      }
    };

    void finishConfirmation();

    return () => {
      isActive = false;

      if (redirectTimer) {
        window.clearTimeout(redirectTimer);
      }
    };
  }, [apiBaseUrl, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8efff_0%,#fdf8ff_100%)] px-6 py-12 text-[#2d1852]">
      <section className="w-full max-w-[560px] rounded-[32px] border border-white/70 bg-white/95 p-8 shadow-[0_30px_60px_-36px_rgba(71,20,120,0.35)] backdrop-blur sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[linear-gradient(135deg,#6d38de_0%,#9b78f6_100%)] text-2xl font-bold text-white shadow-[0_24px_34px_-24px_rgba(109,56,222,0.72)]">
          A
        </div>

        <div className="mt-8 text-center">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.28em] text-[#8f78b5]">Email Confirmation</p>
          <h1 className="mt-4 text-[2rem] font-bold tracking-[-0.05em] text-[#2d1852] sm:text-[2.4rem]">
            {confirmationState === 'loading'
              ? 'Confirming Your Account'
              : confirmationState === 'success'
                ? 'You Are All Set'
                : 'Confirmation Needed'}
          </h1>
          <p className="mt-4 text-[1rem] leading-7 text-[#6b5a88]">{message}</p>
        </div>

        <div className="mt-8 rounded-[24px] border border-[#eee3fb] bg-[#faf6ff] p-5">
          {confirmationState === 'loading' ? (
            <div className="space-y-4">
              <div className="h-2 rounded-full bg-[#ede2fb]">
                <div className="h-2 w-1/2 animate-pulse rounded-full bg-[#7b46ee]" />
              </div>
              <p className="text-sm leading-6 text-[#6d5a8f]">
                We are validating your confirmation link and restoring your session now.
              </p>
            </div>
          ) : confirmationState === 'success' ? (
            <div className="space-y-3 text-left">
              <div className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Success
              </div>
              <p className="text-sm leading-6 text-[#6d5a8f]">
                Your account is active and the app will continue automatically in a moment.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-left">
              <div className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
                Link Error
              </div>
              <p className="text-sm leading-6 text-[#6d5a8f]">
                If this link expired, sign in again or register once more to request a fresh confirmation email.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(90deg,#6d38de_0%,#9b78f6_100%)] px-5 py-3 text-sm font-semibold text-white"
                >
                  Go to Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-2xl border border-[#decff7] px-5 py-3 text-sm font-semibold text-[#5e3ca7]"
                >
                  Create Account Again
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
