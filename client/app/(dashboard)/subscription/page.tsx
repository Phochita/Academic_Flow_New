type PricingPlan = {
  name: string;
  badge: string;
  price: string;
  billingLabel: string;
  duration: string;
  renewal: string;
  featured?: boolean;
  cta: string;
  features: string[];
};

type StatusRule = {
  title: string;
  description: string;
};

const pricingPlans: PricingPlan[] = [
  {
    name: 'Monthly Plan',
    badge: '30 Days Access',
    price: '$5',
    billingLabel: 'per month',
    duration: '30 days',
    renewal: 'Renews every 30 days',
    cta: 'Choose Monthly Plan',
    features: ['AI-based Study Planner', 'Learning Analytics', 'Smart Reminders'],
  },
  {
    name: 'Semester Plan',
    badge: 'Most Popular',
    price: '$20',
    billingLabel: 'per semester',
    duration: '6 months',
    renewal: 'Renews every 6 months',
    featured: true,
    cta: 'Choose Semester Plan',
    features: ['AI-based Study Planner', 'Learning Analytics', 'Smart Reminders', 'Advanced Analytics'],
  },
  {
    name: 'Annual Plan',
    badge: 'Best Value',
    price: '$35',
    billingLabel: 'per year',
    duration: '12 months',
    renewal: 'Renews every 12 months',
    cta: 'Choose Annual Plan',
    features: ['AI-based Study Planner', 'Learning Analytics', 'Smart Reminders', 'Advanced Analytics', 'Priority Support'],
  },
];

const statusRules: StatusRule[] = [
  {
    title: 'Automatic subscription status check',
    description: 'The system shall automatically check subscription status so students always see the correct access level.',
  },
  {
    title: 'Revert to Free Student',
    description: 'When a subscription expires, the user account shall revert to Free Student automatically.',
  },
  {
    title: 'Disable Student Pro features',
    description: 'When a subscription expires, Student Pro features shall be disabled until the plan is renewed.',
  },
  {
    title: 'Notify the user to renew',
    description: 'The system shall notify the user to renew the subscription when access has expired or is about to expire.',
  },
];

function PlanIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor" aria-hidden="true">
      <path d="M12 3 2.5 8 12 13 21.5 8 12 3Zm-7 7.48V16l7 3.7 7-3.7v-5.52L12 15l-7-4.52Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#6d38de] text-white">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
        <path d="m6.5 12 3.1 3.1 7.9-7.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function StatusIcon() {
  return (
    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#efe3ff] text-[#6d38de]">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="8" />
      </svg>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <div className="mx-auto max-w-[1180px] space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-[#eadcf7] bg-white shadow-[0_30px_46px_-40px_rgba(95,41,210,0.7)]">
        <div className="grid gap-7 px-7 py-7 lg:grid-cols-[minmax(0,1.2fr)_320px] lg:px-8">
          <div>
            <span className="inline-flex rounded-full bg-[#efe3ff] px-4 py-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-[#6d38de]">
              Student Pro Subscription
            </span>
            <h1 className="mt-5 text-[2.3rem] font-bold leading-[1] tracking-[-0.05em] text-[#2a1842] sm:text-[2.8rem]">
              Subscription Plan
              <br />
              Display
            </h1>
            <p className="mt-4 max-w-[680px] text-[0.98rem] leading-7 text-[#6b5a88]">
              The system shall display available Student Pro subscription plans to students. Each plan below shows the
              subscription price, subscription duration, premium features included, and renewal option.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[22px] border border-[#eadcf7] bg-[#fcf9ff] p-5">
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[#7c6d92]">Current Account</p>
                <p className="mt-2 text-[1.18rem] font-semibold text-[#2a1842]">Free Student</p>
              </div>
              <div className="rounded-[22px] border border-[#eadcf7] bg-[#fcf9ff] p-5">
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[#7c6d92]">Status Check</p>
                <p className="mt-2 text-[1.18rem] font-semibold text-[#2a1842]">Automatic</p>
              </div>
              <div className="rounded-[22px] border border-[#eadcf7] bg-[#fcf9ff] p-5">
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[#7c6d92]">Renewal Notice</p>
                <p className="mt-2 text-[1.18rem] font-semibold text-[#2a1842]">Enabled</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-[28px] bg-[linear-gradient(180deg,#6d38de_0%,#6c34df_42%,#5b28d3_100%)] p-7 text-white shadow-[0_30px_48px_-34px_rgba(95,41,210,0.95)]">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-xl" />
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
                <PlanIcon />
              </div>
              <h2 className="mt-6 text-[1.65rem] font-bold tracking-[-0.04em]">Subscription Status Rule</h2>
              <p className="mt-3 text-[0.94rem] leading-7 text-white/80">
                If a Student Pro subscription expires, the account returns to Free Student, premium access is disabled,
                and the student is notified to renew.
              </p>
              <div className="mt-6 rounded-[22px] border border-white/15 bg-white/10 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">Expiry Handling</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-white">
                  <li>Revert account to Free Student</li>
                  <li>Disable Student Pro features</li>
                  <li>Notify the user to renew</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 text-center">
        <h2 className="text-[2.2rem] font-bold tracking-[-0.04em] text-[#2a1842]">Available Student Pro Plans</h2>
        <p className="text-[1rem] text-[#6b5a88]">
          Example subscription plans include Monthly Plan, Semester Plan, and Annual Plan.
        </p>

        <div className="grid gap-5 pt-5 xl:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={`relative rounded-[28px] border bg-white px-7 py-7 text-left shadow-[0_28px_46px_-40px_rgba(95,41,210,0.7)] ${
                plan.featured ? 'border-[#6d38de] shadow-[0_34px_54px_-38px_rgba(109,56,222,0.95)]' : 'border-[#eadcf7]'
              }`}
            >
              <span
                className={`inline-flex rounded-full px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] ${
                  plan.featured ? 'bg-[#6d38de] text-white' : 'bg-[#efe3ff] text-[#6d38de]'
                }`}
              >
                {plan.badge}
              </span>

              <h3 className="mt-5 text-[1.7rem] font-bold tracking-[-0.04em] text-[#2a1842]">{plan.name}</h3>

              <div className="mt-5 flex items-end gap-2">
                <span className="text-[2.8rem] font-bold tracking-[-0.05em] text-[#2a1842]">{plan.price}</span>
                <span className="pb-2 text-[1rem] text-[#6b5a88]">{plan.billingLabel}</span>
              </div>

              <div className="mt-6 space-y-4 rounded-[22px] bg-[#faf6ff] p-5">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7c6d92]">Duration</span>
                  <span className="text-right text-[1rem] font-medium text-[#2a1842]">{plan.duration}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7c6d92]">Renewal Option</span>
                  <span className="text-right text-[1rem] font-medium text-[#2a1842]">{plan.renewal}</span>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7c6d92]">Premium Features Included</p>
                <div className="mt-4 space-y-4">
                  {plan.features.map((feature) => (
                    <div key={`${plan.name}-${feature}`} className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-[1rem] text-[#2a1842]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className={`mt-10 w-full rounded-[16px] px-5 py-4 text-[1.02rem] font-semibold transition hover:translate-y-[-1px] ${
                  plan.featured
                    ? 'bg-[linear-gradient(135deg,#6d38de_0%,#8d66ef_100%)] text-white shadow-[0_24px_30px_-24px_rgba(109,56,222,0.95)]'
                    : 'bg-[#f2dfff] text-[#5d34df]'
                }`}
              >
                {plan.cta}
              </button>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_340px]">
        <section className="rounded-[30px] border border-[#eadcf7] bg-white p-7 shadow-[0_30px_46px_-40px_rgba(95,41,210,0.7)]">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#efe3ff] text-[#6d38de]">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M12 2.8 14 7l4.6.67-3.3 3.22.78 4.55L12 13.35 7.92 15.44l.78-4.55L5.4 7.67 10 7l2-4.2Z" />
              </svg>
            </div>
            <h2 className="text-[1.75rem] font-bold tracking-[-0.04em] text-[#2a1842]">System Subscription Rules</h2>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {statusRules.map((rule) => (
              <article key={rule.title} className="rounded-[22px] bg-[#f7ecff] p-5">
                <StatusIcon />
                <h3 className="mt-4 text-[1.28rem] font-semibold tracking-[-0.04em] text-[#2a1842]">{rule.title}</h3>
                <p className="mt-2 text-[0.98rem] leading-7 text-[#6b5a88]">{rule.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[30px] border border-dashed border-[#dac6f3] bg-white p-6 shadow-[0_26px_42px_-42px_rgba(95,41,210,0.7)]">
          <h2 className="text-[1.5rem] font-bold tracking-[-0.03em] text-[#2a1842]">Student Pro Summary</h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-[20px] border border-[#efe3fb] bg-[#fffdfd] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7c6d92]">Displayed Information</p>
              <p className="mt-3 text-[0.98rem] leading-7 text-[#6b5a88]">
                Subscription price, subscription duration, premium features included, and renewal options are shown for
                every available Student Pro plan.
              </p>
            </div>

            <div className="rounded-[20px] border border-[#efe3fb] bg-[#fffdfd] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7c6d92]">Expiry Outcome</p>
              <p className="mt-3 text-[0.98rem] leading-7 text-[#6b5a88]">
                Expired subscriptions automatically fall back to Free Student and trigger a renewal notification for the
                user.
              </p>
            </div>

            <div className="rounded-[20px] border border-[#efe3fb] bg-[#fffdfd] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7c6d92]">Renewal Guidance</p>
              <p className="mt-3 text-[0.98rem] leading-7 text-[#6b5a88]">
                Students can renew using the same Monthly, Semester, or Annual plan options displayed on this page.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
