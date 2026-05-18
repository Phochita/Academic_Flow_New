export type DemoUserRole = 'student' | 'lecturer' | 'admin';

export type DemoUser = {
  createdAt: string;
  email: string;
  fullName: string;
  role: DemoUserRole;
};

export const demoUserStorageKey = 'acaflow-demo-user';

export const saveDemoUser = (user: DemoUser) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(demoUserStorageKey, JSON.stringify(user));
};

export const readDemoUser = (): DemoUser | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const value = window.localStorage.getItem(demoUserStorageKey);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as DemoUser;
  } catch {
    return null;
  }
};

export const getDashboardPath = (role: DemoUserRole) => {
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
