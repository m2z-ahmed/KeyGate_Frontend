import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Check, Star, Loader2 } from 'lucide-react';

export default function BillingPage({ onBack }: { onBack?: () => void }) {
  const { api, notify, loadBilling, setBilling } = useApp();
  const [billing, setBillingState] = useState<any>(null);
  const [busyPlan, setBusyPlan] = useState('');

  useEffect(() => {
    loadBilling().then((data) => setBillingState(data)).catch((e) => notify(e.message, 'error'));
  }, []);

  const plans = useMemo(() => billing?.plans || [], [billing]);
  const currentPlan = plans.find((plan: any) => plan.id === billing?.currentPlan);

  const startCheckout = async (plan: any) => {
    if (plan.id === 'free') return;
    if (!billing?.keyId) { notify('Razorpay key is missing. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET on the backend.', 'error'); return; }
    setBusyPlan(plan.id);
    try {
      // Load Razorpay script
      if (!(window as any).Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Razorpay Checkout'));
          document.body.appendChild(script);
        });
      }
      const sub = await api('/api/billing/subscriptions', { method: 'POST', body: { planId: plan.id } });
      const rz = new (window as any).Razorpay({
        key: sub.keyId || billing.keyId, name: 'KeyGate', description: `${plan.name} account subscription`,
        subscription_id: sub.subscriptionId, notes: { plan: plan.id }, theme: { color: '#14b8a6' },
        handler: async (response: any) => {
          await api('/api/billing/verify', { method: 'POST', body: { ...response, planId: plan.id } });
          const fresh = await loadBilling({ refresh: true });
          setBillingState(fresh); setBilling?.(fresh);
          notify(`You're now on ${plan.name}`);
        },
        modal: { ondismiss: () => setBusyPlan('') },
      });
      rz.open();
    } catch (e: any) { notify(e.message || 'Unable to start checkout', 'error'); }
    finally { setBusyPlan(''); }
  };

  if (!billing) return <div className="p-8 text-center text-gray-500">Loading billing plans…</div>;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {onBack && <button onClick={onBack} className="btn btn-ghost text-xs mb-4">← Back to previous page</button>}
      <div className="mb-6">
        <div className="text-xs font-medium text-primary-400 uppercase tracking-wider mb-2">Account subscription</div>
        <h1 className="text-2xl font-bold text-gray-100 mb-2">Plans & Billing</h1>
        <p className="text-sm text-gray-500">Subscriptions are account-level, not project-level. Upgrade once and your plan limits apply across your KeyGate workspace.</p>
      </div>

      {/* Current plan */}
      <div className="card p-5 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><div className="text-xs text-gray-500 mb-1">Current plan</div><div className="text-sm font-semibold text-gray-100">{currentPlan?.name || billing.currentPlan || 'Free'}</div></div>
          <div><div className="text-xs text-gray-500 mb-1">Subscription</div><div className="text-sm font-semibold text-gray-100">{billing.subscriptionStatus || 'Refreshing…'}</div></div>
          <div><div className="text-xs text-gray-500 mb-1">Subscription ID</div><div className="text-sm font-mono text-gray-100 truncate">{billing.subscriptionId || '—'}</div></div>
          <div><div className="text-xs text-gray-500 mb-1">Currency</div><div className="text-sm font-semibold text-gray-100">{billing.currency || 'INR'}</div></div>
        </div>
      </div>

      {/* Pricing grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan: any) => (
          <div key={plan.id} className={`card p-6 relative ${plan.popular ? 'border-primary-500/40' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary-500 text-base-950 text-xs font-semibold flex items-center gap-1">
                <Star size={12} /> Most Popular
              </div>
            )}
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-100 mb-1">{plan.name}</h2>
              <p className="text-xs text-gray-500">{plan.description}</p>
            </div>
            <div className="mb-1"><span className="text-3xl font-bold text-gray-100">${plan.monthlyUsd}</span><span className="text-sm text-gray-500">/month</span></div>
            <div className="text-xs text-gray-500 mb-5">{plan.monthlyInr ? `₹${plan.monthlyInr.toLocaleString('en-IN')} charged via Razorpay` : 'No payment required'}</div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f: string) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-success-400 flex-shrink-0 mt-0.5" /> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => startCheckout(plan)}
              disabled={plan.id === billing.currentPlan || busyPlan === plan.id}
              className={`btn w-full ${plan.popular ? 'btn-primary' : 'btn-ghost'} border border-base-700`}
            >
              {plan.id === billing.currentPlan ? 'Current plan' : plan.id === 'free' ? 'Included' : busyPlan === plan.id ? <Loader2 size={16} className="animate-spin" /> : `Upgrade to ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
