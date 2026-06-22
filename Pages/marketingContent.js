import {
  Shield,
  KeyRound,
  Gauge,
  ScrollText,
  Lock,
  BarChart3,
  Zap,
  RefreshCw,
  CheckCircle2,
  Clock,
  Globe,
} from './icons';

export const COMPANY = {
  name: 'Lethem',
  legalName: 'Lethem',
  website: 'https://lethem.app',
  supportEmail: 'support@lethem.app',
  billingEmail: 'billing@lethem.app',
  address: 'Operated online from India',
  jurisdiction: 'Bengaluru, Karnataka, India',
  lastUpdated: '22 June 2026',
  foundedYear: '2024',
  currency: 'USD',
};

export const NAV_LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Docs', href: '/#faq' },
];

export const LEGAL_LINKS = [
  { label: 'Terms and Conditions', href: '/terms-and-conditions' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Refund and Cancellation Policy', href: '/refund-and-cancellation-policy' },
  { label: 'Shipping / Delivery Policy', href: '/shipping-delivery-policy' },
  { label: 'Contact Us', href: 'mailto:support@lethem.app', external: true },
];

export const FEATURES = [
  {
    icon: KeyRound,
    title: 'Scoped Subkeys',
    text:
      'Exchange master provider API keys for revocable subkeys with per-team, per-customer, and per-vendor scopes.',
  },
  {
    icon: Gauge,
    title: 'Spend Controls',
    text:
      'Enforce token ceilings, max request counts, rate limits, expiry windows, and model allowlists on every subkey.',
  },
  {
    icon: BarChart3,
    title: 'Audit-Ready Logs',
    text:
      'Track requests, token usage, latency, provider errors, and estimated cost attribution across every call.',
  },
  {
    icon: Shield,
    title: 'Instant Revocation',
    text:
      'Kill compromised subkeys in seconds without rotating the underlying master key or waking a teammate.',
  },
  {
    icon: Lock,
    title: 'Model Allowlists',
    text:
      'Restrict which upstream models a subkey can reach — useful for customer-facing demos and production tiers.',
  },
  {
    icon: Zap,
    title: 'Latency-Aware Proxy',
    text:
      'Transparently proxy to OpenAI, Anthropic, and others with millisecond overhead and automatic failover.',
  },
];

export const PLANS = [
  {
    name: 'Free',
    price: '$0',
    cadence: 'forever',
    text: 'For evaluation and small internal projects.',
    features: [
      '1 project · 3 subkeys',
      '100k tokens / month',
      'Basic logs (7 day retention)',
      'Community email support',
    ],
    cta: 'Start free',
  },
  {
    name: 'Pro',
    price: '$19',
    cadence: '/ month',
    text: 'For production sharing with larger token and project limits.',
    features: [
      '5 projects · 50 subkeys',
      '5M tokens / month',
      'Full logs (90 day retention)',
      'Model allowlists',
      'Priority email support',
    ],
    highlight: true,
    cta: 'Start with Pro',
  },
  {
    name: 'Scale',
    price: '$99',
    cadence: '/ month',
    text: 'For teams needing higher limits and organization controls.',
    features: [
      'Unlimited projects · 500 subkeys',
      '50M tokens / month',
      'Full logs (1 year retention)',
      'Workspaces & role controls',
      'Priority Slack support',
    ],
    cta: 'Start with Scale',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    cadence: 'billed annually',
    text: 'For advanced governance, compliance, and dedicated support.',
    features: [
      'Unlimited everything',
      'SSO / SAML & SCIM',
      'Custom token pools',
      'Dedicated support',
      'Private deployment options',
    ],
    cta: 'Contact sales',
  },
];

export const METRICS = [
  { value: '<5ms', label: 'Proxy overhead per request' },
  { value: '1.2B+', label: 'Tokens governed monthly' },
  { value: '99.98%', label: 'Gateway uptime over 90 days' },
  { value: '40+', label: 'Upstream providers supported' },
];

export const STEPS = [
  {
    number: '01',
    icon: KeyRound,
    title: 'Import a master key',
    text:
      'Connect an upstream provider key once — OpenAI, Anthropic, Mistral, Google Vertex, and 40 more are supported out of the box.',
  },
  {
    number: '02',
    icon: Gauge,
    title: 'Issue scoped subkeys',
    text:
      'Generate lightweight subkeys with per-key token ceilings, rate limits, expiry windows, and model allowlists.',
  },
  {
    number: '03',
    icon: BarChart3,
    title: 'Ship to anyone',
    text:
      'Hand subkeys to vendors, customers, or internal services. Revoke, rotate, or restrict any subkey at any time.',
  },
];

export const TESTIMONIALS = [
  {
    quote:
      'We stopped sharing real OpenAI keys with vendors the day we deployed Lethem. Revoking a leaked subkey used to take an incident — now it is one click.',
    name: 'Aditya Rao',
    title: 'Head of Platform, Neura Health',
  },
  {
    quote:
      'Token budgets per subkey alone saved us from a runaway agent loop that would have cost thousands. The audit log paid for itself in a weekend.',
    name: 'Maya Chen',
    title: 'Staff Engineer, Forge AI',
  },
  {
    quote:
      'For security review, being able to scope which models a contractor subkey can call is genuinely game-changing for our compliance posture.',
    name: 'Dev Patel',
    title: 'CISO, Ledgermint',
  },
];

export const FAQS = [
  {
    q: 'Does Lethem store my raw provider API key?',
    a: 'Lethem holds the master provider key only long enough to proxy requests on your behalf — keys are encrypted at rest and never exposed through subkeys or logs. Subkeys are derived credentials that carry no copy of the master key material.',
  },
  {
    q: 'Can I revoke a subkey without rotating the master key?',
    a: 'Yes. Revocation is instant and isolated — killing a subkey takes effect within seconds and never requires you to touch the underlying provider key or reissue other subkeys.',
  },
  {
    q: 'How is usage billed?',
    a: 'Lethem itself is billed by subscription tier (tokens and features per plan). Upstream provider usage continues to be billed by your provider — Lethem acts as a governed proxy in front of your existing accounts.',
  },
  {
    q: 'Which payment methods do you support?',
    a: 'Payments are processed by Razorpay. We support major credit and debit cards (Visa, Mastercard, American Express), UPI, net banking, and select wallets. International card payments are supported where Razorpay permits.',
  },
  {
    q: 'Can I cancel my subscription at any time?',
    a: 'Yes — you can cancel from the billing console at any time and cancellation prevents future renewals. Refund eligibility is described in our Refund and Cancellation Policy.',
  },
  {
    q: 'Do you support team and enterprise access?',
    a: 'Yes. The Scale plan adds workspaces and role controls. Enterprise adds SSO/SAML, SCIM provisioning, custom token pools, private deployment options, and dedicated support.',
  },
];

export const POLICY_BADGES = [
  { icon: ScrollText, label: 'Clear terms' },
  { icon: RefreshCw, label: 'Easy cancellation' },
  { icon: CheckCircle2, label: 'Razorpay compliant' },
  { icon: Clock, label: 'Instant revocation' },
  { icon: Globe, label: 'International payments' },
  { icon: Lock, label: 'Encrypted at rest' },
];

export const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/m2z-ahmed/KeyGate_Frontend' },
  { label: 'X', href: 'https://x.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
];
