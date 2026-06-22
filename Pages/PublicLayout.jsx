import { useState, useEffect } from 'react';
import { Menu, X, Shield, ChevronRight } from './icons';
import { COMPANY, LEGAL_LINKS, NAV_LINKS, SOCIAL_LINKS } from './marketingContent';


export default function PublicLayout({ children, compact = false }) {
  const [path, setPath] = useState(() => window.location.pathname);
  const go = (to) => {
    if (to.startsWith('/#')) {
      const id = to.slice(2);
      if (window.location.pathname !== '/') { window.history.pushState({}, '', '/'); window.dispatchEvent(new Event('popstate')); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30); }
      else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (/^(https?:|mailto:)/.test(to)) { window.open(to, to.startsWith('mailto:') ? '_self' : '_blank', 'noopener'); return; }
    window.history.pushState({}, '', to); window.dispatchEvent(new Event('popstate')); window.scrollTo({ top: 0 }); setPath(to);
  };
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [path]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <div className="public-page min-h-screen bg-slate-50 text-slate-900 antialiased">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/85 backdrop-blur-lg border-b border-slate-200 shadow-sm'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => go('/')}
            className="group flex items-center gap-2"
            aria-label={`${COMPANY.name} home`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white transition-transform group-hover:scale-105">
              <Shield className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-semibold tracking-tight">{COMPANY.name}</span>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => go(link.href)}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={() => go('/console')}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              Sign in
            </button>
            <button
              onClick={() => go('/console')}
              className="group flex items-center gap-1 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-slate-800 hover:shadow-md"
            >
              Open console
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden border-t border-slate-200 bg-white transition-[max-height] duration-300 ${
            mobileOpen ? 'max-h-[80vh]' : 'max-h-0'
          }`}
        >
          <div className="space-y-1 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => go(link.href)}
                className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                {link.label}
              </button>
            ))}
            <div className="my-2 h-px bg-slate-200" />
            {LEGAL_LINKS.filter((l) => l.href !== '/contact').map((link) => (
              <button
                key={link.href}
                onClick={() => go(link.href)}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => go('/console')}
              className="mt-2 block w-full rounded-md bg-slate-900 px-3 py-2 text-center text-base font-medium text-white"
            >
              Open console
            </button>
          </div>
        </div>
      </header>

      <main className={compact ? 'pt-16' : 'pt-16'}>{children}</main>

      <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <Shield className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-lg font-semibold text-white">{COMPANY.name}</span>
              </div>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
                Secure API access governance with revocable subkeys, rate limits, token budgets,
                request logs, and billing-aware controls. Your master keys never leave the gateway.
              </p>
              <p className="mt-4 text-sm text-slate-400">
                {COMPANY.address}
                <span className="mx-2">·</span>
                <a
                  href={`mailto:${COMPANY.supportEmail}`}
                  className="text-slate-300 underline-offset-2 hover:text-white hover:underline"
                >
                  {COMPANY.supportEmail}
                </a>
              </p>
              <div className="mt-4 flex gap-4">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Product</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => go(link.href)}
                      className="text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => go('/console')}
                    className="text-slate-400 transition-colors hover:text-white"
                  >
                    Open console
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Legal</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => go(link.href)}
                      className="text-left text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
            <p>
              © {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
            </p>
            <p className="flex items-center gap-2">
              Payments processed by Razorpay · PCI-DSS compliant · International cards supported
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
