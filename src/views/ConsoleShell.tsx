import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { LogoIcon } from '../components/Logo';
import { Toast } from '../components/ui';
import {
  LayoutDashboard, KeyRound, Key, Play, ScrollText, Bell, Heart,
  BarChart3, CreditCard, Users, UserCog, Mail, Settings, Terminal, Shield,
  FileText, AlertTriangle, ChevronRight, Menu, LogOut, User,
  ArrowLeftRight,
} from 'lucide-react';

interface NavItem {
  key: string;
  label: string;
  icon: ReactNode;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    label: 'Overview',
    items: [{ key: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> }],
  },
  {
    label: 'Access',
    items: [
      { key: 'masterkeys', label: 'Master keys', icon: <KeyRound size={18} /> },
      { key: 'subkeys', label: 'Subkeys', icon: <Key size={18} /> },
      { key: 'demo', label: 'Live demo', icon: <Play size={18} /> },
    ],
  },
  {
    label: 'Monitoring',
    items: [
      { key: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
      { key: 'usage', label: 'Usage', icon: <CreditCard size={18} /> },
      { key: 'logs', label: 'Request logs', icon: <ScrollText size={18} /> },
      { key: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
      { key: 'health', label: 'Health', icon: <Heart size={18} /> },
    ],
  },
  {
    label: 'Team',
    items: [
      { key: 'members', label: 'Members', icon: <Users size={18} /> },
      { key: 'roles', label: 'Roles', icon: <UserCog size={18} /> },
      { key: 'invites', label: 'Invites', icon: <Mail size={18} /> },
    ],
  },
  {
    label: 'Settings',
    items: [
      { key: 'general', label: 'General', icon: <Settings size={18} /> },
      { key: 'endpoint', label: 'API Endpoint', icon: <Terminal size={18} /> },
      { key: 'security', label: 'Security', icon: <Shield size={18} /> },
      { key: 'audit', label: 'Audit Logs', icon: <FileText size={18} /> },
      { key: 'danger', label: 'Danger Zone', icon: <AlertTriangle size={18} /> },
    ],
  },
];

const PAGE_TITLES: Record<string, string> = {
  overview: 'Overview', masterkeys: 'Master keys', subkeys: 'Subkeys', logs: 'Request logs',
  demo: 'Live demo', health: 'Health', notifications: 'Notifications', billing: 'Billing',
  analytics: 'Analytics', usage: 'Usage', members: 'Members', roles: 'Roles', invites: 'Invites',
  subscription: 'Subscription', invoices: 'Invoices', general: 'General', endpoint: 'API Endpoint',
  security: 'Security', audit: 'Audit Logs', danger: 'Danger Zone', profile: 'Profile',
  workspace: 'Workspace', docs: 'Documentation',
};

export default function ConsoleShell({
  go, page, projectSlug, accountMode = false, children,
}: {
  go: (path: string) => void;
  page: string;
  projectSlug: string;
  accountMode?: boolean;
  children: ReactNode;
}) {
  const { selectedProject, notif, API } = useApp();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const accountProject = selectedProject || { name: 'Account', slug: 'user subscription' };
  const pageTitle = PAGE_TITLES[page] || page;
  const navigate = (p: string) => accountMode ? go(`/console/${p}`) : go(`/console/${projectSlug}/${p}`);

  const toggleSection = (label: string) => setCollapsed((v) => ({ ...v, [label]: !v[label] }));

  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [userMenuOpen]);

  const goAccount = (target: string) => {
    setUserMenuOpen(false);
    const currentPath = `${window.location.pathname}${window.location.search || ''}`;
    const accountPath = /^\/console\/(subscription|billing|profile|workspace|docs)(\/|$)/.test(currentPath);
    let from = accountPath ? '' : currentPath;
    try {
      if (from) sessionStorage.setItem('keygate_last_console_path', from);
      else from = sessionStorage.getItem('keygate_last_console_path') || '';
    } catch { /* skip */ }
    window.history.pushState({ from }, '', `/console/${target}`);
    window.dispatchEvent(new Event('popstate'));
  };

  const userLabel = user?.email || user?.name || 'Signed in';
  const avatar = (user?.email || user?.name || selectedProject?.name || 'K').charAt(0).toUpperCase();

  const renderNavItem = (item: NavItem) => {
    const isActive = page === item.key;
    const isDanger = item.key === 'danger';
    return (
      <button
        key={item.key}
        onClick={() => { navigate(item.key); setSidebarOpen(false); }}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
          isActive
            ? isDanger
              ? 'bg-danger-500/10 text-danger-400'
              : 'bg-primary-500/10 text-primary-300'
            : isDanger
              ? 'text-gray-500 hover:text-danger-400 hover:bg-danger-500/5'
              : 'text-gray-400 hover:text-gray-200 hover:bg-base-800'
        }`}
      >
        <span className="flex-shrink-0">{item.icon}</span>
        <span className="truncate">{item.label}</span>
        {item.key === 'demo' && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse-soft" />}
      </button>
    );
  };

  const sidebar = (
    <aside className="w-60 flex-shrink-0 bg-base-900 border-r border-base-800 flex flex-col h-full">
      {/* Back to projects */}
      <div className="p-3">
        <button
          onClick={() => go('/console')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-base-800 transition-colors"
        >
          <ArrowLeftRight size={16} /> Switch project
        </button>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-4">
        {SECTIONS.map((section) => (
          <div key={section.label}>
            <button
              onClick={() => toggleSection(section.label)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-500 transition-colors"
            >
              {section.label}
              {collapsed[section.label] ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
            </button>
            {!collapsed[section.label] && (
              <div className="mt-1 space-y-0.5">{section.items.map(renderNavItem)}</div>
            )}
          </div>
        ))}
      </nav>

      {/* Proxy endpoint */}
      <div className="p-3 border-t border-base-800">
        <div className="px-3 py-2 rounded-lg bg-base-850 border border-base-700">
          <div className="text-[10px] font-medium text-gray-600 uppercase tracking-wider mb-1">Proxy endpoint</div>
          <div className="text-xs text-gray-400 font-mono truncate">{API.replace(/^https?:\/\//, '')}</div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-base-950 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">{sidebar}</div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 animate-slide-in-right">{sidebar}</div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex-shrink-0 h-14 border-b border-base-800 bg-base-900/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-400 hover:text-gray-200">
              <Menu size={20} />
            </button>
            <div className="md:hidden"><LogoIcon size={24} /></div>
            <div className="hidden md:block min-w-0">
              <div className="text-sm font-semibold text-gray-100 truncate">
                {accountProject.name} <span className="text-gray-600 font-normal">·</span> {pageTitle}
              </div>
              <div className="text-xs text-gray-500 truncate">{accountProject.slug} · API Access Manager</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-base-800 transition-colors"
              >
                {user?.picture ? (
                  <img src={user.picture} alt="" className="w-7 h-7 rounded-full" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary-500/20 text-primary-300 flex items-center justify-center text-xs font-semibold">
                    {avatar}
                  </div>
                )}
                <span className="hidden sm:block text-sm text-gray-300 max-w-[120px] truncate">{userLabel}</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-base-900 border border-base-700 rounded-xl shadow-2xl py-1.5 animate-scale-in z-50">
                  <button onClick={() => goAccount('profile')} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:bg-base-800 transition-colors">
                    <User size={16} /> Profile
                  </button>
                  <button onClick={() => goAccount('workspace')} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:bg-base-800 transition-colors">
                    <Settings size={16} /> Workspace Settings
                  </button>
                  <button onClick={() => goAccount('subscription')} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:bg-base-800 transition-colors">
                    <CreditCard size={16} /> Billing
                  </button>
                  <button onClick={() => goAccount('docs')} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:bg-base-800 transition-colors">
                    <FileText size={16} /> Documentation
                  </button>
                  <div className="border-t border-base-700 mt-1.5 pt-1.5">
                    <button onClick={() => { setUserMenuOpen(false); logout(); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-danger-400 hover:bg-danger-500/10 transition-colors">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div key={page} className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      <Toast show={notif.show} msg={notif.msg} type={notif.type} />
    </div>
  );
}

function ChevronDown({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
