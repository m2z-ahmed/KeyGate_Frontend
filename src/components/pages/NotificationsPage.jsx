import { useEffect, useState } from 'react';
import { Card, CardHeader, Button, Skeleton, EmptyState, Badge } from '../kit';
import { fmtNum, fmtDate } from '../../contexts/LethemContext';
import { Bell, AlertTriangle, Clock, Check, X } from 'lucide-react';

function SkelRow() { return <Skeleton className="h-14 w-full" />; }

export default function NotificationsPage({ ctx }) {
  const { subkeys, fmtNum, fmtDate, api, notify, loading } = ctx;
  const [requests, setRequests] = useState([]);
  const [busy, setBusy] = useState({});
  const refresh = async () => setRequests(await api('/api/quota-requests'));
  useEffect(() => { refresh(); }, []);

  const nearLimit = subkeys.filter((s) => (Number(s.tokens_used || 0) / Number(s.monthly_token_limit || 1)) >= 0.8);
  const expiring = subkeys.filter((s) => s.expires_at && (Number(s.expires_at) - Math.floor(Date.now() / 1000)) < 7 * 86400);
  const isLoading = loading?.subkeys;

  const grant = async (id, type, amount, note = '') => {
    const k = `grant:${id}:${type}`; if (busy[k]) return; setBusy((b) => ({ ...b, [k]: true }));
    try { const created = await api('/api/quota-requests', { method: 'POST', body: { subkey_id: id, request_type: type, amount, note } }); await api('/api/quota-requests/' + created.id, { method: 'PATCH', body: { status: 'approved' } }); notify('Grant approved'); refresh(); }
    finally { setBusy((b) => ({ ...b, [k]: false })); }
  };
  const decide = async (id, status) => {
    const k = `decide:${id}`; if (busy[k]) return; setBusy((b) => ({ ...b, [k]: true }));
    try { await api('/api/quota-requests/' + id, { method: 'PATCH', body: { status } }); notify('Request updated'); refresh(); }
    finally { setBusy((b) => ({ ...b, [k]: false })); }
  };

  return (
    <div>
      <div className="mb-6"><h1 className="font-heading text-2xl font-bold tracking-tight text-gradient">Notifications</h1><p className="mt-1 text-sm text-muted-foreground">Quota alerts, expiry alerts, and admin approvals.</p></div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Near limit" sub="Subkeys approaching their token quota" actions={<AlertTriangle size={14} className="text-warning" />} />
          <div className="p-5 space-y-3">
            {isLoading ? Array.from({ length: 2 }).map((_, i) => <SkelRow key={i} />) : nearLimit.length ? nearLimit.map((s) => { const k = `grant:${s.id}:credits`; return (
              <div key={s.id} className="rounded-lg border border-border bg-secondary/30 p-3">
                <div className="text-sm font-medium">{s.name}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{fmtNum(s.tokens_used)} / {fmtNum(s.monthly_token_limit)} tokens</div>
                <Button size="sm" className="mt-2" disabled={busy[k]} onClick={() => grant(s.id, 'credits', '20', 'Admin approved quota extension from notifications')}>{busy[k] ? 'Granting…' : 'Grant +20k tokens'}</Button>
              </div>
            ); }) : <EmptyState icon={Bell} title="No near-limit alerts." />}
          </div>
        </Card>

        <Card>
          <CardHeader title="Expiring soon" sub="Subkeys expiring within 7 days" actions={<Clock size={14} className="text-warning" />} />
          <div className="p-5 space-y-3">
            {isLoading ? Array.from({ length: 2 }).map((_, i) => <SkelRow key={i} />) : expiring.length ? expiring.map((s) => { const k = `grant:${s.id}:expiry_extend`; return (
              <div key={s.id} className="rounded-lg border border-border bg-secondary/30 p-3">
                <div className="text-sm font-medium">{s.name}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">Expires {fmtDate(s.expires_at)}</div>
                <Button size="sm" className="mt-2" disabled={busy[k]} onClick={() => grant(s.id, 'expiry_extend', '7', 'Admin approved expiry extension from notifications')}>{busy[k] ? 'Extending…' : 'Extend +7 days'}</Button>
              </div>
            ); }) : <EmptyState icon={Bell} title="No expiring subkeys." />}
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="Quota extension requests" sub="Approve or reject pending requests" />
        <div className="divide-y divide-border">
          {!requests.length ? <div className="p-5"><EmptyState icon={Bell} title="No quota requests yet." /></div> : requests.map((r) => { const k = `decide:${r.id}`; return (
            <div key={r.id} className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0"><div className="text-sm"><span className="font-medium">[{r.subkey_name}]</span> asked for {r.request_type}{r.amount ? ` (${r.amount})` : ''}</div></div>
              <div className="flex items-center gap-2 shrink-0"><Badge tone={r.status === 'pending' ? 'warning' : r.status === 'approved' ? 'success' : 'danger'}>{r.status}</Badge>
                <Button variant="outline" size="sm" disabled={busy[k]} onClick={() => decide(r.id, 'approved')}><Check size={13} /> Approve</Button>
                <Button variant="ghost" size="sm" disabled={busy[k]} onClick={() => decide(r.id, 'rejected')} className="text-destructive hover:bg-destructive/10"><X size={13} /> Reject</Button>
              </div>
            </div>
          ); })}
        </div>
      </Card>
    </div>
  );
}