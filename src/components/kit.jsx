import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export function cn(...args) {
  return args.filter(Boolean).join(' ');
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-border bg-transparent hover:bg-secondary/60 text-foreground',
    ghost: 'bg-transparent hover:bg-secondary/60 text-foreground',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    subtle: 'bg-accent text-accent-foreground hover:bg-accent/80',
  };
  const sizes = { sm: 'h-8 px-3 text-xs gap-1.5', md: 'h-9 px-4 text-sm gap-2', lg: 'h-11 px-6 text-sm gap-2', icon: 'h-9 w-9' };
  return (
    <button className={cn('inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]', variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function Card({ className = '', children, ...props }) {
  return <div className={cn('rounded-xl border border-border bg-card/80 backdrop-blur-sm shadow-sm', className)} {...props}>{children}</div>;
}

export function CardHeader({ title, sub, actions, className = '' }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 p-5 border-b border-border', className)}>
      <div className="min-w-0">
        <h3 className="font-heading font-semibold text-sm">{title}</h3>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export function Badge({ tone = 'neutral', className = '', children }) {
  const tones = {
    neutral: 'bg-secondary text-muted-foreground',
    active: 'bg-success/15 text-success',
    success: 'bg-success/15 text-success',
    paused: 'bg-warning/15 text-warning',
    warning: 'bg-warning/15 text-warning',
    revoked: 'bg-destructive/15 text-destructive',
    danger: 'bg-destructive/15 text-destructive',
    info: 'bg-info/15 text-info',
    primary: 'bg-primary/15 text-primary',
  };
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium', tones[tone], className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function Input({ className = '', ...props }) {
  return <input className={cn('flex h-9 w-full rounded-lg border border-input bg-background/50 px-3 text-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-primary disabled:opacity-50', className)} {...props} />;
}

export function Textarea({ className = '', ...props }) {
  return <textarea className={cn('flex w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-primary disabled:opacity-50', className)} {...props} />;
}

export function Label({ className = '', children, ...props }) {
  return <label className={cn('text-xs font-medium text-muted-foreground mb-1.5 block', className)} {...props}>{children}</label>;
}

export function Select({ className = '', children, ...props }) {
  return (
    <select className={cn('flex h-9 w-full rounded-lg border border-input bg-background/50 px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-primary disabled:opacity-50', className)} {...props}>
      {children}
    </select>
  );
}

export function Modal({ open, onClose, title, sub, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }} />
      <div className={cn('relative w-full rounded-2xl border border-border bg-card shadow-2xl animate-fade-up', sizes[size])}>
        <div className="flex items-start justify-between gap-4 p-5 border-b border-border">
          <div>
            {title && <h2 className="font-heading font-semibold text-base">{title}</h2>}
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"><X size={18} /></button>
        </div>
        <div className="p-5 max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 p-5 border-t border-border bg-secondary/30">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

export function QuotaBar({ used, limit, tone }) {
  const pct = Math.min(100, Math.round((Number(used || 0) / Math.max(Number(limit || 1), 1)) * 100));
  const color = tone || (pct > 90 ? 'bg-destructive' : pct > 70 ? 'bg-warning' : 'bg-success');
  return (
    <div className="w-full">
      <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
        <div className={cn('h-full rounded-full transition-all duration-500', color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function StatCard({ label, value, delta, trend, icon: Icon, loading }) {
  if (loading) return <div className="rounded-xl border border-border bg-card/60 p-5"><div className="h-3 w-20 rounded bg-secondary animate-pulse" /><div className="h-7 w-28 rounded bg-secondary/60 animate-pulse mt-3" /></div>;
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card/80 p-5 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5">
      <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-primary to-transparent opacity-60" />
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
        {Icon && <Icon size={16} className="text-muted-foreground/60" />}
      </div>
      <div className="mt-2 font-mono text-2xl font-semibold tracking-tight">{value}</div>
      {delta && <div className={cn('mt-1.5 text-xs font-medium', delta.startsWith('↓') ? 'text-destructive' : 'text-success')}>{delta}</div>}
      {trend && <div className="mt-1.5 text-xs font-medium text-primary">{trend}</div>}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-gradient">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 py-14 px-6 text-center">
      {Icon && <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-muted-foreground"><Icon size={20} /></div>}
      <p className="font-medium text-sm">{title}</p>
      {description && <p className="text-xs text-muted-foreground mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return <div className={cn('rounded bg-secondary/70 animate-pulse', className)} />;
}

export function Spinner({ size = 18, className = '' }) {
  return <div className={cn('animate-spin rounded-full border-2 border-secondary border-t-primary', className)} style={{ width: size, height: size }} />;
}

export function Toast({ notif }) {
  if (!notif?.show) return null;
  const tones = { success: 'border-success/40 text-success', error: 'border-destructive/40 text-destructive' };
  return createPortal(
    <div className="fixed bottom-5 left-1/2 z-[200] -translate-x-1/2 animate-fade-up">
      <div className={cn('flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium shadow-xl', tones[notif.type] || tones.success)}>
        {notif.msg}
      </div>
    </div>,
    document.body
  );
}

export function CopyButton({ text, id, copied, onCopy, className = '', children }) {
  return (
    <button onClick={() => onCopy(text, id)} className={cn('inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors', className)}>
      {children}
    </button>
  );
}