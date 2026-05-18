'use client';

import { Suspense, type ReactNode } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type MaterialCategory = {
  id: string;
  title: string;
  description: string;
  label: string;
  icon: ReactNode;
  iconTone: string;
};

type RecentMaterial = {
  id: string;
  title: string;
  addedTime: string;
  size: string;
  tag: string;
  icon: ReactNode;
  iconTone: string;
};

const footerLinks = ['Privacy Policy', 'Terms of Service', 'Institutional Access', 'Contact Support'] as const;

const materialCategories: MaterialCategory[] = [
  {
    id: 'material-titles',
    title: 'Material\ntitles',
    description: 'Dscription of\nthe materials',
    label: 'NO DUE DATE',
    iconTone: 'bg-[#efe5ff] text-[#7a3df0]',
    icon: (
      <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <path d="M7 8.5h7M7 12h6M7 15.5h4" strokeLinecap="round" />
        <path d="M15.5 6.5 18 9l-4.5 4.5H11v-2.5l4.5-4.5Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'recordings',
    title: 'Recordings',
    description: 'HD capture of\nplenary sessions\nwith searchable\ntimestamps.',
    label: 'NO DUE DATE',
    iconTone: 'bg-[#efe5ff] text-[#7a3df0]',
    icon: (
      <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <rect x="4.5" y="6.5" width="10.5" height="11" rx="2" />
        <path d="m15 10 4.5-2v8L15 14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'assignment',
    title: 'Assignment',
    description: 'Dscription of\nthe materials',
    label: 'DEADLINES',
    iconTone: 'bg-[#efe5ff] text-[#7a3df0]',
    icon: (
      <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <rect x="6" y="4.5" width="12" height="15" rx="2.2" />
        <path d="M9 8.5h6M9 12h4.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

const recentMaterials: RecentMaterial[] = [
  {
    id: 'statistical-mechanics',
    title: 'Statistical Mechanics Manual.pdf',
    addedTime: 'Added 2 hours ago',
    size: '14.2 MB',
    tag: 'INTERACTIVE',
    iconTone: 'bg-[#fff1f0] text-[#f05a57]',
    icon: (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <path d="M8 4.5h6l3 3V18a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 18V6a1.5 1.5 0 0 1 1-1.41Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 4.5V8h3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 11.5h5M9.5 15h3.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'neural-architectures',
    title: 'Lecture 14: Neural Architectures',
    addedTime: 'Added 5 hours ago',
    size: '1.2 GB',
    tag: 'VIDEO',
    iconTone: 'bg-[#edf2ff] text-[#4770ff]',
    icon: (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <rect x="4.5" y="6.5" width="15" height="10.5" rx="2.2" />
        <path d="m10 10 4.5 2.25L10 14.5V10Z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'organic-chem-lab',
    title: 'Organic Chem Lab Manual v3',
    addedTime: 'Added yesterday',
    size: '8.5 MB',
    tag: 'LAB MANUAL',
    iconTone: 'bg-[#ebfff3] text-[#2ab56a]',
    icon: (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <path d="M10 4.5v6.25L6.1 17.7A2.25 2.25 0 0 0 8.07 21h7.86a2.25 2.25 0 0 0 1.97-3.3L14 10.75V4.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.75 14.5h6.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

function MaterialArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MaterialMoreIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}

function MaterialsPageContent() {
  const searchParams = useSearchParams();
  const selectedCourse = searchParams.get('course');
  const materialsHref = selectedCourse ? `/material/materials?course=${encodeURIComponent(selectedCourse)}` : '/material/materials';
  const recordingsHref = selectedCourse ? `/material/recordings?course=${encodeURIComponent(selectedCourse)}` : '/material/recordings';
  const assignmentHref = selectedCourse ? `/assignment?course=${encodeURIComponent(selectedCourse)}` : '/assignment';

  return (
    <div className="mx-auto max-w-[980px] pb-5 pt-2">
      <div className="relative overflow-hidden rounded-[34px] bg-[linear-gradient(180deg,#fffdfd_0%,#fffafc_100%)] px-5 py-6 sm:px-6 lg:px-7">
        <div
          className="pointer-events-none absolute inset-x-10 top-0 h-32 rounded-full opacity-70 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(165,118,255,0.15) 0%, rgba(255,255,255,0) 72%)' }}
        />

        <div className="relative z-10 space-y-10">
          <section className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-[-0.04em] text-[#2f1e47] md:text-[2.75rem]">My</h1>
                <p className="text-3xl font-bold tracking-[-0.04em] text-[#6d38de] md:text-[2.55rem]">Materials</p>
                {selectedCourse ? (
                  <p className="max-w-2xl text-base text-[#5f4a79]">
                    Materials for <span className="font-semibold text-[#2f1e47]">{selectedCourse}</span>.
                  </p>
                ) : (
                  <p className="max-w-2xl text-base text-[#5f4a79]">
                    Browse your class materials, recordings, and recently added files in one place.
                  </p>
                )}
              </div>

              <button
                type="button"
                className="mt-2 inline-flex items-center gap-2 text-[0.86rem] font-semibold text-[#6b32ef] transition hover:text-[#5321cf]"
              >
                View all categories
                <MaterialArrowIcon />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {materialCategories.map((category) => (
                category.id === 'material-titles' ? (
                  <Link
                    key={category.id}
                    href={materialsHref}
                    className="group min-h-[194px] rounded-[22px] border border-[#f1ebfb] bg-white px-5 py-5 text-left shadow-[0_24px_40px_-34px_rgba(84,49,169,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_48px_-34px_rgba(84,49,169,0.38)]"
                  >
                    <div className={`grid h-11 w-11 place-items-center rounded-[14px] ${category.iconTone}`}>
                      {category.icon}
                    </div>

                    <h2 className="mt-5 whitespace-pre-line text-[1.04rem] font-semibold leading-6 tracking-[-0.03em] text-[#2f2738]">
                      {category.title}
                    </h2>

                    <p className="mt-5 whitespace-pre-line text-[0.8rem] leading-5 text-[#998ea9]">
                      {category.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-[#6b32ef]">
                        {category.label}
                      </span>
                      <span className="text-[#b4a9c6] transition group-hover:text-[#6b32ef]">
                        <MaterialArrowIcon />
                      </span>
                    </div>
                  </Link>
                ) : category.id === 'recordings' ? (
                  <Link
                    key={category.id}
                    href={recordingsHref}
                    className="group min-h-[194px] rounded-[22px] border border-[#f1ebfb] bg-white px-5 py-5 text-left shadow-[0_24px_40px_-34px_rgba(84,49,169,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_48px_-34px_rgba(84,49,169,0.38)]"
                  >
                    <div className={`grid h-11 w-11 place-items-center rounded-[14px] ${category.iconTone}`}>
                      {category.icon}
                    </div>

                    <h2 className="mt-5 whitespace-pre-line text-[1.04rem] font-semibold leading-6 tracking-[-0.03em] text-[#2f2738]">
                      {category.title}
                    </h2>

                    <p className="mt-5 whitespace-pre-line text-[0.8rem] leading-5 text-[#998ea9]">
                      {category.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-[#6b32ef]">
                        {category.label}
                      </span>
                      <span className="text-[#b4a9c6] transition group-hover:text-[#6b32ef]">
                        <MaterialArrowIcon />
                      </span>
                    </div>
                  </Link>
                ) : category.id === 'assignment' ? (
                  <Link
                    key={category.id}
                    href={assignmentHref}
                    className="group min-h-[194px] rounded-[22px] border border-[#f1ebfb] bg-white px-5 py-5 text-left shadow-[0_24px_40px_-34px_rgba(84,49,169,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_48px_-34px_rgba(84,49,169,0.38)]"
                  >
                    <div className={`grid h-11 w-11 place-items-center rounded-[14px] ${category.iconTone}`}>
                      {category.icon}
                    </div>

                    <h2 className="mt-5 whitespace-pre-line text-[1.04rem] font-semibold leading-6 tracking-[-0.03em] text-[#2f2738]">
                      {category.title}
                    </h2>

                    <p className="mt-5 whitespace-pre-line text-[0.8rem] leading-5 text-[#998ea9]">
                      {category.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-[#6b32ef]">
                        {category.label}
                      </span>
                      <span className="text-[#b4a9c6] transition group-hover:text-[#6b32ef]">
                        <MaterialArrowIcon />
                      </span>
                    </div>
                  </Link>
                ) : (
                  <button
                    key={category.id}
                    type="button"
                    className="group min-h-[194px] rounded-[22px] border border-[#f1ebfb] bg-white px-5 py-5 text-left shadow-[0_24px_40px_-34px_rgba(84,49,169,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_48px_-34px_rgba(84,49,169,0.38)]"
                  >
                    <div className={`grid h-11 w-11 place-items-center rounded-[14px] ${category.iconTone}`}>
                      {category.icon}
                    </div>

                    <h2 className="mt-5 whitespace-pre-line text-[1.04rem] font-semibold leading-6 tracking-[-0.03em] text-[#2f2738]">
                      {category.title}
                    </h2>

                    <p className="mt-5 whitespace-pre-line text-[0.8rem] leading-5 text-[#998ea9]">
                      {category.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-[#6b32ef]">
                        {category.label}
                      </span>
                      <span className="text-[#b4a9c6] transition group-hover:text-[#6b32ef]">
                        <MaterialArrowIcon />
                      </span>
                    </div>
                  </button>
                )
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-[2rem] font-bold tracking-[-0.05em] text-[#2f2738]">Recently Added</h2>

            <div className="rounded-[22px] border border-[#f0eaf8] bg-white p-2 shadow-[0_24px_42px_-36px_rgba(84,49,169,0.28)]">
              <div className="space-y-2">
                {recentMaterials.map((material) => (
                  <article
                    key={material.id}
                    className="flex items-center gap-3 rounded-[16px] border border-[#f4f0f8] bg-white px-3 py-3 transition hover:border-[#e4d8f7] hover:shadow-[0_16px_28px_-24px_rgba(84,49,169,0.25)] sm:px-4"
                  >
                    <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-[10px] ${material.iconTone}`}>
                      {material.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[0.86rem] font-semibold tracking-[-0.02em] text-[#31283a]">
                        {material.title}
                      </h3>
                      <p className="mt-0.5 text-[0.67rem] text-[#9b8faa]">
                        {material.addedTime} | {material.size}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span className="rounded-full bg-[#f5f1f4] px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-[0.12em] text-[#918591]">
                        {material.tag}
                      </span>
                      <button
                        type="button"
                        aria-label={`More actions for ${material.title}`}
                        className="grid h-8 w-8 place-items-center rounded-full text-[#9b90a8] transition hover:bg-[#f7f2fb] hover:text-[#5b29d6]"
                      >
                        <MaterialMoreIcon />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <footer className="border-t border-[#f0e8f8] pt-5 text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[#b2a5bf]">
              {footerLinks.map((link) => (
                <span key={link}>{link}</span>
              ))}
            </div>
            <p className="mt-4 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[#c2b8cb]">
              2026 Smart Learning & Academic Planning.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default function MaterialsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[980px] px-5 py-8 text-sm font-semibold text-[#6d38de]">Loading materials...</div>}>
      <MaterialsPageContent />
    </Suspense>
  );
}
