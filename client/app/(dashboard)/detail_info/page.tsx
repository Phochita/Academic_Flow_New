import { Inter, Manrope } from 'next/font/google';
import Image from 'next/image';
type InfoField = {
  label: string;
  value: string;
};

type Milestone = {
  title: string;
  description: string;
  dates: string;
  status: 'In Progress' | 'Completed';
  tone: 'active' | 'complete';
};

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['700', '800'],
});

const identityFields: InfoField[] = [
  { label: 'USER_ID', value: 'User_id' },
  { label: 'DEPARTMENT', value: 'Software Engineering' },
  { label: 'BATCH', value: '13' },
];

const contactFields: InfoField[] = [
  { label: 'ACADEMIC EMAIL', value: 'example@kit.edu.kh' },
  { label: 'PHONE NUMBER', value: '+855 123456879' },
  { label: 'ADDRESS', value: 'Home no, Street no, village, district, Phnom Penh' },
];

const academicMilestones: Milestone[] = [
  {
    title: 'Senior Year Transition',
    description: 'Advanced Algorithm Design, Cloud Computing Architecture, Neural Networks.',
    dates: 'Sep 2023 — Present',
    status: 'In Progress',
    tone: 'active',
  },
  {
    title: 'Junior Year Completion',
    description: "Dean's List Recognition. Specialization in Data structures and Systems analysis.",
    dates: 'Sep 2022 — Jun 2023',
    status: 'Completed',
    tone: 'complete',
  },
  {
    title: 'Sophomore Internship',
    description: 'Software Engineering Intern at TechVanguard Systems. 4.0 GPA for semester.',
    dates: 'Jun 2022 — Aug 2022',
    status: 'Completed',
    tone: 'complete',
  },
];

function ProfilePhoto({ imageUrl }: { imageUrl?: string | null }) {
  const normalized = imageUrl?.trim();
  const shouldShowImage =
    !!normalized && normalized !== 'null' && normalized !== 'undefined';

  if (shouldShowImage && normalized) {
    return (
      <div className="flex h-[80px] w-[80px] items-center justify-center">
        <div className="flex h-full w-full shrink-0 items-center justify-center overflow-hidden rounded-[30px] border-4 border-white bg-[#e4e6eb] shadow-[0_4px_12px_rgba(95,41,210,0.15)] relative">
          <Image 
            src={normalized}
            alt="User Avatar"
            fill
            className="object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[84px] w-[84px] items-center justify-center">
      <div className="flex w-full shrink-0 items-center justify-center overflow-hidden rounded-[30px] border-4 border-white bg-[#e4e6eb] shadow-[0_4px_12px_rgba(95,41,210,0.15)] relative">
        <svg viewBox="0 0 24 24" className="h-[44px] w-[44px] translate-y-1 text-[#bcc0c4]" fill="currentColor" aria-hidden="true" style={{height:'100px', width:'100px', translate:'0 1px'}}>
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
    </div>
  );
}

function IdentityIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[20px] w-[20px] text-[#630ED4]" fill="none" stroke="#630ED4" strokeWidth="1.7" aria-hidden="true">
      <rect x="6" y="4.5" width="12" height="15" rx="2" />
      <path d="M9 8.5h6M9 12h6M9 15.5h4" strokeLinecap="round" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[20px] w-[20px] text-[#630ED4]" fill="none" stroke="#630ED4" strokeWidth="1.7" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M9.2 9.6A2.8 2.8 0 0 1 12 7.6a2.6 2.6 0 0 1 2.7 2.5c0 1.8-2.1 2.2-2.1 3.7" strokeLinecap="round" />
      <circle cx="12" cy="16.9" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function GraduationCapIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] text-[#7C3AED]" fill="none" stroke="#630ED4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9.2 12.3 1.9 1.9 3.8-3.8" />
    </svg>
  );
}

function DataCard({
  title,
  icon,
  fields,
}: {
  title: string;
  icon: React.ReactNode;
  fields: InfoField[];
}) {
  return (
    <section className="flex flex-col h-full rounded-xl bg-white p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#F3E8FF]">{icon}</span>
        <h2 className={`${inter.className} text-[18px] font-bold text-[#111827]`}>{title}</h2>
      </div>
      <div className="flex flex-col flex-1 space-y-6">
        {fields.map((field) => (
          <div key={field.label}>
            <p className={`${inter.className} text-[11px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF]`}>
              {field.label}
            </p>
            <p className={`${inter.className} mt-1.5 text-[15px] font-medium text-[#111827]`}>{field.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function DetailInformationPage() {
  const userProfileImage: string | null = null; 

  return (
    <div className={`${inter.className} mx-auto w-full max-w-[1280px] bg-[#F8F9FB]`}>
      <div className="px-4 pb-6 pt-8 sm:px-6 lg:px-8 lg:pb-10 lg:pt-9">
        <header>
          <h1
            className={`${manrope.className}font-bold leading-10 tracking-[-0.9px] text-[#630ED4]`}
            style={{ color: '#630ED4', fontFamily: manrope.style.fontFamily, fontSize:'30px'}}
          >
            Detail Information
          </h1>
          <p
            className={`${inter.className} mt-1 leading-5 font-normal text-[#4B5563]`}
            style={{ color: '#4B5563', fontFamily: inter.style.fontFamily, fontSize:'16px' }}
          >
            Manage and review your verified academic identity and records.
          </p>
        </header>

        <div className="mt-8 grid gap-6 grid-cols-3 grid-rows-[auto_auto] items-stretch">
            <aside className="col-start-1 col-span-1 row-start-1 flex flex-col rounded-xl bg-white p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 justify-start items-center">
              <ProfilePhoto imageUrl={userProfileImage} />
            <div className="flex flex-col items-center">
              <p className={`${inter.className} mt-5 font-bold text-[#111827]`} style={{fontSize: '22px'}}>Username</p>
              <p className={`${inter.className} mt-1.5 font-medium text-[#630ED4]`} style={{fontSize:'15px'}}>
                Software Engineering
              </p>
              <span className={`${inter.className} border border-[#E5E7EB] mt-3 inline-flex items-center justify-center rounded-[6px] bg-[#F3F4F6] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B7280]`} style={{borderRadius:'6px', backgroundColor:'#F3F4F6'}}>
                Class of 2025
              </span>
            </div>

            <div className="mt-auto pt-8 mb-8 w-full">
              <div className="h-px w-full bg-[#E5E7EB]" />
            </div>

            <div className="grid grid-cols-2 gap-4 pb-2">
              <div className="text-center">
                <p className={`${inter.className} text-[10px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF]`}>
                  Current GPA
                </p>
                <p className={`${inter.className} mt-2 text-[36px] font-extrabold tracking-[-0.02em] text-[#111827]`} style={{lineHeight: 1}}>
                  3.92
                </p>
              </div>
              <div className="text-center">
                <p className={`${inter.className} text-[10px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF]`}>
                  Credits
                </p>
                <p className={`${inter.className} mt-2 text-[36px] font-extrabold tracking-[-0.02em] text-[#111827]`} style={{lineHeight: 1}}>
                  114
                </p>
              </div>
            </div>
          </aside>

            <div className="col-start-2 col-span-1 row-start-1">
              <DataCard title="Identity" icon={<IdentityIcon />} fields={identityFields}  />
            </div>
            <div className="col-start-3 col-span-1 row-start-1">
              <DataCard title="Contact Information" icon={<ContactIcon />} fields={contactFields} />
            </div>
        </div>

        <div className="mt-6 w-full">
          <section className="w-full rounded-xl bg-white p-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
              <div className="flex items-center justify-between mt-5 mb-5" style={{marginLeft:'10px', marginRight:'10px'}}>
                <div className="flex min-w-0 items-center gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#F3E8FF] text-[#630ED4]">
                    <GraduationCapIcon />
                  </span>
                  <h2 className={`${inter.className} text-[18px] font-bold leading-none text-[#111827]`}>
                    Academic Milestone History
                  </h2>
                </div>

                <button
                  type="button"
                  className={`${inter.className} shrink-0 text-[10px] font-normal uppercase tracking-[0.08em] text-black px-3.5 py-1 border border-black rounded-[10px] cursor-pointer hover:bg-[#5209b3] transition-colors mx-[10px]`}
                  style={{color:'white', fontFamily:inter.style.fontFamily, fontSize:'12px', fontWeight:'normal', backgroundColor:'#630ED4'}}
                >
                  Download Transcript
                </button>
              </div>

              <div className="space-y-0">
                {academicMilestones.map((milestone, index) => (
                  <article key={milestone.title} className="relative flex gap-6">
                    <div className="relative z-10 flex w-[24px] shrink-0 self-stretch justify-center pt-0.5" aria-hidden="true">
                      <div
                        className={`relative z-20 box-border h-[24px] w-[24px] shrink-0 rounded-full bg-white ring-[6px] ring-white ${
                          milestone.tone === 'active'
                            ? 'border-[5px] border-[#630ED4]'
                            : 'border-[4px] border-[#CBD5E1]'
                        }`}
                      />
                      {index < academicMilestones.length - 1 && (
                        <div className="absolute top-[28px] -bottom-[2px] w-[2px] bg-[#E5E7EB] z-10" />
                      )}
                    </div>
                    <div className={`min-w-0 flex-1 ${index < academicMilestones.length - 1 ? 'pb-12' : 'pb-2'}`}>
                      <div className="flex items-start justify-between mt-1">
                        <div className="min-w-0 w-full pr-8">
                          <h3 className={`${inter.className} mt-3.5 mb-3 text-[16px] font-bold leading-tight text-[#111827]`}>
                            {milestone.title}
                          </h3>
                          <p className={`${inter.className} mt-3.5 mb-3 px-2 text-[15px] font-normal leading-relaxed text-[#4B5563]`}>
                            {milestone.description}
                          </p>
                          <p className={`${inter.className} mt-4 mb-3 px-2 text-[13px] font-normal leading-none text-[#9CA3AF]`}>
                            {milestone.dates}
                          </p>
                        </div>
                        <span
                          className={`${inter.className} inline-flex items-center justify-center shrink-0 rounded-[6px] px-2.5 py-1.5 text-[13px] font-medium leading-none ${
                            milestone.tone === 'active'
                              ? 'bg-[#DCFCE7] text-[#15803D]'
                              : 'bg-[#F1F5F9] text-[#475569]'
                          }`}
                        >
                          {milestone.status}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
        </div>

        <section
          className="mt-8 rounded-xl p-8 text-white"
          style={{
            background: 'linear-gradient(to right, #620ED4, #6D28D9)',
            boxShadow: '0 4px 20px -4px rgba(99,14,212,0.4)',
            borderRadius:'12px',
            height:'190px',
          }}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <span
                className="grid h-12 w-12 shrink-0 place-items-center rounded-[10px]"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9.2 12.3 1.9 1.9 3.8-3.8"/></svg>
              </span>
              <div>
                <p className={`${inter.className} text-[18px] font-bold text-white leading-tight`}>
                  Verified Academic Record
                </p>
                <p
                  className={`${inter.className} mt-1.5 max-w-xl text-[14px] font-medium`}
                  style={{ color: 'rgba(255,255,255,0.85)' }}
                >
                  Your profile is currently verified by the Office of the Registrar. Any changes to core data require formal submission.
                </p>
              </div>
            </div>

            <button
              type="button"
              className={`${inter.className} shrink-0 inline-flex h-11 items-center justify-center rounded-[8px] border  bg-white px-6 text-[13px] font-bold uppercase tracking-[0.08em] text-[#630ED4] transition-colors hover:bg-gray-50`}
              style={{cursor:'pointer', height:'30px',color:'#630ED4', fontFamily:inter.style.fontFamily, fontSize:'13px', fontWeight:'bold', backgroundColor:'white', borderRadius:'8px'}}
            >
              Request Change
            </button>
          </div>
        </section>
      </div>

    </div>
  );
}
