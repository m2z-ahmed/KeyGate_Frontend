import { useEffect, useState } from 'react';
import { Card, Button, cn } from '../kit';
import { RefreshCw } from 'lucide-react';

export default function HealthPage({ ctx, publicMode = false }) {
  const { api, notify } = ctx;
  const [rows, setRows] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { api('/api/health').then(setRows).catch(() => setRows([])); }, []);

  const dayKey = (d) => { const dt = new Date(d); return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`; };
  const byDay = new Map(rows.map((r) => [dayKey(r.day), r]));
  const bars = Array.from({ length: 90 }).map((_, idx) => {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (89 - idx));
    const key = dayKey(d);
    return byDay.get(key) || { day: key, internal_ok: null, db_ok: null, redis_ok: null, details: { missing_record: true } };
  });
  const colorFor = (r) => (r.internal_ok === true ? 'bg-success' : (r.internal_ok === false ? ((r.db_ok || r.redis_ok) ? 'bg-warning' : 'bg-destructive') : 'bg-secondary'));
  const knownDays = bars.filter((r) => r.internal_ok !== null);
  const upDays = knownDays.filter((r) => r.internal_ok).length;
  const pct = knownDays.length ? ((upDays / knownDays.length) * 100).toFixed(2) : 'N/A';
  const latestKnown = [...bars].reverse().find((r) => r.internal_ok !== null);
  const summary = !latestKnown ? 'No data yet' : (latestKnown.internal_ok ? 'Operational' : ((latestKnown.db_ok || latestKnown.redis_ok) ? 'Degraded' : 'Down'));
  const summaryTone = summary === 'Operational' ? 'text-success' : summary === 'Degraded' ? 'text-warning' : summary === 'Down' ? 'text-destructive' : 'text-muted-foreground';

  const refreshNow = async () => {
    setRefreshing(true);
    try { await api('/api/health/refresh-now', { method: 'POST', body: {} }); const data = await api('/api/health'); setRows(data); notify('Health refreshed'); }
    catch (e) { notify(e.message || 'Failed to refresh health', 'error'); }
    finally { setRefreshing(false); }
  };

  return (
    <div className={publicMode ? '' : ''}>
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="font-heading text-2xl font-bold tracking-tight text-gradient">System Health</h1><p className="mt-1 text-sm text-muted-foreground">Public status page for internal server, database, and redis.</p></div>
        {!publicMode && <Button variant="outline" size="sm" onClick={refreshNow} disabled={refreshing}><RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> {refreshing ? 'Refreshing…' : 'Refresh now'}</Button>}
      </div>

      <Card className="mb-6 p-5">
        <div className="flex items-center gap-3">
          <span className={cn('h-3 w-3 rounded-full', summaryTone.includes('success') ? 'bg-success' : summaryTone.includes('warning') ? 'bg-warning' : summaryTone.includes('destructive') ? 'bg-destructive' : 'bg-muted-foreground')} />
          <span className={cn('text-lg font-semibold', summaryTone)}>Current status: {summary}</span>
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-1 text-sm font-semibold">Uptime over last 90 days ({pct}%)</div>
        <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-success" /> Operational</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-warning" /> Degraded</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-destructive" /> Down</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-secondary" /> No data</span>
        </div>
        <div className="flex items-end gap-[2px]">
          {bars.map((r, i) => (
            <div key={i} className={cn('h-8 flex-1 min-w-[2px] rounded-sm transition-colors hover:opacity-80', colorFor(r))} title={`${r.day}: ${r.internal_ok === true ? 'Operational' : r.internal_ok === false ? 'Issue' : 'No data'}`} />
          ))}
        </div>
      </Card>
    </div>
  );
}