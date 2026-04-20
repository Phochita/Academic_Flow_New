'use client';

import { useState } from 'react';
import { SettingRow, type SettingItem } from '@/components/settings/SettingRow';
import LogoutConfirmDialog from '@/components/layout/LogoutConfirmDialog';

const accountItems: SettingItem[] = [
  { label: 'My Profile', icon: 'user', href: '/profile' },
  { label: 'Detail Information', icon: 'info', href: '/detail_info' },
  { label: 'Edit Profile', icon: 'edit', href: '/edit_profile' },
];

const securityItems: SettingItem[] = [
  { label: 'Change Password', icon: 'lock', href: '/change_password' },
  { label: 'Q&A', icon: 'qa', href: '/support' },
];

export default function Page() {
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <div className="mx-auto max-w-[1100px] space-y-5 text-[#2a1842]">
      <header className="pt-1">
        <h1 className="mt-1 text-[2.15rem] font-bold leading-[1.05] tracking-[-0.04em] text-[#2a1842]">Setting</h1>
      </header>

      <section className="space-y-3 rounded-[28px] border border-[#eadcf7] bg-white px-5 py-5 shadow-[0_30px_46px_-40px_rgba(95,41,210,0.7)]">
        <div className="border-b border-[#efe7fa] pb-3">
          <p className="text-[1.05rem] font-semibold tracking-[-0.02em] text-[#2e2e2e]">Account Detail</p>
        </div>
        <div className="space-y-2">
          {accountItems.map((item) => (
            <SettingRow key={item.label} item={item} />
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-[28px] border border-[#eadcf7] bg-white px-5 py-5 shadow-[0_30px_46px_-40px_rgba(95,41,210,0.7)]">
        <div className="border-b border-[#efe7fa] pb-3">
          <p className="text-[1.05rem] font-semibold tracking-[-0.02em] text-[#2e2e2e]">Security &amp; Helps</p>
        </div>
        <div className="space-y-2">
          {securityItems.map((item) => (
            <SettingRow key={item.label} item={item} />
          ))}
        </div>
      </section>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setLogoutOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#6d38de] px-6 py-3 text-[0.98rem] font-semibold text-white shadow-[0_20px_32px_-18px_rgba(109,56,222,0.8)] transition hover:translate-y-[-1px] hover:bg-[#602dce] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d38de]"
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M16 17v-4m0 0V9m0 4H6.5" strokeLinecap="round" />
            <path d="M10 17v-4" strokeLinecap="round" />
            <path d="M6 6h8.8c1.2 0 2.2 1 2.2 2.2v7.6c0 1.2-1 2.2-2.2 2.2H6c-1.2 0-2-.8-2-2V8c0-1.2.8-2 2-2Z" />
          </svg>
          Log Out
        </button>
      </div>

      <LogoutConfirmDialog open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </div>
  );
}
