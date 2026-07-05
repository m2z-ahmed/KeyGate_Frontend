import { useState } from 'react';
import { Button, Card, CardHeader, Badge, Input, Label, Select, Modal, EmptyState, Skeleton } from '../kit';
import { FALLBACK_PROVIDERS, providerLabel, providerPlaceholder } from '../../lib/providers';
import { fmtDate } from '../../contexts/LethemContext';
import { KeyRound, Plus, Trash2, ShieldCheck, Lock } from 'lucide-react';

const PROVIDER_ICON = { openai: '⬛', google: '🔵', anthropic: '🟧', deepseek: '🌊', xai: '✕', groq: '⚡' };

export default function MasterKeysPage({ ctx }) {
  const { masterKeys, api, loadMasterKeys, notify, fmtDate, modal, setModal, providers = FALLBACK_PROVIDERS, loading, billing } = ctx;
  const providerOptions = providers.length ? providers : FALLBACK_PROVIDERS;
  const [provider, setProvider] = useState('openai');
  const [keyName, setKeyName] = useState('Primary OpenAI Key');
  const [apiKey, setApiKey] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const isLoading = loading?.masterkeys;
  const currentPlan = billing?.plans?.find((p) => p.id === billing.currentPlan) || billing?.plans?.find((p) => p.id === 'free');
  const masterKeyLimit = currentPlan?.limits?.masterKeys ?? null;
  const atLimit = masterKeyLimit != null && masterKeys.length >= masterKeyLimit;

  const onProviderChange = (next) => { setProvider(next); setKeyName(`Primary ${providerLabel(providerOptions, next)} Key`); };

  const saveMasterKey = async () => {
    if (!apiKey.trim()) return notify('Enter an API key', 'error');
    await api('/api/master-keys', { method: 'POST', body: { provider, name: keyName.trim(), api_key: apiKey.trim() } });
    setApiKey(''); onProviderChange('openai'); setModal(''); notify('Master key saved — encrypted'); loadMasterKeys();
  };

  const deleteMasterKey = async (mk) => {
    if (!window.confirm(`Delete master key "${mk.name || mk.provider}"?\n\nThis cannot be undone. Related subkeys may stop working.`)) return;
    setDeletingId(mk.id);
    try { await api(`/api/master-keys/${mk.id}`, { method: 'DELETE' }); notify('Master key deleted'); await loadMasterKeys(); }
    finally { setDeletingId(''); }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-gradient">Master keys</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your real provider API keys — stored encrypted, never exposed</p>
        </div>
        <Button onClick={() => setModal('addkey')}><Plus size={15} /> Add key</Button>
      </div>

      <div className="mb-4 flex items-start gap-3 rounded-xl border border-border bg-card p-4">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success"><Lock size={16} /></div>
        <div className="text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">{masterKeys.length}{masterKeyLimit != null ? ` / ${masterKeyLimit}` : ''} master keys used.</span>{' '}
          {atLimit ? 'You reached your plan limit. Upgrade billing to store more provider keys.' : 'Store provider keys for OpenAI, Google, Anthropic, and more.'}{' '}
          Keys are encrypted at rest — never returned in any API response, never logged, only injected server-side at request time.
        </div>
      </div>

      <Card>
        {isLoading ? (
          <div className="p-5 space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
        ) : !masterKeys.length ? (
          <div className="p-5"><EmptyState icon={KeyRound} title="No master keys configured" description="Add your first provider API key to start issuing subkeys." action={<Button size="sm" onClick={() => setModal('addkey')}>Add your first key</Button>} /></div>
        ) : (
          <div className="divide-y divide-border">
            {masterKeys.map((mk) => (
              <div key={mk.id} className="flex items-center gap-4 p-4 transition-colors hover:bg-secondary/30">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-lg">{PROVIDER_ICON[mk.provider] || '🔐'}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold">{mk.name || providerLabel(providerOptions, mk.provider)}</span>
                    <Badge tone="primary">{providerLabel(providerOptions, mk.provider)}</Badge>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <code className="font-mono text-xs text-muted-foreground">{mk.key_masked}</code>
                    <span className="text-xs text-muted-foreground">· Added {fmtDate(mk.created_at)}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteMasterKey(mk)} disabled={deletingId === mk.id} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 size={14} /> {deletingId === mk.id ? 'Deleting…' : 'Delete'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal open={modal === 'addkey'} onClose={() => setModal('')} title="Add provider key" sub="This key will be encrypted immediately. You won't be able to retrieve it — only replace it."
        footer={<><Button variant="ghost" onClick={() => setModal('')}>Cancel</Button><Button onClick={saveMasterKey}><ShieldCheck size={15} /> Save encrypted key</Button></>}>
        <div className="space-y-4">
          <div><Label>Name for master key</Label><Input value={keyName} onChange={(e) => setKeyName(e.target.value)} placeholder="e.g. Production OpenAI Key" /></div>
          <div><Label>Provider</Label><Select value={provider} onChange={(e) => onProviderChange(e.target.value)}>{providerOptions.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</Select></div>
          <div><Label>API key</Label><Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={providerPlaceholder(providerOptions, provider)} autoComplete="off" /></div>
        </div>
      </Modal>
    </div>
  );
}