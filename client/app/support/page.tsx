import Link from 'next/link';
import { Suspense } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import DashboardShellHeader from '@/components/layout/DashboardShellHeader';

type QaItem = {
  question: string;
  answer: string;
};

const qaItems: QaItem[] = [
  {
    question: 'How do I update my profile information?',
    answer:
      'Go to Setting, open My Profile or Edit Profile, then update your details and save. Your changes will be reflected across your account.',
  },
  {
    question: 'Where can I change my password?',
    answer:
      'From Setting, select Change Password, enter your current and new password, then tap Update Password to secure your account.',
  },
  {
    question: 'How do I submit an assignment?',
    answer:
      'Open Assignments from the sidebar, select the assignment card, upload your file, and confirm submission before the deadline.',
  },
  {
    question: 'How can I check my attendance record?',
    answer:
      'Use the Attendance page in the sidebar to view session-by-session attendance and track your current attendance percentage.',
  },
  {
    question: 'How do I use the AI Planner?',
    answer:
      'Navigate to AI Planner, choose your course and timeline, then review the generated study schedule and task breakdown.',
  },
  {
    question: 'Where can I monitor my academic performance?',
    answer:
      'Open Performance to view your grades, trends, and analytics so you can identify subjects that need more attention.',
  },
];

const quickLinks = [
  { label: 'Setting', href: '/setting' },
  { label: 'My Profile', href: '/profile' },
  { label: 'Assignments', href: '/assignments' },
  { label: 'Attendance', href: '/attendance' },
  { label: 'AI Planner', href: '/ai-planner' },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#fcf7ff]">
      <Suspense fallback={null}>
        <DashboardShellHeader />
      </Suspense>
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>

      <main className="min-h-screen px-4 pb-4 pt-[84px] sm:px-5 sm:pt-[86px] lg:ml-[210px] lg:px-5 lg:pb-5 lg:pt-[88px] xl:px-6">
        <div className="mx-auto w-full max-w-[1100px] space-y-5 text-[#2a1842]">
          <header className="space-y-2">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#8a7ca4]">Support Center</p>
            <h1 className="text-[2.15rem] font-bold leading-[1.05] tracking-[-0.04em] text-[#6d38de]">Q&amp;A</h1>
            <p className="max-w-[760px] text-[0.98rem] text-[#6f5f8f]">
              Find quick answers on how to use key Academic Flow features and navigate your account settings.
            </p>
          </header>

          <section className="rounded-[28px] border border-[#eadcf7] bg-white px-5 py-5 shadow-[0_30px_46px_-40px_rgba(95,41,210,0.7)]">
            <div className="border-b border-[#efe7fa] pb-3">
              <p className="text-[1.05rem] font-semibold tracking-[-0.02em] text-[#2e2e2e]">Frequently Asked Questions</p>
            </div>
            <div className="mt-4 space-y-3">
              {qaItems.map((item) => (
                <article key={item.question} className="rounded-2xl border border-[#efe7fa] bg-[#faf7ff] px-4 py-3">
                  <h2 className="text-[1rem] font-semibold text-[#4d2ca8]">{item.question}</h2>
                  <p className="mt-1 text-[0.95rem] leading-6 text-[#5f4d7c]">{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-[#eadcf7] bg-white px-5 py-5 shadow-[0_30px_46px_-40px_rgba(95,41,210,0.7)]">
            <div className="border-b border-[#efe7fa] pb-3">
              <p className="text-[1.05rem] font-semibold tracking-[-0.02em] text-[#2e2e2e]">Quick Navigation</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl bg-[#f2ebff] px-4 py-2 text-[0.9rem] font-semibold text-[#5a2ddf] transition hover:bg-[#e8dcff]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
