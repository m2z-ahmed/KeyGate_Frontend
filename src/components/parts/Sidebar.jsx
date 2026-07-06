import { useState, useMemo } from 'react';
import { useLethem } from '../../contexts/LethemContext';
import { useAuth } from '../../contexts/AuthContext';
import { LogoFull } from './Logo';
import { cn } from '../kit';
import { proxyEndpoint as api } from '../../lib/config';
import {
  LayoutDashboard, KeyRound, KeySquare, Play, BarChart3, Gauge,
  ScrollText, Bell, HeartPulse, Users, ShieldCheck, UserPlus,
  Settings, Webhook, Lock, History, ArrowLeft, Copy, Check, X,
} from 'lucide-react';

const sections = [
  { label: 'Overview', items: [['overview', 'Overview', LayoutDashboard]] },
  { label: 'Access', items: [['masterkeys', 'Master keys', KeyRound], ['subkeys', 'Subkeys', KeySquare], ['demo', 'Live demo', Play]] },
  { label: 'Monitoring', items: [['analytics', 'Analytics', BarChart3], ['usage', 'Usage', Gauge], ['logs', 'Request logs', ScrollText], ['notifications', 'Notifications', Bell], ['health', 'Health', HeartPulse]] },
  { label: 'Team', items: [['members', 'Members', Users], ['roles', 'Roles', ShieldCheck], ['invites', 'Invites', UserPlus]] },
  { label: 'Settings', items: [['general', 'General', Settings], ['endpoint', 'API Endpoint', Webhook], ['security', 'Security', Lock], ['audit', 'Audit Logs', History]] },
];

export default function Sidebar({ page, navigate, onBackToConsole, drawerOpen, setDrawerOpen }) {
  const { ctx } = useLethem();
  const [copied, setCopied] = useState(false);
  const endpoint = `${ctx.API}/`;

  const copyEndpoint = () => {
    ctx.copyText(endpoint, 'proxy-endpoint');
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const go = (next) => { navigate(next); setDrawerOpen(false); };

  const renderItem = ([key, label, Icon]) => {
    const active = page === key;
    return (
      <button
        key={key}
        onClick={() => go(key)}
        className={cn(
          'group relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all',
          active ? 'bg-primary/10 text-foreground' : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
        )}
      >
        {active && <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />}
        <Icon size={16} className={cn('shrink-0 transition-colors', active ? 'text-primary' : 'opacity-70 group-hover:opacity-100')} />
        <span className="truncate">{label}</span>
        {key === 'demo' && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
      </button>
    );
  };

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
        <button onClick={onBackToConsole} className="transition-opacity hover:opacity-80"><LogoFull size={26} /></button>
        <button onClick={() => setDrawerOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {sections.map((section) => (
          <div key={section.label} className="mb-4">
            <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/60">{section.label}</div>
            <div className="space-y-0.5">{section.items.map(renderItem)}</div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="rounded-lg border border-border bg-secondary/30 p-3">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/60">Proxy endpoint</div>
          <div className="flex items-start gap-2">
            <code className="flex-1 break-all font-mono text-[11px] text-primary/90">{endpoint}</code>
            <button onClick={copyEndpoint} className="shrink-0 rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-60 shrink-0 border-r border-border bg-card/40 lg:block">{content}</aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={(e) => { if (e.target === e.currentTarget) setDrawerOpen(false); }} />
          <div className="absolute left-0 top-0 h-full w-72 border-r border-border bg-card shadow-2xl animate-fade-in">{content}</div>
        </div>
      )}
    </>
  );
}