import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, title, children, footer, maxWidth = 'max-w-lg' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`w-full ${maxWidth} bg-base-900 border border-base-700 rounded-2xl shadow-2xl animate-scale-in overflow-hidden`}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-base-700">
            <h2 className="text-base font-semibold text-gray-100">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
              <X size={18} />
            </button>
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-base-700 bg-base-950/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function Toast({ show, msg, type }: { show: boolean; msg: string; type: string }) {
  if (!show) return null;
  const colors = {
    success: 'bg-success-500/15 border-success-500/30 text-success-400',
    error: 'bg-danger-500/15 border-danger-500/30 text-danger-400',
  };
  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slide-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-xl ${colors[type as keyof typeof colors] || colors.success}`}>
        <span className="text-sm font-medium">{msg}</span>
      </div>
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function EmptyState({ icon, title, subtitle, action }: { icon?: ReactNode; title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-gray-600">{icon}</div>}
      <p className="text-sm font-medium text-gray-400">{title}</p>
      {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function StatCard({ label, value, trend, icon, loading }: { label: string; value: string | number; trend?: string; icon?: ReactNode; loading?: boolean }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        {icon && <div className="text-gray-600">{icon}</div>}
      </div>
      {loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <div className="text-2xl font-bold text-gray-100">{value}</div>
      )}
      {trend && !loading && <div className="mt-1 text-xs text-gray-500">{trend}</div>}
    </div>
  );
}

export function QuotaBar({ used, limit, color }: { used: number; limit: number; color: 'over' | 'warn' | 'ok' }) {
  const pct = Math.min(100, Math.round((used / Math.max(limit, 1)) * 100));
  const colors = {
    over: 'bg-danger-500',
    warn: 'bg-accent-500',
    ok: 'bg-primary-500',
  };
  return (
    <div>
      <div className="h-1.5 bg-base-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${colors[color]}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 text-xs text-gray-500 font-mono">{Math.round(used).toLocaleString()} / {Math.round(limit).toLocaleString()}</div>
    </div>
  );
}
