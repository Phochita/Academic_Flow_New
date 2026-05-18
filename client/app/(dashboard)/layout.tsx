import { Suspense } from 'react';
import DashboardAuthGate from '@/components/layout/DashboardAuthGate';
import Sidebar from '@/components/layout/Sidebar';
import DashboardShellHeader from '@/components/layout/DashboardShellHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fcf7ff]">
      <Suspense fallback={null}>
        <DashboardShellHeader />
      </Suspense>
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>
      <main className="min-h-screen px-4 pt-[84px] pb-4 sm:px-5 sm:pt-[86px] lg:ml-[210px] lg:px-5 lg:pt-[88px] lg:pb-5 xl:px-6">
        <DashboardAuthGate>{children}</DashboardAuthGate>
      </main>
    </div>
  );
}
