import AdminBarChart from '@/components/admin/AdminBarChart';
import AdminMetricCard from '@/components/admin/AdminMetricCard';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPanel from '@/components/admin/AdminPanel';
import { adminAlerts, adminGrowthTrend, adminOverviewMetrics, adminRevenueMix } from '@/components/admin/adminData';

export default function AdminAnalyticsPage() {
  return (
    <div className="mx-auto max-w-[1180px] space-y-6">
      <AdminPageHeader
        eyebrow="Analytics"
        title="Platform Intelligence and Executive Metrics"
        description="Monitor growth, revenue mix, platform risk, and operational signals from one analytics workspace designed for admins."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminOverviewMetrics.map((metric) => (
          <AdminMetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <AdminPanel title="User & Course Growth" description="Monthly trajectory across key platform activity.">
          <AdminBarChart data={adminGrowthTrend} suffix="%" />
        </AdminPanel>

        <AdminPanel title="Revenue Composition" description="Current subscription mix to guide product and pricing decisions.">
          <AdminBarChart data={adminRevenueMix} suffix="%" />
        </AdminPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <AdminPanel title="Operational Funnel" description="A simplified admin funnel from sign-up to healthy paid usage.">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: 'New Sign-ups', value: '1,240', tone: 'bg-[#efe3ff] text-[#6d38de]' },
              { label: 'Verified Accounts', value: '1,012', tone: 'bg-[#ebf2ff] text-[#4869ff]' },
              { label: 'Active Learners', value: '864', tone: 'bg-[#e9fbf1] text-[#1e8a4d]' },
              { label: 'Paid Conversions', value: '286', tone: 'bg-[#fff6e7] text-[#ad6a00]' },
            ].map((item) => (
              <article key={item.label} className="rounded-[22px] border border-[#efe4fb] bg-[#fcf9ff] p-4">
                <span className={`inline-flex rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] ${item.tone}`}>
                  {item.label}
                </span>
                <p className="mt-4 text-[1.8rem] font-bold tracking-[-0.05em] text-[#24163a]">{item.value}</p>
              </article>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Risk Radar" description="The alerts that matter most to the platform manager.">
          <div className="space-y-3">
            {adminAlerts.map((alert) => (
              <article key={alert.title} className="rounded-[20px] border border-[#f0e7fb] bg-[#faf7ff] px-4 py-4">
                <p className="text-sm font-semibold text-[#28163f]">{alert.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#6b5a88]">{alert.detail}</p>
              </article>
            ))}
          </div>
        </AdminPanel>
      </section>
    </div>
  );
}
