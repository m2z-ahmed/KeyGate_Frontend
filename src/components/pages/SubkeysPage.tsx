import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Modal } from '../ui';
import { FALLBACK_PROVIDERS, providerLabel, providerModels as getProviderModels } from '../../lib/providers';
import { generateToken } from '../../lib/format';
import { Plus, Copy, Check, Loader2, Search, ArrowUpDown, Trash2, Pause, Play, Ban } from 'lucide-react';

export default function SubkeysPage() {
  const { subkeys, api, loadSubkeys, loadMasterKeys, masterKeys, notify, fmtNum, fmtDate, quotaColor, modal, setModal, setRevealedToken, revealedToken, providers = FALLBACK_PROVIDERS, copyText, copiedItem } = useApp();
  const providerOptions = providers.length ? providers : FALLBACK_PROVIDERS;
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('openai');
  const [limit, setLimit] = useState(50000);
  const [maxRequests, setMaxRequests] = useState(5000);
  const [spend, setSpend] = useState('');
  const [expiry, setExpiry] = useState('');
  const [modelSearch, setModelSearch] = useState('');
  const [selectedModels, setSelectedModels] = useState<string[]>(['all']);
  const [masterKeyId, setMasterKeyId] = useState('');
  const [autoRoute, setAutoRoute] = useState(false);
  const [editingSubkey, setEditingSubkey] = useState<any>(null);
  const [editLimit, setEditLimit] = useState('');
  const [editMaxRequests, setEditMaxRequests] = useState('');
  const [editExpiry, setEditExpiry] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { loadMasterKeys(); }, []);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filteredSubkeys = useMemo(() => {
    let list = statusFilter === 'all' ? subkeys : subkeys.filter((s) => s.status === statusFilter);
    if (!sortKey) return list;
    return [...list].sort((a, b) => {
      let av: any, bv: any;
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

  const providerModelsList = getProviderModels(providerOptions, provider);
  const filteredModels = providerModelsList.filter((m) => m.toLowerCase().includes(modelSearch.toLowerCase()));

  const createSubkey = async () => {
    if (!name.trim()) return notify('Enter a name', 'error');
    const providerKeys = masterKeys.filter((mk: any) => mk.provider === provider);
    if (!providerKeys.length) return notify('Add a Master Key first', 'error');
    const allowed_models = selectedModels.includes('all') ? ['all'] : selectedModels.filter((m) => providerModelsList.includes(m));
    try {
      const sk = await api('/api/subkeys', {
        method: 'POST',
        body: {
          name: name.trim(), provider, master_key_id: masterKeyId || null, auto_route_on_exhausted: autoRoute,
          monthly_token_limit: Number(limit) || 50000, max_requests: Number(maxRequests) || 5000,
          allowed_models, spend_limit_usd: spend ? Number(spend) : null, expires_in_days: expiry ? Number(expiry) : null,
        },
      });
      setName(''); setProvider('openai'); setLimit(50000); setMaxRequests(5000); setSpend(''); setExpiry(''); setSelectedModels(['all']); setMasterKeyId(''); setAutoRoute(false);
      setRevealedToken(sk.token || generateToken()); setModal('tokenreveal'); loadSubkeys();
    } catch (e: any) { notify(e.message || 'Failed to create subkey', 'error'); }
  };

  const openEdit = (sk: any) => {
    setEditingSubkey(sk);
    setEditLimit(sk.monthly_token_limit || 50000);
    setEditMaxRequests(sk.max_requests || 5000);
    setEditExpiry('');
    setModal('editsubkey');
  };

  const saveEdit = async () => {
    if (!editingSubkey) return;
    setSavingEdit(true);
    try {
      await api(`/api/subkeys/${editingSubkey.id}`, {
        method: 'PATCH',
        body: {
          monthly_token_limit: Number(editLimit), max_requests: Number(editMaxRequests),
          expires_in_days: editExpiry === '' ? undefined : (editExpiry === 'never' ? null : Number(editExpiry)),
        },
      });
      notify('Subkey limits updated');
      await loadSubkeys();
    } catch (e: any) { notify(e.message || 'Failed to update subkey', 'error'); }
    finally { setSavingEdit(false); }
  };

  const updateStatus = async (nextStatus: string) => {
    if (!editingSubkey || statusLoading) return;
    if (nextStatus === 'revoked' && !window.confirm(`Revoke "${editingSubkey.name}"? Existing clients using this subkey will stop working immediately.`)) return;
    setStatusLoading(true);
    try {
      await api('/api/subkeys/' + editingSubkey.id, { method: 'PATCH', body: { status: nextStatus } });
      await loadSubkeys();
    } catch (e: any) { notify(e.message || 'Failed to update status', 'error'); }
    finally { setStatusLoading(false); }
  };

  const deleteSubkey = async () => {
    if (!editingSubkey) return;
    if (!window.confirm(`Delete subkey "${editingSubkey.name}"?\n\nThis action is irreversible and the issued token will stop working immediately.`)) return;
    try {
      await api(`/api/subkeys/${editingSubkey.id}`, { method: 'DELETE' });
      notify('Subkey deleted'); setModal(''); setEditingSubkey(null);
      await loadSubkeys();
    } catch (e: any) { notify(e.message || 'Failed to delete subkey', 'error'); }
  };

  const STATUSES = ['all', 'active', 'paused', 'revoked'];
  const SortHeader = ({ k, children }: { k: string; children: React.ReactNode }) => (
    <th onClick={() => toggleSort(k)} className="cursor-pointer hover:text-gray-300 select-none">
      <span className="inline-flex items-center gap-1">{children} <ArrowUpDown size={12} className={sortKey === k ? 'text-primary-400' : 'text-gray-600'} /></span>
    </th>
  );

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-100 mb-1">Subkeys</h1>
          <p className="text-sm text-gray-500">Scoped API tokens you distribute to employees, clients, or teams</p>
        </div>
        <button onClick={() => setModal('createsubkey')} className="btn btn-primary">
          <Plus size={16} /> Create subkey
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-4">
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === s ? 'bg-primary-500/15 text-primary-300 border border-primary-500/30' : 'text-gray-500 hover:text-gray-300 hover:bg-base-800 border border-transparent'
            }`}>
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-base-700 text-xs text-gray-500">
                <SortHeader k="name">Name</SortHeader>
                <th className="text-left">Token</th>
                <SortHeader k="provider">Provider</SortHeader>
                <SortHeader k="quota">Quota</SortHeader>
                <SortHeader k="requests">Max req</SortHeader>
                <SortHeader k="expires">Expires</SortHeader>
                <SortHeader k="status">Status</SortHeader>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!filteredSubkeys.length ? (
                <tr><td colSpan={8} className="text-center text-gray-500 py-12">
                  {statusFilter !== 'all' ? 'No subkeys match this filter.' : 'No subkeys yet — create one above.'}
                </td></tr>
              ) : filteredSubkeys.map((sk: any) => {
                const pct = Math.min(100, Math.round((sk.tokens_used / sk.monthly_token_limit) * 100));
                const col = quotaColor(sk.tokens_used, sk.monthly_token_limit);
                const masked = sk.token_preview || `${sk.token_prefix || 'sk-kg-'}••••`;
                const barColor = col === 'over' ? 'bg-danger-500' : col === 'warn' ? 'bg-accent-500' : 'bg-primary-500';
                return (
                  <tr key={sk.id} className="border-b border-base-800 last:border-0 hover:bg-base-850/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-gray-200">{sk.name}</td>
                    <td className="py-3 px-4"><code className="text-xs text-gray-400 font-mono">{masked}</code></td>
                    <td className="py-3 px-4"><span className="text-xs font-mono text-gray-400 px-2 py-0.5 rounded bg-base-800">{sk.provider}</span></td>
                    <td className="py-3 px-4 min-w-[120px]">
                      <div className="h-1.5 bg-base-800 rounded-full overflow-hidden mb-1"><div className={`h-full ${barColor}`} style={{ width: `${pct}%` }} /></div>
                      <div className="text-xs text-gray-500 font-mono">{fmtNum(sk.tokens_used)} / {fmtNum(sk.monthly_token_limit)}</div>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-gray-400">{fmtNum(sk.request_count || 0)} / {fmtNum(sk.max_requests || 5000)}</td>
                    <td className="py-3 px-4 text-xs text-gray-500">{fmtDate(sk.expires_at)}</td>
                    <td className="py-3 px-4"><span className={`badge ${sk.status === 'active' ? 'badge-active' : sk.status === 'paused' ? 'badge-paused' : 'badge-revoked'}`}>{sk.status}</span></td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => openEdit(sk)} className="btn btn-ghost text-xs px-2.5 py-1.5">Manage</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create subkey modal */}
      <Modal open={modal === 'createsubkey'} onClose={() => setModal('')} title="Create subkey" maxWidth="max-w-xl"
        footer={<><button onClick={() => setModal('')} className="btn btn-ghost">Cancel</button><button onClick={createSubkey} className="btn btn-primary">Generate subkey</button></>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Client A — Frontend" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Provider</label>
              <select className="input" value={provider} onChange={(e) => { setProvider(e.target.value); setSelectedModels(['all']); setMasterKeyId(''); }}>
                {providerOptions.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Monthly token limit</label>
              <input type="number" className="input" value={limit} onChange={(e) => setLimit(Number(e.target.value))} min={100} /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Max allowed requests</label>
              <input type="number" className="input" value={maxRequests} onChange={(e) => setMaxRequests(Number(e.target.value))} min={1} /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Spend ceiling (USD) — optional</label>
            <input type="number" className="input" value={spend} onChange={(e) => setSpend(e.target.value)} placeholder="Optional" min={0} step={0.01} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Select master key</label>
              <select className="input" value={masterKeyId} onChange={(e) => setMasterKeyId(e.target.value)}>
                <option value="">Auto latest by provider</option>
                {masterKeys.filter((mk: any) => mk.provider === provider).map((mk: any) => <option key={mk.id} value={mk.id}>{mk.name || providerLabel(providerOptions, mk.provider)} ({mk.key_masked})</option>)}
              </select></div>
            <div className="flex items-end"><label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer pb-2.5">
              <input type="checkbox" checked={autoRoute} onChange={(e) => setAutoRoute(e.target.checked)} className="rounded" /> Auto-route if key exhausted</label></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Expires in (days) — optional</label>
            <input type="number" className="input" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="Leave blank = never" /></div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Search model</label>
            <div className="relative mb-2">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input className="input pl-9" value={modelSearch} onChange={(e) => setModelSearch(e.target.value)} placeholder="Search models..." />
            </div>
            <div className="max-h-40 overflow-y-auto border border-base-700 rounded-lg p-2.5 space-y-1.5">
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input type="checkbox" checked={selectedModels.includes('all')} onChange={(e) => setSelectedModels(e.target.checked ? ['all'] : [])} className="rounded" /> all
              </label>
              {filteredModels.map((m) => (
                <label key={m} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={selectedModels.includes('all') ? false : selectedModels.includes(m)} disabled={selectedModels.includes('all')}
                    onChange={(e) => setSelectedModels((prev) => e.target.checked ? [...prev.filter((x) => x !== 'all'), m] : prev.filter((x) => x !== m))} className="rounded" /> {m}
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit subkey modal */}
      <Modal open={modal === 'editsubkey'} onClose={() => setModal('')} title={`Manage ${editingSubkey?.name || ''}`} maxWidth="max-w-md"
        footer={
          <>
            <button onClick={deleteSubkey} className="btn btn-danger mr-auto"><Trash2 size={14} /> Delete</button>
            <button onClick={() => setModal('')} className="btn btn-ghost">Close</button>
            <button onClick={saveEdit} disabled={savingEdit} className="btn btn-primary">{savingEdit ? <Loader2 size={14} className="animate-spin" /> : null} Save</button>
          </>
        }>
        <div className="space-y-4">
          <div className="flex gap-2">
            <button onClick={() => updateStatus('paused')} disabled={statusLoading} className="btn btn-warning flex-1 text-xs"><Pause size={14} /> Pause</button>
            <button onClick={() => updateStatus('active')} disabled={statusLoading} className="btn btn-success flex-1 text-xs"><Play size={14} /> Activate</button>
            <button onClick={() => updateStatus('revoked')} disabled={statusLoading} className="btn btn-danger flex-1 text-xs"><Ban size={14} /> Revoke</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Monthly token limit</label>
              <input type="number" min={1} className="input" value={editLimit} onChange={(e) => setEditLimit(e.target.value)} /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Max requests</label>
              <input type="number" min={1} className="input" value={editMaxRequests} onChange={(e) => setEditMaxRequests(e.target.value)} /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Expiry extension (days)</label>
            <input type="number" min={1} className="input" value={editExpiry} onChange={(e) => setEditExpiry(e.target.value)} placeholder="Leave blank to keep existing" /></div>
        </div>
      </Modal>

      {/* Token reveal modal */}
      <Modal open={modal === 'tokenreveal'} onClose={() => setModal('')} title="Subkey created" maxWidth="max-w-md"
        footer={<><button onClick={() => copyText(revealedToken, 'reveal')} className="btn btn-ghost">{copiedItem === 'reveal' ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy token</>}</button><button onClick={() => setModal('')} className="btn btn-primary">Done</button></>}>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Copy this token now. It won't be shown again in full.</p>
          <div className="p-4 rounded-lg bg-base-950 border border-base-700">
            <div className="text-xs text-gray-500 mb-2">Your subkey token</div>
            <code className="text-sm font-mono text-primary-300 break-all">{revealedToken}</code>
          </div>
          <div className="flex gap-2 p-3 rounded-lg bg-accent-500/10 border border-accent-500/20">
            <span className="text-accent-400">⚠</span>
            <span className="text-xs text-accent-400">This is shown once. Save it somewhere safe — your client will use this as their API key.</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
