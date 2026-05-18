'use client';

import Link from 'next/link';
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { readAuthSession, updateStoredAuthUser } from '@/lib/auth';
import { fetchMyProfile, updateMyProfile, uploadMyAvatar, UserProfile } from '@/lib/profile';

const fallbackFontFamily = 'Arial, Helvetica, sans-serif';
const inter = { className: 'font-sans', style: { fontFamily: fallbackFontFamily } };
const manrope = { className: 'font-sans', style: { fontFamily: fallbackFontFamily } };

type ProfileFormState = {
  academicBio: string;
  address: string;
  avatarUrl: string;
  batch: string;
  classYear: string;
  currentGpa: string;
  department: string;
  earnedCredits: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

const createEmptyFormState = (): ProfileFormState => ({
  academicBio: '',
  address: '',
  avatarUrl: '',
  batch: '',
  classYear: '',
  currentGpa: '',
  department: '',
  earnedCredits: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
});

const buildFormState = (profile: UserProfile): ProfileFormState => ({
  academicBio: profile.academicBio ?? '',
  address: profile.address ?? '',
  avatarUrl: profile.avatarUrl ?? '',
  batch: profile.batch ?? '',
  classYear: profile.classYear ? String(profile.classYear) : '',
  currentGpa: profile.currentGpa !== null ? String(profile.currentGpa) : '',
  department: profile.department ?? '',
  earnedCredits: profile.earnedCredits !== null ? String(profile.earnedCredits) : '',
  firstName: profile.firstName ?? '',
  lastName: profile.lastName ?? '',
  phoneNumber: profile.phoneNumber ?? '',
});

function ImagePlaceholderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-11 w-11 text-[#757575]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      aria-hidden="true"
    >
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
      <circle cx="9" cy="9.8" r="1.4" fill="currentColor" stroke="none" />
      <path d="m20.5 16-4.8-4.8-4 4-2.3-2.3L3.5 19" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[#94A3B8]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <rect x="4" y="6.5" width="16" height="11" rx="2" />
      <path d="m5.5 8 6.5 5 6.5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px] text-[#94A3B8]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path d="M8 4.7h2.1L11.2 8l-1.7 1.4a13.8 13.8 0 0 0 5 5l1.4-1.7 3.4 1.1v2.1c0 .7-.6 1.3-1.3 1.3A13.5 13.5 0 0 1 6.7 6c0-.7.6-1.3 1.3-1.3Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-1">
      <h2 className={`${manrope.className} text-[18px] leading-7 font-bold text-[#630ED4]`}>{title}</h2>
      <p className={`${inter.className} text-[14px] leading-5 font-normal text-[#4A4455]`}>{description}</p>
    </div>
  );
}

function InputLabel({
  children,
  weight = 'bold',
}: {
  children: React.ReactNode;
  weight?: 'semibold' | 'bold';
}) {
  return (
    <span
      className={`${inter.className} text-[12px] leading-4 uppercase tracking-[0.6px] text-[#64748B] ${
        weight === 'bold' ? 'font-bold' : 'font-semibold'
      }`}
    >
      {children}
    </span>
  );
}

function BaseInput({
  icon,
  muted = false,
  name,
  onChange,
  placeholder,
  readOnly = false,
  type = 'text',
  value,
}: {
  icon?: React.ReactNode;
  muted?: boolean;
  name: keyof ProfileFormState | 'email';
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
  type?: string;
  value: string;
}) {
  return (
    <div className="relative mt-2">
      {icon ? (
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
          {icon}
        </span>
      ) : null}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`${inter.className} h-12 w-full appearance-none rounded-[8px] border-0 px-4 text-[16px] leading-6 font-normal text-[#191C1E] outline-none ring-0 placeholder:text-[#94A3B8] ${
          icon ? 'pl-12' : ''
        } ${muted ? 'bg-[rgba(226,232,240,0.5)] text-[#64748B]' : 'bg-white'}`}
      />
    </div>
  );
}

export default function EditProfilePage() {
  const session = useMemo(() => readAuthSession(), []);
  const [formState, setFormState] = useState<ProfileFormState>(createEmptyFormState());
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    const loadProfile = async () => {
      if (!session) {
        if (!ignore) {
          setErrorMessage('Sign in again to edit your profile.');
          setIsLoading(false);
        }
        return;
      }

      try {
        const nextProfile = await fetchMyProfile(session.accessToken);

        if (!ignore) {
          setProfile(nextProfile);
          setFormState(buildFormState(nextProfile));
          setErrorMessage('');
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

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setFormState((currentState) => ({
      ...currentState,
      [name]: value,
    }));
  };

  const normalizeOptionalText = (value: string) => {
    const trimmedValue = value.trim();
    return trimmedValue.length > 0 ? trimmedValue : null;
  };

  const handleAvatarFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    if (!session) {
      setErrorMessage('Sign in again to upload your profile image.');
      return;
    }

    setIsUploadingAvatar(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { message, profile: nextProfile } = await uploadMyAvatar(session.accessToken, file);
      setProfile(nextProfile);
      setFormState(buildFormState(nextProfile));
      setSuccessMessage(message);
      updateStoredAuthUser({
        avatarUrl: nextProfile.avatarUrl,
        email: nextProfile.email,
        fullName: nextProfile.fullName,
        id: nextProfile.id,
        isPro: nextProfile.isPro,
        role: nextProfile.role,
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to upload your profile image right now.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!session) {
      setErrorMessage('Sign in again to edit your profile.');
      return;
    }

    if (!formState.firstName.trim() || !formState.lastName.trim()) {
      setErrorMessage('First name and last name are required.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { message, profile: nextProfile } = await updateMyProfile(session.accessToken, {
        academicBio: normalizeOptionalText(formState.academicBio),
        address: normalizeOptionalText(formState.address),
        avatarUrl: normalizeOptionalText(formState.avatarUrl),
        batch: normalizeOptionalText(formState.batch),
        classYear: formState.classYear.trim() ? Number(formState.classYear) : null,
        currentGpa: formState.currentGpa.trim() ? Number(formState.currentGpa) : null,
        department: normalizeOptionalText(formState.department),
        earnedCredits: formState.earnedCredits.trim() ? Number(formState.earnedCredits) : null,
        firstName: formState.firstName.trim(),
        lastName: formState.lastName.trim(),
        phoneNumber: normalizeOptionalText(formState.phoneNumber),
      });

      setProfile(nextProfile);
      setFormState(buildFormState(nextProfile));
      setSuccessMessage(message);
      updateStoredAuthUser({
        avatarUrl: nextProfile.avatarUrl,
        email: nextProfile.email,
        fullName: nextProfile.fullName,
        id: nextProfile.id,
        isPro: nextProfile.isPro,
        role: nextProfile.role,
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to update your profile right now.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-[1024px] flex-col items-start gap-12 px-5 py-10 lg:px-10 lg:pb-[78px]">
        <header className="flex w-full max-w-[944px] flex-col items-start gap-2">
          <h1
            className={`${manrope.className} text-[36px] leading-10 font-extrabold tracking-[-0.9px] text-[#630ED4]`}
            style={{ fontFamily: manrope.style.fontFamily, fontSize: '36px', fontWeight: '800', color: '#630ED4' }}
          >
            Edit Profile
          </h1>
          <div className="max-w-[672px]">
            <p
              style={{ fontFamily: inter.style.fontFamily, fontSize: '16px', fontWeight: '400', color: '#4A4455' }}
              className={`${inter.className} text-[16px] leading-6 font-normal text-[#4A4455]`}
            >
              This page now loads your profile from the backend and saves changes through `PATCH /api/profile/me`.
              Updates here are stored in the real database and then reflected in the dashboard session.
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="flex w-full max-w-[944px] flex-col items-start gap-12 pb-8">
          {errorMessage ? (
            <p className="w-full rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
          ) : null}
          {successMessage ? (
            <p className="w-full rounded-[16px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</p>
          ) : null}

          <section
            className="grid w-full items-start gap-8 xl:grid-cols-[293.33px_1fr]"
            style={{ gridTemplateRows: 'auto auto', width: '100%', margin: '20px 10px', gridTemplateColumns: '293.33px 1fr' }}
          >
            <div className="max-w-[293.33px]" style={{ width: '100%' }}>
              <SectionTitle
                title="Profile Photo"
                description="Upload a real image from your computer or paste an image URL. The uploaded file is stored in Supabase Storage."
              />
            </div>

            <div className="flex min-h-[176px] w-full items-center gap-8 rounded-[8px] bg-[#F3F4F6] p-6">
              <div className="relative h-[129px] w-36 shrink-0 overflow-hidden rounded-[8px] bg-[#ECECEC]">
                {formState.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={formState.avatarUrl} alt="Profile preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-[129px] w-36 place-items-center">
                    <ImagePlaceholderIcon />
                  </div>
                )}
              </div>

              <div className="w-full">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-[9999px] bg-gradient-to-r from-[#630ED4] to-[#7C3AED] px-5 py-2.5 text-[13px] font-bold uppercase tracking-[1px] text-white shadow-[0_10px_15px_-3px_rgba(139,92,246,0.2),0_4px_6px_-4px_rgba(139,92,246,0.2)]">
                    {isUploadingAvatar ? 'Uploading...' : 'Upload From Computer'}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      onChange={handleAvatarFileChange}
                      disabled={isUploadingAvatar || isLoading}
                      className="sr-only"
                    />
                  </label>
                  <p className={`${inter.className} text-[12px] leading-4 font-normal text-[#4A4455]`}>
                    JPG, PNG, WEBP, or GIF. Max 2 MB.
                  </p>
                </div>
                <label className="block">
                  <InputLabel>Avatar URL</InputLabel>
                  <BaseInput
                    name="avatarUrl"
                    value={formState.avatarUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </label>
                <p className={`${inter.className} mt-3 pl-1 text-[12px] leading-4 font-normal text-[#4A4455]`}>
                  Uploading saves the file into Supabase Storage and updates your profile automatically. You can still paste a public image URL if you prefer.
                </p>
              </div>
            </div>
          </section>

          <section className="grid w-full items-start gap-8 xl:grid-cols-[293.33px_1fr]">
            <div className="max-w-[293.33px]">
              <SectionTitle title="Personal Details" description="Update your legal name and academic bio for the portal." />
            </div>

            <div className="w-full rounded-[8px] bg-[#F3F4F6] p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <label className="block">
                  <InputLabel>First Name</InputLabel>
                  <BaseInput name="firstName" value={formState.firstName} onChange={handleInputChange} placeholder="First name" />
                </label>

                <label className="block">
                  <InputLabel>Last Name</InputLabel>
                  <BaseInput name="lastName" value={formState.lastName} onChange={handleInputChange} placeholder="Last name" />
                </label>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <label className="block">
                  <InputLabel>Department</InputLabel>
                  <BaseInput name="department" value={formState.department} onChange={handleInputChange} placeholder="Computer Science" />
                </label>

                <label className="block">
                  <InputLabel>Batch</InputLabel>
                  <BaseInput name="batch" value={formState.batch} onChange={handleInputChange} placeholder="Batch 12" />
                </label>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <label className="block">
                  <InputLabel>Class Year</InputLabel>
                  <BaseInput name="classYear" value={formState.classYear} onChange={handleInputChange} placeholder="2026" type="number" />
                </label>

                <label className="block">
                  <InputLabel>Earned Credits</InputLabel>
                  <BaseInput
                    name="earnedCredits"
                    value={formState.earnedCredits}
                    onChange={handleInputChange}
                    placeholder="96"
                    type="number"
                  />
                </label>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <label className="block">
                  <InputLabel>Current GPA</InputLabel>
                  <BaseInput name="currentGpa" value={formState.currentGpa} onChange={handleInputChange} placeholder="3.75" type="number" />
                </label>

                <label className="block">
                  <InputLabel>Address</InputLabel>
                  <BaseInput name="address" value={formState.address} onChange={handleInputChange} placeholder="Phnom Penh, Cambodia" />
                </label>
              </div>

              <div className="mt-6">
                <label className="block">
                  <InputLabel>Academic Bio</InputLabel>
                  <textarea
                    rows={4}
                    maxLength={500}
                    name="academicBio"
                    value={formState.academicBio}
                    onChange={handleInputChange}
                    placeholder="Tell your classmates and lecturers about your academic focus."
                    className={`${inter.className} mt-2 w-full appearance-none resize-none rounded-[8px] border-0 bg-white px-4 py-3 text-[16px] leading-6 font-normal text-[#191C1E] outline-none ring-0 placeholder:text-[#94A3B8]`}
                  />
                </label>
                <div className="mt-3 flex justify-end">
                  <p className={`${inter.className} text-[11px] leading-4 font-normal text-[#94A3B8]`}>
                    Character count: {formState.academicBio.length}/500
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid w-full items-start gap-8 xl:grid-cols-[293.33px_1fr]">
            <div className="max-w-[293.33px]">
              <SectionTitle title="Contact Info" description="Institutional contact stays read-only while direct contact can be updated here." />
            </div>

            <div className="flex w-full flex-col gap-6 rounded-[8px] bg-[#F3F4F6] p-8">
              <div>
                <label className="block">
                  <InputLabel weight="semibold">Email</InputLabel>
                  <BaseInput name="email" value={profile?.email ?? ''} readOnly muted icon={<MailIcon />} />
                </label>
                <p className={`${inter.className} mt-2 pl-1 text-[11px] leading-4 font-medium text-[#8B5CF6]`}>
                  Email comes from Supabase auth and is not edited from this profile form.
                </p>
              </div>

              <label className="block">
                <InputLabel weight="semibold">Phone Number</InputLabel>
                <BaseInput
                  name="phoneNumber"
                  value={formState.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+855 12345678"
                  icon={<PhoneIcon />}
                />
              </label>
            </div>
          </section>

          <div className="w-full">
            <div className="flex h-[78px] w-full items-center justify-end gap-4 rounded-[16px] border border-white/40 bg-white/70 px-4 py-4 shadow-[0_25px_50px_-12px_rgba(76,29,149,0.1)] backdrop-blur-md">
              <Link
                href="/setting"
                className={`${inter.className} inline-flex h-11 items-center justify-center rounded-[9999px] px-8 text-[14px] leading-5 font-semibold uppercase tracking-[1.4px] text-[#475569]`}
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading || isSaving}
                className={`${inter.className} inline-flex h-11 min-w-[206.73px] items-center justify-center rounded-[9999px] bg-gradient-to-r from-[#630ED4] to-[#7C3AED] px-10 text-[14px] leading-5 font-bold uppercase tracking-[1.4px] text-white shadow-[0_10px_15px_-3px_rgba(139,92,246,0.2),0_4px_6px_-4px_rgba(139,92,246,0.2)] disabled:cursor-not-allowed disabled:opacity-70`}
              >
                {isLoading ? 'Loading Profile...' : isSaving ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
