import { useApp } from '../../contexts/AppContext';
import { StatCard, Skeleton, EmptyState } from '../ui';
import { Activity, Zap, Clock, DollarSign } from 'lucide-react';

export default function AnalyticsPage() {
  const { analytics, logs, fmtNum, fmtTime, loading } = useApp();
  const isLoading = loading?.overview || loading?.logs;
  const failed = logs.filter((l) => l.status !== 'success').length;
  const success = Math.max((analytics.totalRequests || 0) - failed, 0);
  const totalCost = analytics.costAttribution?.reduce((sum, row) => sum + Number(row.est_cost_usd || 0), 0) || 0;
  const providers = logs.reduce<Record<string, number>>((acc, row) => {
    const key = row.provider || 'unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const maxProviderCount = Math.max(...Object.values(providers), 1);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-100 mb-1">Analytics</h1>
        <p className="text-sm text-gray-500">Real project analytics from request logs, token usage, providers, models, and errors.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total requests" value={isLoading ? '' : fmtNum(analytics.totalRequests)} loading={isLoading} icon={<Activity size={16} />} />
        <StatCard label="Tokens used" value={isLoading ? '' : fmtNum(analytics.totalTokens)} loading={isLoading} icon={<Zap size={16} />} />
        <StatCard label="Avg latency" value={isLoading ? '' : `${analytics.avgLatency || 0}ms`} loading={isLoading} icon={<Clock size={16} />} />
        <StatCard label="Estimated cost" value={isLoading ? '' : `$${totalCost.toFixed(4)}`} loading={isLoading} icon={<DollarSign size={16} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Request health */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-100 mb-1">Request health</h2>
          <p className="text-xs text-gray-500 mb-4">Success vs failed requests</p>
          {isLoading ? <Skeleton className="h-3 w-full mb-2" /> : (
            <>
              <div className="h-2 bg-base-800 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-success-500 transition-all duration-500" style={{ width: `${analytics.totalRequests ? Math.round((success / analytics.totalRequests) * 100) : 0}%` }} />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-success-400 font-medium">{fmtNum(success)} success</span>
                <span className="text-danger-400 font-medium">{fmtNum(failed)} failed</span>
              </div>
            </>
          )}
        </div>

        {/* Top models */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-100 mb-1">Top models</h2>
          <p className="text-xs text-gray-500 mb-4">Most requested models</p>
          {isLoading ? <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-6" />)}</div>
            : !analytics.topModels?.length ? <EmptyState title="No model usage yet" />
            : <div className="space-y-0">
                {analytics.topModels.map((m) => (
                  <div key={m.model} className="flex justify-between py-2 border-b border-base-800 last:border-0">
                    <span className="text-sm text-gray-300 font-mono">{m.model}</span>
                    <span className="text-sm font-semibold text-gray-100">{fmtNum(m.count)}</span>
                  </div>
                ))}
              </div>}
        </div>

        {/* Providers */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-100 mb-1">Providers</h2>
          <p className="text-xs text-gray-500 mb-4">Traffic by upstream provider</p>
          {isLoading ? <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-6" />)}</div>
            : !Object.keys(providers).length ? <EmptyState title="No provider traffic yet" />
            : <div className="space-y-0">
                {Object.entries(providers).sort((a, b) => b[1] - a[1]).map(([provider, count]) => (
                  <div key={provider} className="py-2 border-b border-base-800 last:border-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300 font-mono">{provider}</span>
                      <span className="text-sm font-semibold text-gray-100">{fmtNum(count)}</span>
                    </div>
                    <div className="h-1 bg-base-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500/60" style={{ width: `${(count / maxProviderCount) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>}
        </div>
      </div>

      {/* Recent events */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-gray-100 mb-1">Recent analytical events</h2>
        <p className="text-xs text-gray-500 mb-4">Latest 10 requests powering this dashboard</p>
        {isLoading ? <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-6" />)}</div>
          : !logs.length ? <EmptyState title="No requests logged yet" />
          : <div className="space-y-0">
              {logs.slice(0, 10).map((l, i) => (
                <div key={i} className="flex justify-between py-2.5 border-b border-base-800 last:border-0">
                  <span className="text-sm text-gray-300 truncate">{l.subkey_name || 'Unknown subkey'} · {l.model || 'unknown'} · {l.status}</span>
                  <span className="text-xs text-gray-500 font-mono flex-shrink-0 ml-3">{fmtTime(l.created_at)}</span>
                </div>
              ))}
            </div>}
      </div>
    </div>
  );
}
