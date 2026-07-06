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