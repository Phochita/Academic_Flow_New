import type { ReactNode } from 'react';

type AdminPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export default function AdminPageHeader({ eyebrow, title, description, actions }: AdminPageHeaderProps) {
  return (
    <header className="rounded-[30px] border border-[#eadcf7] bg-white px-6 py-6 shadow-[0_24px_40px_-34px_rgba(84,39,174,0.82)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <span className="inline-flex rounded-full bg-[#efe3ff] px-3.5 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#6d38de]">
            {eyebrow}
          </span>
          <h1 className="text-[2.25rem] font-bold tracking-[-0.05em] text-[#28163f]">{title}</h1>
          <p className="max-w-[760px] text-[0.98rem] leading-7 text-[#5f4a79]">{description}</p>
        </div>
        {actions}
      </div>
    </header>
  );
}
