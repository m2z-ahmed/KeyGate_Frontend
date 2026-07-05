import { useState } from 'react';
import PublicLayout from './PublicLayout';
import { COMPANY, FEATURES, PLANS, METRICS, STEPS, TESTIMONIALS, FAQS } from '../lib/marketingContent';
import { ArrowRight, Check, ChevronDown, Sparkles, Star } from 'lucide-react';

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-700">{eyebrow}</span>}
      <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base text-slate-600">{subtitle}</p>}
    </div>
  );
}

export default function LandingPage({ go }) {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
              <Sparkles size={13} /> New: token budgets per subkey & model allowlists
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl">
              Share API access without<br />sharing your real keys.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">
              {COMPANY.name} converts master provider keys into scoped subkeys with revocation, rate limits, token budgets, expiry controls, and full request analytics — all behind one transparent proxy.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button onClick={() => go('/console')} className="group inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-lg">
                Get started <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <button onClick={() => go('/#pricing')} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-800 transition-all hover:border-slate-400 hover:bg-slate-50">
                View pricing
              </button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><Check size={14} className="text-green-600" /> No credit card to start</span>
              <span className="flex items-center gap-1.5"><Check size={14} className="text-green-600" /> Free tier forever</span>
              <span className="flex items-center gap-1.5"><Check size={14} className="text-green-600" /> Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="border-y border-slate-100 bg-slate-50/50 py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-xs font-medium uppercase tracking-wide text-slate-500">Works with your existing providers</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {['OpenAI', 'Anthropic', 'Google Vertex', 'Mistral', 'Cohere', 'Together AI', 'Groq', 'Perplexity'].map((p) => (
              <span key={p} className="text-sm font-semibold text-slate-400">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {METRICS.map((m) => (
              <div key={m.label} className="text-center">
                <div className="font-heading text-3xl font-bold text-slate-900">{m.value}</div>
                <div className="mt-1 text-sm text-slate-500">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader eyebrow="Features" title="Everything you need to govern API access" subtitle="From encrypted master keys to per-subkey spend ceilings, Lethem gives you security and visibility without the ops burden." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-violet-200 hover:shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><f.icon size={20} /></div>
                <h3 className="mt-4 font-heading text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50/50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader eyebrow="How it works" title="Ship governed API access in three steps" />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white font-heading font-bold">{s.number}</div>
                <div className="mt-4 flex items-center gap-2"><s.icon size={18} className="text-violet-600" /><h3 className="font-heading text-lg font-bold">{s.title}</h3></div>
                <p className="mt-2 text-sm text-slate-600">{s.text}</p>
                {i < STEPS.length - 1 && <div className="absolute -right-4 top-5 hidden text-slate-300 md:block"><ArrowRight size={20} /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader eyebrow="Pricing" title="Simple, transparent pricing" subtitle="Start free. Upgrade when you need more projects, subkeys, or tokens." />
          <div className="mt-12 grid gap-6 lg:grid-cols-4">
            {PLANS.map((plan) => (
              <div key={plan.id} className={`relative flex flex-col rounded-2xl border p-6 transition-all ${plan.highlight ? 'border-violet-300 bg-white shadow-xl ring-2 ring-violet-500/20' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                {plan.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">{plan.badge}</div>}
                <h3 className="font-heading text-lg font-bold">{plan.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{plan.text}</p>
                <div className="mt-4"><span className="font-heading text-4xl font-bold">{plan.price}</span><span className="text-sm text-slate-500">{plan.cadence}</span></div>
                <div className="mt-1 text-xs text-slate-500">{plan.note}</div>
                <ul className="mt-5 flex-1 space-y-2">
                  {plan.features.map((f) => <li key={f} className="flex items-start gap-2 text-sm"><Check size={16} className="mt-0.5 shrink-0 text-green-600" /><span className="text-slate-700">{f}</span></li>)}
                </ul>
                <button onClick={() => go('/console')} className={`mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${plan.highlight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'border border-slate-300 text-slate-900 hover:bg-slate-50'}`}>Get started</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50/50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader eyebrow="Customers" title="Loved by security-conscious teams" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex gap-0.5 text-amber-400">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div>
                <p className="mt-3 text-sm text-slate-700">“{t.quote}”</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">{t.name.split(' ').map((n) => n[0]).join('')}</div>
                  <div><div className="text-sm font-semibold">{t.name}</div><div className="text-xs text-slate-500">{t.title}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionHeader eyebrow="FAQ" title="Frequently asked questions" />
          <div className="mt-10 space-y-3">
            {FAQS.map((item, i) => <FaqItem key={i} item={item} />)}
          </div>
          <p className="mt-8 text-center text-sm text-slate-600">Still have questions? <a href={`mailto:${COMPANY.supportEmail}`} className="font-medium text-slate-900 underline-offset-2 hover:underline">Email us</a></p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-16 text-center">
            <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-violet-500/30 blur-3xl" />
            <div className="relative">
              <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">Stop sharing raw API keys today.</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-slate-300">Create a free account, import your first provider key, and issue a scoped subkey in under five minutes. No credit card required.</p>
              <button onClick={() => go('/console')} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100">Get started <ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
        <span className="text-sm font-semibold text-slate-900">{item.q}</span>
        <ChevronDown size={18} className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="px-5 pb-4 text-sm text-slate-600">{item.a}</p>}
    </div>
  );
}