import Link from 'next/link';
import AdminBarChart from '@/components/admin/AdminBarChart';
import AdminMetricCard from '@/components/admin/AdminMetricCard';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPanel from '@/components/admin/AdminPanel';
import AdminStatusBadge from '@/components/admin/AdminStatusBadge';
import {
  adminActivities,
  adminAlerts,
  adminApiRoutePlan,
  adminFeatures,
  adminGrowthTrend,
  adminLayoutBlocks,
  adminOverviewMetrics,
  adminSidebarStructure,
} from '@/components/admin/adminData';

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-[1180px] space-y-6">
      <AdminPageHeader
        eyebrow="Admin Module"
        title="AcaFlow Platform Manager"
        description="A dedicated admin control center for platform operations, user access, course quality, assignment risk, attendance oversight, billing health, analytics, and audit visibility."
        actions={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/reports"
              className="inline-flex items-center rounded-full border border-[#dbc8fa] bg-white px-4 py-2.5 text-sm font-semibold text-[#5a2ddf] shadow-[0_16px_28px_-24px_rgba(90,45,223,0.95)] transition hover:border-[#cdb5f7]"
            >
              Moderation Queue
            </Link>
            <Link
              href="/admin/activity"
              className="inline-flex items-center rounded-full bg-[linear-gradient(135deg,#7641e8_0%,#9a73ef_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_28px_-20px_rgba(118,65,232,0.95)] transition hover:scale-[1.01]"
            >
              View Activity Logs
            </Link>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminOverviewMetrics.map((metric) => (
          <AdminMetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <AdminPanel
          title="1. Admin Features"
          description="Platform manager capabilities only. The admin experience focuses on oversight and governance, not student submission or lecturer teaching flows."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {adminFeatures.map((feature) => (
              <article key={feature.title} className="rounded-[22px] border border-[#efe4fb] bg-[#fcf9ff] p-4">
                <h3 className="text-[1rem] font-semibold text-[#28163f]">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6b5a88]">{feature.description}</p>
              </article>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Platform Health" description="Operational alerts that deserve an admin response.">
          <div className="space-y-4">
            {adminAlerts.map((alert) => (
              <article key={alert.title} className="rounded-[20px] border border-[#f0e7fb] bg-[#faf7ff] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-[#28163f]">{alert.title}</h3>
                  <AdminStatusBadge status={alert.status} />
                </div>
                <p className="mt-3 text-sm leading-6 text-[#6b5a88]">{alert.detail}</p>
              </article>
            ))}
          </div>
        </AdminPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <AdminPanel title="2. Sidebar Structure" description="Admin navigation is separated by platform responsibilities, not classroom tasks.">
          <div className="space-y-3">
            {adminSidebarStructure.map((item) => (
              <div key={item.href} className="flex items-start justify-between gap-4 rounded-[20px] border border-[#f0e7fb] bg-[#faf7ff] px-4 py-4">
                <div>
                  <p className="text-sm font-semibold text-[#28163f]">{item.label}</p>
                  <p className="mt-1 text-sm leading-6 text-[#6b5a88]">{item.purpose}</p>
                </div>
                <span className="rounded-full bg-[#efe3ff] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#6d38de]">
                  {item.href}
                </span>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="3. Page Layout" description="Each module follows a consistent admin shell so teams can scan, search, filter, and confirm actions safely.">
          <div className="space-y-3">
            {adminLayoutBlocks.map((block) => (
              <article key={block.title} className="rounded-[20px] border border-[#f0e7fb] bg-[#faf7ff] px-4 py-4">
                <p className="text-sm font-semibold text-[#28163f]">{block.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#6b5a88]">{block.detail}</p>
              </article>
            ))}
          </div>
        </AdminPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <AdminPanel title="Growth Snapshot" description="A quick SaaS-style visual for the admin command center.">
          <AdminBarChart data={adminGrowthTrend} suffix="%" />
        </AdminPanel>

        <AdminPanel title="Recent Activity" description="Latest platform actions visible to the admin role.">
          <div className="space-y-3">
            {adminActivities.slice(0, 4).map((entry) => (
              <article key={entry.id} className="rounded-[20px] border border-[#f0e7fb] bg-[#faf7ff] px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#28163f]">{entry.action}</p>
                  <AdminStatusBadge status={entry.severity} />
                </div>
                <p className="mt-2 text-sm text-[#5a2ddf]">{entry.actor}</p>
                <p className="mt-1 text-sm leading-6 text-[#6b5a88]">{entry.target}</p>
                <p className="mt-2 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[#9c8db7]">{entry.time}</p>
              </article>
            ))}
          </div>
        </AdminPanel>
      </section>

      <AdminPanel title="4. API Route Plan" description="Backend route plan aligned to your current schemas and strict admin-only role checks.">
        <div className="grid gap-4 xl:grid-cols-2">
          {adminApiRoutePlan.map((group) => (
            <article key={group.title} className="rounded-[24px] border border-[#efe4fb] bg-[#fcf9ff] p-4">
              <h3 className="text-[1rem] font-semibold text-[#28163f]">{group.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6b5a88]">{group.description}</p>
              <div className="mt-4 space-y-3">
                {group.routes.map((route) => (
                  <div key={`${route.method}-${route.path}`} className="rounded-[18px] border border-[#f1e8fb] bg-white px-4 py-3">
                    <p className="text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-[#8a78ab]">
                      {route.method} <span className="text-[#5a2ddf]">{route.path}</span>
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#6b5a88]">{route.summary}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </AdminPanel>
    </div>
  );
}
