import { Card, CardHeader, StatCard, QuotaBar, Badge, Button, Skeleton, EmptyState } from '../kit';
import { fmtNum, quotaColor, fmtTime } from '../../contexts/LethemContext';
import { Activity, AlertTriangle, ArrowRight, TrendingUp, TrendingDown, Zap, DollarSign, Clock, ShieldCheck, BarChart3 } from 'lucide-react';

function SkelStat() { return <div className="rounded-xl border border-border bg-card/60 p-5"><Skeleton className="h-3 w-20" /><Skeleton className="mt-3 h-7 w-28" /></div>; }

export default function OverviewPage({ ctx, navigate }) {
  const { subkeys, logs, analytics, fmtNum, quotaColor, fmtTime, loading } = ctx;
  const failed = logs.filter((l) => l.status !== 'success').length;
  const costUsed = analytics.costAttribution?.reduce((s, r) => s + (r.est_cost_usd || 0), 0) || 0;
  const todayBySubkey = logs.reduce((acc, l) => { acc[l.subkey_name || '—'] = (acc[l.subkey_name || '—'] || 0) + (l.tokens_used || 0); return acc; }, {});
  const topUser = Object.entries(todayBySubkey).sort((a, b) => b[1] - a[1])[0];
  const recentActivity = logs.slice(0, 4);
  const prevReq = logs.slice(15, 30).length || 1;
  const reqTrend = Math.round(((logs.slice(0, 15).length - prevReq) / prevReq) * 100);
  const prevFail = logs.slice(15, 30).filter((l) => l.status !== 'success').length || 1;
  const failTrend = Math.round(((logs.slice(0, 15).filter((l) => l.status !== 'success').length - prevFail) / prevFail) * 100);
  const isLoading = loading?.overview;

  const maxBar = Math.max(1, ...logs.slice(0, 30).map((l) => l.tokens_used || 0));

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-gradient">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Observability dashboard for proxy usage</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => <SkelStat key={i} />) : (
          <>
            <StatCard label="Requests" value={fmtNum(analytics.totalRequests)} delta={`${reqTrend >= 0 ? '↑' : '↓'}${Math.abs(reqTrend)}%`} icon={Activity} />
            <StatCard label="Failed" value={fmtNum(failed)} delta={`${failTrend >= 0 ? '↑' : '↓'}${Math.abs(failTrend)}%`} icon={AlertTriangle} />
            <StatCard label="Cost" value={`$${costUsed.toFixed(2)}`} icon={DollarSign} />
            <StatCard label="Latency" value={analytics.avgLatency || '—'} icon={Clock} />
          </>
        )}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="Health & abuse detection" sub="Fast signal check before deep analytics" actions={<Button variant="ghost" size="sm" onClick={() => navigate('logs')}>Inspect <ArrowRight size={14} /></Button>} />
          <div className="p-5 space-y-4">
            {isLoading ? <Skeleton className="h-16 w-full" /> : (
              <>
                <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
                  <span className="text-xs text-muted-foreground">Top user</span>
                  <span className="text-xs font-medium">{topUser ? `${topUser[0]} — ${fmtNum(topUser[1])} tokens` : '—'}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
                  <span className="text-xs text-muted-foreground">Abuse detection</span>
                  {failed > analytics.totalRequests * 0.35
                    ? <Badge tone="warning"><AlertTriangle size={11} /> High error ratio</Badge>
                    : <Badge tone="success"><ShieldCheck size={11} /> No suspicious activity</Badge>}
                </div>
              </>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Usage graph" sub="Proxy requests trend" />
          <div className="p-5">
            {isLoading ? <Skeleton className="h-28 w-full" /> : (
              <div className="flex h-28 items-end gap-1">
                {logs.slice(0, 30).reverse().map((l, i) => (
                  <div key={i} className="flex-1 min-w-[3px] rounded-t bg-gradient-to-t from-primary/40 to-primary transition-all hover:from-primary hover:to-primary/80" style={{ height: `${Math.max(4, ((l.tokens_used || 0) / maxBar) * 100)}%` }} title={`${fmtNum(l.tokens_used || 0)} tokens`} />
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Recent activity" sub="Latest proxy events" actions={<Button variant="ghost" size="sm" onClick={() => navigate('logs')}>Open logs <ArrowRight size={14} /></Button>} />
          <div className="p-3">
            {isLoading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="mb-2 h-12 w-full" />) : !recentActivity.length ? (
              <EmptyState icon={Activity} title="No activity yet" />
            ) : recentActivity.map((l, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-secondary/40 transition-colors">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{l.subkey_name || 'Unknown subkey'}</div>
                  <div className="text-xs text-muted-foreground">{fmtTime(l.created_at)}</div>
                </div>
                <Badge tone={l.status === 'success' ? 'success' : 'danger'}>{l.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Subkey usage snapshot" sub="Quota consumption across active keys" actions={<Button variant="ghost" size="sm" onClick={() => navigate('subkeys')}>Manage <ArrowRight size={14} /></Button>} />
          <div className="p-5 space-y-3">
            {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />) : !subkeys.length ? (
              <EmptyState icon={BarChart3} title="No subkeys yet" description="Create a subkey to start tracking usage." action={<Button size="sm" onClick={() => navigate('subkeys')}>Create one</Button>} />
            ) : subkeys.slice(0, 5).map((sk) => {
              const pct = Math.min(100, Math.round((sk.tokens_used / sk.monthly_token_limit) * 100));
              return (
                <div key={sk.id}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium">{sk.name}</span>
                    <span className="font-mono text-muted-foreground">{fmtNum(sk.tokens_used)} / {fmtNum(sk.monthly_token_limit)}</span>
                  </div>
                  <QuotaBar used={sk.tokens_used} limit={sk.monthly_token_limit} tone={quotaColor(sk.tokens_used, sk.monthly_token_limit) === 'over' ? 'bg-destructive' : quotaColor(sk.tokens_used, sk.monthly_token_limit) === 'warn' ? 'bg-warning' : 'bg-success'} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}