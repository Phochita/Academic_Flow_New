'use client';

import { useRouter } from 'next/navigation';
import { clearAuthSession } from '@/lib/auth';

type LogoutConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
};

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

export default function LogoutConfirmDialog({ open, onClose }: LogoutConfirmDialogProps) {
  const router = useRouter();

  if (!open) {
    return null;
  }

  function handleLogout() {
    clearAuthSession();
    onClose();
    router.push('/login');
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#1e1232]/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-[420px] rounded-[28px] border border-[#eadcf7] bg-white p-6 shadow-[0_30px_46px_-30px_rgba(39,17,77,0.45)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#8f7ba8]">Confirm Logout</p>
            <h2 className="mt-2 text-[1.6rem] font-bold tracking-[-0.04em] text-[#2a1842]">Leave your dashboard?</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close logout dialog"
            className="grid h-9 w-9 place-items-center rounded-full border border-[#eadcf7] text-[#7b6a97] transition hover:text-[#5a2ddf]"
          >
            <CloseIcon />
          </button>
        </div>

        <p className="mt-4 text-sm leading-7 text-[#66557f]">
          You will be signed out from your current session and returned to the login page.
        </p>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#6b5a88] transition hover:text-[#5a2ddf]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full bg-[linear-gradient(135deg,#7641e8_0%,#9a73ef_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_28px_-20px_rgba(118,65,232,0.95)] transition hover:scale-[1.01]"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
