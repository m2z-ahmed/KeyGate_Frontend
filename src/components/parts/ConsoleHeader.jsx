import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LogoIcon } from './Logo';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../kit';
import { Bell, Menu, ChevronDown, ExternalLink, User, Settings, CreditCard, LogOut, FileText } from 'lucide-react';

export default function ConsoleHeader({ page, selectedProject, projectSlug, onSwitchProject, onOpenMobileMenu, onOpenNotifications, mobileMenuOpen = false, navigate }) {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const btnRef = useRef(null);
  const panelRef = useRef(null);
  const [pos, setPos] = useState({ top: 60, right: 20 });

  const pageTitle = String(page || 'overview').replace(/^./, (m) => m.toUpperCase());
  const userLabel = user?.name || user?.email || 'Signed in';
  const avatar = (user?.name || user?.email || 'K').charAt(0).toUpperCase();

  const goAccount = (target) => {
    setUserMenuOpen(false);
    const currentPath = `${window.location.pathname}${window.location.search || ''}`;
    const isAccount = /^\/console\/(subscription|billing|profile|workspace|docs)(\/|$)/.test(currentPath);
    let from = isAccount ? '' : currentPath;
    try {
      if (from) sessionStorage.setItem('lethem_last_console_path', from);
      else from = sessionStorage.getItem('lethem_last_console_path') || '';
    } catch (_) {}
    window.history.pushState({ from }, '', `/console/${target}`);
    window.dispatchEvent(new Event('popstate'));
  };

  const updatePos = () => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ top: Math.round(rect.bottom + 10), right: Math.max(12, Math.round(window.innerWidth - rect.right)) });
  };

  useLayoutEffect(() => { if (userMenuOpen) updatePos(); }, [userMenuOpen, userLabel]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const down = (e) => { if (btnRef.current?.contains(e.target) || panelRef.current?.contains(e.target)) return; setUserMenuOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setUserMenuOpen(false); };
    const resize = () => updatePos();
    document.addEventListener('pointerdown', down);
    document.addEventListener('keydown', esc);
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', resize, true);
    return () => {
      document.removeEventListener('pointerdown', down);
      document.removeEventListener('keydown', esc);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', resize, true);
    };
  }, [userMenuOpen]);

  const menu = userMenuOpen && createPortal(
    <div ref={panelRef} className="fixed z-[80] w-60 origin-top-right rounded-xl border border-border bg-popover p-1.5 shadow-2xl animate-fade-up" style={{ top: pos.top, right: pos.right }}>
      <div className="px-3 py-2.5 border-b border-border mb-1.5">
        <div className="text-sm font-medium truncate">{userLabel}</div>
        {user?.email && user.email !== userLabel && <div className="text-xs text-muted-foreground truncate">{user.email}</div>}
      </div>
      {[
        { icon: User, label: 'Profile', action: () => goAccount('profile') },
        { icon: Settings, label: 'Workspace Settings', action: () => goAccount('workspace') },
        { icon: CreditCard, label: 'Billing', action: () => goAccount('subscription') },
        { icon: FileText, label: 'Documentation', action: () => goAccount('docs') },
      ].map((item) => (
        <button key={item.label} onClick={item.action} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
          <item.icon size={15} /> {item.label}
        </button>
      ))}
      <div className="my-1.5 border-t border-border" />
      <button onClick={() => { setUserMenuOpen(false); logout(); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">
        <LogOut size={15} /> Logout
      </button>
    </div>,
    document.body
  );

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-border bg-card/70 px-4 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3">
          <button onClick={onOpenMobileMenu} className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden">
            <Menu size={20} />
          </button>
          <button onClick={onSwitchProject} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-secondary/60 transition-colors">
            <LogoIcon size={22} className="lg:hidden" />
            <div className="hidden text-left sm:block">
              <div className="text-[11px] text-muted-foreground leading-none">{selectedProject?.name ? 'Project' : 'Console'}</div>
              <div className="mt-0.5 flex items-center gap-1 font-heading text-sm font-semibold leading-none">
                {selectedProject?.name || 'Lethem'}
                <ChevronDown size={14} className="text-muted-foreground" />
              </div>
            </div>
          </button>
          <div className="hidden h-5 w-px bg-border sm:block" />
          <h1 className="hidden font-heading text-sm font-semibold text-muted-foreground sm:block">{pageTitle}</h1>
        </div>

        <div className="flex items-center gap-1.5">
          <a href={`${import.meta.env.VITE_API_URL || 'https://lethem-backend.onrender.com'}/docs`} target="_blank" rel="noreferrer" className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            API docs <ExternalLink size={13} />
          </a>
          <button onClick={onOpenNotifications} className="relative rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <Bell size={18} />
          </button>
          <button ref={btnRef} onClick={() => setUserMenuOpen((v) => !v)} className="flex items-center gap-2 rounded-lg p-1 pl-1.5 hover:bg-secondary/60 transition-colors">
            {user?.picture ? <img src={user.picture} alt="" className="h-8 w-8 rounded-full object-cover" /> : <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{avatar}</span>}
            <ChevronDown size={14} className="hidden text-muted-foreground sm:block" />
          </button>
        </div>
      </header>
      {menu}
    </>
  );
}