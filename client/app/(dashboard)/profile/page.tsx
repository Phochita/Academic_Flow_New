'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AppUser, getDashboardPath, getUserInitials, readAuthSession, updateStoredAuthUser } from '@/lib/auth';
import { fetchMyProfile, UserProfile } from '@/lib/profile';

const fallbackUser: AppUser = {
  avatarUrl: null,
  email: 'student@acaflow.edu',
  fullName: 'AcaFlow Student',
  id: null,
  isPro: false,
  role: 'student',
};

const profileHighlightsByRole: Record<AppUser['role'], Array<{ label: string; value: string }>> = {
  student: [
    { label: 'Profile Sync', value: 'Live API' },
    { label: 'Account Type', value: 'Student' },
    { label: 'Status', value: 'Verified' },
  ],
  lecturer: [
    { label: 'Profile Sync', value: 'Live API' },
    { label: 'Account Type', value: 'Lecturer' },
    { label: 'Status', value: 'Verified' },
  ],
  admin: [
    { label: 'Profile Sync', value: 'Live API' },
    { label: 'Account Type', value: 'Admin' },
    { label: 'Status', value: 'Internal' },
  ],
};

const quickLinksByRole: Record<AppUser['role'], Array<{ href: string; label: string }>> = {
  student: [
    { href: '/student?view=courses', label: 'My Courses' },
    { href: '/assignments', label: 'Assignments' },
    { href: '/attendance', label: 'Attendance' },
    { href: '/edit_profile', label: 'Edit Profile' },
  ],
  lecturer: [
    { href: '/lecturer', label: 'Dashboard' },
    { href: '/lecturer/classwork', label: 'Classwork' },
    { href: '/lecturer/grades', label: 'Grades' },
    { href: '/edit_profile', label: 'Edit Profile' },
  ],
  admin: [
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/activity', label: 'Activity Logs' },
    { href: '/admin/reports', label: 'Reports' },
    { href: '/edit_profile', label: 'Edit Profile' },
  ],
};

const formatRole = (role: AppUser['role']) => role.charAt(0).toUpperCase() + role.slice(1);

const formatProfileStatus = (status: UserProfile['status']) =>
  status
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const formatDate = (value?: string | null) => {
  if (!value) {
    return 'Not available yet';
  }

  return new Date(value).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const buildInfoRows = (profile: UserProfile | null, user: AppUser) => [
  { label: 'Name', value: profile?.fullName ?? user.fullName ?? 'Not set yet' },
  { label: 'Email', value: profile?.email ?? user.email ?? 'Not set yet' },
  { label: 'Phone', value: profile?.phoneNumber ?? 'Add a contact number' },
  { label: 'Department', value: profile?.department ?? 'Add your department' },
  { label: 'Batch', value: profile?.batch ?? 'Add your batch' },
  { label: 'Class Year', value: profile?.classYear ? String(profile.classYear) : 'Add your class year' },
  { label: 'Role', value: formatRole(profile?.role ?? user.role) },
  { label: 'Status', value: profile ? formatProfileStatus(profile.status) : 'Loading...' },
];

export default function ProfilePage() {
  const session = useMemo(() => readAuthSession(), []);
  const authUser = session?.user ?? fallbackUser;
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadProfile = async () => {
      if (!session) {
        if (!ignore) {
          setErrorMessage('Sign in again to load your profile.');
          setIsLoading(false);
        }
        return;
      }

      try {
        const nextProfile = await fetchMyProfile(session.accessToken);

        if (!ignore) {
          setProfile(nextProfile);
          setErrorMessage('');
          updateStoredAuthUser({
            avatarUrl: nextProfile.avatarUrl,
            email: nextProfile.email,
            fullName: nextProfile.fullName,
            id: nextProfile.id,
            isPro: nextProfile.isPro,
            role: nextProfile.role,
          });
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load your profile right now.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      ignore = true;
    };
  }, [session]);

  const currentUser = {
    ...authUser,
    avatarUrl: profile?.avatarUrl ?? authUser.avatarUrl,
    email: profile?.email ?? authUser.email,
    fullName: profile?.fullName ?? authUser.fullName,
    id: profile?.id ?? authUser.id,
    isPro: profile?.isPro ?? authUser.isPro,
    role: profile?.role ?? authUser.role,
  };

  const dashboardPath = getDashboardPath(currentUser.role);
  const initials = getUserInitials(currentUser.fullName);
  const profileHighlights = profileHighlightsByRole[currentUser.role];
  const quickLinks = quickLinksByRole[currentUser.role];
  const infoRows = buildInfoRows(profile, currentUser);

  return (
    <div className="mx-auto max-w-[1180px] space-y-6 pt-2">
      <section className="overflow-hidden rounded-[34px] border border-[#eadcf7] bg-white shadow-[0_30px_48px_-40px_rgba(95,41,210,0.72)]">
        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1.35fr)_260px] lg:px-8">
          <div className="space-y-6">
            <div className="flex flex-wrap items-start gap-6">
              <div className="grid h-36 w-36 place-items-center overflow-hidden rounded-[28px] border border-[#f0e6ff] bg-[linear-gradient(145deg,#f7efff_0%,#ffffff_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                {profile?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatarUrl} alt={currentUser.fullName ?? 'User avatar'} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-20 w-20 place-items-center rounded-[24px] bg-[#efe3ff] text-[1.5rem] font-bold tracking-[0.12em] text-[#6d38de]">
                    {initials}
                  </div>
                )}
              </div>

              <div className="min-w-[240px] flex-1 space-y-4">
                <div>
                  <p className="text-[0.78rem] font-semibold uppercase tracking-[0.28em] text-[#8e7cab]">My Profile</p>
                  <h1 className="mt-2 text-[2.8rem] font-bold tracking-[-0.06em] text-[#5c2ddd]">
                    {currentUser.fullName ?? 'Complete your profile'}
                  </h1>
                  <p className="mt-3 text-[1rem] text-[#6d5c89]">{formatRole(currentUser.role)} Dashboard Access</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {profileHighlights.map((highlight, index) => (
                    <div key={highlight.label} className="rounded-[20px] border border-[#f0e6ff] bg-[#fcf9ff] px-4 py-4">
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#9b8bb4]">{highlight.label}</p>
                      <p className="mt-2 text-[1.5rem] font-bold tracking-[-0.04em] text-[#2b1943]">
                        {index === 1 ? formatRole(currentUser.role) : index === 2 ? (profile ? formatProfileStatus(profile.status) : highlight.value) : highlight.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {errorMessage ? (
              <p className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
            ) : null}

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
              <section className="rounded-[28px] border border-[#f0e6ff] bg-[#fffefe] p-6">
                {isLoading ? (
                  <p className="text-sm font-semibold text-[#6d38de]">Loading your profile...</p>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2">
                    {infoRows.map((row) => (
                      <div key={row.label} className="space-y-1">
                        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#a08fb8]">{row.label}</p>
                        <p className="text-[1.08rem] font-semibold text-[#2d1b46]">{row.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <aside className="rounded-[28px] bg-[linear-gradient(160deg,#6f32e4_0%,#933ff0_100%)] p-6 text-white shadow-[0_30px_48px_-34px_rgba(111,50,228,0.95)]">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-[18px] bg-white/14">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                      <path d="M12 3 9.8 8.1 5 10.3l4.8 2.2L12 17.7l2.2-5.2 4.8-2.2-4.8-2.2L12 3Z" strokeLinejoin="round" />
                      <path d="M19 16.5 18 19l-2.5 1 2.5 1L19 23l1-2 2.5-1-2.5-1-1-2.5Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-[1.45rem] font-bold tracking-[-0.04em]">Profile Sync</h2>
                    <p className="text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-white/70">Backend Connected</p>
                  </div>
                </div>

                <p className="mt-5 text-[0.95rem] leading-7 text-white/88">
                  This page now reads profile data from `GET /api/profile/me`, so the user information shown here comes
                  from the real database instead of static frontend placeholders.
                </p>

                <div className="mt-6 space-y-3 rounded-[22px] border border-white/15 bg-white/10 p-5">
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-white/70">Created</p>
                    <p className="mt-1 text-sm font-medium text-white">{formatDate(profile?.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-white/70">Last Updated Touchpoint</p>
                    <p className="mt-1 text-sm font-medium text-white">{formatDate(profile?.lastSeenAt)}</p>
                  </div>
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-white/70">Academic Bio</p>
                    <p className="mt-1 text-sm leading-6 text-white/88">{profile?.academicBio ?? 'Add your bio from Edit Profile to see it here.'}</p>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          <aside className="rounded-[30px] border border-[#ece1fb] bg-[#faf5ff] p-6">
            <p className="text-[0.76rem] font-semibold uppercase tracking-[0.22em] text-[#8a78ab]">Quick Access</p>
            <div className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between rounded-[18px] bg-white px-4 py-3.5 text-[0.95rem] font-semibold text-[#2d1b46] shadow-[0_16px_28px_-26px_rgba(95,41,210,0.8)] transition hover:text-[#5c2ddd]"
                >
                  <span>{link.label}</span>
                  <span aria-hidden="true">&gt;</span>
                </Link>
              ))}
            </div>

            <Link
              href={dashboardPath}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[18px] bg-[linear-gradient(135deg,#7641e8_0%,#9a73ef_100%)] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_24px_34px_-24px_rgba(118,65,232,1)] transition hover:scale-[1.01]"
            >
              Back to Dashboard
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
}
