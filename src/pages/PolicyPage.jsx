import PublicLayout from './PublicLayout';
import { POLICIES } from '../lib/legalContent';

export default function PolicyPage({ type, go }) {
  const policy = POLICIES[type] || POLICIES.terms;

  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-700">{policy.eyebrow}</span>
          <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-slate-900">{policy.title}</h1>
          <p className="mt-2 text-sm text-slate-500">Last updated: {policy.lastUpdated}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-600">
          {policy.intro}
        </div>

        <div className="mt-10 space-y-10">
          {policy.sections.map((section, i) => (
            <section key={i}>
              <h2 className="font-heading text-xl font-bold text-slate-900">{section.title}</h2>
              <div className="mt-3 space-y-3">
                {section.body.map((para, j) => (
                  <p key={j} className="text-sm leading-relaxed text-slate-600">{para}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 border-t border-slate-200 pt-8 text-center">
          <button onClick={() => go('/')} className="text-sm font-medium text-slate-600 hover:text-slate-900">← Back to home</button>
        </div>
      </div>
    </PublicLayout>
  );
}