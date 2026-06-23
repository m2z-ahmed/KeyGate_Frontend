import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Modal } from '../ui';
import { FALLBACK_PROVIDERS, providerLabel, providerPlaceholder } from '../../lib/providers';
import { Plus, Trash2, ShieldCheck, KeyRound, Loader2 } from 'lucide-react';

const PROVIDER_ICONS: Record<string, string> = {
  openai: '⬛', google: '🔵', anthropic: '🟧', deepseek: '🌊', xai: '✕', groq: '⚡',
};

export default function MasterKeysPage() {
  const { masterKeys, api, loadMasterKeys, notify, fmtDate, modal, setModal, providers = FALLBACK_PROVIDERS, loading } = useApp();
  const providerOptions = providers.length ? providers : FALLBACK_PROVIDERS;
  const [provider, setProvider] = useState('openai');
  const [keyName, setKeyName] = useState('Primary OpenAI Key');
  const [apiKey, setApiKey] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const isLoading = loading?.masterkeys;

  const onProviderChange = (next: string) => {
    setProvider(next);
    setKeyName(`Primary ${providerLabel(providerOptions, next)} Key`);
  };

  const saveMasterKey = async () => {
    if (!apiKey.trim()) return notify('Enter an API key', 'error');
    try {
      await api('/api/master-keys', { method: 'POST', body: { provider, name: keyName.trim(), api_key: apiKey.trim() } });
      setApiKey(''); onProviderChange('openai'); setModal(''); notify('Master key saved — encrypted'); loadMasterKeys();
    } catch (e: any) { notify(e.message || 'Failed to save key', 'error'); }
  };

  const deleteMasterKey = async (mk: any) => {
    if (!window.confirm(`Delete master key "${mk.name || mk.provider}"?\n\nThis cannot be undone. Related subkeys may stop working if they depend on this key.`)) return;
    setDeletingId(mk.id);
    try {
      await api(`/api/master-keys/${mk.id}`, { method: 'DELETE' });
      notify('Master key deleted');
      await loadMasterKeys();
    } catch (e: any) { notify(e.message || 'Failed to delete key', 'error'); }
    finally { setDeletingId(''); }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-100 mb-1">Master keys</h1>
          <p className="text-sm text-gray-500">Your real provider API keys — stored encrypted, never exposed</p>
        </div>
        <button onClick={() => setModal('addkey')} className="btn btn-primary">
          <Plus size={16} /> Add key
        </button>
      </div>

      {/* Security notice */}
      <div className="card p-4 mb-6 border-accent-500/20 bg-accent-500/5">
        <div className="flex gap-3">
          <ShieldCheck size={20} className="text-accent-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-accent-400 mb-1">Keys are encrypted at rest</div>
            <div className="text-xs text-gray-500 leading-relaxed">
              Your master keys are encrypted before storage. They are never returned in any API response, never logged, and only injected server-side at request time. Your clients only ever see subkeys.
            </div>
          </div>
        </div>
      </div>

      {/* Keys list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-4 flex items-center gap-4">
              <div className="skeleton w-10 h-10 rounded-lg" />
              <div className="flex-1 space-y-2"><div className="skeleton h-4 w-40" /><div className="skeleton h-3 w-60" /></div>
              <div className="skeleton h-6 w-20" />
            </div>
          ))}
        </div>
      ) : !masterKeys.length ? (
        <div className="card p-12 text-center">
          <KeyRound size={40} className="mx-auto mb-4 text-gray-600" />
          <p className="text-sm font-medium text-gray-400 mb-1">No master keys configured</p>
          <p className="text-xs text-gray-500 mb-4">Add a provider API key to start creating subkeys</p>
          <button onClick={() => setModal('addkey')} className="btn btn-primary">
            <Plus size={16} /> Add your first key
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {masterKeys.map((mk: any) => (
            <div key={mk.id} className="card p-4 flex items-center gap-4 hover:border-base-600 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-base-800 flex items-center justify-center text-lg flex-shrink-0">
                {PROVIDER_ICONS[mk.provider] || '🔐'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-100 mb-0.5">{mk.name || providerLabel(providerOptions, mk.provider)}</div>
                <div className="text-xs text-gray-500 font-mono">{mk.key_masked}</div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="hidden sm:block text-xs text-gray-600">Added {fmtDate(mk.created_at)}</span>
                <span className="badge badge-active">{providerLabel(providerOptions, mk.provider)}</span>
                <button
                  onClick={() => deleteMasterKey(mk)}
                  disabled={deletingId === mk.id}
                  className="btn btn-danger text-xs px-2.5 py-1.5"
                >
                  {deletingId === mk.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add key modal */}
      <Modal
        open={modal === 'addkey'}
        onClose={() => setModal('')}
        title="Add provider key"
        footer={
          <>
            <button onClick={() => setModal('')} className="btn btn-ghost">Cancel</button>
            <button onClick={saveMasterKey} className="btn btn-primary">Save encrypted key</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Name for master key</label>
            <input className="input" value={keyName} onChange={(e) => setKeyName(e.target.value)} placeholder="e.g. Production OpenAI Key" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Provider</label>
            <select className="input" value={provider} onChange={(e) => onProviderChange(e.target.value)}>
              {providerOptions.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">API key</label>
            <input type="password" className="input" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={providerPlaceholder(providerOptions, provider)} autoComplete="off" />
          </div>
          <p className="text-xs text-gray-500">This key will be encrypted immediately. You won't be able to retrieve it — only replace it.</p>
        </div>
      </Modal>
    </div>
  );
}
