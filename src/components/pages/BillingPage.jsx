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