export default function AnalyticsPage({ ctx }) {
  const { analytics, logs, fmtNum, fmtTime, loading } = ctx;
  const isLoading = loading?.overview || loading?.logs;
  const failed = logs.filter((l) => l.status !== 'success').length;
  const success = Math.max((analytics.totalRequests || 0) - failed, 0);
  const totalCost = analytics.costAttribution?.reduce((sum, row) => sum + Number(row.est_cost_usd || 0), 0) || 0;
  const providers = logs.reduce((acc, row) => {
    const key = row.provider || 'unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <section className='page active analytics-page'>
      <div className='page-header'>
        <h1 className='page-title'>Analytics</h1>
        <p className='page-sub'>Real project analytics from request logs, token usage, providers, models, and errors.</p>
      </div>

      <div className='stats mobile-quick-stats'>
        <div className='stat'><div className='stat-val'>{isLoading ? '—' : fmtNum(analytics.totalRequests)}</div><div className='stat-label'>Total requests</div></div>
        <div className='stat'><div className='stat-val'>{isLoading ? '—' : fmtNum(analytics.totalTokens)}</div><div className='stat-label'>Tokens used</div></div>
        <div className='stat'><div className='stat-val'>{isLoading ? '—' : `${analytics.avgLatency || 0}ms`}</div><div className='stat-label'>Average latency</div></div>
        <div className='stat'><div className='stat-val'>{isLoading ? '—' : `$${totalCost.toFixed(4)}`}</div><div className='stat-label'>Estimated cost</div></div>
      </div>

      <div className='analytics-grid'>
        <div className='card'>
          <div className='card-header'><div><div className='card-title'>Request health</div><div className='card-sub'>Success vs failed requests</div></div></div>
          <div className='billing-meter'><span style={{ width: `${analytics.totalRequests ? Math.round((success / analytics.totalRequests) * 100) : 0}%` }} /></div>
          <div className='billing-meter-row'><strong>{fmtNum(success)} success</strong><span>{fmtNum(failed)} failed</span></div>
        </div>
        <div className='card'>
          <div className='card-header'><div><div className='card-title'>Top models</div><div className='card-sub'>Most requested models</div></div></div>
          {!analytics.topModels?.length ? <div className='empty'><div className='empty-text'>No model usage yet</div></div> : analytics.topModels.map((m) => <div className='analytics-row' key={m.model}><span>{m.model}</span><strong>{fmtNum(m.count)}</strong></div>)}
        </div>
        <div className='card'>
          <div className='card-header'><div><div className='card-title'>Providers</div><div className='card-sub'>Traffic by upstream provider</div></div></div>
          {!Object.keys(providers).length ? <div className='empty'><div className='empty-text'>No provider traffic yet</div></div> : Object.entries(providers).sort((a, b) => b[1] - a[1]).map(([provider, count]) => <div className='analytics-row' key={provider}><span>{provider}</span><strong>{fmtNum(count)}</strong></div>)}
        </div>
      </div>

      <div className='card'>
        <div className='card-header'><div><div className='card-title'>Recent analytical events</div><div className='card-sub'>Latest 10 requests powering this dashboard</div></div></div>
        {!logs.length ? <div className='empty'><div className='empty-text'>No requests logged yet</div></div> : logs.slice(0, 10).map((l) => <div className='analytics-row' key={l.id}><span>{l.subkey_name || 'Unknown subkey'} · {l.model || 'unknown'} · {l.status}</span><strong>{fmtTime(l.created_at)}</strong></div>)}
      </div>
    </section>
  );
}
