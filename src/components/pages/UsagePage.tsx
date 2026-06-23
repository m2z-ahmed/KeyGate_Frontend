import { useApp } from '../../contexts/AppContext';

const limitText = (value: number | null, fmtNum: (n: number) => string) => value == null ? 'Unlimited' : fmtNum(value);

export default function UsagePage() {
  const { analytics, subkeys, projects = [], fmtNum, billing } = useApp();
  const plan = billing?.plans?.find((p) => p.id === billing.currentPlan) || billing?.plans?.find((p) => p.id === 'free');
  const limits = plan?.limits || { projects: 3, subkeys: 20, tokens: 2000000, logsDays: 30 };
  const rows = [
    { label: 'Projects', used: projects.length, limit: limits.projects, helper: 'Organization workspaces' },
    { label: 'Subkeys', used: subkeys.length, limit: limits.subkeys, helper: 'API access keys' },
    { label: 'Monthly tokens', used: analytics.totalTokens || 0, limit: limits.tokens, helper: 'Proxy token usage' },
    { label: 'Log retention', used: limits.logsDays || 0, limit: limits.logsDays || 0, helper: 'Days retained by plan' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-100 mb-1">Usage</h1>
        <p className="text-sm text-gray-500">Live usage against the current account subscription limits.</p>
      </div>

      <div className="card p-5 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div><div className="text-xs text-gray-500 mb-1">Current plan</div><div className="text-sm font-semibold text-gray-100">{plan?.name || 'Free'}</div></div>
          <div><div className="text-xs text-gray-500 mb-1">Subscription source</div><div className="text-sm font-semibold text-gray-100">Account-level</div></div>
          <div><div className="text-xs text-gray-500 mb-1">Charged currency</div><div className="text-sm font-semibold text-gray-100">{billing?.currency || 'INR'}</div></div>
        </div>
      </div>

      <div className="space-y-4">
        {rows.map((row) => {
          const pct = row.limit ? Math.min(100, Math.round((row.used / row.limit) * 100)) : 12;
          const barColor = pct > 90 ? 'bg-danger-500' : pct > 70 ? 'bg-accent-500' : 'bg-primary-500';
          return (
            <div key={row.label} className="card p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-sm font-semibold text-gray-100">{row.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{row.helper}</div>
                </div>
                <div className="text-sm font-mono text-gray-300">{fmtNum(row.used)} / {limitText(row.limit, fmtNum)}</div>
              </div>
              <div className="h-2 bg-base-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
