import { useApp } from '../../contexts/AppContext';
import { StatCard, Skeleton, EmptyState, QuotaBar } from '../ui';
import { Activity, AlertTriangle, CheckCircle2, DollarSign, Zap, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

export default function OverviewPage({ navigate }: { navigate: (p: string) => void }) {
  const { subkeys, logs, analytics, fmtNum, fmtTime, quotaColor, loading } = useApp();
  const isLoading = loading?.overview;

  const failed = logs.filter((l) => l.status !== 'success').length;
  const costUsed = analytics.costAttribution?.reduce((s, r) => s + (r.est_cost_usd || 0), 0) || 0;
  const todayBySubkey = logs.reduce<Record<string, number>>((acc, l) => {
    acc[l.subkey_name || '—'] = (acc[l.subkey_name || '—'] || 0) + (l.tokens_used || 0);
    return acc;
  }, {});
  const topUser = Object.entries(todayBySubkey).sort((a, b) => b[1] - a[1])[0];
  const recentActivity = logs.slice(0, 5);
  const prevReq = logs.slice(15, 30).length || 1;
  const reqTrend = Math.round(((logs.slice(0, 15).length - prevReq) / prevReq) * 100);
  const prevFail = logs.slice(15, 30).filter((l) => l.status !== 'success').length || 1;
  const failTrend = Math.round(((logs.slice(0, 15).filter((l) => l.status !== 'success').length - prevFail) / prevFail) * 100);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-100 mb-1">Overview</h1>
        <p className="text-sm text-gray-500">Observability dashboard for proxy usage</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Requests" value={isLoading ? '' : fmtNum(analytics.totalRequests)} loading={isLoading} icon={<Activity size={16} />}
          trend={isLoading ? undefined : (
            <span className={reqTrend >= 0 ? 'text-success-400' : 'text-danger-400'}>
              {reqTrend >= 0 ? <TrendingUp size={12} className="inline" /> : <TrendingDown size={12} className="inline" />} {Math.abs(reqTrend)}%
            </span>
          ) as any} />
        <StatCard label="Failed" value={isLoading ? '' : fmtNum(failed)} loading={isLoading} icon={<AlertTriangle size={16} />}
          trend={isLoading ? undefined : (
            <span className={failTrend >= 0 ? 'text-danger-400' : 'text-success-400'}>
              {failTrend >= 0 ? <TrendingUp size={12} className="inline" /> : <TrendingDown size={12} className="inline" />} {Math.abs(failTrend)}%
            </span>
          ) as any} />
        <StatCard label="Cost" value={isLoading ? '' : `$${costUsed.toFixed(2)}`} loading={isLoading} icon={<DollarSign size={16} />} />
        <StatCard label="Latency" value={isLoading ? '' : (analytics.avgLatency || '—')} loading={isLoading} icon={<Zap size={16} />} />
      </div>

      {/* Health & abuse detection */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-100">Health & abuse detection</h2>
            <p className="text-xs text-gray-500 mt-0.5">Fast signal check before deep analytics</p>
          </div>
          <button onClick={() => navigate('logs')} className="btn btn-ghost text-xs">Inspect logs <ArrowRight size={14} /></button>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Skeleton className="h-20" /><Skeleton className="h-20" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-lg bg-base-850 border border-base-700">
              <div className="text-xs text-gray-500 mb-1">Top user</div>
              <div className="text-sm font-mono text-gray-200">{topUser ? `${topUser[0]} — ${fmtNum(topUser[1])} tokens` : '—'}</div>
            </div>
            <div className="p-4 rounded-lg bg-base-850 border border-base-700">
              <div className="text-xs text-gray-500 mb-1">Abuse detection</div>
              <div className="text-sm flex items-center gap-2">
                {failed > analytics.totalRequests * 0.35 ? (
                  <><AlertTriangle size={16} className="text-danger-400" /> <span className="text-danger-400">High error ratio detected</span></>
                ) : (
                  <><CheckCircle2 size={16} className="text-success-400" /> <span className="text-success-400">No suspicious activity</span></>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Usage graph */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-100">Usage graph</h2>
            <p className="text-xs text-gray-500 mt-0.5">Proxy requests trend</p>
          </div>
          <div className="flex gap-1">
            {['24H', '7D', '30D'].map((t) => (
              <button key={t} className="px-2.5 py-1 text-xs rounded-md text-gray-500 hover:text-gray-300 hover:bg-base-800 transition-colors">{t}</button>
            ))}
          </div>
        </div>
        {isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : (
          <div className="flex items-end gap-1 h-20">
            {logs.slice(0, 30).reverse().map((l, i) => (
              <div
                key={i}
                title={`${l.subkey_name || '—'} | ${l.model || '—'} | ${fmtNum(l.tokens_used)} tokens | ${l.status}`}
                className="flex-1 min-w-[4px] bg-primary-500/70 hover:bg-primary-400 rounded-sm transition-all duration-200 hover:scale-y-110 cursor-default"
                style={{ height: `${Math.max(8, Math.min(64, (l.tokens_used || 1) / 20))}px` }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-100">Recent activity</h2>
            <button onClick={() => navigate('logs')} className="btn btn-ghost text-xs">Open logs <ArrowRight size={14} /></button>
          </div>
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
          ) : !recentActivity.length ? (
            <EmptyState title="No activity yet" />
          ) : (
            <div className="space-y-0">
              {recentActivity.map((l, i) => (
                <div key={i} className="flex items-center justify-between gap-3 py-2.5 border-b border-base-800 last:border-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${l.status === 'success' ? 'bg-success-500' : 'bg-danger-500'}`} />
                    <span className="text-sm text-gray-300 truncate">{l.subkey_name || 'Unknown subkey'}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-mono flex-shrink-0">{fmtTime(l.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subkey usage snapshot */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-100">Subkey usage snapshot</h2>
              <p className="text-xs text-gray-500 mt-0.5">Quota consumption across all active keys</p>
            </div>
            <button onClick={() => navigate('subkeys')} className="btn btn-ghost text-xs">Manage <ArrowRight size={14} /></button>
          </div>
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : !subkeys.length ? (
            <EmptyState title="No subkeys yet" action={<button onClick={() => navigate('subkeys')} className="btn btn-primary text-xs">Create one</button>} />
          ) : (
            <div className="space-y-0">
              {subkeys.slice(0, 5).map((sk) => {
                const col = quotaColor(sk.tokens_used, sk.monthly_token_limit);
                return (
                  <div key={sk.id} className="flex items-center gap-4 py-3 border-b border-base-800 last:border-0">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-200 mb-1.5 truncate">{sk.name}</div>
                      <QuotaBar used={sk.tokens_used} limit={sk.monthly_token_limit} color={col} />
                    </div>
                    <span className={`badge ${sk.status === 'active' ? 'badge-active' : sk.status === 'paused' ? 'badge-paused' : 'badge-revoked'}`}>{sk.status}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
