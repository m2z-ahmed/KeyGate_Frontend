import { useMemo, useState } from 'react';
import { Card, Badge, Input, Button, EmptyState, Skeleton, cn } from '../kit';
import { fmtNum, fmtTime } from '../../contexts/LethemContext';
import { ScrollText, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const fmtCost = (v) => Number(v || 0) ? `$${Number(v).toFixed(6)}` : '—';
const STATUSES = ['all', 'success', 'error', 'quota'];

export default function LogsPage({ ctx }) {
  const { logs, fmtNum, fmtTime, loading } = ctx;
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const toggleSort = (key) => { if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc'); else { setSortKey(key); setSortDir('asc'); } };

  const filteredLogs = useMemo(() => {
    let list = logs;
    if (startDate) { const start = new Date(startDate).getTime() / 1000; list = list.filter((l) => (l.created_at || 0) >= start); }
    if (endDate) { const end = new Date(endDate).getTime() / 1000 + 86400; list = list.filter((l) => (l.created_at || 0) <= end); }
    if (statusFilter !== 'all') list = list.filter((l) => l.status === statusFilter);
    if (sourceFilter) list = list.filter((l) => (l.source || 'external') === sourceFilter);
    if (sortKey) {
      list = [...list].sort((a, b) => {
        let av, bv;
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
  }, [logs, sortKey, sortDir, statusFilter, sourceFilter, startDate, endDate]);

  const pageSize = 30;
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedLogs = filteredLogs.slice((safePage - 1) * pageSize, safePage * pageSize);
  const sourceCounts = logs.reduce((a, l) => { const k = l.source || 'external'; a[k] = (a[k] || 0) + 1; return a; }, {});

  const SortHeader = ({ k, children }) => (
    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
      <button onClick={() => toggleSort(k)} className="inline-flex items-center gap-1 hover:text-foreground transition-colors">{children} {sortKey === k && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}</button>
    </th>
  );

  return (
    <div>
      <div className="mb-6"><h1 className="font-heading text-2xl font-bold tracking-tight text-gradient">Request logs</h1><p className="mt-1 text-sm text-muted-foreground">Every request proxied through Lethem</p></div>

      <Card className="mb-4 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(sourceCounts).map(([k, v]) => (
            <button key={k} onClick={() => { setSourceFilter((c) => c === k ? '' : k); setPage(1); }} className={cn('rounded-lg px-3 py-1.5 text-xs font-medium transition-colors', sourceFilter === k ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground hover:text-foreground')}><span className="capitalize">{k}</span>: {v}</button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <Input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(1); }} className="w-auto" />
            <span className="text-xs text-muted-foreground">to</span>
            <Input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(1); }} className="w-auto" />
            {(startDate || endDate) && <Button variant="ghost" size="sm" onClick={() => { setStartDate(''); setEndDate(''); setPage(1); }}>Clear</Button>}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={cn('rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors', statusFilter === s ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground hover:text-foreground')}>{s === 'all' ? 'All' : s}</button>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        {loading?.logs ? <div className="p-4 space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
        : !pagedLogs.length ? <div className="p-5"><EmptyState icon={ScrollText} title="No requests match the current filters" /></div>
        : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-secondary/40">
                <tr>
                  <SortHeader k="time">Time</SortHeader><th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Req ID</th><th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Subkey</th><th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Provider</th><th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Model</th><SortHeader k="tokens">Tokens</SortHeader><SortHeader k="cost">Cost</SortHeader><SortHeader k="latency">Latency</SortHeader><SortHeader k="status">Status</SortHeader><th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pagedLogs.map((l, i) => (
                  <tr key={i} className="text-sm transition-colors hover:bg-secondary/20">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">{fmtTime(l.created_at)}</td>
                    <td className="px-4 py-3 font-mono text-xs">{l.request_id ? String(l.request_id).slice(0, 8) : '—'}</td>
                    <td className="px-4 py-3">{l.subkey_name || '—'}</td>
                    <td className="px-4 py-3">{l.provider || '—'}</td>
                    <td className="px-4 py-3 font-mono text-xs">{l.model || '—'}</td>
                    <td className="px-4 py-3 font-mono text-xs">{fmtNum(l.tokens_used)} <span className="text-muted-foreground">({fmtNum(l.prompt_tokens || 0)}/{fmtNum(l.completion_tokens || 0)})</span></td>
                    <td className="px-4 py-3 font-mono text-xs">{fmtCost(l.estimated_cost_usd)}</td>
                    <td className="px-4 py-3 font-mono text-xs">{l.latency_ms ? `${l.latency_ms}ms` : '—'}</td>
                    <td className="px-4 py-3"><Badge tone={l.status === 'success' ? 'success' : 'danger'}>{l.status}</Badge></td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-xs text-muted-foreground" title={l.error_reason}>{l.error_reason || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>Page {safePage} / {totalPages} · {filteredLogs.length} log{filteredLogs.length !== 1 ? 's' : ''}</span>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}><ChevronLeft size={14} /> Prev</Button>
          <Button variant="outline" size="sm" disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next <ChevronRight size={14} /></Button>
        </div>
      </div>
    </div>
  );
}