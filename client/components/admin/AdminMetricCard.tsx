import type { AdminMetric } from './adminData';

const toneClasses: Record<AdminMetric['tone'], string> = {
  purple: 'bg-[#f4ebff] text-[#6d38de]',
  blue: 'bg-[#ebf2ff] text-[#4869ff]',
  green: 'bg-[#eafbf2] text-[#23925a]',
  amber: 'bg-[#fff7ea] text-[#b36c00]',
  rose: 'bg-[#fff0f3] text-[#be375d]',
};

export default function AdminMetricCard({ label, value, change, detail, tone }: AdminMetric) {
  return (
    <article className="rounded-[24px] border border-[#efe4fb] bg-white p-5 shadow-[0_20px_34px_-30px_rgba(90,45,223,0.65)]">
      <div className={`inline-flex rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] ${toneClasses[tone]}`}>
        {label}
      </div>
      <p className="mt-4 text-[2rem] font-bold tracking-[-0.05em] text-[#24163a]">{value}</p>
      <p className="mt-2 text-sm font-semibold text-[#5a2ddf]">{change}</p>
      <p className="mt-3 text-sm leading-6 text-[#6b5a88]">{detail}</p>
    </article>
  );
}
