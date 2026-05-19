import { useMemo, useSyncExternalStore } from 'react';

export type AppRole = 'student' | 'lecturer' | 'admin';

export type AppUser = {
  avatarUrl: string | null;
  id: string | null;
  email: string | null;
  fullName: string | null;
  isPro: boolean;
  role: AppRole;
};

export type AuthSession = {
  accessToken: string;
  expiresAt: number | null;
  refreshToken: string;
  tokenType: string;
  user: AppUser;
};

type AuthPayload = {
  session?: {
    accessToken?: string | null;
    expiresAt?: number | null;
    refreshToken?: string | null;
    tokenType?: string | null;
  } | null;
  user?: {
    avatarUrl?: string | null;
    email?: string | null;
    fullName?: string | null;
    id?: string | null;
    isPro?: boolean | null;
    role?: string | null;
  } | null;
};

export const authSessionStorageKey = 'acaflow-auth-session';
const authSessionChangeEvent = 'acaflow-auth-session-change';

export const getApiBaseUrl = () => {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return configuredBaseUrl?.replace(/\/$/, '') || 'http://localhost:4000';
};

export const getAuthRequestErrorMessage = (error: unknown, fallback: string, apiBaseUrl = getApiBaseUrl()) => {
  if (error instanceof Error) {
    const message = error.message.trim();

    if (message.toLowerCase() === 'failed to fetch') {
      return `Cannot reach the AcaFlow API at ${apiBaseUrl}. Start the backend server or check NEXT_PUBLIC_API_BASE_URL.`;
    }

    return message || fallback;
  }

  return fallback;
};

export const normalizeRole = (role?: string | null): AppRole => {
  if (role === 'admin' || role === 'lecturer') {
    return role;
  }

  return 'student';
};

export const buildUserFromPayload = (user?: AuthPayload['user']): AppUser => ({
  avatarUrl: user?.avatarUrl?.trim() || null,
  email: user?.email?.trim() || null,
  fullName: user?.fullName?.trim() || null,
  id: user?.id?.trim() || null,
  isPro: Boolean(user?.isPro),
  role: normalizeRole(user?.role),
});

const parseStoredAuthSession = (value: string | null): AuthSession | null => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<AuthSession>;

    if (
      typeof parsed.accessToken !== 'string' ||
      typeof parsed.refreshToken !== 'string' ||
      typeof parsed.tokenType !== 'string' ||
      !parsed.user
    ) {
      return null;
    }

    return {
      accessToken: parsed.accessToken,
      expiresAt: typeof parsed.expiresAt === 'number' ? parsed.expiresAt : null,
      refreshToken: parsed.refreshToken,
      tokenType: parsed.tokenType,
      user: buildUserFromPayload(parsed.user),
    };
  } catch {
    return null;
  }
};

const dispatchAuthSessionChange = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(authSessionChangeEvent));
};

export const buildSessionFromPayload = (payload: AuthPayload): AuthSession | null => {
  const accessToken = payload.session?.accessToken?.trim();
  const refreshToken = payload.session?.refreshToken?.trim();
  const tokenType = payload.session?.tokenType?.trim();

  if (!accessToken || !refreshToken || !tokenType || !payload.user) {
    return null;
  }

  return {
    accessToken,
    expiresAt: payload.session?.expiresAt ?? null,
    refreshToken,
    tokenType,
    user: buildUserFromPayload(payload.user),
  };
};

export const saveAuthSession = (session: AuthSession) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(authSessionStorageKey, JSON.stringify(session));
  dispatchAuthSessionChange();
};

export const readAuthSession = (): AuthSession | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return parseStoredAuthSession(window.localStorage.getItem(authSessionStorageKey));
};

export const clearAuthSession = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(authSessionStorageKey);
  dispatchAuthSessionChange();
};

export const readAuthUser = () => readAuthSession()?.user ?? null;

const subscribeToAuthStorage = (callback: () => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (!event.key || event.key === authSessionStorageKey) {
      callback();
    }
  };

  const handleAuthSessionChange = () => {
    callback();
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(authSessionChangeEvent, handleAuthSessionChange);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(authSessionChangeEvent, handleAuthSessionChange);
  };
};

const getStoredAuthSessionSnapshot = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(authSessionStorageKey);
};

export const useStoredAuthUser = () => {
  const serializedSession = useSyncExternalStore(
    subscribeToAuthStorage,
    getStoredAuthSessionSnapshot,
    () => null,
  );

  return useMemo(
    () => parseStoredAuthSession(serializedSession)?.user ?? null,
    [serializedSession],
  );
};

export const updateStoredAuthUser = (updates: Partial<AppUser>) => {
  const session = readAuthSession();

  if (!session) {
    return null;
  }

  const nextSession: AuthSession = {
    ...session,
    user: {
      ...session.user,
      ...updates,
      role: updates.role ? normalizeRole(updates.role) : session.user.role,
    },
  };

  saveAuthSession(nextSession);

  return nextSession;
};

export const buildAuthHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
  'Content-Type': 'application/json',
});

export const getDashboardPath = (role: AppRole) => {
  if (role === 'admin') {
    return '/admin';
  }

  return role === 'student' ? '/student' : '/lecturer';
};

export const getUserInitials = (fullName?: string | null, fallback = 'AF') => {
  const parts = (fullName ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return fallback;
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? '').join('');
};
