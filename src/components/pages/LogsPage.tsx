import { useMemo, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { fmtCost } from '../../lib/format';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

const STATUSES = ['all', 'success', 'error', 'quota'];

export default function LogsPage() {
  const { logs, fmtNum, fmtTime } = useApp();
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filteredLogs = useMemo(() => {
    let list = logs;
    if (startDate) { const start = new Date(startDate).getTime() / 1000; list = list.filter((l) => (l.created_at || 0) >= start); }
    if (endDate) { const end = new Date(endDate).getTime() / 1000 + 86400; list = list.filter((l) => (l.created_at || 0) <= end); }
    if (statusFilter !== 'all') list = list.filter((l) => l.status === statusFilter);
    if (sortKey) {
      list = [...list].sort((a, b) => {
        let av: any, bv: any;
        if (sortKey === 'time') { av = a.created_at || 0; bv = b.created_at || 0; }
        else if (sortKey === 'tokens') { av = a.tokens_used || 0; bv = b.tokens_used || 0; }
        else if (sortKey === 'cost') { av = Number(a.estimated_cost_usd || 0); bv = Number(b.estimated_cost_usd || 0); }
        else if (sortKey === 'latency') { av = a.latency_ms || 0; bv = b.latency_ms || 0; }
        else if (sortKey === 'status') { av = a.status || ''; bv = b.status || ''; }
        else { av = a.created_at || 0; bv = b.created_at || 0; }
        const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return list;
  }, [logs, sortKey, sortDir, statusFilter, startDate, endDate]);

  const pageSize = 30;
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedLogs = filteredLogs.slice((safePage - 1) * pageSize, safePage * pageSize);
  const sourceCounts = logs.reduce<Record<string, number>>((a, l) => { const k = l.source || 'external'; a[k] = (a[k] || 0) + 1; return a; }, {});

  const SortHeader = ({ k, children }: { k: string; children: React.ReactNode }) => (
    <th onClick={() => toggleSort(k)} className="cursor-pointer hover:text-gray-300 select-none whitespace-nowrap">
      <span className="inline-flex items-center gap-1">{children} <ArrowUpDown size={12} className={sortKey === k ? 'text-primary-400' : 'text-gray-600'} /></span>
    </th>
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-100 mb-1">Request logs</h1>
        <p className="text-sm text-gray-500">Every request proxied through KeyGate</p>
      </div>

      {/* Source breakdown */}
      <div className="card p-4 mb-4">
        <div className="text-sm font-semibold text-gray-100 mb-3">Source breakdown</div>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(sourceCounts).map(([k, v]) => (
            <span key={k} className="badge badge-active">{k}: {v}</span>
          ))}
        </div>
      </div>

      {/* Date filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">From</label>
          <input type="date" className="input py-1.5 w-auto" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(1); }} />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">To</label>
          <input type="date" className="input py-1.5 w-auto" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(1); }} />
        </div>
        {(startDate || endDate) && <button onClick={() => { setStartDate(''); setEndDate(''); setPage(1); }} className="btn btn-ghost text-xs">Clear</button>}
      </div>

      {/* Status filter chips */}
      <div className="flex gap-2 mb-4">
        {STATUSES.map((s) => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === s ? 'bg-primary-500/15 text-primary-300 border border-primary-500/30' : 'text-gray-500 hover:text-gray-300 hover:bg-base-800 border border-transparent'
            }`}>
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-base-700 text-xs text-gray-500">
                <SortHeader k="time">Time</SortHeader>
                <th className="text-left">Req ID</th>
                <th className="text-left">Subkey</th>
                <th className="text-left">Provider</th>
                <th className="text-left">Model</th>
                <SortHeader k="tokens">Tokens</SortHeader>
                <SortHeader k="cost">Cost</SortHeader>
                <SortHeader k="latency">Latency</SortHeader>
                <SortHeader k="status">Status</SortHeader>
                <th className="text-left">Error</th>
              </tr>
            </thead>
            <tbody>
              {!pagedLogs.length ? (
                <tr><td colSpan={10} className="text-center text-gray-500 py-12">No requests match the current filters</td></tr>
              ) : pagedLogs.map((l, i) => (
                <tr key={i} className="border-b border-base-800 last:border-0 hover:bg-base-850/50 transition-colors">
                  <td className="py-2.5 px-4 text-xs font-mono text-gray-500 whitespace-nowrap">{fmtTime(l.created_at)}</td>
                  <td className="py-2.5 px-4 text-xs font-mono text-gray-600">{l.request_id ? String(l.request_id).slice(0, 8) : '—'}</td>
                  <td className="py-2.5 px-4 text-sm font-medium text-gray-200">{l.subkey_name || '—'}</td>
                  <td className="py-2.5 px-4 text-xs font-mono text-gray-400">{l.provider || '—'}</td>
                  <td className="py-2.5 px-4 text-xs font-mono text-gray-400">{l.model || '—'}</td>
                  <td className="py-2.5 px-4 text-xs font-mono text-gray-300">{fmtNum(l.tokens_used)} <span className="text-gray-600">({fmtNum(l.prompt_tokens || 0)}/{fmtNum(l.completion_tokens || 0)})</span></td>
                  <td className="py-2.5 px-4 text-xs font-mono text-gray-400">{fmtCost(l.estimated_cost_usd)}</td>
                  <td className="py-2.5 px-4 text-xs font-mono text-gray-500">{l.latency_ms ? `${l.latency_ms}ms` : '—'}</td>
                  <td className="py-2.5 px-4"><span className={`badge ${l.status === 'success' ? 'badge-success' : l.status === 'quota' ? 'badge-quota' : 'badge-error'}`}>{l.status}</span></td>
                  <td className="py-2.5 px-4 text-xs font-mono text-gray-500 max-w-[200px] truncate">{l.error_reason || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
        <div className="text-xs font-mono text-gray-500">Page {safePage} / {totalPages} · {filteredLogs.length} log{filteredLogs.length !== 1 ? 's' : ''} found</div>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} className="btn btn-ghost text-xs px-2.5 py-1.5"><ChevronLeft size={14} /> Previous</button>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="btn btn-ghost text-xs px-2.5 py-1.5">Next <ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  );
}
