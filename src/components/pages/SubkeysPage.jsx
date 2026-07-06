import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Badge, Input, Label, Select, Modal, EmptyState, Skeleton, cn } from '../kit';
import { FALLBACK_PROVIDERS, providerLabel, providerModels as getProviderModels, parseAllowedModels } from '../../lib/providers';
import { fmtNum, fmtDate, quotaColor } from '../../contexts/LethemContext';
import { KeySquare, Plus, Copy, Check, Pencil, Receipt, Eye, ChevronUp, ChevronDown, Search, RefreshCw } from 'lucide-react';

const fmtCost = (v) => Number(v || 0) ? `$${Number(v).toFixed(6)}` : '—';
const pctUsed = (used, limit) => Math.min(100, Math.round(((Number(used) || 0) / Math.max(Number(limit) || 1, 1)) * 100));
const getMaskedSubkey = (sk) => sk?.token_preview || `${sk?.token_prefix || 'sk-kg-'}••••••••${sk?.token_suffix || ''}`;
const slugifyFilePart = (v) => String(v || 'Subkey').trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'Subkey';

function exportReceiptPdf(receipt) {
  const popup = window.open('', '_blank', 'width=1000,height=900');
  if (!popup) return false;
  const rows = receipt.relatedLogs.length
    ? receipt.relatedLogs.map((log) => `<tr><td>${String(log.request_id || '').slice(0, 10) || '—'}</td><td>${log.provider || receipt.providerId}</td><td>${log.model || '—'}</td><td>${log.tokens_used || 0}</td><td>${fmtCost(log.estimated_cost_usd)}</td><td>${log.status || '—'}</td></tr>`).join('')
    : '<tr><td colspan="6">No request logs available yet.</td></tr>';
  popup.document.open();
  popup.document.write(`<!doctype html><html><head><title>${receipt.fileName}</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#111}h1{color:#7c6bff}table{width:100%;border-collapse:collapse;margin-top:16px}td,th{border:1px solid #ddd;padding:8px;text-align:left;font-size:13px}</style></head><body>
  <h1>Lethem Subkey Receipt</h1>
  <p><strong>${receipt.name}</strong> — <code>${receipt.token}</code></p>
  <p>Project: ${receipt.projectName} (${receipt.projectSlug}) · Provider: ${receipt.provider}</p>
  <p>Quota: ${receipt.quotaUsed} / ${receipt.quotaLimit} tokens (${receipt.quotaPct}%) · Requests: ${receipt.requestsUsed} / ${receipt.requestsLimit}</p>
  <p>Total spent: ${receipt.totalSpentUsd} · Expiry: ${receipt.expiry} · Allowed models: ${receipt.allowedModels}</p>
  <h2>Recent Request Logs</h2>
  <table><thead><tr><th>Request</th><th>Provider</th><th>Model</th><th>Tokens</th><th>Cost</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>
  <p style="margin-top:24px;color:#888;font-size:12px">Generated ${receipt.generatedAt} · Receipt ${receipt.receiptNo}</p>
  </body></html>`);
  popup.document.close();
  popup.document.title = receipt.fileName;
  popup.setTimeout(() => { popup.focus(); popup.print(); }, 250);
  return true;
}

export default function SubkeysPage({ ctx }) {
  const { subkeys, api, loadSubkeys, loadMasterKeys, masterKeys, notify, fmtNum, fmtDate, quotaColor, modal, setModal, setRevealedToken, revealedToken, providers = FALLBACK_PROVIDERS, logs = [], selectedProject, copyText, copiedItem, loading } = ctx;
  const providerOptions = providers.length ? providers : FALLBACK_PROVIDERS;
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('openai');
  const [limit, setLimit] = useState(50000);
  const [maxRequests, setMaxRequests] = useState(5000);
  const [spend, setSpend] = useState('');
  const [expiry, setExpiry] = useState('');
  const [modelSearch, setModelSearch] = useState('');
  const [selectedModels, setSelectedModels] = useState(['all']);
  const [masterKeyId, setMasterKeyId] = useState('');
  const [autoRoute, setAutoRoute] = useState(false);
  const [editingSubkey, setEditingSubkey] = useState(null);
  const [editLimit, setEditLimit] = useState('');
  const [editMaxRequests, setEditMaxRequests] = useState('');
  const [editExpiry, setEditExpiry] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [revealCopied, setRevealCopied] = useState(false);

  const toggleSort = (key) => { if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc'); else { setSortKey(key); setSortDir('asc'); } };

  const filteredSubkeys = useMemo(() => {
    let list = statusFilter === 'all' ? subkeys : subkeys.filter((s) => s.status === statusFilter);
    if (!sortKey) return list;
    return [...list].sort((a, b) => {
      let av, bv;
      if (sortKey === 'name') { av = a.name?.toLowerCase() || ''; bv = b.name?.toLowerCase() || ''; }
      else if (sortKey === 'provider') { av = a.provider || ''; bv = b.provider || ''; }
      else if (sortKey === 'quota') { av = a.tokens_used / Math.max(a.monthly_token_limit, 1); bv = b.tokens_used / Math.max(b.monthly_token_limit, 1); }
      else if (sortKey === 'requests') { av = a.request_count || 0; bv = b.request_count || 0; }
      else if (sortKey === 'expires') { av = a.expires_at || 0; bv = b.expires_at || 0; }
      else if (sortKey === 'status') { av = a.status || ''; bv = b.status || ''; }
      const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [subkeys, sortKey, sortDir, statusFilter]);

  useEffect(() => { loadMasterKeys(); }, []);

  const providerModels = getProviderModels(providerOptions, provider);
  const filteredModels = providerModels.filter((m) => m.toLowerCase().includes(modelSearch.toLowerCase()));

  const createSubkey = async () => {
    if (!name.trim()) return notify('Enter a name', 'error');
    const providerKeys = masterKeys.filter((mk) => mk.provider === provider);
    if (!providerKeys.length) return notify('Add a Master Key first', 'error');
    const allowed_models = selectedModels.includes('all') ? ['all'] : selectedModels.filter((m) => providerModels.includes(m));
    const sk = await api('/api/subkeys', { method: 'POST', body: { name: name.trim(), provider, master_key_id: masterKeyId || null, auto_route_on_exhausted: autoRoute, monthly_token_limit: Number(limit) || 50000, max_requests: Number(maxRequests) || 5000, allowed_models, spend_limit_usd: spend ? Number(spend) : null, expires_in_days: expiry ? Number(expiry) : null } });
    if (sk.error) return notify(sk.error, 'error');
    setName(''); setProvider('openai'); setLimit(50000); setMaxRequests(5000); setSpend(''); setExpiry(''); setSelectedModels(['all']); setMasterKeyId(''); setAutoRoute(false);
    setRevealedToken(sk.token); setModal('tokenreveal'); loadSubkeys();
  };

  const openEdit = (sk) => { setEditingSubkey(sk); setEditLimit(sk.monthly_token_limit || 50000); setEditMaxRequests(sk.max_requests || 5000); setEditExpiry(''); setModal('editsubkey'); };

  const saveEdit = async () => {
    setSavingEdit(true);
    try {
      await api(`/api/subkeys/${editingSubkey.id}`, { method: 'PATCH', body: { monthly_token_limit: Number(editLimit) || 50000, max_requests: Number(editMaxRequests) || 5000, expires_in_days: editExpiry ? Number(editExpiry) : null } });
      notify('Subkey updated'); setModal(''); await loadSubkeys();
    } catch (e) { notify(e.message, 'error'); }
    finally { setSavingEdit(false); }
  };

  const toggleStatus = async (sk) => {
    setStatusLoading(true);
    try { await api(`/api/subkeys/${sk.id}`, { method: 'PATCH', body: { status: sk.status === 'active' ? 'paused' : 'active' } }); await loadSubkeys(); }
    catch (e) { notify(e.message, 'error'); }
    finally { setStatusLoading(false); }
  };

  const openReceipt = async (sk) => {
    if (!Number(sk.tokens_used || 0)) { notify('No quota usage found for this subkey', 'error'); return; }
    const an = await api('/api/analytics').catch(() => ({}));
    const relatedLogs = (an.logs || []).filter((log) => { const id = log.subkey_id || log.subkeyId || log.subkey; return (sk.id && id && String(id) === String(sk.id)) || (log.subkey_name && sk.name && log.subkey_name === sk.name); }).slice(0, 8);
    const totalTokens = relatedLogs.reduce((s, log) => s + (Number(log.tokens_used) || 0), 0);
    const totalCost = relatedLogs.reduce((s, log) => s + (Number(log.estimated_cost_usd) || 0), 0);
    const fileDate = new Date().toISOString().slice(0, 10);
    exportReceiptPdf({
      receiptNo: `LT-${String(sk.id || Date.now()).slice(0, 8).toUpperCase()}-${Date.now().toString().slice(-5)}`,
      fileName: `Lethem-${slugifyFilePart(sk.name)}-Subkey-Receipt-${fileDate}.pdf`,
      generatedAt: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      projectName: selectedProject?.name || 'Current project', projectSlug: selectedProject?.slug || selectedProject?.id || '—',
      name: sk.name || 'Untitled subkey', token: getMaskedSubkey(sk),
      provider: providerLabel(providerOptions, sk.provider) || sk.provider || '—', providerId: sk.provider || '—',
      status: sk.status || '—', quotaUsed: fmtNum(sk.tokens_used || 0), quotaLimit: fmtNum(sk.monthly_token_limit || 0), quotaPct: pctUsed(sk.tokens_used, sk.monthly_token_limit),
      requestsUsed: fmtNum(sk.request_count || 0), requestsLimit: fmtNum(sk.max_requests || 5000), expiry: fmtDate(sk.expires_at),
      allowedModels: Array.isArray(sk.allowed_models) && sk.allowed_models.length ? sk.allowed_models.join(', ') : 'All approved models',
      relatedLogs, totalSpentUsd: totalCost ? `$${totalCost.toFixed(6)}` : '$0.000000',
    });
  };

  const SortHeader = ({ k, children }) => (
    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
      <button onClick={() => toggleSort(k)} className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
        {children} {sortKey === k && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
      </button>
    </th>
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="font-heading text-2xl font-bold tracking-tight text-gradient">Subkeys</h1><p className="mt-1 text-sm text-muted-foreground">Scoped, revocable keys your clients actually use</p></div>
        <Button onClick={() => setModal('create')}><Plus size={15} /> New subkey</Button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {['all', 'active', 'paused', 'revoked'].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={cn('rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors', statusFilter === s ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground hover:text-foreground')}>{s}</button>
        ))}
        <div className="ml-auto text-xs text-muted-foreground">{filteredSubkeys.length} subkey{filteredSubkeys.length !== 1 ? 's' : ''}</div>
      </div>

      <Card className="overflow-hidden p-0">
        {loading?.subkeys ? <div className="p-4 space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        : !filteredSubkeys.length ? <div className="p-5"><EmptyState icon={KeySquare} title="No subkeys yet" description="Create a scoped subkey to start proxying requests." action={<Button size="sm" onClick={() => setModal('create')}><Plus size={14} /> New subkey</Button>} /></div>
        : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-secondary/40">
                <tr>
                  <SortHeader k="name">Name</SortHeader>
                  <SortHeader k="provider">Provider</SortHeader>
                  <SortHeader k="quota">Quota</SortHeader>
                  <SortHeader k="requests">Requests</SortHeader>
                  <SortHeader k="expires">Expires</SortHeader>
                  <SortHeader k="status">Status</SortHeader>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSubkeys.map((sk) => {
                  const col = quotaColor(sk.tokens_used, sk.monthly_token_limit);
                  return (
                    <tr key={sk.id} className="transition-colors hover:bg-secondary/20">
                      <td className="px-4 py-3"><div className="text-sm font-medium">{sk.name}</div><code className="font-mono text-xs text-muted-foreground">{getMaskedSubkey(sk)}</code></td>
                      <td className="px-4 py-3 text-sm">{providerLabel(providerOptions, sk.provider)}</td>
                      <td className="px-4 py-3"><div className="text-xs font-mono">{fmtNum(sk.tokens_used)} / {fmtNum(sk.monthly_token_limit)}</div><div className="mt-1.5 w-24"><div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden"><div className={cn('h-full rounded-full', col === 'over' ? 'bg-destructive' : col === 'warn' ? 'bg-warning' : 'bg-success')} style={{ width: `${pctUsed(sk.tokens_used, sk.monthly_token_limit)}%` }} /></div></div></td>
                      <td className="px-4 py-3 text-sm font-mono">{fmtNum(sk.request_count || 0)}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{fmtDate(sk.expires_at)}</td>
                      <td className="px-4 py-3"><Badge tone={sk.status === 'active' ? 'success' : sk.status === 'paused' ? 'warning' : 'danger'}>{sk.status}</Badge></td>
                      <td className="px-4 py-3"><div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(sk)} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground" title="Edit"><Pencil size={14} /></button>
                        <button onClick={() => openReceipt(sk)} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground" title="Receipt"><Receipt size={14} /></button>
                        <button onClick={() => toggleStatus(sk)} disabled={statusLoading} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground" title="Toggle status"><RefreshCw size={14} /></button>
                      </div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create modal */}
      <Modal open={modal === 'create'} onClose={() => setModal('')} title="Create subkey" sub="Generate a scoped, revocable key for your clients." size="lg"
        footer={<><Button variant="ghost" onClick={() => setModal('')}>Cancel</Button><Button onClick={createSubkey}><KeySquare size={15} /> Create subkey</Button></>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><Label>Subkey name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Production mobile app" /></div>
          <div><Label>Provider</Label><Select value={provider} onChange={(e) => setProvider(e.target.value)}>{providerOptions.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</Select></div>
          <div><Label>Master key (optional)</Label><Select value={masterKeyId} onChange={(e) => setMasterKeyId(e.target.value)}><option value="">Auto-select</option>{masterKeys.filter((mk) => mk.provider === provider).map((mk) => <option key={mk.id} value={mk.id}>{mk.name}</option>)}</Select></div>
          <div><Label>Monthly token limit</Label><Input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} /></div>
          <div><Label>Max requests</Label><Input type="number" value={maxRequests} onChange={(e) => setMaxRequests(e.target.value)} /></div>
          <div><Label>Spend limit (USD)</Label><Input type="number" value={spend} onChange={(e) => setSpend(e.target.value)} placeholder="Optional" /></div>
          <div><Label>Expires in (days)</Label><Input type="number" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="Optional" /></div>
          <div className="sm:col-span-2"><Label>Allowed models</Label>
            <div className="mb-2 flex items-center gap-2"><button onClick={() => setSelectedModels(['all'])} className={cn('rounded-lg px-2.5 py-1 text-xs', selectedModels.includes('all') ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground')}>All models</button><div className="relative flex-1"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input value={modelSearch} onChange={(e) => setModelSearch(e.target.value)} placeholder="Search models" className="pl-7" /></div></div>
            {!selectedModels.includes('all') && <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">{filteredModels.map((m) => { const on = selectedModels.includes(m); return <button key={m} onClick={() => setSelectedModels((v) => on ? v.filter((x) => x !== m) : [...v, m])} className={cn('rounded-md px-2 py-1 text-xs font-mono', on ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground')}>{m}</button>; })}</div>}
          </div>
          <div className="sm:col-span-2"><label className="flex items-center gap-2.5 cursor-pointer"><input type="checkbox" checked={autoRoute} onChange={(e) => setAutoRoute(e.target.checked)} className="rounded" /><span className="text-sm">Auto-route to another master key when quota exhausted</span></label></div>
        </div>
      </Modal>

      {/* Edit modal */}
      <Modal open={modal === 'editsubkey'} onClose={() => setModal('')} title="Edit subkey" sub={editingSubkey?.name}
        footer={<><Button variant="ghost" onClick={() => setModal('')}>Cancel</Button><Button onClick={saveEdit} disabled={savingEdit}>{savingEdit ? 'Saving…' : 'Save changes'}</Button></>}>
        <div className="space-y-4">
          <div><Label>Monthly token limit</Label><Input type="number" value={editLimit} onChange={(e) => setEditLimit(e.target.value)} /></div>
          <div><Label>Max requests</Label><Input type="number" value={editMaxRequests} onChange={(e) => setEditMaxRequests(e.target.value)} /></div>
          <div><Label>Extend expiry by (days)</Label><Input type="number" value={editExpiry} onChange={(e) => setEditExpiry(e.target.value)} placeholder="Leave blank to keep current" /></div>
        </div>
      </Modal>

      {/* Token reveal modal */}
      <Modal open={modal === 'tokenreveal'} onClose={() => setModal('')} title="Subkey created" sub="Copy this token now — it won’t be shown again."
        footer={<Button onClick={() => setModal('')}>Done</Button>}>
        <div className="space-y-3">
          <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-xs text-success">Your subkey has been created. Store it securely.</div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 p-3">
            <code className="flex-1 break-all font-mono text-sm text-primary">{revealedToken}</code>
            <Button variant="secondary" size="sm" onClick={() => { copyText(revealedToken, 'reveal'); setRevealCopied(true); setTimeout(() => setRevealCopied(false), 1600); }}>{revealCopied || copiedItem === 'reveal' ? <Check size={14} /> : <Copy size={14} />} Copy</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}