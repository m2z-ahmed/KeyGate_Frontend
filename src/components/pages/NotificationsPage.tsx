import { useEffect, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { EmptyState } from '../ui';
import { AlertTriangle, Clock, FileText, Check, X, Loader2 } from 'lucide-react';

export default function NotificationsPage() {
  const { subkeys, fmtNum, fmtDate, api, notify, loading } = useApp();
  const [requests, setRequests] = useState<any[]>([]);
  const [busy, setBusy] = useState<Record<string, boolean>>({});

  const refresh = async () => { try { setRequests(await api<any[]>('/api/quota-requests')); } catch { setRequests([]); } };
  useEffect(() => { refresh(); }, []);

  const nearLimit = subkeys.filter((s) => (Number(s.tokens_used || 0) / Number(s.monthly_token_limit || 1)) >= 0.8);
  const expiring = subkeys.filter((s) => s.expires_at && (Number(s.expires_at) - Math.floor(Date.now() / 1000)) < 7 * 86400);
  const isLoading = loading?.subkeys;

  const grant = async (id: string, type: string, amount: string, note = '') => {
    const k = `grant:${id}:${type}`;
    if (busy[k]) return;
    setBusy((b) => ({ ...b, [k]: true }));
    try {
      const created = await api('/api/quota-requests', { method: 'POST', body: { subkey_id: id, request_type: type, amount, note } });
      await api('/api/quota-requests/' + created.id, { method: 'PATCH', body: { status: 'approved' } });
      notify('Grant approved'); refresh();
    } catch (e: any) { notify(e.message || 'Failed to grant', 'error'); }
    finally { setBusy((b) => ({ ...b, [k]: false })); }
  };

  const decide = async (id: string, status: string) => {
    const k = `decide:${id}`;
    if (busy[k]) return;
    setBusy((b) => ({ ...b, [k]: true }));
    try { await api('/api/quota-requests/' + id, { method: 'PATCH', body: { status } }); notify('Request updated'); refresh(); }
    catch (e: any) { notify(e.message || 'Failed to update', 'error'); }
    finally { setBusy((b) => ({ ...b, [k]: false })); }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-100 mb-1">Notifications</h1>
        <p className="text-sm text-gray-500">Quota alerts, expiry alerts, and admin approvals.</p>
      </div>

      {/* Near limit */}
      <div className="card p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={16} className="text-accent-400" />
          <h2 className="text-sm font-semibold text-gray-100">Near limit</h2>
        </div>
        {isLoading ? <div className="space-y-2">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="skeleton h-10" />)}</div>
          : nearLimit.length ? nearLimit.map((s) => {
              const k = `grant:${s.id}:credits`;
              return (
                <div key={s.id} className="flex justify-between items-center gap-3 py-2.5 border-b border-base-800 last:border-0 flex-wrap">
                  <span className="text-sm text-gray-300">{s.name} is near limit ({fmtNum(s.tokens_used)} / {fmtNum(s.monthly_token_limit)})</span>
                  <button onClick={() => grant(s.id, 'credits', '20', 'Admin approved quota extension')} disabled={busy[k]} className="btn btn-warning text-xs">
                    {busy[k] ? <Loader2 size={14} className="animate-spin" /> : null} Grant +20k tokens
                  </button>
                </div>
              );
            })
          : <EmptyState title="No near-limit alerts" />}
      </div>

      {/* Expiring soon */}
      <div className="card p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-accent-400" />
          <h2 className="text-sm font-semibold text-gray-100">Expiring soon</h2>
        </div>
        {isLoading ? <div className="space-y-2">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="skeleton h-10" />)}</div>
          : expiring.length ? expiring.map((s) => {
              const k = `grant:${s.id}:expiry_extend`;
              return (
                <div key={s.id} className="flex justify-between items-center gap-3 py-2.5 border-b border-base-800 last:border-0 flex-wrap">
                  <span className="text-sm text-gray-300">{s.name} expires on {fmtDate(s.expires_at)}</span>
                  <button onClick={() => grant(s.id, 'expiry_extend', '7', 'Admin approved expiry extension')} disabled={busy[k]} className="btn btn-warning text-xs">
                    {busy[k] ? <Loader2 size={14} className="animate-spin" /> : null} Extend 7 days
                  </button>
                </div>
              );
            })
          : <EmptyState title="No expiring subkeys" />}
      </div>

      {/* Quota requests */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={16} className="text-primary-400" />
          <h2 className="text-sm font-semibold text-gray-100">Quota extension requests</h2>
        </div>
        {requests.length ? requests.map((r) => {
          const k = `decide:${r.id}`;
          return (
            <div key={r.id} className="flex justify-between items-center gap-3 py-2.5 border-b border-base-800 last:border-0 flex-wrap">
              <span className="text-sm text-gray-300">[{r.subkey_name}] asked for {r.request_type} {r.amount ? `(${r.amount})` : ''} — <code className="font-mono text-xs text-gray-500">{r.status}</code></span>
              <div className="flex gap-2">
                <button onClick={() => decide(r.id, 'approved')} disabled={busy[k]} className="btn btn-success text-xs px-2.5 py-1.5"><Check size={14} /> Approve</button>
                <button onClick={() => decide(r.id, 'rejected')} disabled={busy[k]} className="btn btn-danger text-xs px-2.5 py-1.5"><X size={14} /> Reject</button>
              </div>
            </div>
          );
        }) : <EmptyState title="No quota requests yet" />}
      </div>
    </div>
  );
}
