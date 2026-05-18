import { getApiBaseUrl } from '@/lib/auth';

export type ProfileStatus = 'active' | 'pending_review' | 'suspended';

export type UserProfile = {
  academicBio: string | null;
  address: string | null;
  avatarUrl: string | null;
  batch: string | null;
  classYear: number | null;
  createdAt: string | null;
  currentGpa: number | null;
  department: string | null;
  earnedCredits: number | null;
  email: string | null;
  firstName: string | null;
  fullName: string | null;
  id: string;
  isPro: boolean;
  lastName: string | null;
  lastSeenAt: string | null;
  phoneNumber: string | null;
  role: 'student' | 'lecturer' | 'admin';
  status: ProfileStatus;
};

export type UpdateProfilePayload = {
  academicBio?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
  batch?: string | null;
  classYear?: number | null;
  currentGpa?: number | null;
  department?: string | null;
  earnedCredits?: number | null;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string | null;
};

type ProfileResponse = {
  error?: string;
  message?: string;
  profile?: UserProfile;
};

type ProfileSuccessResponse = ProfileResponse & {
  profile: UserProfile;
};

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Unable to read that image file.'));
    };

    reader.onerror = () => reject(new Error('Unable to read that image file.'));
    reader.readAsDataURL(file);
  });

const requestProfile = async (
  accessToken: string,
  fallbackMessage: string,
  init?: RequestInit,
): Promise<ProfileSuccessResponse> => {
  const response = await fetch(`${getApiBaseUrl()}/api/profile/me`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const payload = (await response.json().catch(() => null)) as ProfileResponse | null;

  if (!response.ok || !payload?.profile) {
    throw new Error(payload?.error?.trim() || fallbackMessage);
  }

  return payload as ProfileSuccessResponse;
};

export const fetchMyProfile = async (accessToken: string) => {
  const payload = await requestProfile(accessToken, 'Unable to load your profile right now.', { method: 'GET' });
  return payload.profile;
};

export const updateMyProfile = async (accessToken: string, updates: UpdateProfilePayload) => {
  const payload = await requestProfile(accessToken, 'Unable to update your profile right now.', {
    body: JSON.stringify(updates),
    method: 'PATCH',
  });

  return {
    message: payload.message ?? 'Profile updated successfully.',
    profile: payload.profile,
  };
};

export const uploadMyAvatar = async (accessToken: string, file: File) => {
  const dataUrl = await fileToDataUrl(file);
  const response = await fetch(`${getApiBaseUrl()}/api/profile/me/avatar`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contentType: file.type,
      dataUrl,
      fileName: file.name,
    }),
  });

  const payload = (await response.json().catch(() => null)) as ProfileResponse | null;

  if (!response.ok || !payload?.profile) {
    throw new Error(payload?.error?.trim() || 'Unable to upload your profile image right now.');
  }

  return {
    message: payload.message ?? 'Profile photo uploaded successfully.',
    profile: payload.profile,
  };
};
