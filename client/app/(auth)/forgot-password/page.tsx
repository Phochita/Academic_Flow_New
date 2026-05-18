'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';

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

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 7.5 12 13l8-5.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="5" width="18" height="14" rx="3" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="M5 12h13M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ForgotPasswordPage() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setSuccessMessage('');
      setErrorMessage('Enter the email address connected to your account.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const payload = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(getErrorMessage(payload, 'Unable to send a password reset link right now.'));
      }

      setSuccessMessage(
        payload?.message?.trim() ||
          'If an account exists for this email, a password reset link has been sent.',
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to send a password reset link right now.';
      setSuccessMessage('');
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8efff] px-6 py-8 text-[15px] text-[#2d1852] sm:px-10 lg:px-12">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-[1180px] gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden rounded-[34px] bg-[linear-gradient(140deg,#6d38de_0%,#8357eb_48%,#a37ef6_100%)] px-7 py-8 text-white shadow-[0_40px_80px_-40px_rgba(109,56,222,0.55)] sm:px-10 sm:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.24),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_42%)]" />
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div>
              <Link href="/login" className="inline-flex items-center gap-3 text-sm font-semibold tracking-[0.2em] text-white/88">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/18 text-base font-bold">A</span>
                <span>AcaFlow</span>
              </Link>

              <div className="mt-10 max-w-[520px]">
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.34em] text-white/72">Account Recovery</p>
                <h1 className="mt-4 text-[2.8rem] font-extrabold leading-[0.94] tracking-[-0.06em] sm:text-[3.6rem]">
                  Get back into your academic workspace.
                </h1>
                <p className="mt-6 max-w-[460px] text-[1.02rem] leading-8 text-white/84">
                  We will send a secure recovery link so your students, materials, and planner stay protected.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Secure email flow', 'Recovery links are delivered through your registered inbox.'],
                ['Fast return', 'Choose a new password and head straight back to login.'],
                ['Built for AcaFlow', 'The flow matches the rest of your platform instead of a generic form.'],
              ].map(([title, description]) => (
                <div key={title} className="rounded-[24px] border border-white/14 bg-white/10 p-5 backdrop-blur-sm">
                  <p className="text-sm font-semibold tracking-[0.08em] text-white">{title}</p>
                  <p className="mt-3 text-sm leading-6 text-white/74">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-[520px] rounded-[30px] border border-[#eadcf7] bg-[#fbf4ff] p-7 shadow-[0_32px_70px_-42px_rgba(45,24,82,0.22)] backdrop-blur sm:p-9">
            <div>
              <p className="text-[0.82rem] font-semibold uppercase tracking-[0.3em] text-[#7b68a5]">Forgot Password</p>
              <h2 className="mt-3 text-[2.2rem] font-bold tracking-[-0.05em] text-[#2d1852] sm:text-[2.6rem]">
                Reset your password
              </h2>
              <p className="mt-4 max-w-[420px] text-[1rem] leading-7 text-[#6a568b]">
                Enter your email and we will send you a reset link to finish the recovery flow.
              </p>
            </div>

            <form className="mt-9 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="mb-3 block text-[0.84rem] font-semibold uppercase tracking-[0.24em] text-[#6a568b]">
                  Email Address
                </label>
                <div className="flex items-center gap-4 rounded-[18px] bg-[#f3e8ff] px-5 py-4 text-[#8c77ac] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
                  <MailIcon />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="scholar@institution.edu"
                    autoComplete="email"
                    className="w-full bg-transparent text-[1rem] text-[#2d1852] outline-none placeholder:text-[#b49ccc]"
                  />
                </div>
              </div>

              <div className="rounded-[20px] border border-[#eadcf7] bg-white px-5 py-4 text-sm leading-6 text-[#6f5a8f]">
                Check your spam folder if the email does not appear within a couple of minutes.
              </div>

              {errorMessage ? (
                <p className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" aria-live="polite">
                  {errorMessage}
                </p>
              ) : null}

              {successMessage ? (
                <p
                  className="rounded-[18px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                  aria-live="polite"
                >
                  {successMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-3 rounded-[18px] bg-[linear-gradient(90deg,#6d38de_0%,#9b78f6_100%)] px-6 py-4 text-[1rem] font-semibold text-white shadow-[0_24px_36px_-24px_rgba(109,56,222,0.7)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span>{isSubmitting ? 'Sending reset link...' : 'Send reset link'}</span>
                <ArrowIcon />
              </button>
            </form>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm text-[#6a568b]">
              <Link href="/login" className="font-semibold text-[#5a2ce4] transition hover:opacity-80">
                Back to sign in
              </Link>
              <Link href="/register" className="font-semibold text-[#5a2ce4] transition hover:opacity-80">
                Need a new account?
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
