'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import LecturerTabsNav from '@/components/lecturer/LecturerTabsNav';
import { lecturerClassworkItems, type LecturerClassworkItem, type LecturerWorkflowStatus } from '../lecturerData';

type FilterKey = 'all' | LecturerWorkflowStatus;

const filterOptions: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'missing', label: 'Missing' },
  { key: 'graded', label: 'Graded' },
];

function cloneClassworkItems() {
  return lecturerClassworkItems.map((item) => ({ ...item, instructions: [...item.instructions] }));
}

function ClassworkIcon({ type }: { type: LecturerClassworkItem['type'] }) {
  if (type === 'Assignment') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="5" y="4" width="14" height="16" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'Quiz Assignment') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M10 10a2 2 0 1 1 3.5 1.3c-.67.64-1.5 1.2-1.5 2.2" strokeLinecap="round" />
        <circle cx="12" cy="17" r=".7" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M8 4h6l4 4v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      <path d="M14 4v4h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LecturerClassworkPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState(() => cloneClassworkItems());
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDue, setEditDue] = useState('');

  const activeTopic = searchParams.get('topic') ?? 'All Topics';
  const activeFilter = (searchParams.get('filter') as FilterKey | null) ?? 'all';
  const activeItemId = searchParams.get('item');
  const activeMode = searchParams.get('mode');

  const selectedItem = items.find((item) => item.id === activeItemId) ?? null;
  const topicNames = ['All Topics', ...new Set(items.map((item) => item.topic))];

  const visibleItems = items.filter((item) => {
    const matchesTopic = activeTopic === 'All Topics' || item.topic === activeTopic;
    const matchesFilter = activeFilter === 'all' || item.workflowStatus === activeFilter;

    return matchesTopic && matchesFilter;
  });

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    router.push(queryString ? `/lecturer/classwork?${queryString}` : '/lecturer/classwork');
  }

  function openDetails(itemId: string) {
    setBannerMessage(null);
    updateParams({ item: itemId, mode: 'details' });
  }

  function beginEdit(itemId: string) {
    const item = items.find((entry) => entry.id === itemId);

    if (!item) {
      return;
    }

    setEditTitle(item.title);
    setEditDescription(item.description);
    setEditDue(item.due);
    setBannerMessage(null);
    updateParams({ item: itemId, mode: 'edit' });
  }

  function saveChanges() {
    if (!selectedItem) {
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              title: editTitle.trim() || item.title,
              description: editDescription.trim() || item.description,
              due: editDue.trim() || item.due,
            }
          : item
      )
    );

    setBannerMessage('Assignment details updated successfully.');
    updateParams({ mode: 'details' });
  }

  function createDraft() {
    const trimmedTitle = draftTitle.trim();

    if (!trimmedTitle) {
      setBannerMessage('Add a title before creating a draft post.');
      return;
    }

    const newId = `${trimmedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${items.length + 1}`;

    setItems((current) => [
      {
        id: newId,
        title: trimmedTitle,
        type: 'Assignment',
        topic: activeTopic === 'All Topics' ? 'Week 6' : activeTopic,
        due: 'No deadline yet',
        points: '100 points',
        assignedTo: 'Assigned to all students',
        submissions: '0 turned in',
        course: 'Advanced Data Structures',
        workflowStatus: 'assigned',
        description: 'New assignment draft created from classwork.',
        instructions: ['Open Edit to update the description, deadline, and instructions.'],
        isGradable: true,
      },
      ...current,
    ]);

    setDraftTitle('');
    setBannerMessage('Draft assignment created in classwork.');
    updateParams({ item: newId, mode: 'edit', topic: 'All Topics' });
  }

  function reuseSelectedPost() {
    const source = selectedItem ?? items[0];

    if (!source) {
      return;
    }

    const duplicatedId = `${source.id}-copy-${items.length + 1}`;

    setItems((current) => [
      {
        ...source,
        id: duplicatedId,
        title: `${source.title} Copy`,
        due: source.type === 'Material' ? 'Posted just now' : 'No deadline yet',
        submissions: source.type === 'Material' ? '0 viewed' : '0 turned in',
      },
      ...current,
    ]);

    setBannerMessage('Post duplicated successfully.');
    updateParams({ item: duplicatedId, mode: 'edit', topic: 'All Topics' });
  }

  return (
    <div className="mx-auto max-w-[1120px] space-y-6">
      <LecturerTabsNav />

      <section className="grid gap-6 pt-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          {bannerMessage ? (
            <div className="rounded-[22px] border border-[#ddcff7] bg-[#f7f1ff] px-5 py-4 text-sm font-semibold text-[#5a2ddf]">
              {bannerMessage}
            </div>
          ) : null}

          <header className="rounded-[28px] border border-[#eadcf7] bg-white px-6 py-6 shadow-[0_24px_40px_-34px_rgba(84,39,174,0.82)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <span className="inline-flex rounded-full bg-[#efe3ff] px-3.5 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#6d38de]">
                  Google Classroom Style
                </span>
                <h1 className="text-[2.2rem] font-bold tracking-[-0.05em] text-[#28163f]">Classwork</h1>
                <p className="max-w-[620px] text-[0.98rem] leading-7 text-[#5f4a79]">
                  Keep classwork clean and focused. Create assignments, post materials, and review submission progress in one
                  simple list.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateParams({ mode: 'create', item: null })}
                  className="rounded-full border border-[#dbc8fa] bg-white px-5 py-2.5 text-sm font-semibold text-[#5a2ddf] transition hover:border-[#cdb5f7]"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={reuseSelectedPost}
                  className="rounded-full bg-[linear-gradient(135deg,#7641e8_0%,#9a73ef_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_28px_-20px_rgba(118,65,232,0.95)] transition hover:scale-[1.01]"
                >
                  Reuse Post
                </button>
              </div>
            </div>
          </header>

          {activeMode === 'create' ? (
            <section className="rounded-[28px] border border-[#eadcf7] bg-white p-6 shadow-[0_24px_40px_-34px_rgba(84,39,174,0.82)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-[1.45rem] font-bold tracking-[-0.03em] text-[#28163f]">Create Assignment Draft</h2>
                  <p className="mt-1 text-sm text-[#6b5a88]">Add the assignment title first, then edit the full description and deadline.</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateParams({ mode: null })}
                  className="text-sm font-semibold text-[#5a2ddf]"
                >
                  Close
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  placeholder="Assignment title"
                  className="h-12 min-w-[280px] flex-1 rounded-[16px] border border-[#e4d8fb] bg-[#fcfaff] px-4 text-sm text-[#2a1842] outline-none focus:border-[#cdb5f7]"
                />
                <button
                  type="button"
                  onClick={createDraft}
                  className="rounded-full bg-[linear-gradient(135deg,#7641e8_0%,#9a73ef_100%)] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Add Draft
                </button>
              </div>
            </section>
          ) : null}

          {selectedItem && activeMode === 'edit' ? (
            <section className="rounded-[28px] border border-[#eadcf7] bg-white p-6 shadow-[0_24px_40px_-34px_rgba(84,39,174,0.82)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-[1.45rem] font-bold tracking-[-0.03em] text-[#28163f]">Edit Assignment</h2>
                  <p className="mt-1 text-sm text-[#6b5a88]">Update the title, description, or deadline for this classwork post.</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateParams({ mode: 'details' })}
                  className="text-sm font-semibold text-[#5a2ddf]"
                >
                  Cancel
                </button>
              </div>

              <div className="mt-5 grid gap-4">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  className="h-12 rounded-[16px] border border-[#e4d8fb] bg-[#fcfaff] px-4 text-sm text-[#2a1842] outline-none focus:border-[#cdb5f7]"
                />
                <input
                  type="text"
                  value={editDue}
                  onChange={(event) => setEditDue(event.target.value)}
                  placeholder="Deadline"
                  className="h-12 rounded-[16px] border border-[#e4d8fb] bg-[#fcfaff] px-4 text-sm text-[#2a1842] outline-none focus:border-[#cdb5f7]"
                />
                <textarea
                  rows={5}
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                  className="rounded-[18px] border border-[#e4d8fb] bg-[#fcfaff] px-4 py-3 text-sm text-[#2a1842] outline-none focus:border-[#cdb5f7]"
                />
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={saveChanges}
                  className="rounded-full bg-[linear-gradient(135deg,#7641e8_0%,#9a73ef_100%)] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Save Changes
                </button>
              </div>
            </section>
          ) : null}

          {selectedItem && activeMode === 'details' ? (
            <section className="rounded-[28px] border border-[#eadcf7] bg-white p-6 shadow-[0_24px_40px_-34px_rgba(84,39,174,0.82)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-[1.45rem] font-bold tracking-[-0.03em] text-[#28163f]">{selectedItem.title}</h2>
                  <p className="mt-1 text-sm text-[#6b5a88]">
                    {selectedItem.course} / {selectedItem.topic}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => beginEdit(selectedItem.id)}
                  className="rounded-full border border-[#dbc8fa] px-4 py-2 text-sm font-semibold text-[#5a2ddf] transition hover:border-[#cdb5f7]"
                >
                  Edit Assignment
                </button>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[18px] bg-[#faf6ff] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">Deadline</p>
                  <p className="mt-1 text-sm font-semibold text-[#2a1842]">{selectedItem.due}</p>
                </div>
                <div className="rounded-[18px] bg-[#faf6ff] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">Points</p>
                  <p className="mt-1 text-sm font-semibold text-[#2a1842]">{selectedItem.points}</p>
                </div>
              </div>

              <div className="mt-5 rounded-[18px] bg-[#fcfaff] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">Description</p>
                <p className="mt-2 text-sm leading-6 text-[#5f4a79]">{selectedItem.description}</p>
              </div>
            </section>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="space-y-5">
              <section className="rounded-[24px] border border-[#eadcf7] bg-white p-5 shadow-[0_20px_34px_-30px_rgba(82,36,163,0.65)]">
                <h2 className="text-[1.2rem] font-bold tracking-[-0.03em] text-[#28163f]">Topics</h2>
                <div className="mt-4 space-y-2">
                  {topicNames.map((topic) => {
                    const count =
                      topic === 'All Topics' ? items.length : items.filter((item) => item.topic === topic).length;
                    const isActive = topic === activeTopic;

                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => updateParams({ topic, item: null, mode: null })}
                        className={`flex w-full items-center justify-between rounded-[16px] px-4 py-3 text-left text-sm transition ${
                          isActive
                            ? 'bg-[#f4edff] font-semibold text-[#5a2ddf]'
                            : 'bg-[#fcfaff] text-[#5f4a79] hover:bg-[#f7f1ff]'
                        }`}
                      >
                        <span>{topic}</span>
                        <span className="text-xs">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-[24px] border border-[#eadcf7] bg-white p-5 shadow-[0_20px_34px_-30px_rgba(82,36,163,0.65)]">
                <h2 className="text-[1.2rem] font-bold tracking-[-0.03em] text-[#28163f]">Quick View</h2>
                <div className="mt-4 space-y-3">
                  <div className="rounded-[18px] bg-[#faf6ff] p-4">
                    <p className="text-sm font-semibold text-[#2a1842]">{items.filter((item) => item.workflowStatus === 'assigned').length} posts assigned</p>
                    <p className="mt-1 text-sm text-[#6b5a88]">Assignments that are active and waiting for more student progress.</p>
                  </div>
                  <div className="rounded-[18px] bg-[#faf6ff] p-4">
                    <p className="text-sm font-semibold text-[#2a1842]">{items.filter((item) => item.workflowStatus === 'missing').length} posts need follow-up</p>
                    <p className="mt-1 text-sm text-[#6b5a88]">Open the relevant item and jump into grades when students are missing work.</p>
                  </div>
                </div>
              </section>
            </aside>

            <section className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 rounded-[22px] border border-[#eadcf7] bg-white px-4 py-4 shadow-[0_20px_34px_-30px_rgba(82,36,163,0.65)]">
                {filterOptions.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => updateParams({ filter: option.key, item: null, mode: null })}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      option.key === activeFilter ? 'bg-[#f1e6ff] text-[#5a2ddf]' : 'text-[#6b5a88] hover:bg-[#faf6ff]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {visibleItems.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[26px] border border-[#eadcf7] bg-white p-5 shadow-[0_22px_38px_-32px_rgba(82,36,163,0.7)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <button type="button" onClick={() => openDetails(item.id)} className="flex items-start gap-4 text-left">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#efe4ff] text-[#6d38de]">
                        <ClassworkIcon type={item.type} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#7c6d92]">
                          <span>{item.type}</span>
                          <span className="text-[#b59ed8]">/</span>
                          <span>{item.topic}</span>
                        </div>
                        <h2 className="text-[1.35rem] font-bold tracking-[-0.04em] text-[#28163f]">{item.title}</h2>
                        <p className="text-sm text-[#6b5a88]">{item.assignedTo}</p>
                      </div>
                    </button>

                    <div className="rounded-[16px] bg-[#faf6ff] px-4 py-3 text-right">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">Due</p>
                      <p className="mt-1 text-sm font-semibold text-[#2a1842]">{item.due}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[18px] bg-[#fcfaff] px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">Points</p>
                      <p className="mt-1 text-sm font-semibold text-[#2a1842]">{item.points}</p>
                    </div>
                    <div className="rounded-[18px] bg-[#fcfaff] px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7c6d92]">Submission Status</p>
                      <p className="mt-1 text-sm font-semibold text-[#2a1842]">{item.submissions}</p>
                    </div>
                    <div className="flex items-center justify-end gap-3 rounded-[18px] bg-[#fcfaff] px-4 py-3">
                      <button
                        type="button"
                        onClick={() => beginEdit(item.id)}
                        className="rounded-full border border-[#dbc8fa] px-4 py-2 text-sm font-semibold text-[#5a2ddf] transition hover:border-[#cdb5f7]"
                      >
                        Edit
                      </button>
                      {item.isGradable ? (
                        <Link
                          href={`/lecturer/grades?assignment=${encodeURIComponent(item.id)}`}
                          className="rounded-full bg-[#efe6ff] px-4 py-2 text-sm font-semibold text-[#5a2ddf] transition hover:bg-[#e5d6ff]"
                        >
                          View work
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openDetails(item.id)}
                          className="rounded-full bg-[#efe6ff] px-4 py-2 text-sm font-semibold text-[#5a2ddf] transition hover:bg-[#e5d6ff]"
                        >
                          View post
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </div>
        </div>

        <aside className="space-y-6">
          <section className="rounded-[28px] border border-[#eadcf7] bg-[linear-gradient(180deg,#f3e7ff_0%,#f7edff_100%)] p-5 shadow-[0_24px_40px_-34px_rgba(84,39,174,0.82)]">
            <h2 className="text-[1.4rem] font-bold tracking-[-0.03em] text-[#28163f]">Quick Actions</h2>
            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={() => updateParams({ mode: 'create', item: null })}
                className="w-full rounded-[18px] bg-white px-4 py-3 text-left text-sm font-semibold text-[#5a2ddf] shadow-[0_16px_24px_-24px_rgba(84,39,174,0.9)]"
              >
                Create assignment draft
              </button>
              <button
                type="button"
                onClick={reuseSelectedPost}
                className="w-full rounded-[18px] bg-white px-4 py-3 text-left text-sm font-semibold text-[#5a2ddf] shadow-[0_16px_24px_-24px_rgba(84,39,174,0.9)]"
              >
                Reuse selected post
              </button>
              <Link
                href={selectedItem?.isGradable ? `/lecturer/grades?assignment=${encodeURIComponent(selectedItem.id)}` : '/lecturer/grades'}
                className="block w-full rounded-[18px] bg-white px-4 py-3 text-left text-sm font-semibold text-[#5a2ddf] shadow-[0_16px_24px_-24px_rgba(84,39,174,0.9)]"
              >
                Open grading
              </Link>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#eadcf7] bg-white p-5 shadow-[0_24px_40px_-34px_rgba(84,39,174,0.82)]">
            <h2 className="text-[1.35rem] font-bold tracking-[-0.03em] text-[#28163f]">Today</h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-[18px] bg-[#faf6ff] p-4">
                <p className="text-sm font-semibold text-[#2a1842]">
                  {items.filter((item) => item.isGradable).length} gradable posts active
                </p>
                <p className="mt-1 text-sm text-[#6b5a88]">Assignments and quizzes can be opened directly in the grade workflow.</p>
              </div>
              <div className="rounded-[18px] bg-[#faf6ff] p-4">
                <p className="text-sm font-semibold text-[#2a1842]">Selected post can be edited</p>
                <p className="mt-1 text-sm text-[#6b5a88]">Use Edit to change the description or deadline without leaving classwork.</p>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
