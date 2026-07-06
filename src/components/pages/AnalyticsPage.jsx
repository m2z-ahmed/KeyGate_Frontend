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