'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { getDriveResourceCollection, type DriveResourceItem, type ResourceType } from '../resourceLibrary';

const footerLinks = ['Privacy Policy', 'Terms of Service', 'Institutional Access', 'Contact Support'] as const;

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M19 12H5m7-7-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DriveIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="m8 5 4 7-4 7M8 5h8l4 7h-8L8 5Zm0 14h8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M8 4.5h6l3 3V18a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 18V6a1.5 1.5 0 0 1 1-1.41Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 4.5V8h3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <rect x="4.5" y="6.5" width="11" height="11" rx="2.2" />
      <path d="m15.5 10 4-2v8l-4-2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9.5 10.5 3.75 1.75L9.5 14v-3.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ExternalArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14 5h5v5M10 14 19 5M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ResourceCard({ item, type }: { item: DriveResourceItem; type: ResourceType }) {
  const isRecording = type === 'recordings';

  return (
    <article className="rounded-[22px] border border-[#f0eaf8] bg-white px-5 py-5 shadow-[0_20px_34px_-34px_rgba(84,49,169,0.28)]">
      <div className="flex items-start justify-between gap-4">
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-[14px] ${isRecording ? 'bg-[#edf2ff] text-[#4770ff]' : 'bg-[#efe5ff] text-[#7a3df0]'}`}>
          {isRecording ? <VideoIcon /> : <DocumentIcon />}
        </div>
        <span className="rounded-full bg-[#f5f1f4] px-3 py-1.5 text-[0.58rem] font-bold uppercase tracking-[0.12em] text-[#8e8199]">
          {item.tag}
        </span>
      </div>

      <h2 className="mt-5 text-[1.15rem] font-semibold tracking-[-0.03em] text-[#2f2738]">{item.title}</h2>
      <p className="mt-3 text-sm leading-6 text-[#7d708f]">{item.description}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#9a8fb0]">
        <span>{item.meta}</span>
        <span>Google Drive</span>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          href={item.driveHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#7b47ed_0%,#5d34df_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(93,52,223,1)] transition hover:scale-[1.01]"
        >
          Open in Drive
          <ExternalArrowIcon />
        </a>
      </div>
    </article>
  );
}

export default function MaterialResourcePage() {
  const params = useParams<{ resourceType: string }>();
  const searchParams = useSearchParams();
  const selectedCourse = searchParams.get('course');
  const resourceType = params.resourceType === 'materials' || params.resourceType === 'recordings' ? params.resourceType : null;

  if (!resourceType) {
    return (
      <div className="mx-auto max-w-[980px] py-10">
        <div className="rounded-[28px] border border-[#eadcf7] bg-white px-6 py-8 text-center shadow-[0_20px_34px_-34px_rgba(84,49,169,0.28)]">
          <p className="text-lg font-semibold text-[#2f1e47]">This material section was not found.</p>
          <Link href={selectedCourse ? `/material?course=${encodeURIComponent(selectedCourse)}` : '/material'} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#6d38de]">
            <BackIcon />
            Back to Materials
          </Link>
        </div>
      </div>
    );
  }

  const collection = getDriveResourceCollection(selectedCourse, resourceType);
  const backHref = selectedCourse ? `/material?course=${encodeURIComponent(selectedCourse)}` : '/material';

  return (
    <div className="mx-auto max-w-[980px] pb-5 pt-2">
      <div className="relative overflow-hidden rounded-[34px] bg-[linear-gradient(180deg,#fffdfd_0%,#fffafc_100%)] px-5 py-6 sm:px-6 lg:px-7">
        <div
          className="pointer-events-none absolute inset-x-10 top-0 h-32 rounded-full opacity-70 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(165,118,255,0.15) 0%, rgba(255,255,255,0) 72%)' }}
        />

        <div className="relative z-10 space-y-8">
          <section className="space-y-5">
            <Link href={backHref} className="inline-flex items-center gap-2 text-sm font-semibold text-[#6d38de] transition hover:text-[#5422d0]">
              <BackIcon />
              Back to Materials
            </Link>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-[-0.04em] text-[#2f1e47] md:text-[2.75rem]">My</h1>
                <p className="text-3xl font-bold tracking-[-0.04em] text-[#6d38de] md:text-[2.55rem]">{collection.title}</p>
                <p className="max-w-2xl text-base text-[#5f4a79]">
                  {collection.subtitle}
                </p>
              </div>

              <a
                href={collection.folderHref}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#dfd1f5] bg-white px-4 py-2.5 text-sm font-semibold text-[#6b32ef] shadow-[0_18px_30px_-28px_rgba(84,49,169,0.42)] transition hover:border-[#cfbbf0]"
              >
                <DriveIcon />
                Open Course Drive
              </a>
            </div>

            <article className="rounded-[24px] border border-[#eadcf7] bg-white px-5 py-5 shadow-[0_22px_38px_-34px_rgba(84,49,169,0.3)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#8f80aa]">Selected Course</p>
                  <h2 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.03em] text-[#2f1e47]">{collection.course}</h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-full bg-[#f4ebff] px-4 py-2 text-sm font-semibold text-[#6d38de]">
                    {collection.items.length} Drive Items
                  </div>
                  <div className="rounded-full bg-[#f8f3fb] px-4 py-2 text-sm font-semibold text-[#7d708f]">
                    Student View
                  </div>
                </div>
              </div>
            </article>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            {collection.items.map((item) => (
              <ResourceCard key={item.id} item={item} type={collection.type} />
            ))}
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
