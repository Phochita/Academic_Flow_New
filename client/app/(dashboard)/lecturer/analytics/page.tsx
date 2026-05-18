import LecturerTabsNav from '@/components/lecturer/LecturerTabsNav';

type PerformanceStudent = {
  name: string;
  course: string;
  score: string;
  note: string;
};

type PerformanceGroup = {
  label: string;
  tone: string;
  description: string;
  students: PerformanceStudent[];
};

const performanceGroups: PerformanceGroup[] = [
  {
    label: 'Low Performance',
    tone: 'bg-[#fff1f5] text-[#b83262]',
    description: 'Students needing quick intervention, reminders, or one-on-one support.',
    students: [
      { name: 'Jordan Smith', course: 'Cloud Computing Systems', score: '64%', note: 'Missing two recent tasks and attendance is down.' },
      { name: 'Srey Leak', course: 'Advanced Data Structures', score: '58%', note: 'Three missing submissions this month.' },
      { name: 'Dara Ngin', course: 'Cloud Computing Systems', score: '61%', note: 'Quiz trend is declining week by week.' },
    ],
  },
  {
    label: 'Medium Performance',
    tone: 'bg-[#fff7e8] text-[#b26b00]',
    description: 'Students who are progressing but still need targeted feedback to improve.',
    students: [
      { name: 'Marcus Chen', course: 'Advanced Data Structures', score: '78%', note: 'Solid work, but needs clearer explanations in written responses.' },
      { name: 'Phalla Hem', course: 'Cloud Computing Systems', score: '74%', note: 'Good attendance, inconsistent assignment completion.' },
      { name: 'Lina Phan', course: 'Neural Network Architecture', score: '76%', note: 'Understands concepts but loses marks on implementation detail.' },
    ],
  },
  {
    label: 'High Performance',
    tone: 'bg-[#ecfbf0] text-[#22804a]',
    description: 'Students with strong and consistent performance across coursework and class engagement.',
    students: [
      { name: 'Elena Rodriguez', course: 'Neural Network Architecture', score: '92%', note: 'Excellent submissions and active in discussion.' },
      { name: 'Nika Sok', course: 'Advanced Data Structures', score: '88%', note: 'Reliable work and improving every week.' },
      { name: 'Sokunthea Lim', course: 'Neural Network Architecture', score: '94%', note: 'Consistently high-quality lab and quiz results.' },
    ],
  },
];

export default function LecturerAnalyticsPage() {
  return (
    <div className="mx-auto max-w-[1120px] space-y-6">
      <LecturerTabsNav />

      <section className="space-y-6 pt-5">
        <header className="rounded-[28px] border border-[#eadcf7] bg-white px-6 py-6 shadow-[0_24px_40px_-34px_rgba(84,39,174,0.82)]">
          <div className="space-y-2">
            <span className="inline-flex rounded-full bg-[#efe3ff] px-3.5 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#6d38de]">
              Performance Overview
            </span>
            <h1 className="text-[2.1rem] font-bold tracking-[-0.05em] text-[#28163f]">Analytics</h1>
            <p className="max-w-[720px] text-[0.98rem] leading-7 text-[#5f4a79]">
              See which students are low, medium, and high performance so you can quickly decide who needs support and who
              is ready for more challenge.
            </p>
          </div>
        </header>

        <section className="grid gap-5 md:grid-cols-3">
          {performanceGroups.map((group) => (
            <article
              key={group.label}
              className="rounded-[24px] border border-[#eadcf7] bg-white p-5 shadow-[0_20px_34px_-30px_rgba(82,36,163,0.65)]"
            >
              <span className={`inline-flex rounded-full px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] ${group.tone}`}>
                {group.label}
              </span>
              <p className="mt-4 text-[2rem] font-bold tracking-[-0.05em] text-[#2a1842]">{group.students.length}</p>
              <p className="mt-2 text-sm leading-7 text-[#6b5a88]">{group.description}</p>
            </article>
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          {performanceGroups.map((group) => (
            <section
              key={group.label}
              className="rounded-[28px] border border-[#eadcf7] bg-white p-5 shadow-[0_24px_40px_-34px_rgba(84,39,174,0.82)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[1.3rem] font-bold tracking-[-0.03em] text-[#28163f]">{group.label}</h2>
                  <p className="mt-1 text-sm leading-6 text-[#6b5a88]">{group.description}</p>
                </div>
                <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] ${group.tone}`}>
                  {group.students.length}
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {group.students.map((student) => (
                  <article key={student.name} className="rounded-[20px] bg-[#faf6ff] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-[1rem] font-semibold text-[#2a1842]">{student.name}</h3>
                      <span className="text-sm font-bold text-[#5a2ddf]">{student.score}</span>
                    </div>
                    <p className="mt-1 text-sm text-[#6b5a88]">{student.course}</p>
                    <p className="mt-3 text-sm leading-6 text-[#5f4a79]">{student.note}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
