const limitText = (value, fmtNum) => value == null ? '*Unlimited' : fmtNum(value);

export default function UsagePage({ ctx, billing }) {
  const { analytics, subkeys, projects = [], fmtNum } = ctx;
  const plan = billing?.plans?.find((p) => p.id === billing.currentPlan) || billing?.plans?.find((p) => p.id === 'free');
  const limits = plan?.limits || { projects: 3, subkeys: 20, tokens: 2000000, logsDays: 30 };
  const rows = [
    ['Projects', projects.length, limits.projects, 'Organization workspaces'],
    ['Subkeys', subkeys.length, limits.subkeys, 'API access keys'],
    ['Monthly tokens', analytics.totalTokens || 0, limits.tokens, 'Proxy token usage'],
    ['Log retention', limits.logsDays || 0, limits.logsDays || 0, 'Days retained by plan'],
  ];

  return (
    <section className='page active usage-page'>
      <div className='page-header'>
        <h1 className='page-title'>Usage</h1>
        <p className='page-sub'>Live usage against the current account subscription limits.</p>
      </div>
      <div className='billing-current card'>
        <div><div className='muted'>Current plan</div><strong>{plan?.name || 'Free'}</strong></div>
        <div><div className='muted'>Subscription source</div><strong>Account-level</strong></div>
        <div><div className='muted'>Charged currency</div><strong>{billing?.currency || 'INR'}</strong></div>
      </div>
      <div className='usage-list'>
        {rows.map(([label, used, limit, helper]) => {
          const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : 12;
          return <div className='card usage-card' key={label}>
            <div className='usage-card-head'><div><strong>{label}</strong><span>{helper}</span></div><b>{fmtNum(used)} / {limitText(limit, fmtNum)}</b></div>
            <div className='billing-meter'><span style={{ width: `${pct}%` }} /></div>
          </div>;
        })}
      </div>
    </section>
  );
}
