import { useEffect, useState } from 'react';
import { Shield, Mail, ChevronRight, FileText } from './icons';
import PublicLayout from './PublicLayout';
import { LEGAL_LINKS, COMPANY } from './marketingContent';
import { POLICIES } from './legalContent';


export default function PolicyPage({ type, policyKey }) {
  policyKey = policyKey || type || 'terms';
  const go = (path) => { window.history.pushState({}, '', path); window.dispatchEvent(new Event('popstate')); };
  const doc = POLICIES[policyKey];
  const [active, setActive] = useState('');

  useEffect(() => {
    const headings = doc.sections
      .map((_s, i) => document.getElementById(`sec-${i}`))
      .filter(Boolean);
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-100px 0px -70% 0px', threshold: [0, 1] },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [doc]);

  const toc = doc.sections.map((section, i) => ({ id: `sec-${i}`, title: section.title }));

  return (
    <PublicLayout compact>
      <section className="bg-slate-50 pb-20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <button onClick={() => go('/')} className="hover:text-slate-800">
              Home
            </button>
            <ChevronRight className="h-3 w-3" />
            <button onClick={() => go('/terms-and-conditions')} className="hover:text-slate-800">
              Legal
            </button>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-slate-700">{doc.title}</span>
          </nav>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_18rem]">
            <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-sky-600">
                <FileText className="h-3.5 w-3.5" />
                {doc.eyebrow}
              </div>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {doc.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                <span>Last updated: {doc.lastUpdated}</span>
                <span className="hidden sm:inline">·</span>
                <span className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5 text-emerald-500" />
                  Razorpay-compliant
                </span>
              </div>

              <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                {doc.intro}
              </div>

              <div className="mt-8 space-y-8">
                {doc.sections.map((section, i) => (
                  <section
                    key={i}
                    id={`sec-${i}`}
                    className="scroll-mt-24 border-l-2 border-transparent transition-colors data-[active=true]:border-sky-500"
                  >
                    <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">{section.title}</h2>
                    <div className="mt-3 space-y-3">
                      {section.body.map((para, j) => (
                        <p key={j} className="text-sm leading-relaxed text-slate-700">
                          {para}
                        </p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-sm font-semibold text-slate-900">Questions about this policy?</h3>
                <p className="mt-2 text-sm text-slate-600">
                  We respond within two business days. For billing-specific questions, contact{' '}
                  <a
                    href={`mailto:${COMPANY.billingEmail}`}
                    className="font-medium text-slate-900 underline-offset-2 hover:underline"
                  >
                    {COMPANY.billingEmail}
                  </a>
                  . For general questions, contact{' '}
                  <a
                    href={`mailto:${COMPANY.supportEmail}`}
                    className="font-medium text-slate-900 underline-offset-2 hover:underline"
                  >
                    {COMPANY.supportEmail}
                  </a>
                  .
                </p>
                <a
                  href={`mailto:${COMPANY.supportEmail}`}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                >
                  <Mail className="h-4 w-4" />
                  Contact support
                </a>
              </div>
            </article>

            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    On this page
                  </h3>
                  <ul className="mt-3 space-y-1 text-sm">
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document
                              .getElementById(item.id)
                              ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          className={`block rounded-md px-2 py-1.5 transition-colors ${
                            active === item.id
                              ? 'bg-slate-100 font-medium text-slate-900'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Other policies
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm">
                    {LEGAL_LINKS.filter(
                      (l) => l.href !== `/${doc.slug}` && l.href !== '/contact',
                    ).map((link) => (
                      <li key={link.href}>
                        <button
                          onClick={() => go(link.href)}
                          className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                        >
                          {link.label}
                          <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
