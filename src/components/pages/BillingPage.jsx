import { useEffect, useMemo, useState } from 'react';

const loadRazorpayScript = () => new Promise((resolve, reject) => {
  if (window.Razorpay) return resolve(true);
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  script.onload = () => resolve(true);
  script.onerror = () => reject(new Error('Failed to load Razorpay Checkout'));
  document.body.appendChild(script);
});

const readStoredSubscriptionDetails = () => {
  try { return JSON.parse(localStorage.getItem('lethem_subscription_details') || 'null'); }
  catch { return null; }
};

const writeStoredSubscriptionDetails = (data) => {
  try {
    const detailOnly = {
      currentPlan: data.currentPlan,
      subscriptionId: data.subscriptionId,
      subscriptionStatus: data.subscriptionStatus,
      currency: data.currency,
      testMode: data.testMode,
      plan: (data.plans || []).find((plan) => plan.id === data.currentPlan) || null,
    };
    localStorage.setItem('lethem_subscription_details', JSON.stringify(detailOnly));
  } catch (_) {}
};

export default function BillingPage({ ctx, onBack }) {
  const { api, notify, loadBilling, setBilling: setCtxBilling } = ctx;
  const [billing, setBilling] = useState(null);
  const [storedDetails, setStoredDetails] = useState(readStoredSubscriptionDetails());
  const [busyPlan, setBusyPlan] = useState('');

  useEffect(() => {
    (loadBilling ? loadBilling() : api('/api/billing/plans'))
      .then((data) => { setBilling(data); setCtxBilling?.(data); writeStoredSubscriptionDetails(data); setStoredDetails(readStoredSubscriptionDetails()); })
      .catch((e) => notify(e.message, 'error'));
  }, []);

  const plans = useMemo(() => billing?.plans || [], [billing]);
  const currentPlan = plans.find((plan) => plan.id === billing?.currentPlan) || storedDetails?.plan;

  const startCheckout = async (plan) => {
    if (plan.id === 'free') return;
    if (!billing?.keyId) {
      notify('Razorpay key is missing. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET on the backend.', 'error');
      return;
    }
    setBusyPlan(plan.id);
    try {
      await loadRazorpayScript();
      const sub = await api('/api/billing/subscriptions', { method: 'POST', body: { planId: plan.id } });
      const rz = new window.Razorpay({
        key: sub.keyId || billing.keyId,
        name: 'Lethem',
        description: `${plan.name} account subscription`,
        subscription_id: sub.subscriptionId,
        notes: { plan: plan.id },
        theme: { color: '#7c3aed' },
        handler: async (response) => {
          await api('/api/billing/verify', { method: 'POST', body: { ...response, planId: plan.id } });
          const fresh = loadBilling ? await loadBilling({ refresh: true }) : await api('/api/billing/plans');
          setBilling(fresh);
          setCtxBilling?.(fresh);
          writeStoredSubscriptionDetails(fresh);
          setStoredDetails(readStoredSubscriptionDetails());
          notify(`You're now on ${plan.name}`);
        },
        modal: { ondismiss: () => setBusyPlan('') },
      });
      rz.open();
    } catch (e) {
      notify(e.message || 'Unable to start checkout', 'error');
    } finally {
      setBusyPlan('');
    }
  };

  if (!billing && !storedDetails) return <div className='card'>Loading billing plans…</div>;

  return (
    <div className='billing-page account-billing-page'>
      {onBack && <button className='btn btn-ghost btn-sm billing-back' onClick={onBack}>← Back to previous page</button>}
      <div className='page-head billing-hero'>
        <div>
          <span className='eyebrow'>Account subscription</span>
          <h1>Plans & Billing</h1>
          <p>Subscriptions are account-level, not project-level. Upgrade once and your plan limits apply across your Lethem workspace.</p>
        </div>
        <span className='badge active'>{billing?.testMode ?? storedDetails?.testMode ? 'Razorpay test mode' : 'Razorpay live mode'}</span>
      </div>
      <div className='billing-current card billing-current-premium'>
        <div><div className='muted'>Current plan</div><strong>{currentPlan?.name || billing?.currentPlan || storedDetails?.currentPlan || 'Free'}</strong></div>
        <div><div className='muted'>Subscription</div><strong>{billing?.subscriptionStatus || storedDetails?.subscriptionStatus || 'Refreshing…'}</strong><small>Status is fetched live, plan details are cached locally.</small></div>
        <div><div className='muted'>Subscription ID</div><strong className='mono'>{billing?.subscriptionId || storedDetails?.subscriptionId || '—'}</strong></div>
        <div><div className='muted'>Currency charged</div><strong>{billing?.currency || storedDetails?.currency || 'INR'}</strong></div>
      </div>
      <div className='pricing-grid pricing-grid-premium'>
        {plans.map((plan) => (
          <div key={plan.id} className={`card pricing-card premium-pricing-card ${plan.popular ? 'popular' : ''}`}>
            {plan.popular && <div className='popular-ribbon'>Most Popular</div>}
            <div className='pricing-card-top'>
              <h2>{plan.name}</h2>
              <p>{plan.description}</p>
            </div>
            <div className='price-line'><span>${plan.monthlyUsd}</span><small>/month</small></div>
            <div className='inr-line'>{plan.monthlyInr ? `₹${plan.monthlyInr.toLocaleString('en-IN')} charged via Razorpay` : 'No payment required'}</div>
            <ul className='pricing-features'>
              {plan.features.map((f) => <li key={f} title={String(f).startsWith('*Unlimited Projects') ? 'Subject to fair usage' : undefined}>✓ {f}</li>)}
            </ul>
            <button className={`btn ${plan.popular ? 'btn-primary' : 'btn-ghost'} btn-block`} disabled={plan.id === billing?.currentPlan || busyPlan === plan.id} onClick={() => startCheckout(plan)}>
              {plan.id === billing?.currentPlan ? 'Current plan' : plan.id === 'free' ? 'Included' : busyPlan === plan.id ? 'Opening checkout…' : `Upgrade to ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
