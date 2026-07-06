import { Card, CardHeader, QuotaBar } from '../kit';
import { fmtNum } from '../../contexts/LethemContext';
import { CheckCircle2 } from 'lucide-react';

const limitText = (value, fmtNum) => value == null ? 'Unlimited' : fmtNum(value);

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
    <div>
      <div className="mb-6"><h1 className="font-heading text-2xl font-bold tracking-tight text-gradient">Usage</h1><p className="mt-1 text-sm text-muted-foreground">Live usage against the current account subscription limits.</p></div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Card className="p-4"><div className="text-xs text-muted-foreground">Current plan</div><div className="mt-1 font-semibold">{plan?.name || 'Free'}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Subscription source</div><div className="mt-1 font-semibold">Account-level</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Charged currency</div><div className="mt-1 font-semibold">{billing?.currency || 'INR'}</div></Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map(([label, used, limit, helper]) => {
          const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : 12;
          const tone = pct > 90 ? 'bg-destructive' : pct > 70 ? 'bg-warning' : 'bg-success';
          return (
            <Card key={label} className="p-5">
              <div className="flex items-center justify-between"><span className="text-sm font-semibold">{label}</span><span className="text-xs text-muted-foreground">{helper}</span></div>
              <div className="mt-3 font-mono text-lg font-semibold">{fmtNum(used)} / {limitText(limit, fmtNum)}</div>
              <div className="mt-3"><QuotaBar used={used} limit={limit} tone={tone} /></div>
              <div className="mt-2 text-xs text-muted-foreground">{pct}% used</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}