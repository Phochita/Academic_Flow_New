import Link from 'next/link';

type SettingIcon = 'user' | 'info' | 'edit' | 'lock' | 'qa';

export type SettingItem = {
  label: string;
  icon: SettingIcon;
  href: string;
};

function RowIcon({ icon }: { icon: SettingIcon }) {
  if (icon === 'user') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 19c1.8-3.2 4.3-4.8 7-4.8S17.2 15.8 19 19" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === 'info') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 10.2v4.6M12 7.8h.01" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === 'edit') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="m4 20 4.2-1 9-9a2.1 2.1 0 0 0-3-3l-9 9L4 20Z" strokeLinejoin="round" />
        <path d="m12.5 6.5 5 5" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === 'lock') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V8a4 4 0 1 1 8 0v2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.5 9.5a2.7 2.7 0 0 1 5.2.9c0 1.8-2.7 2.4-2.7 3.9" strokeLinecap="round" />
      <path d="M12 17h.01" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SettingRow({ item }: { item: SettingItem }) {
  return (
    <Link
      href={item.href}
      className="flex items-center justify-between gap-3 rounded-[20px] border border-[#f0e8fb] bg-[#fcfaff] px-4 py-4 text-[#2a1842] transition hover:border-[#dbc8fa] hover:bg-white hover:text-[#5a2ddf]"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-[16px] bg-[#efe4ff] text-[#6d38de]">
          <RowIcon icon={item.icon} />
        </span>
        <span className="text-[0.98rem] font-semibold">{item.label}</span>
      </div>

      <span className="text-[#957fbc]">
        <ArrowIcon />
      </span>
    </Link>
  );
}
