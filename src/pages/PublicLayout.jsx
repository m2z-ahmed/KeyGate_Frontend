import { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { COMPANY, LEGAL_LINKS, NAV_LINKS, SOCIAL_LINKS } from '../lib/marketingContent';
import { LogoIcon } from '../components/parts/Logo';

export default function PublicLayout({ children, compact = false }) {
  const [path, setPath] = useState(() => window.location.pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setMobileOpen(false); }, [path]);
  useEffect(() => { document.body.style.overflow = mobileOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className={`sticky top-0 z-50 transition-all ${scrolled ? 'border-b border-slate-200 bg-white/80 backdrop-blur-md' : 'bg-transparent'}`}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <button onClick={() => go('/')} className="flex items-center gap-2">
            <LogoIcon size={28} />
            <span className="font-heading text-lg font-bold">{COMPANY.name}</span>
          </button>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => <button key={link.label} onClick={() => go(link.href)} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">{link.label}</button>)}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => go('/console')} className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 sm:block">Sign in</button>
            <button onClick={() => go('/console')} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800">Get started</button>
            <button onClick={() => setMobileOpen((v) => !v)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden">{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>
        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
            {NAV_LINKS.map((link) => <button key={link.label} onClick={() => go(link.href)} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100">{link.label}<ChevronRight size={16} /></button>)}
          </div>
        )}
      </header>

      <main>{children}</main>

      {!compact && (
        <footer className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2"><LogoIcon size={26} /><span className="font-heading font-bold">{COMPANY.name}</span></div>
                <p className="mt-3 max-w-sm text-sm text-slate-600">{COMPANY.name} is a developer-first AI gateway for secure API key management, access control, and observability.</p>
                <div className="mt-4 flex gap-4 text-sm">
                  {SOCIAL_LINKS.map((s) => <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-900">{s.label}</a>)}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Legal</h4>
                <ul className="mt-3 space-y-2">
                  {LEGAL_LINKS.map((link) => <li key={link.label}><button onClick={() => go(link.href)} className="text-sm text-slate-600 hover:text-slate-900">{link.label}</button></li>)}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Contact</h4>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li><a href={`mailto:${COMPANY.supportEmail}`} className="hover:text-slate-900">{COMPANY.supportEmail}</a></li>
                  <li>{COMPANY.address}</li>
                  <li>© {new Date().getFullYear()} {COMPANY.name}</li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}