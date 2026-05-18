'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';

const getApiBaseUrl = () => {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return configuredBaseUrl?.replace(/\/$/, '') || 'http://localhost:4000';
};

const getErrorMessage = (payload: unknown, fallback: string) => {
  if (!payload || typeof payload !== 'object') {
    return fallback;
  }

  const response = payload as {
    error?: string;
    issues?: Array<{ message?: string }>;
  };

  if (Array.isArray(response.issues) && response.issues.length > 0) {
    return response.issues
      .map((issue) => issue.message?.trim())
      .filter(Boolean)
      .join(' ');
  }

  return response.error?.trim() || fallback;
};

type RecoveryState = 'checking' | 'ready' | 'invalid' | 'complete';

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7.8a4 4 0 1 1 8 0V10" strokeLinecap="round" />
    </svg>
  );
}

function parseRecoveryAccessToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const searchParams = new URLSearchParams(window.location.search);
  const token = hashParams.get('access_token') || searchParams.get('access_token');
  const type = hashParams.get('type') || searchParams.get('type');

  if (!token) {
    return null;
  }

  if (type && type !== 'recovery') {
    return null;
  }

  return token;
}

export default function ResetPasswordPage() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recoveryState, setRecoveryState] = useState<RecoveryState>('checking');

  useEffect(() => {
    const nextToken = parseRecoveryAccessToken();

    if (!nextToken) {
      setRecoveryState('invalid');
      return;
    }

    setAccessToken(nextToken);
    setRecoveryState('ready');
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!accessToken) {
      setErrorMessage('This recovery link is missing a valid access token. Request a new reset email.');
      return;
    }

    if (password.length < 8) {
      setSuccessMessage('');
      setErrorMessage('Your new password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setSuccessMessage('');
      setErrorMessage('Your password confirmation does not match.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const payload = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(getErrorMessage(payload, 'Unable to update your password right now.'));
      }

      window.history.replaceState(null, '', window.location.pathname);
      setPassword('');
      setConfirmPassword('');
      setAccessToken('');
      setRecoveryState('complete');
      setSuccessMessage(
        payload?.message?.trim() || 'Password updated successfully. You can now sign in with your new password.',
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update your password right now.';
      setSuccessMessage('');
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReady = recoveryState === 'ready';

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff3db_0%,#f7efff_45%,#f4f4ff_100%)] px-6 py-8 text-[15px] text-[#2d1852] sm:px-10 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1024px] items-center justify-center">
        <section className="w-full overflow-hidden rounded-[34px] border border-white/55 bg-white/88 shadow-[0_36px_80px_-46px_rgba(45,24,82,0.34)] backdrop-blur">
          <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
            <div className="bg-[linear-gradient(160deg,#2d1852_0%,#5e2fd7_55%,#ef9b3d_100%)] px-7 py-8 text-white sm:px-10 sm:py-10">
              <p className="text-[0.82rem] font-semibold uppercase tracking-[0.32em] text-white/66">Password Reset</p>
              <h1 className="mt-5 text-[2.5rem] font-extrabold leading-[0.94] tracking-[-0.06em] sm:text-[3.2rem]">
                Create a fresh password and step back in.
              </h1>
              <p className="mt-6 max-w-[360px] text-[1rem] leading-8 text-white/82">
                Choose something unique so your dashboard, course data, and admin tools stay secure.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  'Use 8 or more characters to meet the minimum requirement.',
                  'A mix of letters, numbers, and symbols is much stronger.',
                  'Once saved, return to login and continue with your new password.',
                ].map((tip) => (
                  <div key={tip} className="rounded-[22px] border border-white/14 bg-white/10 px-4 py-4 text-sm leading-6 text-white/82">
                    {tip}
                  </div>
                ))}
              </div>
            </div>

            <div className="px-7 py-8 sm:px-10 sm:py-10">
              <div className="max-w-[440px]">
                <h2 className="text-[2rem] font-bold tracking-[-0.05em] text-[#2d1852] sm:text-[2.35rem]">Set your new password</h2>
                <p className="mt-4 text-[1rem] leading-7 text-[#6a568b]">
                  Finish the recovery flow here. If the link expired, request a new reset email.
                </p>

                {recoveryState === 'invalid' ? (
                  <div className="mt-8 rounded-[22px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-800">
                    This recovery link is missing or no longer valid. Request a fresh password reset email to continue.
                  </div>
                ) : null}

                {successMessage ? (
                  <div className="mt-8 rounded-[22px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm leading-6 text-emerald-700">
                    {successMessage}
                  </div>
                ) : null}

                {errorMessage ? (
                  <div className="mt-8 rounded-[22px] border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-700">
                    {errorMessage}
                  </div>
                ) : null}

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="password" className="mb-3 block text-[0.84rem] font-semibold uppercase tracking-[0.24em] text-[#6a568b]">
                      New Password
                    </label>
                    <div className="flex items-center gap-4 rounded-[18px] border border-[#eadcf9] bg-[#faf4ff] px-5 py-4 text-[#8f79b1] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                      <LockIcon />
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Choose a new password"
                        autoComplete="new-password"
                        disabled={!isReady}
                        className="w-full bg-transparent text-[1rem] text-[#2d1852] outline-none placeholder:text-[#b49ccc] disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-3 block text-[0.84rem] font-semibold uppercase tracking-[0.24em] text-[#6a568b]"
                    >
                      Confirm Password
                    </label>
                    <div className="flex items-center gap-4 rounded-[18px] border border-[#eadcf9] bg-[#faf4ff] px-5 py-4 text-[#8f79b1] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                      <LockIcon />
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Repeat your new password"
                        autoComplete="new-password"
                        disabled={!isReady}
                        className="w-full bg-transparent text-[1rem] text-[#2d1852] outline-none placeholder:text-[#b49ccc] disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!isReady || isSubmitting}
                    className="w-full rounded-[18px] bg-[linear-gradient(90deg,#5e2fd7_0%,#7f58ec_56%,#ef9b3d_100%)] px-6 py-4 text-[1rem] font-semibold text-white shadow-[0_24px_36px_-24px_rgba(94,47,215,0.7)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? 'Saving new password...' : 'Save new password'}
                  </button>
                </form>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm text-[#6a568b]">
                  <Link href="/forgot-password" className="font-semibold text-[#5a2ce4] transition hover:opacity-80">
                    Request another email
                  </Link>
                  <Link href="/login" className="font-semibold text-[#5a2ce4] transition hover:opacity-80">
                    Return to sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
