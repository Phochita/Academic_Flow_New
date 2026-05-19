
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import PublicRouteRedirect from '@/components/auth/PublicRouteRedirect';
import {
  buildSessionFromPayload,
  getApiBaseUrl,
  getAuthRequestErrorMessage,
  getDashboardPath,
  saveAuthSession,
} from '@/lib/auth';

type Role = 'student' | 'lecturer';

type RegisterFormState = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: Role;
};

const initialFormState: RegisterFormState = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  role: 'student',
};

const roleOptions: Array<{ label: string; value: Role }> = [
  { label: 'Student', value: 'student' },
  { label: 'Lecturer', value: 'lecturer' },
];

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

export default function RegisterPage() {
  const router = useRouter();
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [form, setForm] = useState<RegisterFormState>(initialFormState);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((currentForm) => {
      if (name === 'role') {
        return {
          ...currentForm,
          role: value as Role,
        };
      }

      return {
        ...currentForm,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedForm = {
      email: form.email.trim().toLowerCase(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      password: form.password,
      role: form.role,
    };

    if (!trimmedForm.firstName || !trimmedForm.lastName || !trimmedForm.email || !trimmedForm.password) {
      setSuccessMessage('');
      setErrorMessage('Please complete all fields before creating your account.');
      return;
    }

    if (trimmedForm.password.length < 8) {
      setSuccessMessage('');
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trimmedForm),
      });

      const payload = (await response.json().catch(() => null)) as
        | {
            message?: string;
            user?: {
              email?: string | null;
              fullName?: string | null;
              role?: Role;
            } | null;
          }
        | null;

      if (!response.ok) {
        throw new Error(getErrorMessage(payload, 'Unable to create your account right now.'));
      }

      const session = buildSessionFromPayload(payload ?? {});

      setForm(initialFormState);
      if (session) {
        setSuccessMessage(payload?.message?.trim() || 'Account created successfully. Redirecting to your dashboard...');
        const nextPath = getDashboardPath(session.user.role);

        saveAuthSession(session);
        router.replace(nextPath);

        window.setTimeout(() => {
          if (window.location.pathname !== nextPath) {
            window.location.replace(nextPath);
          }
        }, 150);

        return;
      }

      setSuccessMessage(
        payload?.message?.trim() ||
          `Account created. Check ${trimmedForm.email} for your confirmation email before signing in.`,
      );
    } catch (error) {
      const message = getAuthRequestErrorMessage(error, 'Unable to create your account right now.', apiBaseUrl);
      setSuccessMessage('');
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans text-[15px]">
      <PublicRouteRedirect />
      {/* Left Side - Visual/Gradient (Consistent with Login) */}
      <div className="gradient-bg relative hidden w-1/2 flex-col justify-between overflow-hidden px-10 py-10 text-white lg:flex">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-12">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center font-bold text-xl">
              A
            </div>
            <span className="text-2xl font-bold tracking-tight">AcaFlow</span>
          </div>
          
          <h2 className="text-4xl font-extrabold leading-tight mb-5">
            Start Your <br />
            Academic Revolution.
          </h2>
          <p className="text-lg text-white/80 max-w-md leading-8">
            The most advanced platform for university management and AI-powered learning.
          </p>
        </div>
        
        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="flex space-x-2 mb-4">
               {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400">★</span>)}
            </div>
            <p className="text-base font-medium mb-4 leading-7">
              &ldquo;Finally, a system that actually understands how modern universities work. The lecturer tools are incredibly intuitive.&rdquo;
            </p>
            <div className="flex items-center space-x-4">
               <div className="w-12 h-12 bg-white/30 rounded-full"></div>
               <div>
                  <div className="font-bold">Dr. Michael Chen</div>
                  <div className="text-sm text-white/60">Senior Lecturer, MIT</div>
               </div>
            </div>
          </div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 bg-background flex items-center justify-center p-7 md:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white font-bold text-xl">
              A
            </div>
            <span className="text-2xl font-bold text-text-primary tracking-tight">AcaFlow</span>
          </div>

          <h1 className="text-2xl font-bold text-text-primary mb-2">Create Account</h1>
          <p className="text-text-secondary mb-7">Join the AcaFlow community today.</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-text-primary mb-2">First Name</label>
                  <input
                     id="firstName"
                     name="firstName"
                     type="text"
                     value={form.firstName}
                     onChange={handleChange}
                     placeholder="John"
                     autoComplete="given-name"
                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
               </div>
               <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-text-primary mb-2">Last Name</label>
                  <input
                     id="lastName"
                     name="lastName"
                     type="text"
                     value={form.lastName}
                     onChange={handleChange}
                     placeholder="Doe"
                     autoComplete="family-name"
                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
               </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-2">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@university.edu"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>

            <div>
               <label className="block text-sm font-semibold text-text-primary mb-3">I am a...</label>
               <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map((roleOption) => (
                     <label key={roleOption.value} className="relative cursor-pointer group">
                        <input
                          type="radio"
                          name="role"
                          value={roleOption.value}
                          checked={form.role === roleOption.value}
                          onChange={handleChange}
                          className="peer sr-only"
                        />
                        <div className="px-3 py-2.5 text-center rounded-xl border border-gray-200 text-sm font-bold text-text-secondary peer-checked:border-primary peer-checked:text-primary peer-checked:bg-primary/5 transition-all group-hover:bg-gray-50">
                           {roleOption.label}
                        </div>
                     </label>
                  ))}
               </div>
            </div>

            <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-900">
              Public signup allows only `Student` and `Lecturer`. `Admin` accounts are created internally only.
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-text-primary mb-2">Password</label>
              <input
                id="password"
                name="password"
                type={isPasswordVisible ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                className="mb-3 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible((currentValue) => !currentValue)}
                aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                className="text-sm font-semibold text-primary transition hover:opacity-80"
              >
                {isPasswordVisible ? 'Hide password' : 'Show password'}
              </button>
            </div>

            {errorMessage ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" aria-live="polite">
                {errorMessage}
              </p>
            ) : null}

            {successMessage ? (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" aria-live="polite">
                {successMessage}
              </p>
            ) : null}

             <div className="text-xs text-text-secondary leading-relaxed">
               By clicking &ldquo;Create Account&rdquo;, you agree to our <Link href="#" className="font-bold text-primary underline">Terms of Service</Link> and <Link href="#" className="font-bold text-primary underline">Privacy Policy</Link>.
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full py-3.5 rounded-xl gradient-bg text-white font-bold shadow-soft hover:opacity-90 transition-all disabled:cursor-not-allowed disabled:opacity-70">
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-8 text-text-secondary">
            Already have an account? <Link href="/login" className="font-bold text-primary hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
