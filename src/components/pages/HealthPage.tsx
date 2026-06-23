import { useEffect, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { RefreshCw, Activity } from 'lucide-react';

export default function HealthPage({ publicMode = false }: { publicMode?: boolean }) {
  const { api, notify } = useApp();
  const [rows, setRows] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await api<any[]>('/api/health', { skipAuth: publicMode });
        setRows(data);
      } catch { setRows([]); }
    };
    fetchHealth();
  }, []);

  const dayKey = (d: Date | string) => {
    const dt = new Date(d);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
  };
  const byDay = new Map(rows.map((r) => [dayKey(r.day), r]));
  const bars = Array.from({ length: 90 }).map((_, idx) => {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (89 - idx));
    const key = dayKey(d);
    return byDay.get(key) || { day: key, internal_ok: null, db_ok: null, redis_ok: null, details: { missing_record: true } };
  });
  const colorFor = (r: any) => (r.internal_ok === true ? '#22c55e' : (r.internal_ok === false ? ((r.db_ok || r.redis_ok) ? '#eab308' : '#ef4444') : '#3a4051'));
  const knownDays = bars.filter((r) => r.internal_ok !== null);
  const upDays = knownDays.filter((r) => r.internal_ok).length;
  const pct = knownDays.length ? ((upDays / knownDays.length) * 100).toFixed(2) : 'N/A';
  const latestKnown = [...bars].reverse().find((r) => r.internal_ok !== null);
  const summary = !latestKnown ? 'No data yet' : (latestKnown.internal_ok ? 'Operational' : ((latestKnown.db_ok || latestKnown.redis_ok) ? 'Degraded' : 'Down'));
  const summaryColor = summary === 'Operational' ? 'text-success-400 bg-success-500/10 border-success-500/20' : summary === 'Degraded' ? 'text-accent-400 bg-accent-500/10 border-accent-500/20' : summary === 'Down' ? 'text-danger-400 bg-danger-500/10 border-danger-500/20' : 'text-gray-400 bg-base-800 border-base-700';

  const refreshNow = async () => {
    setRefreshing(true);
    try {
      await api('/api/health/refresh-now', { method: 'POST', body: {} });
      const data = await api<any[]>('/api/health');
      setRows(data); notify('Health refreshed');
    } catch (e: any) { notify(e.message || 'Failed to refresh health', 'error'); }
    finally { setRefreshing(false); }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-100 mb-1">System Health</h1>
        <p className="text-sm text-gray-500">Public status page for internal server, database, and redis.</p>
      </div>

      <div className={`card p-5 mb-6 border ${summaryColor}`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Activity size={20} />
            <span className="text-sm font-semibold">Current status: {summary}</span>
          </div>
          {!publicMode && <button onClick={refreshNow} disabled={refreshing} className="btn btn-ghost text-xs"><RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> {refreshing ? 'Refreshing...' : 'Refresh now'}</button>}
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-semibold text-gray-100 mb-3">Uptime over last 90 days ({pct}%)</h2>
        <div className="flex gap-4 mb-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-success-500" /> Operational</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-accent-500" /> Degraded</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-danger-500" /> Down</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-base-600" /> No data</span>
        </div>
        <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(90, 1fr)' }}>
          {bars.map((r, i) => (
            <div key={i} title={`${r.day}\nInternal: ${r.internal_ok === null ? 'N/A' : (r.internal_ok ? 'OK' : 'FAIL')}\nDB: ${r.db_ok === null ? 'N/A' : (r.db_ok ? 'OK' : 'FAIL')}\nRedis: ${r.redis_ok === null ? 'N/A' : (r.redis_ok ? 'OK' : 'FAIL')}`}
              className="h-7 rounded-sm transition-transform hover:scale-y-125 cursor-default" style={{ background: colorFor(r) }} />
          ))}
        </div>
      </div>
    </div>
  );
}
