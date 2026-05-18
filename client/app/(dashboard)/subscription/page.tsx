'use client';

import { useEffect, useMemo, useState } from 'react';
import { buildAuthHeaders, getApiBaseUrl, readAuthSession } from '@/lib/auth';

type SubscriptionPlan = {
  code: string;
  durationDays: number;
  features: string[];
  name: string;
  priceUsd: number;
};

type SubscriptionHistoryItem = {
  createdAt: string;
  endDate: string;
  id: number;
  plan: string | null;
  startDate: string;
  status: 'active' | 'expired' | 'cancelled' | string;
};

type SubscriptionPayload = {
  activeSubscription: SubscriptionHistoryItem | null;
  history: SubscriptionHistoryItem[];
  isPro: boolean;
  plans: SubscriptionPlan[];
  userId: string;
};

type StatusRule = {
  title: string;
  description: string;
};

const statusRules: StatusRule[] = [
  {
    title: 'Automatic subscription status check',
    description: 'The system checks subscription status automatically so dashboard access stays accurate.',
  },
  {
    title: 'Revert to free access',
    description: 'When a subscription expires, the account falls back to the standard access level automatically.',
  },
  {
    title: 'Disable Pro-only tools',
    description: 'Pro features remain locked until the user activates another eligible plan.',
  },
  {
    title: 'Prompt to renew',
    description: 'Users can see the next renewal state and activate a new plan directly from this page.',
  },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(value);

const formatDuration = (days: number) => {
  if (days >= 365) {
    return '12 months';
  }

  if (days >= 180) {
    return '6 months';
  }

  return `${days} days`;
};

const formatBillingLabel = (days: number) => {
  if (days >= 365) {
    return 'per year';
  }

  if (days >= 180) {
    return 'per semester';
  }

  return 'per month';
};

const formatRenewalLabel = (days: number) => {
  if (days >= 365) {
    return 'Renews every 12 months';
  }

  if (days >= 180) {
    return 'Renews every 6 months';
  }

  return `Renews every ${days} days`;
};

const formatPlanBadge = (plan: SubscriptionPlan) => {
  if (plan.code === 'semester') {
    return 'Most Popular';
  }

  if (plan.code === 'annual') {
    return 'Best Value';
  }

  return `${plan.durationDays} Days Access`;
};

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
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionPayload | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [submittingPlan, setSubmittingPlan] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadSubscriptions = async () => {
      const session = readAuthSession();

      if (!session) {
        if (!ignore) {
          setErrorMessage('Sign in again to load your subscription details.');
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(`${apiBaseUrl}/api/subscriptions`, {
          headers: buildAuthHeaders(session.accessToken),
          method: 'GET',
        });

        const payload = (await response.json().catch(() => null)) as
          | (SubscriptionPayload & { error?: string })
          | null;

        if (!response.ok || !payload) {
          throw new Error(payload?.error?.trim() || 'Unable to load subscription details right now.');
        }

        if (!ignore) {
          setSubscriptionData(payload);
          setErrorMessage('');
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load subscription details right now.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void loadSubscriptions();

    return () => {
      ignore = true;
    };
  }, [apiBaseUrl]);

  const handleActivatePlan = async (planCode: string) => {
    const session = readAuthSession();

    if (!session) {
      setErrorMessage('Sign in again to activate a plan.');
      return;
    }

    setSubmittingPlan(planCode);
    setErrorMessage('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/subscriptions`, {
        method: 'POST',
        headers: buildAuthHeaders(session.accessToken),
        body: JSON.stringify({
          plan: planCode,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | (SubscriptionPayload & { error?: string })
        | null;

      if (!response.ok || !payload) {
        throw new Error(payload?.error?.trim() || 'Unable to activate this plan right now.');
      }

      setSubscriptionData(payload);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to activate this plan right now.');
    } finally {
      setSubmittingPlan(null);
    }
  };

  const plans = subscriptionData?.plans ?? [];
  const activeSubscription = subscriptionData?.activeSubscription ?? null;
  const activePlan = plans.find((plan) => plan.code === activeSubscription?.plan) ?? null;
  const latestHistory = subscriptionData?.history?.[0] ?? null;

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
              This page now reads live plan data from the backend and lets signed-in users activate a subscription directly.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[22px] border border-[#eadcf7] bg-[#fcf9ff] p-5">
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[#7c6d92]">Current Account</p>
                <p className="mt-2 text-[1.18rem] font-semibold text-[#2a1842]">
                  {activePlan ? activePlan.name : subscriptionData?.isPro ? 'Pro Access' : 'Free Student'}
                </p>
              </div>
              <div className="rounded-[22px] border border-[#eadcf7] bg-[#fcf9ff] p-5">
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[#7c6d92]">Status Check</p>
                <p className="mt-2 text-[1.18rem] font-semibold text-[#2a1842]">Automatic</p>
              </div>
              <div className="rounded-[22px] border border-[#eadcf7] bg-[#fcf9ff] p-5">
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[#7c6d92]">Renewal Notice</p>
                <p className="mt-2 text-[1.18rem] font-semibold text-[#2a1842]">
                  {activeSubscription ? new Date(activeSubscription.endDate).toLocaleDateString('en-US') : 'No active plan'}
                </p>
              </div>
            </div>

            {errorMessage ? (
              <p className="mt-6 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
            ) : null}
          </div>

          <div className="relative rounded-[28px] bg-[linear-gradient(180deg,#6d38de_0%,#6c34df_42%,#5b28d3_100%)] p-7 text-white shadow-[0_30px_48px_-34px_rgba(95,41,210,0.95)]">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-xl" />
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
                <PlanIcon />
              </div>
              <h2 className="mt-6 text-[1.65rem] font-bold tracking-[-0.04em]">Subscription Status Rule</h2>
              <p className="mt-3 text-[0.94rem] leading-7 text-white/80">
                If a Student Pro subscription expires, the account returns to free access, premium tools are disabled,
                and the user can activate a new plan.
              </p>
              <div className="mt-6 rounded-[22px] border border-white/15 bg-white/10 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">Current State</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-white">
                  <li>{subscriptionData?.isPro ? 'Pro features are active' : 'Standard access is active'}</li>
                  <li>{activeSubscription ? `Plan code: ${activeSubscription.plan}` : 'No active subscription on file'}</li>
                  <li>{latestHistory ? `Latest status: ${latestHistory.status}` : 'No subscription history yet'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 text-center">
        <h2 className="text-[2.2rem] font-bold tracking-[-0.04em] text-[#2a1842]">Available Student Pro Plans</h2>
        <p className="text-[1rem] text-[#6b5a88]">
          Live plans are loaded from the backend plan catalog instead of hardcoded UI content.
        </p>

        {isLoading ? (
          <div className="rounded-[28px] border border-[#eadcf7] bg-white px-7 py-10 text-sm font-semibold text-[#6d38de] shadow-[0_28px_46px_-40px_rgba(95,41,210,0.7)]">
            Loading subscription plans...
          </div>
        ) : (
          <div className="grid gap-5 pt-5 xl:grid-cols-3">
            {plans.map((plan) => {
              const isFeatured = plan.code === 'semester';
              const isCurrentPlan = activeSubscription?.plan === plan.code && activeSubscription.status === 'active';

              return (
                <article
                  key={plan.code}
                  className={`relative rounded-[28px] border bg-white px-7 py-7 text-left shadow-[0_28px_46px_-40px_rgba(95,41,210,0.7)] ${
                    isFeatured ? 'border-[#6d38de] shadow-[0_34px_54px_-38px_rgba(109,56,222,0.95)]' : 'border-[#eadcf7]'
                  }`}
                >
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] ${
                      isFeatured ? 'bg-[#6d38de] text-white' : 'bg-[#efe3ff] text-[#6d38de]'
                    }`}
                  >
                    {isCurrentPlan ? 'Current Plan' : formatPlanBadge(plan)}
                  </span>

                  <h3 className="mt-5 text-[1.7rem] font-bold tracking-[-0.04em] text-[#2a1842]">{plan.name}</h3>

                  <div className="mt-5 flex items-end gap-2">
                    <span className="text-[2.8rem] font-bold tracking-[-0.05em] text-[#2a1842]">{formatCurrency(plan.priceUsd)}</span>
                    <span className="pb-2 text-[1rem] text-[#6b5a88]">{formatBillingLabel(plan.durationDays)}</span>
                  </div>

                  <div className="mt-6 space-y-4 rounded-[22px] bg-[#faf6ff] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7c6d92]">Duration</span>
                      <span className="text-right text-[1rem] font-medium text-[#2a1842]">{formatDuration(plan.durationDays)}</span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7c6d92]">Renewal Option</span>
                      <span className="text-right text-[1rem] font-medium text-[#2a1842]">{formatRenewalLabel(plan.durationDays)}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7c6d92]">Premium Features Included</p>
                    <div className="mt-4 space-y-4">
                      {plan.features.map((feature) => (
                        <div key={`${plan.code}-${feature}`} className="flex items-center gap-3">
                          <CheckIcon />
                          <span className="text-[1rem] text-[#2a1842]">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleActivatePlan(plan.code)}
                    disabled={Boolean(submittingPlan)}
                    className={`mt-10 w-full rounded-[16px] px-5 py-4 text-[1.02rem] font-semibold transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70 ${
                      isFeatured
                        ? 'bg-[linear-gradient(135deg,#6d38de_0%,#8d66ef_100%)] text-white shadow-[0_24px_30px_-24px_rgba(109,56,222,0.95)]'
                        : 'bg-[#f2dfff] text-[#5d34df]'
                    }`}
                  >
                    {submittingPlan === plan.code ? 'Activating plan...' : isCurrentPlan ? 'Current Active Plan' : `Choose ${plan.name}`}
                  </button>
                </article>
              );
            })}
          </div>
        )}
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
                Prices, durations, premium features, and renewal timing are now loaded from the backend plan catalog.
              </p>
            </div>

            <div className="rounded-[20px] border border-[#efe3fb] bg-[#fffdfd] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7c6d92]">Expiry Outcome</p>
              <p className="mt-3 text-[0.98rem] leading-7 text-[#6b5a88]">
                Expired subscriptions automatically transition out of active status when the backend refresh runs.
              </p>
            </div>

            <div className="rounded-[20px] border border-[#efe3fb] bg-[#fffdfd] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7c6d92]">Latest Backend State</p>
              <p className="mt-3 text-[0.98rem] leading-7 text-[#6b5a88]">
                {latestHistory
                  ? `Latest record: ${latestHistory.plan ?? 'unknown'} (${latestHistory.status}) ending ${new Date(latestHistory.endDate).toLocaleDateString('en-US')}.`
                  : 'No subscription history has been created for this account yet.'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
