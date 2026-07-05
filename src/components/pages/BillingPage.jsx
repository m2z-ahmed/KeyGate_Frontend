import { useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, Button, Badge, cn } from '../kit';
import { CreditCard, Check, ArrowLeft, Sparkles } from 'lucide-react';

const loadRazorpayScript = () => new Promise((resolve, reject) => {
  if (window.Razorpay) return resolve(true);
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  script.onload = () => resolve(true);
  script.onerror = () => reject(new Error('Failed to load Razorpay Checkout'));
  document.body.appendChild(script);
});

const readStoredSubscriptionDetails = () => { try { return JSON.parse(localStorage.getItem('lethem_subscription_details') || 'null'); } catch { return null; } };
const writeStoredSubscriptionDetails = (data) => { try { const d = { currentPlan: data.currentPlan, subscriptionId: data.subscriptionId, subscriptionStatus: data.subscriptionStatus, currency: data.currency, testMode: data.testMode, plan: (data.plans || []).find((p) => p.id === data.currentPlan) || null }; localStorage.setItem('lethem_subscription_details', JSON.stringify(d)); } catch (_) {} };

export default function BillingPage({ ctx, onBack }) {
  const { api, notify, loadBilling, setBilling: setCtxBilling } = ctx;
  const [billing, setBilling] = useState(null);
  const [storedDetails, setStoredDetails] = useState(readStoredSubscriptionDetails());
  const [busyPlan, setBusyPlan] = useState('');

  useEffect(() => {
    (loadBilling ? loadBilling() : api('/api/billing/plans')).then((data) => { setBilling(data); setCtxBilling?.(data); writeStoredSubscriptionDetails(data); setStoredDetails(readStoredSubscriptionDetails()); }).catch((e) => notify(e.message, 'error'));
  }, []);

  const plans = useMemo(() => billing?.plans || [], [billing]);
  const currentPlan = plans.find((p) => p.id === billing?.currentPlan) || storedDetails?.plan;

  const startCheckout = async (plan) => {
    if (plan.id === 'free') return;
    if (!billing?.keyId) { notify('Razorpay key is missing. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET on the backend.', 'error'); return; }
    setBusyPlan(plan.id);
    try {
      await loadRazorpayScript();
      const sub = await api('/api/billing/subscriptions', { method: 'POST', body: { planId: plan.id } });
      const rz = new window.Razorpay({
        key: sub.keyId || billing.keyId, name: 'Lethem', description: `${plan.name} account subscription`, subscription_id: sub.subscriptionId, notes: { plan: plan.id }, theme: { color: '#7c3aed' },
        handler: async (response) => {
          await api('/api/billing/verify', { method: 'POST', body: { ...response, planId: plan.id } });
          const fresh = loadBilling ? await loadBilling({ refresh: true }) : await api('/api/billing/plans');
          setBilling(fresh); setCtxBilling?.(fresh); writeStoredSubscriptionDetails(fresh); setStoredDetails(readStoredSubscriptionDetails()); notify(`You're now on ${plan.name}`);
        },
        modal: { ondismiss: () => setBusyPlan('') },
      });
      rz.open();
    } catch (e) { notify(e.message || 'Unable to start checkout', 'error'); }
    finally { setBusyPlan(''); }
  };

  if (!billing && !storedDetails) return <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">Loading billing plans…</div>;

  return (
    <div>
      <div className="mb-6">
        {onBack && <Button variant="ghost" size="sm" onClick={onBack} className="mb-3"><ArrowLeft size={15} /> Back</Button>}
        <h1 className="font-heading text-2xl font-bold tracking-tight text-gradient">Plans & Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">Subscriptions are account-level, not project-level. Upgrade once and your plan limits apply across your Lethem workspace.</p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4"><div className="text-xs text-muted-foreground">Current plan</div><div className="mt-1 font-semibold">{currentPlan?.name || billing?.currentPlan || storedDetails?.currentPlan || 'Free'}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Subscription</div><div className="mt-1 font-semibold">{billing?.subscriptionStatus || storedDetails?.subscriptionStatus || 'Refreshing…'}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Subscription ID</div><div className="mt-1 truncate font-mono text-xs">{billing?.subscriptionId || storedDetails?.subscriptionId || '—'}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Currency</div><div className="mt-1 font-semibold">{billing?.currency || storedDetails?.currency || 'INR'} <span className="ml-1 text-xs text-muted-foreground">{billing?.testMode ?? storedDetails?.testMode ? '(test)' : '(live)'}</span></div></Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => {
          const isCurrent = plan.id === billing?.currentPlan;
          return (
            <Card key={plan.id} className={cn('relative flex flex-col p-5 transition-all', plan.popular ? 'border-primary/50 shadow-lg shadow-primary/10' : 'hover:border-primary/30')}>
              {plan.popular && <div className="absolute -top-2.5 left-1/2 -translate-x-1/2"><Badge tone="primary"><Sparkles size={11} /> Most Popular</Badge></div>}
              <h3 className="font-heading text-lg font-bold">{plan.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{plan.description}</p>
              <div className="mt-4"><span className="font-heading text-3xl font-bold">${plan.monthlyUsd}</span><span className="text-sm text-muted-foreground">/month</span></div>
              <div className="mt-1 text-xs text-muted-foreground">{plan.monthlyInr ? `₹${plan.monthlyInr.toLocaleString('en-IN')} charged via Razorpay` : 'No payment required'}</div>
              <ul className="mt-4 flex-1 space-y-2">
                {plan.features.map((f, i) => <li key={i} className="flex items-start gap-2 text-xs"><Check size={14} className="mt-0.5 shrink-0 text-success" /><span>{f}</span></li>)}
              </ul>
              <Button className="mt-5 w-full" variant={isCurrent ? 'secondary' : 'primary'} disabled={isCurrent || (plan.id !== 'free' && busyPlan === plan.id)} onClick={() => startCheckout(plan)}>
                {isCurrent ? 'Current plan' : plan.id === 'free' ? 'Included' : busyPlan === plan.id ? 'Opening checkout…' : `Upgrade to ${plan.name}`}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}