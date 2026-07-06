import { Card, CardHeader, StatCard, Badge, EmptyState, Skeleton, QuotaBar } from '../kit';
import { fmtNum, fmtTime } from '../../contexts/LethemContext';
import { Activity, Zap, Clock, DollarSign, CheckCircle2, XCircle, Cpu, Boxes } from 'lucide-react';

export default function AnalyticsPage({ ctx }) {
  const { analytics, logs, fmtNum, fmtTime, loading } = ctx;
  const isLoading = loading?.overview || loading?.logs;
  const failed = logs.filter((l) => l.status !== 'success').length;
  const success = Math.max((analytics.totalRequests || 0) - failed, 0);
  const totalCost = analytics.costAttribution?.reduce((sum, row) => sum + Number(row.est_cost_usd || 0), 0) || 0;
  const providers = logs.reduce((acc, row) => { const key = row.provider || 'unknown'; acc[key] = (acc[key] || 0) + 1; return acc; }, {});
  const successPct = analytics.totalRequests ? Math.round((success / analytics.totalRequests) * 100) : 0;

  return (
    <div>
      <div className="mb-6"><h1 className="font-heading text-2xl font-bold tracking-tight text-gradient">Analytics</h1><p className="mt-1 text-sm text-muted-foreground">Real project analytics from request logs, token usage, providers, models, and errors.</p></div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Total requests" value={isLoading ? '—' : fmtNum(analytics.totalRequests)} icon={Activity} />
        <StatCard label="Tokens used" value={isLoading ? '—' : fmtNum(analytics.totalTokens)} icon={Zap} />
        <StatCard label="Average latency" value={isLoading ? '—' : `${analytics.avgLatency || 0}ms`} icon={Clock} />
        <StatCard label="Estimated cost" value={isLoading ? '—' : `$${totalCost.toFixed(4)}`} icon={DollarSign} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="Request health" sub="Success vs failed requests" />
          <div className="p-5">
            <div className="mb-3 flex items-end justify-between">
              <div><div className="font-mono text-2xl font-semibold">{successPct}%</div><div className="text-xs text-muted-foreground">success rate</div></div>
              <div className="text-right"><div className="text-xs text-success">{fmtNum(success)} success</div><div className="text-xs text-destructive">{fmtNum(failed)} failed</div></div>
            </div>
            <QuotaBar used={success} limit={Math.max(analytics.totalRequests || 1, 1)} tone="bg-success" />
          </div>
        </Card>

        <Card>
          <CardHeader title="Top models" sub="Most requested models" />
          <div className="p-5">
            {!analytics.topModels?.length ? <EmptyState icon={Cpu} title="No model usage yet" /> : (
              <div className="space-y-3">
                {analytics.topModels.map((m) => { const max = analytics.topModels[0]?.count || 1; return (
                  <div key={m.model}>
                    <div className="mb-1 flex items-center justify-between text-xs"><span className="font-mono truncate">{m.model}</span><span className="font-medium">{fmtNum(m.count)}</span></div>
                    <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${(m.count / max) * 100}%` }} /></div>
                  </div>
                ); })}
              </div>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Providers" sub="Traffic by upstream provider" />
          <div className="p-5">
            {!Object.keys(providers).length ? <EmptyState icon={Boxes} title="No provider traffic yet" /> : (
              <div className="space-y-3">
                {Object.entries(providers).sort((a, b) => b[1] - a[1]).map(([provider, count]) => { const max = Object.values(providers)[0] || 1; return (
                  <div key={provider}>
                    <div className="mb-1 flex items-center justify-between text-xs"><span className="capitalize">{provider}</span><span className="font-medium">{fmtNum(count)}</span></div>
                    <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden"><div className="h-full rounded-full bg-info" style={{ width: `${(count / max) * 100}%` }} /></div>
                  </div>
                ); })}
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="Recent analytical events" sub="Latest 10 requests powering this dashboard" />
        <div className="divide-y divide-border">
          {!logs.length ? <div className="p-5"><EmptyState icon={Activity} title="No requests logged yet" /></div> : logs.slice(0, 10).map((l, i) => (
            <div key={i} className="flex items-center justify-between gap-3 px-5 py-3">
              <div className="flex items-center gap-2.5 min-w-0">
                {l.status === 'success' ? <CheckCircle2 size={15} className="shrink-0 text-success" /> : <XCircle size={15} className="shrink-0 text-destructive" />}
                <span className="truncate text-sm">{l.subkey_name || 'Unknown subkey'} · {l.model || 'unknown'} · {l.status}</span>
              </div>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">{fmtTime(l.created_at)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}