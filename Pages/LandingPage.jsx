import { useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Shield,
  Sparkles,
  Star,
  Lock,
  Github,
  Zap,
  Globe,
} from './icons';
import PublicLayout from './PublicLayout';
import {
  COMPANY,
  FEATURES,
  PLANS,
  METRICS,
  STEPS,
  TESTIMONIALS,
  FAQS,
} from './marketingContent';


export default function LandingPage() {
  const go = (path) => { window.history.pushState({}, '', path); window.dispatchEvent(new Event('popstate')); };

  return (
    <PublicLayout>
      <Hero go={go} />
      <Logos />
      <MetricsBar />
      <Features />
      <HowItWorks />
      <Pricing go={go} />
      <Testimonials />
      <Faq />
      <CtaBand go={go} />
    </PublicLayout>
  );
}

function Hero({ go }) {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundColor: '#f8fafc',
          backgroundImage:
            'radial-gradient(circle at 20% 0%, rgba(15,23,42,0.06), transparent 40%), radial-gradient(circle at 80% 10%, rgba(56,189,248,0.10), transparent 35%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at top, black 30%, transparent 70%)',
        }}
      />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pb-24 lg:pt-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/60 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              New: token budgets per subkey &amp; model allowlists
            </div>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Share API access without sharing your real keys.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              {COMPANY.name} converts master provider keys into scoped subkeys with revocation,
              rate limits, token budgets, expiry controls, and full request analytics — all behind
              one transparent proxy.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => go('/console')}
                className="group inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-lg"
              >
                Launch console
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => go('/#pricing')}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800 transition-all hover:border-slate-400 hover:bg-slate-50"
              >
                View pricing
              </button>
            </div>
            <div className="mt-6 flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-500" />
                No credit card to start
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-500" />
                Free tier forever
              </div>
              <div className="hidden items-center gap-1.5 sm:flex">
                <Check className="h-4 w-4 text-emerald-500" />
                Cancel anytime
              </div>
            </div>
          </div>

          <HeroCard />
        </div>
      </div>
    </section>
  );
}

function HeroCard() {
  return (
    <div className="relative">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-sky-200/40 blur-2xl" />
      <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-emerald-200/40 blur-2xl" />
      <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/30">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Shield className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-slate-900">Live governance</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Healthy
          </span>
        </div>
        <div className="mt-4 space-y-3">
          {[
            ['k_live_openai_•••• 9f3a', 'Production', '3.2M / 5M tokens', 64],
            ['k_live_anthropic_•••• 1c2b', 'Forge AI', '1.1M / 2M tokens', 55],
            ['k_live_vertex_•••• 7e44', 'Neura Health', '0.4M / 1M tokens', 40],
            ['k_live_mistral_•••• 02dd', 'Demo (vendor)', '12k / 50k tokens', 24],
          ].map(([name, project, usage, pct], i) => (
            <div key={i} className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
              <div className="flex items-center justify-between">
                <code className="text-[11px] text-slate-700">{name}</code>
                <span className="text-[11px] font-medium text-slate-500">{project}</span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-slate-900 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[11px] tabular-nums text-slate-600">{usage}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
          {[
            ['1,247', 'requests today'],
            ['4.7M', 'tokens today'],
            ['42ms', 'p50 latency'],
          ].map(([val, label]) => (
            <div key={label}>
              <div className="text-lg font-semibold text-slate-900">{val}</div>
              <div className="text-[11px] text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Logos() {
  return (
    <section className="border-y border-slate-200 bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-slate-500">
          Works with your existing providers
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-slate-400">
          {['OpenAI', 'Anthropic', 'Google Vertex', 'Mistral', 'Cohere', 'Together AI', 'Groq', 'Perplexity'].map(
            (p) => (
              <span key={p} className="text-sm font-semibold transition-colors hover:text-slate-700">
                {p}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

function MetricsBar() {
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.label} className="text-center">
              <div className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {m.value}
              </div>
              <div className="mt-1 text-sm text-slate-600">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="text-xs font-semibold uppercase tracking-widest text-sky-600">{eyebrow}</div>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-slate-600">{subtitle}</p>}
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Capabilities"
          title="Everything you need to govern API access"
          subtitle="Your master keys stay behind the gateway. Everyone else gets scoped subkeys with the limits you choose."
        />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <article
                key={f.title}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 text-white transition-transform group-hover:scale-105">
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="How it works"
          title="From master key to governed subkeys in three steps"
        />
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.number} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="absolute left-[3.5rem] top-7 hidden h-px w-[calc(100%-3.5rem)] bg-gradient-to-r from-slate-300 to-transparent md:block" />
                )}
                <div className="flex items-start gap-4">
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
                    <Icon className="h-6 w-6 text-slate-900" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                      {s.number}
                    </span>
                  </div>
                  <div>
                    <h3 className="mt-1 text-base font-semibold text-slate-900">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{s.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Pricing({ go }) {
  const renderFeature = (feature, highlighted) => {
    const text = typeof feature === 'string' ? feature : feature.text;
    const tooltip = typeof feature === 'string' ? '' : feature.tooltip;

    return (
      <span className={highlighted ? 'text-slate-200' : 'text-slate-700'}>
        {tooltip ? (
          <span className="fair-usage-tooltip" data-tooltip={tooltip} tabIndex={0}>
            {text}
          </span>
        ) : (
          text
        )}
      </span>
    );
  };

  return (
    <section id="pricing" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Pricing"
          title="Simple, subscription-based pricing"
          subtitle="Pricing is billed monthly. INR plan charges are processed securely via Razorpay."
        />
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-xl border p-6 transition-all ${
                plan.highlight
                  ? 'border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-300 lg:-mt-3 lg:mb-3'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {plan.highlight && (
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-900">
                  <Star className="h-3 w-3 fill-current" />
                  {plan.badge || 'Most Popular'}
                </span>
              )}
              <h3
                className={`text-sm font-semibold uppercase tracking-wide ${
                  plan.highlight ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {plan.name}
              </h3>
              <p className={`mt-3 text-sm leading-relaxed ${plan.highlight ? 'text-slate-300' : 'text-slate-600'}`}>
                {plan.text}
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                <span className={`text-sm ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>
                  {plan.cadence}
                </span>
              </div>
              <p className={`mt-2 text-xs ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>
                {plan.note}
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {plan.features.map((feat) => {
                  const key = typeof feat === 'string' ? feat : feat.text;
                  return (
                    <li key={key} className="flex items-start gap-2">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          plan.highlight ? 'text-emerald-400' : 'text-emerald-500'
                        }`}
                      />
                      {renderFeature(feat, plan.highlight)}
                    </li>
                  );
                })}
              </ul>
              <button
                onClick={() => !plan.current && go('/console')}
                disabled={plan.current}
                aria-disabled={plan.current ? 'true' : undefined}
                className={`mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  plan.current
                    ? 'bg-slate-100 text-slate-500'
                    : plan.highlight
                      ? 'bg-white text-slate-900 hover:bg-slate-100'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {plan.cta}
              </button>
            </article>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-slate-500">
          All plans include instant revocation, audit-ready logs, and encrypted master keys. Need a
          private deployment or custom terms?{' '}
          <button onClick={() => (window.location.href = 'mailto:support@lethem.app')} className="font-medium text-slate-700 underline-offset-2 hover:underline">
            Talk to us
          </button>
          .
        </p>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Customers" title="Teams ship API access with confidence" />
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-3 flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-slate-700">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                  {t.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.title}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="FAQ" title="Frequently asked questions" />
        <div className="mt-12 divide-y divide-slate-200 rounded-xl border border-slate-200">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-slate-900">{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid overflow-hidden px-5 transition-all duration-300 ${
                    isOpen ? 'grid-rows-[1fr] pb-4' : 'grid-rows-[0fr]'
                  }`}
                >
                  <p className="overflow-hidden text-sm leading-relaxed text-slate-600">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            Still have questions?{' '}
            <button
              onClick={() => (window.location.href = `mailto:${COMPANY.supportEmail}`)}
              className="font-medium text-slate-900 underline-offset-2 hover:underline"
            >
              Email us
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}

function CtaBand({ go }) {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 px-8 py-12 text-center shadow-xl sm:px-16 sm:py-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, rgba(56,189,248,0.4), transparent 40%), radial-gradient(circle at 80% 80%, rgba(16,185,129,0.3), transparent 40%)',
            }}
          />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              Ship in minutes
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Stop sharing raw API keys today.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-300">
              Create a free account, import your first provider key, and issue a scoped subkey in
              under five minutes. No credit card required.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => go('/console')}
                className="group inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-slate-900 transition-all hover:bg-slate-100"
              >
                Launch console
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => go('/terms-and-conditions')}
                className="inline-flex items-center gap-2 rounded-lg border border-white bg-white px-5 py-3 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100"
              >
                View policies
              </button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" /> Encrypted master keys
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" /> International payments via Razorpay
              </span>
              <span className="flex items-center gap-1.5">
                <Github className="h-3.5 w-3.5" /> Open about how it works
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
