'use client';

import Link from 'next/link';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { buildAuthHeaders, getApiBaseUrl, getAuthRequestErrorMessage, readAuthSession } from '@/lib/auth';

type UploadItem = {
  id: string;
  name: string;
  meta: string;
};

type SubmissionState = {
  submittedAt: string;
  totalItems: number;
};

type ApiAssignment = {
  course?: {
    code?: string | null;
    name?: string | null;
  } | null;
  description?: string | null;
  dueDate?: string | null;
  id: number;
  maxScore?: number | string | null;
  submission?: {
    fileUrl?: string | null;
    id?: number | null;
    status?: string | null;
    submissionText?: string | null;
    submittedAt?: string | null;
  } | null;
  title: string;
};

const footerLinks = ['Privacy Policy', 'Terms of Service', 'Institutional Access', 'Contact Support'] as const;

function AssignmentArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AssignmentMoreIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}

function AssignmentCardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <rect x="6" y="4.5" width="12" height="15" rx="2.2" />
      <path d="M9 8.5h6M9 12h4.5" strokeLinecap="round" />
    </svg>
  );
}

function FileUploadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M8 4.5h6l3 3V18a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 18V6a1.5 1.5 0 0 1 1-1.41Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 4.5V8h3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 11.5h5M9.5 15h3.5" strokeLinecap="round" />
    </svg>
  );
}

function MediaUploadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <rect x="4.5" y="6.5" width="15" height="10.5" rx="2.2" />
      <path d="m10 10 4.5 2.25L10 14.5V10Z" fill="currentColor" stroke="none" />
      <path d="m7 17 3-3 2.5 2.5 2-2 2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinkUploadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M10 14 8.25 15.75a3 3 0 1 1-4.24-4.24L5.75 9.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m14 10 1.75-1.75a3 3 0 0 1 4.24 4.24L18.25 14.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m8.5 15.5 7-7" strokeLinecap="round" />
    </svg>
  );
}

function formatFileSize(size: number) {
  if (size >= 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }

  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (size >= 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${size} B`;
}

function createUploadItems(files: FileList | null, kindLabel: string) {
  if (!files) {
    return [];
  }

  return Array.from(files).map((file) => ({
    id: `${file.name}-${file.size}-${file.lastModified}`,
    name: file.name,
    meta: `${kindLabel} | ${formatFileSize(file.size)}`,
  }));
}

function AssignmentPageContent() {
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get('id');
  const selectedCourse = searchParams.get('course');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaInputRef = useRef<HTMLInputElement | null>(null);
  const [assignment, setAssignment] = useState<ApiAssignment | null>(null);
  const [documentItems, setDocumentItems] = useState<UploadItem[]>([]);
  const [mediaItems, setMediaItems] = useState<UploadItem[]>([]);
  const [links, setLinks] = useState<UploadItem[]>([]);
  const [linkDraft, setLinkDraft] = useState('');
  const [isLinkEditorOpen, setIsLinkEditorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(Boolean(assignmentId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState<SubmissionState | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadAssignment = async () => {
      if (!assignmentId) {
        setIsLoading(false);
        return;
      }

      const session = readAuthSession();

      if (!session) {
        if (!ignore) {
          setErrorMessage('Sign in again to check and submit this assignment.');
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(`${getApiBaseUrl()}/api/assignments/${assignmentId}`, {
          headers: buildAuthHeaders(session.accessToken),
        });
        const payload = (await response.json().catch(() => null)) as { assignment?: ApiAssignment; error?: string; message?: string } | null;

        if (!response.ok || !payload?.assignment) {
          throw new Error(payload?.error?.trim() || payload?.message?.trim() || 'Unable to load this assignment.');
        }

        if (!ignore) {
          setAssignment(payload.assignment);
          setSubmission(
            payload.assignment.submission?.submittedAt
              ? {
                  submittedAt: formatSubmittedAt(payload.assignment.submission.submittedAt),
                  totalItems: payload.assignment.submission.fileUrl ? 2 : 1,
                }
              : null,
          );
          setErrorMessage('');
          setIsLoading(false);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(getAuthRequestErrorMessage(error, 'Unable to load this assignment right now.'));
          setIsLoading(false);
        }
      }
    };

    void loadAssignment();

    return () => {
      ignore = true;
    };
  }, [assignmentId]);

  const formattedDeadline = useMemo(() => formatDeadline(assignment?.dueDate), [assignment?.dueDate]);

  const assignmentCourseName = assignment?.course?.name?.trim() || assignment?.course?.code?.trim() || selectedCourse;

  const assignmentDescription =
    assignment?.description?.trim() ||
    'Upload documents, supporting media, or a working link for your final submission.';

  const existingSubmissionText = assignment?.submission?.submissionText?.trim();

  const totalSubmissionItems = documentItems.length + mediaItems.length + links.length;

  function formatDeadline(value?: string | null) {
    if (!value) {
      return 'No due date set';
    }

    const dueDate = new Date(value);

    if (Number.isNaN(dueDate.getTime())) {
      return 'No due date set';
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(dueDate);
  }

  function formatSubmittedAt(value?: string | null) {
    const submittedDate = value ? new Date(value) : new Date();

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(Number.isNaN(submittedDate.getTime()) ? new Date() : submittedDate);
  }

  const addLink = () => {
    const trimmedLink = linkDraft.trim();

    if (!trimmedLink) {
      setErrorMessage('Please paste a link before adding it.');
      return;
    }

    try {
      const parsedUrl = new URL(trimmedLink);
      const linkName = parsedUrl.hostname.replace('www.', '');

      setLinks((currentLinks) => [
        ...currentLinks,
        {
          id: trimmedLink,
          name: trimmedLink,
          meta: `Link | ${linkName}`,
        },
      ]);
      setLinkDraft('');
      setIsLinkEditorOpen(false);
      setErrorMessage('');
    } catch {
      setErrorMessage('Please enter a valid link such as a Canva, Google Docs, or Drive URL.');
    }
  };

  const removeItem = (targetId: string, setter: React.Dispatch<React.SetStateAction<UploadItem[]>>) => {
    setter((items) => items.filter((item) => item.id !== targetId));
  };

  const submitAssignment = async () => {
    if (!assignmentId) {
      setErrorMessage('Open this page from Assignments so AcaFlow knows which assignment to submit.');
      return;
    }

    if (totalSubmissionItems === 0) {
      setErrorMessage('Add at least one file, video/image, or link before submitting.');
      return;
    }

    const session = readAuthSession();

    if (!session) {
      setErrorMessage('Sign in again to submit this assignment.');
      return;
    }

    const attachmentLines = [
      ...documentItems.map((item) => `Document: ${item.name} (${item.meta})`),
      ...mediaItems.map((item) => `Media: ${item.name} (${item.meta})`),
      ...links.map((item) => `Link: ${item.name}`),
    ];
    const primaryLink = links[0]?.name;

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/assignments/${assignmentId}/submissions`, {
        method: 'POST',
        headers: buildAuthHeaders(session.accessToken),
        body: JSON.stringify({
          ...(primaryLink ? { fileUrl: primaryLink } : {}),
          submissionText: attachmentLines.join('\n'),
        }),
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        message?: string;
        submission?: { submittedAt?: string | null };
      } | null;

      if (!response.ok) {
        throw new Error(payload?.error?.trim() || payload?.message?.trim() || 'Unable to submit this assignment.');
      }

      setSubmission({
        submittedAt: formatSubmittedAt(payload?.submission?.submittedAt),
        totalItems: totalSubmissionItems,
      });
      setSuccessMessage(payload?.message?.trim() || 'Assignment submitted successfully.');
    } catch (error) {
      setErrorMessage(getAuthRequestErrorMessage(error, 'Unable to submit this assignment right now.'));
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <p className="text-3xl font-bold tracking-[-0.04em] text-[#6d38de] md:text-[2.55rem]">Assignment</p>
                <p className="max-w-2xl text-base text-[#5f4a79]">
                  {assignmentCourseName
                    ? `Submit your work for ${assignmentCourseName}. Teachers will review the submission and grade your points later.`
                    : 'Submit your work here. Teachers will review the submission and grade your points later.'}
                </p>
              </div>

              <Link
                href="/assignments"
                className="mt-2 inline-flex items-center gap-2 text-[0.86rem] font-semibold text-[#6b32ef] transition hover:text-[#5321cf]"
              >
                Back to assignments
                <AssignmentArrowIcon />
              </Link>
            </div>

            <article className="rounded-[22px] border border-[#f1ebfb] bg-white px-5 py-5 shadow-[0_24px_40px_-34px_rgba(84,49,169,0.28)]">
              <div className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#efe5ff] text-[#7a3df0]">
                <AssignmentCardIcon />
              </div>

              <h2 className="mt-5 text-[1.45rem] font-semibold tracking-[-0.03em] text-[#2f2738]">
                {isLoading ? 'Loading assignment...' : assignment?.title ?? 'Assignment'}
              </h2>
              {assignmentCourseName ? (
                <p className="mt-2 text-sm font-medium text-[#6d38de]">{assignmentCourseName}</p>
              ) : null}

              <p className="mt-8 max-w-2xl text-[0.82rem] leading-5 text-[#998ea9]">
                {assignmentDescription}
              </p>

              <div className="mt-8 space-y-1">
                <p className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-[#6b32ef]">Deadlines</p>
                <p className="text-sm font-semibold text-[#2f1e47]">{formattedDeadline}</p>
              </div>

              {!assignmentId ? (
                <p className="mt-5 rounded-[14px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                  Open a specific assignment from the Assignments page before submitting.
                </p>
              ) : null}
            </article>
          </section>

          <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-[2rem] font-bold tracking-[-0.05em] text-[#2f2738]">Submit here</h2>
              {submission ? (
                <span className="rounded-full bg-[#eef9f1] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#17945d]">
                  Submitted
                </span>
              ) : null}
            </div>

            <div className="rounded-[22px] border border-[#f0eaf8] bg-white p-2 shadow-[0_24px_42px_-36px_rgba(84,49,169,0.28)]">
              <div className="space-y-2">
                <article className="rounded-[16px] border border-[#f4f0f8] bg-white px-3 py-3 sm:px-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-[#fff1f0] text-[#f05a57]">
                      <FileUploadIcon />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-[0.86rem] font-semibold tracking-[-0.02em] text-[#31283a]">File</h3>
                      <p className="mt-0.5 text-[0.67rem] text-[#9b8faa]">Submit in PDF, DOC, DOCX, PPT, PPTX, ZIP, or other file types.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full bg-[#f5f1f4] px-3 py-1.5 text-[0.55rem] font-bold uppercase tracking-[0.12em] text-[#918591] transition hover:bg-[#ece4f4] hover:text-[#5b29d6]"
                    >
                      Add File
                    </button>

                    <button type="button" className="grid h-8 w-8 place-items-center rounded-full text-[#9b90a8] transition hover:bg-[#f7f2fb] hover:text-[#5b29d6]">
                      <AssignmentMoreIcon />
                    </button>
                  </div>

                  {documentItems.length > 0 ? (
                    <div className="mt-3 space-y-2 border-t border-[#f3edf8] pt-3">
                      {documentItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-3 rounded-[12px] bg-[#faf7fd] px-3 py-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-[#2f1e47]">{item.name}</p>
                            <p className="text-xs text-[#8e82a5]">{item.meta}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id, setDocumentItems)}
                            className="text-xs font-semibold uppercase tracking-[0.08em] text-[#9b8fb3] transition hover:text-[#5b29d6]"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>

                <article className="rounded-[16px] border border-[#f4f0f8] bg-white px-3 py-3 sm:px-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-[#edf2ff] text-[#4770ff]">
                      <MediaUploadIcon />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-[0.86rem] font-semibold tracking-[-0.02em] text-[#31283a]">Video or Images</h3>
                      <p className="mt-0.5 text-[0.67rem] text-[#9b8faa]">Submit image proofs or video files, similar to Google Classroom media attachments.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => mediaInputRef.current?.click()}
                      className="rounded-full bg-[#f5f1f4] px-3 py-1.5 text-[0.55rem] font-bold uppercase tracking-[0.12em] text-[#918591] transition hover:bg-[#ece4f4] hover:text-[#5b29d6]"
                    >
                      Add Video
                    </button>

                    <button type="button" className="grid h-8 w-8 place-items-center rounded-full text-[#9b90a8] transition hover:bg-[#f7f2fb] hover:text-[#5b29d6]">
                      <AssignmentMoreIcon />
                    </button>
                  </div>

                  {mediaItems.length > 0 ? (
                    <div className="mt-3 space-y-2 border-t border-[#f3edf8] pt-3">
                      {mediaItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-3 rounded-[12px] bg-[#faf7fd] px-3 py-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-[#2f1e47]">{item.name}</p>
                            <p className="text-xs text-[#8e82a5]">{item.meta}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id, setMediaItems)}
                            className="text-xs font-semibold uppercase tracking-[0.08em] text-[#9b8fb3] transition hover:text-[#5b29d6]"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>

                <article className="rounded-[16px] border border-[#f4f0f8] bg-white px-3 py-3 sm:px-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-[#ebfff3] text-[#2ab56a]">
                      <LinkUploadIcon />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-[0.86rem] font-semibold tracking-[-0.02em] text-[#31283a]">Link</h3>
                      <p className="mt-0.5 text-[0.67rem] text-[#9b8faa]">Submit as a link such as Canva, Google Docs, Google Drive, Figma, or other online work.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsLinkEditorOpen(true);
                        setErrorMessage('');
                      }}
                      className="rounded-full bg-[#f5f1f4] px-3 py-1.5 text-[0.55rem] font-bold uppercase tracking-[0.12em] text-[#918591] transition hover:bg-[#ece4f4] hover:text-[#5b29d6]"
                    >
                      Add Link
                    </button>

                    <button type="button" className="grid h-8 w-8 place-items-center rounded-full text-[#9b90a8] transition hover:bg-[#f7f2fb] hover:text-[#5b29d6]">
                      <AssignmentMoreIcon />
                    </button>
                  </div>

                  {isLinkEditorOpen ? (
                    <div className="mt-3 flex flex-col gap-3 border-t border-[#f3edf8] pt-3 sm:flex-row">
                      <input
                        type="url"
                        value={linkDraft}
                        onChange={(event) => setLinkDraft(event.target.value)}
                        placeholder="Paste a Canva, Google Docs, Drive, or other share link"
                        className="flex-1 rounded-[12px] border border-[#e7def5] bg-[#fbf9fe] px-4 py-3 text-sm text-[#2f1e47] outline-none placeholder:text-[#a398b4] focus:border-[#cdb9f0]"
                      />
                      <button
                        type="button"
                        onClick={addLink}
                        className="rounded-[12px] bg-[linear-gradient(135deg,#7b47ed_0%,#5d34df_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_28px_-24px_rgba(93,52,223,1)]"
                      >
                        Save Link
                      </button>
                    </div>
                  ) : null}

                  {links.length > 0 ? (
                    <div className="mt-3 space-y-2 border-t border-[#f3edf8] pt-3">
                      {links.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-3 rounded-[12px] bg-[#faf7fd] px-3 py-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-[#2f1e47]">{item.name}</p>
                            <p className="text-xs text-[#8e82a5]">{item.meta}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id, setLinks)}
                            className="text-xs font-semibold uppercase tracking-[0.08em] text-[#9b8fb3] transition hover:text-[#5b29d6]"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[18px] border border-[#f0eaf8] bg-white px-4 py-4 shadow-[0_20px_34px_-34px_rgba(84,49,169,0.35)]">
                <p className="text-sm font-semibold text-[#2f1e47]">Submission notes</p>
                <p className="mt-2 text-sm leading-6 text-[#6c5f80]">
                  Accepted documents include PDF, Word, PowerPoint, and other class files. Media uploads support video and image proofs like Google Classroom. Links can point to Canva, Google Docs, Figma, or any teacher-accessible resource.
                </p>
                {submission ? (
                  <div className="mt-4 rounded-[14px] bg-[#eef9f1] px-4 py-3">
                    <p className="text-sm font-semibold text-[#17945d]">Submitted for teacher review</p>
                    <p className="mt-1 text-xs text-[#3d775b]">
                      {submission.totalItems} items sent on {submission.submittedAt}. Teachers can now check the work and grade the points later.
                    </p>
                  </div>
                ) : null}
                {existingSubmissionText ? (
                  <div className="mt-4 rounded-[14px] bg-[#faf7ff] px-4 py-3">
                    <p className="text-sm font-semibold text-[#4f2fd1]">Current submission</p>
                    <pre className="mt-2 whitespace-pre-wrap text-xs leading-5 text-[#5f4a79]">{existingSubmissionText}</pre>
                  </div>
                ) : null}
                {successMessage ? <p className="mt-4 text-sm font-medium text-[#17945d]">{successMessage}</p> : null}
                {errorMessage ? <p className="mt-4 text-sm font-medium text-[#c53459]">{errorMessage}</p> : null}
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={submitAssignment}
                  disabled={isLoading || isSubmitting || !assignmentId}
                  className="min-w-[154px] rounded-[8px] bg-[linear-gradient(135deg,#7b47ed_0%,#5d34df_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(93,52,223,1)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Submitting...' : submission ? 'Resubmit' : 'Submit'}
                </button>
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

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar,.csv"
        className="hidden"
        onChange={(event) => {
          const items = createUploadItems(event.target.files, 'Document');
          if (items.length > 0) {
            setDocumentItems((currentItems) => [...currentItems, ...items]);
            setErrorMessage('');
          }
          event.target.value = '';
        }}
      />

      <input
        ref={mediaInputRef}
        type="file"
        multiple
        accept="video/*,image/*"
        className="hidden"
        onChange={(event) => {
          const items = createUploadItems(event.target.files, 'Media');
          if (items.length > 0) {
            setMediaItems((currentItems) => [...currentItems, ...items]);
            setErrorMessage('');
          }
          event.target.value = '';
        }}
      />
    </div>
  );
}

export default function AssignmentPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[980px] px-5 py-8 text-sm font-semibold text-[#6d38de]">Loading assignment...</div>}>
      <AssignmentPageContent />
    </Suspense>
  );
}
