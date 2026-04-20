import Link from 'next/link';
import { Inter, Manrope } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['700', '800'],
});

function ImagePlaceholderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-11 w-11 text-[#757575]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      aria-hidden="true"
    >
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
      <circle cx="9" cy="9.8" r="1.4" fill="currentColor" stroke="none" />
      <path d="m20.5 16-4.8-4.8-4 4-2.3-2.3L3.5 19" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[15px] w-[15px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M7.3 8.4h1.6l1-1.5h4.2l1 1.5h1.6c.9 0 1.7.8 1.7 1.7v4.8c0 .9-.8 1.7-1.7 1.7H7.3c-.9 0-1.7-.8-1.7-1.7v-4.8c0-.9.8-1.7 1.7-1.7Z" />
      <circle cx="12" cy="12.2" r="2.2" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[#94A3B8]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <rect x="4" y="6.5" width="16" height="11" rx="2" />
      <path d="m5.5 8 6.5 5 6.5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px] text-[#94A3B8]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path d="M8 4.7h2.1L11.2 8l-1.7 1.4a13.8 13.8 0 0 0 5 5l1.4-1.7 3.4 1.1v2.1c0 .7-.6 1.3-1.3 1.3A13.5 13.5 0 0 1 6.7 6c0-.7.6-1.3 1.3-1.3Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-1">
      <h2
        className={`${manrope.className} text-[18px] leading-7 font-bold text-[#630ED4]`}
      >
        {title}
      </h2>
      <p className={`${inter.className} text-[14px] leading-5 font-normal text-[#4A4455]`}>
        {description}
      </p>
    </div>
  );
}

function InputLabel({
  children,
  weight = 'bold',
}: {
  children: React.ReactNode;
  weight?: 'semibold' | 'bold';
}) {
  return (
    <span
      className={`${inter.className} text-[12px] leading-4 uppercase tracking-[0.6px] text-[#64748B] ${
        weight === 'bold' ? 'font-bold' : 'font-semibold'
      }`}
    >
      {children}
    </span>
  );
}

function BaseInput({
  placeholder,
  defaultValue,
  readOnly = false,
  muted = false,
  icon,
}: {
  placeholder?: string;
  defaultValue?: string;
  readOnly?: boolean;
  muted?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="relative mt-2">
      {icon ? (
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
          {icon}
        </span>
      ) : null}
      <input
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`${inter.className} h-12 w-full appearance-none rounded-[8px] border-0 px-4 text-[16px] leading-6 font-normal text-[#191C1E] outline-none ring-0 placeholder:text-[#191C1E] ${icon ? 'pl-12' : ''} ${muted ? 'bg-[rgba(226,232,240,0.5)] text-[#64748B]' : 'bg-white'}`}
      />
    </div>
  );
}

export default function EditProfilePage() {
  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-[1024px] flex-col items-start gap-12 px-5 py-10 lg:px-10 lg:pb-[78px]">
        <header className="flex w-full max-w-[944px] flex-col items-start gap-2">
          <h1
            className={`${manrope.className} text-[36px] leading-10 font-extrabold tracking-[-0.9px] text-[#630ED4]`}
            style={{fontFamily:manrope.style.fontFamily, fontSize:'36px', fontWeight:'800', color:'#630ED4'}}
          >
            Edit Profile
          </h1>
          <div className="max-w-[672px]">
            <p style={{fontFamily:inter.style.fontFamily, fontSize:'16px', fontWeight:'400', color:'#4A4455'}}
            className={`${inter.className} text-[16px] leading-6 font-normal text-[#4A4455]`}>
              Manage your academic identity. Updates here will be reflected across your course enrollments and student
              directory.
            </p>
          </div>
        </header>

        <form className="flex w-full max-w-[944px] flex-col items-start gap-12 pb-8">
          <section className="grid w-full items-start gap-8 xl:grid-cols-[293.33px_1fr]" style={{gridTemplateRows:'auto auto',
            width:'100%', margin:'20px 10px', gridTemplateColumns:'293.33px 1fr'}}>
            <div className="max-w-[293.33px]" style={{width:'100%'}}>
              <SectionTitle
                title="Profile Photo"
                description="This will be displayed on your profile and course forums."
              />
          </div>

            <div className="flex min-h-[176px] w-full items-center gap-8 rounded-[8px] bg-[#F3F4F6] p-6">
              <div className="relative h-[129px] w-36 shrink-0">
                <div className="grid h-[129px] w-36 place-items-center bg-[#ECECEC]">
                  <ImagePlaceholderIcon />
                </div>
                <button
                  type="button"
                  aria-label="Upload photo"
                  className="absolute -right-2 -bottom-2 grid h-10 w-10 place-items-center rounded-[8px] bg-[#630ED4] text-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
                >
                  <CameraIcon />
                </button>
              </div>

              <div className="flex w-full max-w-[201.69px] flex-col items-start justify-center">
                <label className="flex h-10 cursor-pointer items-center justify-center rounded-[9999px] bg-white px-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                  <span className={`${inter.className} text-[14px] leading-5 font-semibold text-[#630ED4]`}>
                    Upload New Image
                  </span>
                  <input type="file" accept=".jpg,.jpeg,.png" className="sr-only" />
                </label>
                <p className={`${inter.className} mt-3 pl-1 text-[12px] leading-4 font-normal text-[#4A4455]`}>
                  At least 500x500 px. JPG or PNG.
                </p>
              </div>
            </div>
          </section>

          <section className="grid w-full items-start gap-8 xl:grid-cols-[293.33px_1fr]">
            <div className="max-w-[293.33px]">
              <SectionTitle
                title="Personal Details"
                description="Update your legal name and public bio for the portal."
              />
            </div>

            <div className="flex h-[328.5px] w-full flex-col rounded-[8px] bg-[#F3F4F6] p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <label className="block">
                  <InputLabel>First Name</InputLabel>
                  <BaseInput placeholder="First_name" />
                </label>

                <label className="block">
                  <InputLabel>Last Name</InputLabel>
                  <BaseInput placeholder="Last_name" />
                </label>
              </div>

              <div className="mt-6">
                <label className="block">
                  <InputLabel>Academic Bio</InputLabel>
                  <textarea
                    rows={2}
                    maxLength={500}
                    placeholder="Bio"
                    className={`${inter.className} mt-2 h-[72px] w-full appearance-none resize-none rounded-[8px] border-0 bg-white px-4 py-3 text-[16px] leading-6 font-normal text-[#191C1E] outline-none ring-0 placeholder:text-[#191C1E]`}
                  />
                </label>
                <div className="mt-[56px] flex justify-end">
                  <p className={`${inter.className} text-[11px] leading-4 font-normal text-[#94A3B8]`}>
                    Character count: 0/500
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid w-full items-start gap-8 xl:grid-cols-[293.33px_1fr]">
            <div className="max-w-[293.33px]">
              <SectionTitle
                title="Contact Info"
                description="Internal communication and notification settings."
              />
            </div>

            <div className="flex h-[256.5px] w-full flex-col gap-6 rounded-[8px] bg-[#F3F4F6] p-8">
              <div>
                <label className="block">
                  <InputLabel weight="semibold">Email</InputLabel>
                  <BaseInput defaultValue="example@kit.edu.kh" readOnly muted icon={<MailIcon />} />
                </label>
                <p className={`${inter.className} mt-2 pl-1 text-[11px] leading-4 font-medium text-[#8B5CF6]`}>
                  Restricted to institutional domain.
                </p>
              </div>

              <label className="block">
                <InputLabel weight="semibold">Phone Number</InputLabel>
                <BaseInput defaultValue="+855 12345678" icon={<PhoneIcon />} />
              </label>
            </div>
          </section>

          <div className="w-full">
            <div className="flex h-[78px] w-full items-center justify-end gap-4 rounded-[16px] border border-white/40 bg-white/70 px-4 py-4 shadow-[0_25px_50px_-12px_rgba(76,29,149,0.1)] backdrop-blur-md">
              <Link
                href="/setting"
                className={`${inter.className} inline-flex h-11 items-center justify-center rounded-[9999px] px-8 text-[14px] leading-5 font-semibold uppercase tracking-[1.4px] text-[#475569]`}
              >
                Cancel
              </Link>
              <button
                type="button"
                className={`${inter.className} inline-flex h-11 min-w-[206.73px] items-center justify-center rounded-[9999px] bg-gradient-to-r from-[#630ED4] to-[#7C3AED] px-10 text-[14px] leading-5 font-bold uppercase tracking-[1.4px] text-white shadow-[0_10px_15px_-3px_rgba(139,92,246,0.2),0_4px_6px_-4px_rgba(139,92,246,0.2)]`}
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
