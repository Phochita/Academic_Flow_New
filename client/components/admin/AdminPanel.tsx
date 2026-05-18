import type { ReactNode } from 'react';

type AdminPanelProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function AdminPanel({ title, description, action, children, className = '' }: AdminPanelProps) {
  return (
    <section className={`rounded-[28px] border border-[#eadcf7] bg-white p-5 shadow-[0_24px_40px_-34px_rgba(84,39,174,0.82)] ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-[1.2rem] font-bold tracking-[-0.03em] text-[#28163f]">{title}</h2>
          {description ? <p className="text-sm leading-6 text-[#6b5a88]">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
