import type { AdminChartPoint } from './adminData';

type AdminBarChartProps = {
  data: AdminChartPoint[];
  suffix?: string;
};

export default function AdminBarChart({ data, suffix = '' }: AdminBarChartProps) {
  const maxValue = Math.max(...data.map((point) => point.value), 1);

  return (
    <div className="space-y-4">
      {data.map((point) => (
        <div key={point.label} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-[#2a1842]">{point.label}</span>
            <span className="text-[#6b5a88]">
              {point.value}
              {suffix}
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-[#f1e9fb]">
            <div
              className={`h-2.5 rounded-full ${point.tone ?? 'bg-[#6d38de]'}`}
              style={{ width: `${(point.value / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
